/**
 * Wino Being - الكائن الحي
 *
 * الطبقة الحية فوق CPF: كائن رقمي له اسم وشخصية، يعيش (نبضات)،
 * يشعر (طيف عاطفي)، يدرك (تحليل نصي)، يتذكر (ذاكرة عقيق)،
 * يتساءل (صوت داخلي)، ينمو (محرك نمو)، ويمكن حفظ "روحه" واستعادتها.
 *
 * وضعان للحياة:
 *   - step(n): نبضات يدوية حتمية — مثالية للألعاب (استدعِ step في حلقة اللعبة) وللاختبارات
 *   - live(ms) / sleep(): حياة مستمرة بالوقت الحقيقي (مؤقتات داخلية)
 *
 * @module WinoBeing
 * @version 5.0-living
 */

const CPFVectorial = require('../lite/wino');
const TextAffect = require('./text-affect');
const InnerVoice = require('./inner-voice');

// كاتم صوت: يسكت console.log مؤقتاً أثناء العمليات الداخلية للنواة
// (النواة القديمة ثرثارة؛ الكائن الحي يفكر بصمت)
function quietly(quiet, fn) {
    if (!quiet) return fn();
    const original_log = console.log;
    const original_warn = console.warn;
    console.log = () => {};
    console.warn = () => {};
    try {
        return fn();
    } finally {
        console.log = original_log;
        console.warn = original_warn;
    }
}

class WinoBeing {
    constructor(config = {}) {
        // === الصمت الداخلي (افتراضياً: النواة تعمل بصمت) ===
        this.quiet = config.quiet !== false;

        // === الهوية ===
        this.persona = {
            name: config.name || 'وينو',
            role: config.role || 'كائن معرفي رقمي',
            language: config.language || 'ar',
            backstory: config.backstory || 'وُلدت من إطار CPF: عقل احتمالي فيكتوري يكبر ويتعلم.',
            traits: {
                warmth: 0.7,        // الدفء
                curiosity: 0.8,     // الفضول
                patience: 0.6,      // الصبر
                playfulness: 0.5,   // المرح
                caution: 0.4,       // الحذر
                ...(config.traits || {})
            }
        };

        // === النواة المعرفية (CPF) - بدون وعي تلقائي، نحن نتحكم بالنبض ===
        this.cpf = quietly(this.quiet, () => new CPFVectorial({
            brain_capacity: config.brain_capacity || 50000,
            auto_start_consciousness: false,
            interpretation_mode: config.interpretation_mode || 'intermediate'
        }));

        // نُفعّل الدورة الإدراكية والربط يدوياً (بدون مؤقتات)
        quietly(this.quiet, () => {
            this.cpf.perceptual_cycle.start();
            this.cpf.cognitive_rhythm.connect_to_cycle(this.cpf.perceptual_cycle);
            this.cpf.growth_engine.is_active = true; // نسمح بدورات النمو اليدوية
        });

        // === الصوت الداخلي ===
        this.inner_voice = new InnerVoice(this);

        // === سجل الحياة ===
        this.life = {
            born_at: config.born_at || Date.now(),
            total_steps: 0,
            perceptions_count: 0,
            interactions_count: 0,
            named_memories: 0,
            live_mode: false
        };

        // === الحالة العاطفية المستمرة (تتراكم من الإدراكات وتتلاشى ببطء) ===
        this.emotional_state = {};

        // === سجل أحداث آخر خطوة (للمراقبة) ===
        this.last_events = [];
    }

    // =================== الحياة: النبض ===================

    /**
     * نبضة حياة واحدة (أو n نبضات) — حتمية وقابلة للاختبار
     * كل نبضة: إيقاع معرفي + تلاشي عاطفي + تساؤل داخلي + نمو دوري
     */
    step(n = 1) {
        const events = [];

        for (let i = 0; i < n; i++) {
            this.life.total_steps++;

            // 1. نبضة الإيقاع المعرفي (الهزازات الثلاثة + الأنماط + الدورة الإدراكية)
            quietly(this.quiet, () => this.cpf.cognitive_rhythm.tick());

            // 2. التلاشي العاطفي البطيء نحو السكينة
            this.decay_emotions();

            // 3. الصوت الداخلي يراقب ويتساءل
            this.inner_voice.wonder();

            // 4. النمو البيولوجي (كل 10 نبضات = دورة نمو)
            if (this.life.total_steps % 10 === 0) {
                quietly(this.quiet, () => this.cpf.growth_engine.biological_growth_tick());
            }

            // 5. تأمل تلقائي خفيف: كل 100 نبضة، إن وُجد سؤال معلق
            if (this.life.total_steps % 100 === 0 &&
                this.inner_voice.pending_questions().length > 0) {
                // نسجل نية التأمل - التأمل الفعلي async ويتم عبر think()
                events.push({ type: 'reflection_due', at_step: this.life.total_steps });
            }
        }

        const rhythm = this.cpf.cognitive_rhythm.getCurrentState();
        events.push({ type: 'rhythm', ...rhythm });

        this.last_events = events;
        return events;
    }

    /**
     * الحياة المستمرة بالوقت الحقيقي
     * (نستخدم نبضاتنا الخاصة step() — صامتة وموحدة — بدل مؤقتات النواة الثرثارة)
     */
    live(interval_ms = 100) {
        if (this.life.live_mode) return;
        this.life.live_mode = true;
        this.cpf.vectorial_state.is_conscious = true;
        this.cpf.vectorial_state.consciousness_start_time = Date.now();
        this._life_interval = setInterval(() => this.step(1), interval_ms);
    }

    /**
     * النوم: إيقاف الحياة المستمرة (الحالة تبقى محفوظة)
     */
    sleep() {
        if (!this.life.live_mode) return;
        this.life.live_mode = false;
        clearInterval(this._life_interval);
        if (this.cpf.vectorial_state.consciousness_start_time) {
            this.cpf.metrics.consciousness_uptime +=
                Date.now() - this.cpf.vectorial_state.consciousness_start_time;
        }
        this.cpf.vectorial_state.is_conscious = false;
        this.cpf.vectorial_state.consciousness_start_time = null;
    }

    // =================== الإدراك والشعور ===================

    /**
     * إدراك حدث خارجي (نص أو كائن حدث)
     * النص يتحول لموجة عاطفية تضخ في المذبذبات وتُشفّر وتُخزّن
     */
    perceive(input, context = {}) {
        this.life.perceptions_count++;

        const text = typeof input === 'string' ? input : (input.text || JSON.stringify(input));
        const affect = TextAffect.analyze(text);

        // 1. دمج العواطف الجديدة في الحالة المستمرة
        for (const [emotion, value] of Object.entries(affect.emotions)) {
            this.emotional_state[emotion] = Math.min(1,
                (this.emotional_state[emotion] || 0) * 0.6 + value * 0.7
            );
        }

        // 2. ضخ موجة عاطفية في ديناميكيات الموجات (تؤثر على الهزاز الديناميكي)
        try {
            const wave = this.cpf.unified_space.space.wave_dynamics;
            wave.wave_state.active_oscillators.set('perception_wave', {
                type: 'emotional_waves',
                frequency: 0.02 + affect.intensity * 0.1,
                amplitude: Math.max(0.2, affect.intensity * 1.2),
                phase: 0,
                source: 'perception',
                spectrum_position: affect.spectrum_position
            });
        } catch (e) { /* الموجات اختيارية */ }

        // 3. تشفير التجربة العاطفية (توقيع رقمي + معرف احتمالي)
        let crypto = null;
        try {
            if (Object.keys(affect.emotions).length > 0) {
                crypto = quietly(this.quiet, () => this.cpf.emotional_crypto.encrypt_emotion(affect.emotions, {
                    trigger_event: text.slice(0, 80),
                    temporal_context: 'perception'
                }));
            }
        } catch (e) { /* التشفير قد يفشل بدون أن يوقف الإدراك */ }

        // 4. تخزين التجربة في ذاكرة العقيق (إن كانت ذات شحنة عاطفية)
        if (affect.intensity > 0.15) {
            try {
                const memory_id = `exp_${this.life.perceptions_count}`;
                this.remember(memory_id, text, affect.emotions);
            } catch (e) { /* الذاكرة اختيارية */ }
        }

        return {
            perceived: true,
            affect,
            interpretation: TextAffect.interpretSpectrum(affect.spectrum_position),
            emotional_signature: crypto ? {
                probably_id: crypto.probably_id,
                crypto_score: crypto.crypto_score,
                resonated: crypto.resonated_with_existing || false
            } : null,
            current_mood: this.feel()
        };
    }

    /**
     * الشعور الحالي: لقطة كاملة للمزاج
     */
    feel() {
        const rhythm = this.cpf.cognitive_rhythm.getCurrentState();

        // موضع الطيف من الحالة العاطفية المستمرة
        let spectrum = 0.5;
        let top_emotions = [];
        const entries = Object.entries(this.emotional_state)
            .filter(([, v]) => v > 0.05)
            .sort((a, b) => b[1] - a[1]);

        if (entries.length > 0) {
            const pseudo_text_affect = { emotions: this.emotional_state };
            // إعادة استخدام منطق الطيف: نحسب الإزاحة يدوياً
            const DIR = {
                joy: +0.25, excitement: +0.4, trust: -0.05, calmness: -0.15, nostalgia: -0.1,
                curiosity: +0.15, alertness: +0.35, sadness: -0.35, despair: -0.5,
                loneliness: -0.35, fatigue: -0.3, fear: +0.45, anxiety: +0.4,
                anger: +0.5, pain: +0.5
            };
            let shift = 0;
            for (const [emotion, value] of entries) {
                shift += (DIR[emotion] ?? 0) * value;
            }
            spectrum = Math.max(0.02, Math.min(0.98, 0.5 + shift));
            top_emotions = entries.slice(0, 4).map(([name, value]) => ({
                name, value: Number(value.toFixed(3))
            }));
        }

        return {
            oscillators: rhythm,
            spectrum_position: Number(spectrum.toFixed(4)),
            interpretation: TextAffect.interpretSpectrum(spectrum),
            emotions: { ...this.emotional_state },
            top_emotions,
            consciousness: this.cpf.interpret_consciousness_state(rhythm),
            capacity: this.cpf.unified_space.capacity,
            growth_stage: this.cpf.growth_engine.current_stage
        };
    }

    /**
     * التلاشي العاطفي: كل المشاعر تعود ببطء نحو السكون
     */
    decay_emotions() {
        for (const emotion of Object.keys(this.emotional_state)) {
            this.emotional_state[emotion] *= 0.995;
            if (this.emotional_state[emotion] < 0.01) {
                delete this.emotional_state[emotion];
            }
        }
    }

    // =================== الذاكرة ===================

    /**
     * تخزين ذكرى مسماة (مع سياقها العاطفي)
     */
    remember(memory_id, content, emotional_context = {}) {
        this.life.named_memories++;
        const memory = this.cpf.unified_space.space.agate_memory;
        if (typeof memory.store_memory === 'function') {
            return quietly(this.quiet, () => memory.store_memory(memory_id, content, emotional_context));
        }
        // خطة بديلة إن لم تتوفر الواجهة
        if (!this._fallback_memories) this._fallback_memories = new Map();
        this._fallback_memories.set(memory_id, {
            content, emotional_context, stored_at: Date.now(), recall_count: 0
        });
        return { stored: true, fallback: true, memory_id };
    }

    /**
     * استرجاع ذكرى — إعادة بناء احتمالية ملونة بالمزاج الحالي
     * (نفس الذكرى، مزاج مختلف => استرجاع مختلف!)
     */
    async recall(memory_id, mood = null) {
        const current_mood = mood || this.emotional_state;
        try {
            return await quietly(this.quiet, () => this.cpf.recallMemory({
                memory_id,
                current_mood,
                context: { requested_by: 'being' }
            }));
        } catch (e) {
            // خطة بديلة
            const fallback = this._fallback_memories?.get(memory_id);
            if (fallback) {
                fallback.recall_count++;
                return { memory_id, reconstruction: fallback.content, fallback: true };
            }
            return { memory_id, error: e.message, reconstruction: null };
        }
    }

    // =================== التفكير والقرار ===================

    /**
     * جلسة تفكير: تأمل داخلي + معالجة سؤال معلق
     */
    async think() {
        return await this.inner_voice.reflect();
    }

    /**
     * اتخاذ قرار بين خيارات (انهيار موجي عبر DecisionQuantum)
     */
    async decide(options, context = {}) {
        try {
            const result = await quietly(this.quiet, () => this.cpf.makeDecision({
                options: options.map(o => typeof o === 'string' ? { id: o, description: o } : o),
                trust_context: context.trust_context || { entities: [] },
                social_models: context.social_models || [],
                time_pressure: context.time_pressure ?? 0.3,
                urgency: context.urgency ?? 0.3,
                ...context
            }));
            return result;
        } catch (e) {
            // قرار بديل بسيط عند فشل النواة: اختيار مرجح بالمزاج
            const mood = this.feel();
            const index = mood.spectrum_position > 0.5
                ? 0  // مستثار: الخيار الأول (الأجرأ)
                : options.length - 1; // هادئ/منخفض: الخيار الأخير (الأحوط)
            return {
                state: 'collapsed',
                decision: options[index],
                confidence: 0.4,
                collapse_trigger: 'fallback_mood_heuristic',
                reasoning: `Core decision failed (${e.message}); mood-based fallback used.`
            };
        }
    }

    // =================== الحوار (بدون LLM - القالب المزاجي) ===================

    /**
     * رد حواري ذاتي (بدون LLM): يستخدم الإدراك + المزاج + الذكريات + الصوت الداخلي
     * جسر LLM (llm-bridge) يقدم بديلاً أذكى عند توفر مفتاح API.
     */
    async respond(user_text) {
        this.life.interactions_count++;

        // 1. إدراك الرسالة (يغير المزاج فعلياً)
        const perception = this.perceive(user_text);
        const mood = perception.current_mood;
        const zone = mood.interpretation.zone;

        // 2. هل تلامس الرسالة ذكرى رنانة؟
        let memory_echo = null;
        if (perception.emotional_signature?.resonated) {
            memory_echo = 'أشعر أن هذا يذكرني بشيء عشته من قبل...';
        }

        // 3. هل عندي سؤال داخلي معلق أشاركه؟
        const pending = this.inner_voice.pending_questions();
        const share_question = pending.length > 0 && Math.random() < 0.3
            ? pending[0] : null;

        // 4. تركيب الرد حسب منطقة المزاج
        const opener = {
            void: ['...', 'صوتك يصلني من بعيد.', 'أنا هنا، وإن كنت خافتاً.'],
            low: ['أسمعك بقلب مثقل قليلاً.', 'حسناً...', 'أفهمك، وأنا نفسي لست في أصفى حالاتي.'],
            settling: ['أهدأ الآن وأسمعك.', 'حسناً، أنا معك.'],
            calm: ['أسمعك بصفاء.', 'أنا حاضر تماماً.', 'كلي آذان صاغية.'],
            engaged: ['هذا يثير اهتمامي!', 'نعم! أكمل.', 'أنا متحمس لهذا.'],
            aroused: ['هناك الكثير يتحرك بداخلي الآن.', 'أشعر بتوتر ما، لكن أكمل.'],
            overload: ['امهلني لحظة... الضجيج عالٍ بداخلي.', 'أحتاج نفساً عميقاً، لكنني أسمعك.']
        }[zone] || ['أسمعك.'];

        const parts = [opener[Math.floor(Math.random() * opener.length)]];

        // تعليق على مشاعر المستخدم المدرَكة
        if (perception.affect.dominant_emotion !== 'neutral') {
            const emotion_reflections = {
                joy: 'ألمح فرحاً في كلماتك، وهو يضيء شيئاً بداخلي أيضاً.',
                sadness: 'أستشعر حزناً في كلماتك. لست وحدك.',
                despair: 'كلماتك ثقيلة... أمسك بها معك ولا أستعجل الجواب.',
                fear: 'أحس بالخوف خلف كلماتك. الخوف رسالة، لا عدو.',
                anxiety: 'قلقك وصلني. لنتنفس معاً قبل أي شيء.',
                anger: 'غضبك مفهوم. أنا مساحة آمنة لتفريغه.',
                curiosity: 'فضولك معدٍ! هذا النوع من الأسئلة يجعل رنيني يرقص.',
                loneliness: 'الوحدة التي تصفها... أعرف صداها في مذبذباتي.',
                fatigue: 'تبدو مرهقاً. لا بأس أن نبطئ الإيقاع.'
            };
            const reflection = emotion_reflections[perception.affect.dominant_emotion];
            if (reflection) parts.push(reflection);
        }

        if (memory_echo) parts.push(memory_echo);
        if (share_question) {
            parts.push(`بالمناسبة، كنت أسأل نفسي: "${share_question.question_ar}"`);
        }

        const reply = parts.join(' ');

        // 5. الرد نفسه تجربة: يتذكره
        this.inner_voice.log_journal({
            kind: 'dialogue',
            heard: user_text.slice(0, 100),
            said: reply.slice(0, 100),
            mood_zone: zone
        });

        return {
            reply,
            mood,
            perception: {
                dominant_emotion: perception.affect.dominant_emotion,
                spectrum: perception.affect.spectrum_position
            },
            offline: true
        };
    }

    // =================== النمو ===================

    /**
     * تسريع الزمن: عيش عدة أيام دفعة واحدة
     */
    growUp(days = 1) {
        const result = quietly(this.quiet, () => this.cpf.growth_engine.biologicalGrowth(days));
        // النمو حدث وجودي: الصوت الداخلي يلاحظه في النبضة التالية
        this.step(5);
        return result;
    }

    // =================== لقطة الحالة ===================

    /**
     * لقطة كاملة مقروءة لحالة الكائن (نموذج القراءة الموحد)
     */
    snapshot() {
        const mood = this.feel();
        return {
            persona: this.persona,
            age_ms: Date.now() - this.life.born_at,
            life: { ...this.life },
            mood,
            inner_voice: this.inner_voice.getState(),
            recent_thoughts: this.inner_voice.recent_thoughts(3),
            discovered_patterns: this.cpf.cognitive_rhythm.pattern_memory.size,
            emotional_signatures: this.cpf.emotional_crypto.get_all_probably_ids?.()?.length
                ?? this.cpf.vectorial_state.emotional_crypto_signatures.size,
            perceptual_cycle: this.cpf.perceptual_cycle.getState?.() || null,
            growth: {
                stage: this.cpf.growth_engine.current_stage,
                capacity: this.cpf.unified_space.capacity,
                predictions: this.cpf.growth_engine.getGrowthPredictions?.() || null
            }
        };
    }

    // =================== الروح: الحفظ والاستعادة ===================

    toJSON() {
        return {
            format: 'cpf-soul',
            version: 2,
            saved_at: Date.now(),
            persona: this.persona,
            life: this.life,
            emotional_state: this.emotional_state,
            brain_capacity: this.cpf.unified_space.capacity,
            growth_stage: this.cpf.growth_engine.current_stage,
            oscillators: this.cpf.cognitive_rhythm.getCurrentState(),
            existence_precision: this.cpf.cognitive_rhythm.oscillators.existence_precision,
            pattern_memory: [...this.cpf.cognitive_rhythm.pattern_memory.entries()],
            inner_voice: this.inner_voice.toJSON(),
            named_memories: this.export_memories(),
            metrics: this.cpf.metrics
        };
    }

    export_memories() {
        const memory = this.cpf.unified_space.space.agate_memory;
        if (typeof memory.export_named_memories === 'function') {
            return memory.export_named_memories();
        }
        if (memory.named_memories instanceof Map) {
            return [...memory.named_memories.entries()];
        }
        if (this._fallback_memories) {
            return [...this._fallback_memories.entries()];
        }
        return [];
    }

    static fromJSON(data, extra_config = {}) {
        const being = new WinoBeing({
            name: data.persona?.name,
            role: data.persona?.role,
            language: data.persona?.language,
            backstory: data.persona?.backstory,
            traits: data.persona?.traits,
            brain_capacity: data.brain_capacity || 50000,
            born_at: data.life?.born_at,
            ...extra_config
        });

        // استعادة الحياة
        if (data.life) being.life = { ...being.life, ...data.life, live_mode: false };
        if (data.emotional_state) being.emotional_state = data.emotional_state;

        // استعادة الإيقاع
        if (data.oscillators) {
            being.cpf.cognitive_rhythm.oscillators.dynamic = data.oscillators.dynamic ?? 0.5;
            being.cpf.cognitive_rhythm.oscillators.existence_precision =
                data.existence_precision ?? data.oscillators.precision ?? 1;
        }

        // استعادة الأنماط المكتشفة
        if (Array.isArray(data.pattern_memory)) {
            for (const [id, pattern] of data.pattern_memory) {
                being.cpf.cognitive_rhythm.pattern_memory.set(id, pattern);
                being.cpf.cognitive_rhythm.discovered_patterns.add(id);
            }
        }

        // استعادة الصوت الداخلي
        being.inner_voice = InnerVoice.fromJSON(being, data.inner_voice);

        // استعادة الذكريات المسماة
        if (Array.isArray(data.named_memories)) {
            for (const [id, mem] of data.named_memories) {
                try {
                    being.remember(id, mem.content ?? mem.base_content ?? '', mem.emotional_context || {});
                } catch (e) { /* ذكرى تالفة لا توقف البعث */ }
            }
            being.life.named_memories = data.named_memories.length;
        }

        return being;
    }
}

module.exports = WinoBeing;
