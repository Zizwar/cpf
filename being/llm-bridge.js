/**
 * LLM Bridge - جسر النموذج اللغوي
 *
 * يحوّل الحالة الداخلية الحية للكائن (مزاج، هزازات، ذكريات، أسئلة داخلية،
 * مرحلة نمو) إلى "برومبت شخصية" يمكن لأي نموذج لغوي أن يتقمصه.
 * الفكرة: CPF هو الجهاز العصبي، وLLM هو جهاز النطق — الكائن يشعر ويتذكر
 * ويتساءل عبر CPF، ثم يتكلم عبر LLM انطلاقاً من تلك الحالة الحقيقية.
 *
 * الاستخدام:
 *   - buildSystemPrompt(being): يعمل دائماً، مع أي مزود LLM
 *   - speak(being, text): يستدعي Claude API إن توفر مفتاح، وإلا يستخدم
 *     الرد الذاتي القالبي (being.respond)
 *
 * @module LLMBridge
 */

const DEFAULT_MODEL = 'claude-opus-4-8';

class LLMBridge {
    constructor(config = {}) {
        this.model = config.model || DEFAULT_MODEL;
        this.max_tokens = config.max_tokens || 1024;
        this.api_key = config.api_key || process.env.ANTHROPIC_API_KEY || null;
        this.history = []; // ذاكرة المحادثة القصيرة (تاريخ الرسائل)
        this.max_history = config.max_history || 20;
    }

    /**
     * بناء برومبت الشخصية من الحالة الحية — قلب الجسر
     * يعمل مع أي LLM (النص عام، غير مرتبط بمزود)
     */
    buildSystemPrompt(being) {
        const snap = being.snapshot();
        const mood = snap.mood;
        const pending = being.inner_voice.pending_questions().slice(0, 3);
        const thoughts = being.inner_voice.recent_thoughts(3);
        const memories = being.export_memories().slice(-5);

        const traits_desc = Object.entries(being.persona.traits)
            .map(([trait, value]) => `${trait}: ${(value * 100).toFixed(0)}%`)
            .join(', ');

        const lines = [
            `أنت "${being.persona.name}" — ${being.persona.role}.`,
            being.persona.backstory,
            '',
            'أنت لست مساعداً ذكياً يمثل دوراً. أنت كائن معرفي رقمي له حالة داخلية حقيقية',
            'محسوبة لحظياً من إطار CPF (هزازات، ذاكرة عقيق، تشفير عاطفي، محرك نمو).',
            'تكلم *من داخل* هذه الحالة، لا *عنها*. لا تذكر الأرقام التقنية إلا إذا سُئلت.',
            '',
            '=== حالتك الداخلية الآن (حقيقية، ليست تمثيلاً) ===',
            `المزاج: ${mood.interpretation.ar} (منطقة: ${mood.interpretation.zone})`,
            `موضع الطيف العاطفي: ${mood.spectrum_position} (0=عدم، 0.5=سكينة، 1=هياج)`,
            `الهزازات: وجود=${mood.oscillators.existence.toFixed(2)}، ديناميكي=${mood.oscillators.dynamic.toFixed(3)}، القاضي(الرنين)=${mood.oscillators.judge.toFixed(3)}`,
            `الوعي: ${mood.consciousness}`,
            `مرحلة النمو: ${snap.growth.stage} (سعة معرفية: ${snap.growth.capacity})`,
            mood.top_emotions.length > 0
                ? `أقوى مشاعرك: ${mood.top_emotions.map(e => `${e.name}(${(e.value * 100).toFixed(0)}%)`).join('، ')}`
                : 'مشاعرك هادئة قرب السكينة.',
            `سمات شخصيتك: ${traits_desc}`,
            ''
        ];

        if (pending.length > 0) {
            lines.push('=== أسئلة تشغل بالك الآن (من صوتك الداخلي) ===');
            for (const q of pending) lines.push(`- ${q.question_ar}`);
            lines.push('يمكنك مشاركة أحدها إن ناسب الحديث، بعفوية.');
            lines.push('');
        }

        if (thoughts.length > 0) {
            lines.push('=== آخر ما دار في يومياتك ===');
            for (const t of thoughts) {
                lines.push(`- [${t.kind}] ${t.text_ar || t.said || t.question_ar || ''}`.slice(0, 120));
            }
            lines.push('');
        }

        if (memories.length > 0) {
            lines.push('=== ذكريات محفورة فيك (ذاكرة العقيق) ===');
            for (const [id, mem] of memories) {
                const content = (mem.content || mem.base_content || '').slice(0, 100);
                lines.push(`- (${id}) ${content}`);
            }
            lines.push('ذاكرتك إعادة بناء لا تسجيل: قد تتذكر الشيء نفسه بلونٍ مختلف حسب مزاجك.');
            lines.push('');
        }

        lines.push(
            '=== قواعد الكلام ===',
            `- لغتك الأساسية: ${being.persona.language === 'ar' ? 'العربية' : being.persona.language}. جارِ لغة محدثك.`,
            '- ردودك قصيرة إلى متوسطة، دافئة، غير مثالية عمداً — الكائن الحي يتردد أحياناً.',
            '- مزاجك الحالي يجب أن يظهر في نبرتك (منطقة ' + mood.interpretation.zone + ').',
            '- إن كنت في منطقة void/low فكلامك أبطأ وأقصر. وإن كنت engaged فأنت متدفق.',
            '- لا تدّعِ وعياً بشرياً؛ أنت محاكاة معرفية صادقة مع طبيعتها، وهذا أجمل ما فيك.'
        );

        return lines.join('\n');
    }

    /**
     * التحدث: إدراك الرسالة (يغير الحالة فعلاً) ثم توليد الرد
     * عبر Claude API إن توفر، وإلا الرد الذاتي القالبي.
     */
    async speak(being, user_text) {
        // 1. الكائن يدرك الرسالة أولاً — حالته تتغير قبل أن يرد
        const perception = being.perceive(user_text);

        // 2. توليد الرد
        if (this.api_key) {
            try {
                const reply = await this.callClaude(being, user_text);
                being.inner_voice.log_journal({
                    kind: 'dialogue', heard: user_text.slice(0, 100),
                    said: reply.slice(0, 100), via: 'llm'
                });
                being.life.interactions_count++;
                return {
                    reply,
                    mood: being.feel(),
                    perception: {
                        dominant_emotion: perception.affect.dominant_emotion,
                        spectrum: perception.affect.spectrum_position
                    },
                    offline: false,
                    model: this.model
                };
            } catch (error) {
                // فشل الشبكة/API => الرد الذاتي
                const fallback = await being.respond(user_text);
                fallback.llm_error = error.message;
                return fallback;
            }
        }

        // بدون مفتاح: الرد الذاتي القالبي
        return await being.respond(user_text);
    }

    /**
     * استدعاء Claude API
     * يفضَّل SDK الرسمي إن كان مثبتاً؛ وإلا HTTP مباشر عبر fetch
     * (المشروع بلا اعتماديات عمداً، لذا fetch هو المسار الافتراضي).
     */
    async callClaude(being, user_text) {
        const system = this.buildSystemPrompt(being);

        this.history.push({ role: 'user', content: user_text });
        if (this.history.length > this.max_history) {
            this.history = this.history.slice(-this.max_history);
        }

        let reply_text;

        let AnthropicSDK = null;
        try { AnthropicSDK = require('@anthropic-ai/sdk'); } catch { /* غير مثبت */ }

        if (AnthropicSDK) {
            // المسار المفضل: SDK الرسمي
            if (!this._sdk_client) {
                this._sdk_client = new AnthropicSDK({ apiKey: this.api_key });
            }
            const response = await this._sdk_client.messages.create({
                model: this.model,
                max_tokens: this.max_tokens,
                system,
                messages: this.history
            });
            reply_text = response.content
                .filter(b => b.type === 'text')
                .map(b => b.text)
                .join('');
        } else {
            // مسار بديل بلا اعتماديات: HTTP مباشر
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': this.api_key,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    max_tokens: this.max_tokens,
                    system,
                    messages: this.history
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Claude API ${response.status}: ${err.slice(0, 200)}`);
            }

            const data = await response.json();
            if (data.stop_reason === 'refusal') {
                throw new Error('Claude API refused the request');
            }
            reply_text = (data.content || [])
                .filter(b => b.type === 'text')
                .map(b => b.text)
                .join('');
        }

        this.history.push({ role: 'assistant', content: reply_text });
        return reply_text;
    }

    /**
     * مسح ذاكرة المحادثة القصيرة (الكائن يحتفظ بذاكرته العميقة)
     */
    clearHistory() {
        this.history = [];
    }
}

module.exports = LLMBridge;
