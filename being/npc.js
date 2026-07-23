/**
 * CPF NPC - كائن غير قابل للعب
 *
 * محول جاهز للألعاب: يغلّف WinoBeing بواجهة يفهمها مطور الألعاب:
 *   tick(dt)           - نبضة في حلقة اللعبة
 *   onEvent(event)     - حدث لعبة (هجوم، هدية، اقتراب لاعب...)
 *   interact(text)     - حوار مع اللاعب
 *   hud()              - حالة مدمجة للعرض (مزاج، ثقة، إيموجي، لون، تلميح حركة)
 *   save()/load()      - استمرارية عبر الجلسات
 *
 * الشخصيات النمطية الخمس موروثة من تجارب collective-interference.
 *
 * @module CPFNPC
 */

const WinoBeing = require('./mind');
const LLMBridge = require('./llm-bridge');
const Soul = require('./soul');

// أنماط شخصية جاهزة (من توثيق التداخل الجماعي)
const ARCHETYPES = {
    analytical_thinker: {
        traits: { warmth: 0.4, curiosity: 0.9, patience: 0.8, playfulness: 0.2, caution: 0.7 },
        role: 'مفكر تحليلي'
    },
    intuitive_creative: {
        traits: { warmth: 0.7, curiosity: 0.9, patience: 0.4, playfulness: 0.8, caution: 0.2 },
        role: 'مبدع حدسي'
    },
    cautious_conservative: {
        traits: { warmth: 0.5, curiosity: 0.3, patience: 0.9, playfulness: 0.2, caution: 0.9 },
        role: 'حذر محافظ'
    },
    social_coordinator: {
        traits: { warmth: 0.9, curiosity: 0.6, patience: 0.7, playfulness: 0.6, caution: 0.4 },
        role: 'منسق اجتماعي'
    },
    rapid_decider: {
        traits: { warmth: 0.5, curiosity: 0.5, patience: 0.2, playfulness: 0.5, caution: 0.3 },
        role: 'حاسم سريع'
    },
    wise_guard: {
        traits: { warmth: 0.7, curiosity: 0.6, patience: 0.9, playfulness: 0.3, caution: 0.6 },
        role: 'حارس حكيم'
    }
};

// تحويل أحداث اللعبة إلى نص إدراكي + تعديل ثقة
const GAME_EVENTS = {
    player_approach: { text: 'لاعب يقترب مني بهدوء', trust_delta: +0.01 },
    player_gift: { text: 'اللاعب أعطاني هدية جميلة! هذا كرم منه', trust_delta: +0.1 },
    player_attack: { text: 'اللاعب هاجمني! خطر! ألم وخوف وغضب', trust_delta: -0.25 },
    player_help: { text: 'اللاعب ساعدني في مهمتي، أشعر بالامتنان والثقة', trust_delta: +0.15 },
    player_insult: { text: 'اللاعب أهانني بكلام جارح. غضب وحزن', trust_delta: -0.1 },
    player_leave: { text: 'اللاعب غادر... هدوء ووحدة خفيفة', trust_delta: 0 },
    night_falls: { text: 'الليل يحل، هدوء وحذر', trust_delta: 0 },
    danger_near: { text: 'خطر يقترب من المكان! توتر وتأهب', trust_delta: 0 },
    quest_complete: { text: 'أنجزنا المهمة معاً! فرح وفخر وإنجاز', trust_delta: +0.12 }
};

class CPFNPC {
    constructor(config = {}) {
        const archetype = ARCHETYPES[config.archetype] || ARCHETYPES.wise_guard;

        this.being = config.being || new WinoBeing({
            name: config.name || 'حارس القرية',
            role: config.role || archetype.role,
            traits: { ...archetype.traits, ...(config.traits || {}) },
            brain_capacity: config.brain_capacity || 50000,
            backstory: config.backstory ||
                `أنا ${config.name || 'حارس القرية'}، ${archetype.role} في هذا العالم. أكبر وأتعلم من كل تفاعل.`
        });

        this.bridge = new LLMBridge(config.llm || {});

        // علاقة اللاعب (نموذج ثقة بسيط + نمذجة الآخرين في CPF)
        this.player_trust = config.player_trust ?? 0.5;

        // تجميع النبضات: اللعبة تستدعي tick كل إطار لكن CPF ينبض كل 100ms افتراضياً
        this._tick_accumulator = 0;
        this.tick_interval_ms = config.tick_interval_ms || 100;
    }

    /**
     * نبضة في حلقة اللعبة - dt بالمللي ثانية
     */
    tick(dt = 16) {
        this._tick_accumulator += dt;
        let steps = 0;
        while (this._tick_accumulator >= this.tick_interval_ms) {
            this._tick_accumulator -= this.tick_interval_ms;
            this.being.step(1);
            steps++;
        }
        return steps;
    }

    /**
     * حدث لعبة
     */
    onEvent(event_type, details = {}) {
        const event = GAME_EVENTS[event_type];
        const text = event?.text || String(event_type);

        const perception = this.being.perceive(text, details);

        if (event) {
            this.player_trust = Math.max(0, Math.min(1, this.player_trust + event.trust_delta));
            // تحديث نموذج اللاعب في نمذجة الآخرين
            try {
                this.being.cpf.unified_space.space.others_models.update_model_from_interaction('player', {
                    type: event_type,
                    valence: event.trust_delta,
                    ...details
                });
            } catch (e) { /* اختياري */ }
        }

        return {
            event: event_type,
            perception: perception.affect.dominant_emotion,
            mood_zone: perception.current_mood.interpretation.zone,
            player_trust: Number(this.player_trust.toFixed(3))
        };
    }

    /**
     * حوار مع اللاعب
     */
    async interact(player_text) {
        // الثقة تعدل الإدراك: كلام من شخص موثوق يُدرك بدفء أكبر
        const result = await this.bridge.speak(this.being, player_text);

        // التفاعل الإيجابي/السلبي يحرك الثقة قليلاً
        const spectrum = result.perception?.spectrum ?? 0.5;
        if (spectrum > 0.55) this.player_trust = Math.min(1, this.player_trust + 0.01);
        if (spectrum < 0.35) this.player_trust = Math.max(0, this.player_trust - 0.005);

        return {
            reply: result.reply,
            mood_zone: result.mood.interpretation.zone,
            player_trust: Number(this.player_trust.toFixed(3)),
            offline: result.offline ?? false
        };
    }

    /**
     * قرار NPC بين خيارات سلوكية
     */
    async decide(options, context = {}) {
        return await this.being.decide(options, {
            trust_context: { entities: [{ id: 'player', competence_history: [], transparency: this.player_trust }] },
            ...context
        });
    }

    /**
     * حالة مدمجة للعرض في اللعبة
     */
    hud() {
        const mood = this.being.feel();
        const zone = mood.interpretation.zone;

        const zone_visuals = {
            void: { emoji: '🌑', color: '#37474f', animation: 'slouch' },
            low: { emoji: '😔', color: '#546e7a', animation: 'slow_walk' },
            settling: { emoji: '😌', color: '#78909c', animation: 'idle_calm' },
            calm: { emoji: '🙂', color: '#4caf50', animation: 'idle' },
            engaged: { emoji: '😃', color: '#ffb300', animation: 'alert' },
            aroused: { emoji: '😰', color: '#f4511e', animation: 'agitated' },
            overload: { emoji: '🤯', color: '#d32f2f', animation: 'panic' }
        };

        return {
            name: this.being.persona.name,
            ...zone_visuals[zone],
            mood_zone: zone,
            mood_ar: mood.interpretation.ar,
            spectrum: mood.spectrum_position,
            resonance: Number(mood.oscillators.judge.toFixed(3)),
            player_trust: Number(this.player_trust.toFixed(3)),
            growth_stage: mood.growth_stage,
            capacity: mood.capacity,
            pending_thoughts: this.being.inner_voice.pending_questions().length
        };
    }

    /**
     * حفظ روح الـ NPC
     */
    save(filepath = null) {
        const being_data = this.being.toJSON();
        being_data.npc_state = { player_trust: this.player_trust };
        const fs = require('fs');
        const path = require('path');
        const target = filepath ||
            path.join(process.cwd(), 'souls', `${Soul.slug(this.being.persona.name)}.soul.json`);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, JSON.stringify(being_data, null, 2), 'utf8');
        return { saved: true, path: target };
    }

    /**
     * استعادة NPC من ملف روح
     */
    static load(filepath, config = {}) {
        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        const being = WinoBeing.fromJSON(data);
        const npc = new CPFNPC({ ...config, being });
        if (data.npc_state) {
            npc.player_trust = data.npc_state.player_trust ?? 0.5;
        }
        return npc;
    }

    static get archetypes() {
        return Object.keys(ARCHETYPES);
    }
}

module.exports = CPFNPC;
