/**
 * Agate Memory - Probabilistic Memory Engine (CORE!)
 *
 * Integrates: agate-memory + generative-reconstruction + emotional-encryption
 *
 * The heart of human cognition - memory as probabilistic reconstruction rather than file retrieval.
 * Every recall is influenced by current emotional state, context, and cognitive noise.
 *
 * العقيق الملوّن = خبرات مُقاسة وملموسة | العقيق الأبيض = فجوات تُملأ بتخمين مقيّد
 *
 * @module AgateMemory
 * @version 3.0-quantum
 */

const ProbabilityCore = require('../probability-core');

class AgateMemory {
    constructor(config = {}) {
        this.webppl = new ProbabilityCore(config.probability || {});

        // السعة الدماغية الحالية - أساس مفهوم إعادة العرض الفيكتوري
        this.brain_capacity = config.brain_capacity || 1000;

        // Agate Memory Timeline Structure
        this.timeline = {
            colored_agate: new Map(), // Measured, concrete experiences
            white_agate: new Map(),   // Unmeasured possibilities and gaps
            compression_ratios: new Map(),
            voting_history: new Map()
        };

        // 🆕 إضافة نظام الخبرات
        this.quantum_experiences = new Map(); // skill_id -> QuantumExperience
        this.crossover_potential_matrix = new Map(); // skill1::skill2 -> potential

        // 🆕 الذكريات المسماة - قابلة للاستدعاء بالمعرف عبر recall(memory_id, ...)
        this.named_memories = new Map(); // memory_id -> {base_content, emotional_signature, recall_count, created_at}

        // Emotional Encryption System
        this.emotional_encryption = {
            encryption_keys: new Map(), // Emotional states as keys
            decay_patterns: new Map(),  // How emotions fade over time
            trigger_associations: new Map(), // What triggers specific memories
            trauma_protections: new Map() // Special handling for difficult memories
        };

        // Generative Reconstruction Engine
        this.reconstruction_engine = {
            base_patterns: new Map(),    // Core memory patterns
            variation_generators: new Map(), // How memories vary in recall
            context_modifiers: new Map(),    // How context changes reconstruction
            coherence_validators: new Map()  // Ensure reconstructions make sense
        };

        // Simulator Voting System for Timeline Storage
        this.voting_system = {
            active_voters: ["reality_processor", "memory_reconstructor", "prediction_engine", "pattern_explorer"],
            voting_weights: {
                reality_processor: 0.3,
                memory_reconstructor: 0.3,
                prediction_engine: 0.2,
                pattern_explorer: 0.2
            },
            consensus_threshold: 0.7,
            storage_decisions: new Map()
        };

        // White Agate Logical Constraints
        this.white_agate_constraints = {
            temporal_feasibility: "events_must_respect_timeline",
            causal_consistency: "effects_must_follow_causes",
            physical_plausibility: "must_obey_physical_laws",
            emotional_coherence: "emotions_must_fit_context",
            social_appropriateness: "interactions_must_be_realistic"
        };

        // Performance metrics
        this.metrics = {
            voting_consensus_rate: 0.73,
            timeline_integrity: 0.96,
            speculation_accuracy: 0.64,
            compression_efficiency: 0.42,
            reconstruction_variation: 0.31
        };
    }

    /**
     * أدوات مساعدة صغيرة - حَصر القيم وتفكيك النصوص
     */
    _clamp(value, lo = 0, hi = 1) {
        if (!Number.isFinite(value)) return (lo + hi) / 2;
        return Math.max(lo, Math.min(hi, value));
    }

    tokenize(text) {
        return String(text == null ? '' : text)
            .toLowerCase()
            .split(/[^a-z0-9؀-ۿ]+/)
            .filter(token => token.length > 2);
    }

    token_overlap(a, b) {
        const tokens_a = new Set(this.tokenize(a));
        const tokens_b = new Set(this.tokenize(b));
        if (!tokens_a.size || !tokens_b.size) return 0;
        let shared = 0;
        for (const token of tokens_a) if (tokens_b.has(token)) shared++;
        return shared / Math.min(tokens_a.size, tokens_b.size);
    }

    // إضافة الدعم الفيكتوري:
    store_vectorial_experience(experience, crypto_data) {
        const vectorial_exp = {
            core_pattern: this.extract_core_pattern(experience),
            crypto_signature: crypto_data,
            current_capacity: this.brain_capacity,
            scaling_potential: this.calculate_scaling_potential(experience)
        };

        // يستخدم النظام الحالي مع إضافات
        return this.store_experience(vectorial_exp);
    }

    // النمط الجوهري للخبرة: الكلمات الأكثر تكرارًا + بصمة + تعقيد
    extract_core_pattern(experience) {
        let text;
        try { text = JSON.stringify(experience || {}); } catch (e) { text = String(experience); }
        const counts = new Map();
        for (const token of this.tokenize(text)) counts.set(token, (counts.get(token) || 0) + 1);
        const keywords = [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([token]) => token);
        return {
            keywords,
            signature: keywords.join('+') || 'empty_pattern',
            complexity: this._clamp(counts.size / 40)
        };
    }

    // قابلية إعادة العرض عند سعة دماغية أعلى (المفهوم الفيكتوري)
    calculate_scaling_potential(experience) {
        const pattern = this.extract_core_pattern(experience);
        const capacity_headroom = this._clamp(this.brain_capacity / 2000);
        return this._clamp(0.2 + (1 - pattern.complexity) * 0.4 + capacity_headroom * 0.4);
    }

    /**
     * 🆕 إعادة تحجيم الخبرات عند تغيّر السعة الدماغية
     * نفس الجوهر المخزّن، مستوى تفصيل جديد - "الضجيج القديم قد يصير زخرفة"
     */
    rescale_experiences(new_capacity) {
        const previous_capacity = this.brain_capacity;
        this.brain_capacity = new_capacity;
        const detail_level = this._clamp(new_capacity / 1000, 0.05, 1);
        let rescaled_items = 0;
        for (const record of this.named_memories.values()) { record.detail_level = detail_level; rescaled_items++; }
        for (const experience of this.quantum_experiences.values()) { experience.detail_level = detail_level; rescaled_items++; }
        for (const record of this.timeline.colored_agate.values()) { record.detail_level = detail_level; rescaled_items++; }
        for (const record of this.timeline.white_agate.values()) { record.detail_level = detail_level; rescaled_items++; }
        return { previous_capacity, new_capacity, detail_level, rescaled_items };
    }

    // 🆕 تخزين خبرة جديدة
    store_skill_experience(skill_id, performance_data) {
        const existing = this.quantum_experiences.get(skill_id) || {
            skill_id: skill_id,
            proficiency_level: 0.1,
            attempts_count: 0,
            success_history: [],
            crossover_discoveries: new Map()
        };

        existing.attempts_count++;
        const success_value = performance_data.success ?? performance_data.success_rate ?? 0.5;
        existing.success_history.push(success_value);
        if (performance_data.emotional_context) existing.last_emotional_context = performance_data.emotional_context;
        existing.last_updated = Date.now();
        existing.proficiency_level = this.calculate_proficiency(existing);

        this.quantum_experiences.set(skill_id, existing);
        this.update_crossover_potential(skill_id);

        return existing;
    }

    // منحنى تعلم: متوسط النجاح × عامل خبرة بتناقص العوائد
    calculate_proficiency(experience_record) {
        const history = (experience_record.success_history || [])
            .map(v => typeof v === 'number' ? this._clamp(v) : (v ? 1 : 0));
        const avg_success = history.length
            ? history.reduce((a, b) => a + b, 0) / history.length
            : 0.5;
        const experience_factor = 1 - Math.exp(-(experience_record.attempts_count || 0) / 8);
        return this._clamp(0.1 + avg_success * 0.9 * experience_factor, 0.05, 1);
    }

    // تحديث إمكانات التقاطع بين المهارات: تداخل دلالي + جسر كفاءة
    update_crossover_potential(skill_id) {
        const source = this.quantum_experiences.get(skill_id);
        if (!source) return;
        for (const [other_id, other] of this.quantum_experiences) {
            if (other_id === skill_id) continue;
            const semantic_overlap = this.token_overlap(skill_id, other_id);
            const proficiency_bridge = Math.sqrt((source.proficiency_level || 0) * (other.proficiency_level || 0));
            const potential = this._clamp(0.15 + semantic_overlap * 0.55 + proficiency_bridge * 0.3);
            this.crossover_potential_matrix.set([skill_id, other_id].sort().join('::'), potential);
            source.crossover_discoveries.set(other_id, potential);
        }
    }

    get_crossover_potential(skill_id, target_skill) {
        if (!target_skill || target_skill === skill_id) return 0.2;
        const stored = this.crossover_potential_matrix.get([skill_id, target_skill].sort().join('::'));
        if (typeof stored === 'number') return stored;
        return this._clamp(0.15 + this.token_overlap(skill_id, target_skill) * 0.55);
    }

    // مدى صلة خبرة بالسياق: تداخل كلمات + كفاءة + تشابه عاطفي
    calculate_relevance(experience, context = {}) {
        let context_text;
        try { context_text = JSON.stringify(context || {}); } catch (e) { context_text = String(context); }
        const context_tokens = new Set(this.tokenize(context_text));
        const skill_tokens = this.tokenize(experience.skill_id);
        const hits = skill_tokens.filter(t => context_tokens.has(t)).length;
        const keyword_overlap = skill_tokens.length ? hits / skill_tokens.length : 0;
        const emotional_similarity = context.emotional_state
            ? this.calculate_emotional_key_similarity(context.emotional_state, experience.last_emotional_context || {})
            : 0.5;
        return this._clamp(
            keyword_overlap * 0.55 +
            (experience.proficiency_level || 0) * 0.25 +
            emotional_similarity * 0.2
        );
    }

    // 🆕 العثور على خبرات ذات صلة
    getRelevantExperiences(context, threshold = 0.4) {
        const relevant = [];

        for (const [skill_id, experience] of this.quantum_experiences) {
            const relevance = this.calculate_relevance(experience, context);
            if (relevance > threshold) {
                relevant.push({
                    ...experience,
                    relevance_score: relevance,
                    crossover_potential: this.get_crossover_potential(skill_id, context && context.target_skill)
                });
            }
        }

        return relevant.sort((a, b) => b.relevance_score - a.relevance_score);
    }

    /**
     * 🆕 تخزين ذاكرة مسماة قابلة للاستدعاء لاحقًا بـ recall(memory_id, ...)
     */
    store_memory(memory_id, content, emotional_context = {}) {
        const record = {
            memory_id,
            base_content: content,
            raw_emotional_context: emotional_context,
            emotional_signature: this.generate_emotional_key(emotional_context),
            decay_pattern: this.calculate_decay_pattern(emotional_context),
            recall_count: 0,
            created_at: Date.now(),
            detail_level: this._clamp(this.brain_capacity / 1000, 0.05, 1)
        };
        this.named_memories.set(memory_id, record);
        return record;
    }

    // البحث عن ذاكرة مسماة تطابق الإشارات
    resolve_named_memory(memory_cues) {
        if (typeof memory_cues === 'string') return this.named_memories.get(memory_cues) || null;
        if (memory_cues && typeof memory_cues === 'object' && memory_cues.memory_id) {
            return this.named_memories.get(memory_cues.memory_id) || null;
        }
        return null;
    }

    /**
     * Main memory recall function - always probabilistic reconstruction
     * This is the core of human-like memory understanding
     *
     * يُرجع كائنًا عاديًا (تحققًا واحدًا) + ميتاداتا توزيع في _distribution
     * كل استدعاء يختلف قليلًا، والمزاج الحالي يلوّن إعادة البناء
     */
    recall(memory_cues, current_mood = {}, context = {}) {
        const named_memory = this.resolve_named_memory(memory_cues);
        if (named_memory) {
            named_memory.recall_count++;
            named_memory.last_recalled_at = Date.now();
        }
        const memory_meta = named_memory
            ? { recall_count: named_memory.recall_count, age_days: (Date.now() - named_memory.created_at) / 86400000 }
            : { recall_count: 0, age_days: 0 };
        const memory_id = named_memory
            ? named_memory.memory_id
            : (typeof memory_cues === 'string' ? memory_cues : (memory_cues && memory_cues.memory_id) || 'synthesized_recall');

        // البرنامج الاحتمالي: كل تنفيذ = إعادة بناء كاملة واحدة
        const reconstruct_once = () => {
            // Identify target memory segments
            const target_segments = this.identify_memory_segments(memory_cues, named_memory);

            // Calculate emotional filter based on current mood
            const emotional_filter = this.calculate_emotional_filter(current_mood, memory_meta);

            // Assess contextual bias
            const contextual_bias = this.calculate_contextual_bias(context);

            // Generate reconstruction for each segment
            const reconstructed_segments = target_segments.map(segment => {
                if (segment.type === "colored_agate") {
                    return this.reconstruct_measured_memory(segment, emotional_filter, contextual_bias);
                } else {
                    return this.speculate_white_agate(segment, emotional_filter, contextual_bias);
                }
            });

            // Combine segments into coherent narrative
            const coherent_memory = this.combine_memory_segments(reconstructed_segments, emotional_filter);

            // Validate reconstruction quality
            const validation_result = this.validate_reconstruction(coherent_memory, memory_cues);

            return {
                memory_id,
                reconstruction: this.render_reconstruction_text(coherent_memory, current_mood, named_memory, emotional_filter),
                reconstructed_memory: coherent_memory,
                emotional_coloring: emotional_filter,
                contextual_influence: contextual_bias,
                // التشويه العاطفي يقتطع من ثقة إعادة البناء (تدهور موافق للمزاج)
                reconstruction_confidence: this._clamp(
                    validation_result.confidence * (1 - emotional_filter.distortion_level * 0.3), 0.05, 0.95),
                memory_segments: reconstructed_segments,
                reconstruction_variation: this.calculate_variation_score(coherent_memory),

                // Meta-information about the reconstruction process
                segments_used: target_segments.length,
                colored_segments: target_segments.filter(s => s.type === "colored_agate").length,
                white_segments: target_segments.filter(s => s.type === "white_agate").length,
                emotional_encryption_active: emotional_filter.encryption_strength > 0.3,
                recall_count: memory_meta.recall_count,

                // Quality metrics
                coherence_score: validation_result.coherence,
                plausibility_score: validation_result.plausibility,
                emotional_authenticity: validation_result.emotional_fit
            };
        };

        // نستنتج التوزيع لأغراض الميتاداتا، ثم نُرجع تحققًا ملموسًا واحدًا
        const distribution = this.webppl.infer(reconstruct_once, { samples: 24 });
        const has_samples = distribution && Array.isArray(distribution.samples) && distribution.samples.length > 0
            && typeof distribution.sample === 'function';
        const realized = has_samples ? distribution.sample() : reconstruct_once();
        const sample_pool = has_samples ? distribution.samples : [realized];
        realized._distribution = {
            mean: this.webppl.expectation(sample_pool, r => r.reconstruction_confidence || 0),
            variance: this.webppl.variance(sample_pool, r => r.reconstruction_confidence || 0),
            size: sample_pool.length
        };
        return realized;
    }

    // صياغة نص إعادة البناء - يتغير مع كل استدعاء (تركيز منتقى احتماليًا + نبرة المزاج)
    render_reconstruction_text(coherent_memory, current_mood = {}, named_memory = null, emotional_filter = {}) {
        const source = named_memory
            ? String(named_memory.memory_id).replace(/_/g, ' ')
            : 'a loosely cued moment';
        const details = [];
        if (named_memory && named_memory.base_content && typeof named_memory.base_content === 'object') {
            for (const value of Object.values(named_memory.base_content)) {
                (Array.isArray(value) ? value : [value]).forEach(v => {
                    if (typeof v === 'string') details.push(v.replace(/_/g, ' '));
                });
            }
        }
        const focus = details.length
            ? this.webppl.categorical(details)
            : 'blurred details at the edge of the scene';
        const vb = emotional_filter.valence_bias || 0;
        const tone = vb > 0.15
            ? 'glows warmer than it probably was'
            : vb < -0.15
                ? 'feels heavier and dimmer than it was'
                : 'surfaces in muted, neutral tones';
        const distortion_pct = (100 * (emotional_filter.distortion_level || 0)).toFixed(0);
        return `Recalling "${source}": attention settles on "${focus}"; the scene ${tone} (distortion ${distortion_pct}%).`;
    }

    /**
     * Probabilistic reconstruction of measured memories (colored agate)
     */
    reconstruct_measured_memory(segment, emotional_filter, contextual_bias) {
        // Base memory content (what actually happened)
        const base_content = segment.measured_content;

        // Apply emotional encryption/decryption
        const emotionally_filtered = this.apply_emotional_decryption(
            base_content,
            emotional_filter,
            segment.original_emotional_context
        );

        // Apply contextual reconstruction bias
        const contextually_adjusted = this.apply_contextual_reconstruction(
            emotionally_filtered,
            contextual_bias,
            segment.original_context
        );

        // Add reconstruction variability
        const reconstruction_noise = this.webppl.exponential(0.2);
        const varied_reconstruction = this.add_reconstruction_variation(
            contextually_adjusted,
            reconstruction_noise
        );

        // Validate against logical constraints
        const constraint_validated = this.validate_against_constraints(
            varied_reconstruction,
            segment.timestamp
        );

        return {
            type: "reconstructed_measurement",
            original_segment: segment.id,
            content: constraint_validated,
            emotional_transformation: this.calculate_emotional_delta(
                segment.original_emotional_context,
                emotional_filter
            ),
            contextual_shift: this.calculate_contextual_shift(
                segment.original_context,
                contextual_bias
            ),
            reconstruction_confidence: this.webppl.beta(7, 3), // Generally confident in measured memories
            variation_applied: varied_reconstruction.variation_level
        };
    }

    // انحياز السياق يعيد صبغ المحتوى دون تغيير جوهره
    apply_contextual_reconstruction(content, contextual_bias, original_context) {
        const context_shift = this.calculate_contextual_shift(original_context, contextual_bias);
        return {
            ...(content && typeof content === 'object' ? content : { content }),
            contextual_emphasis: (contextual_bias.context_strength || 0) > 0.6 ? 'context_amplified' : 'context_neutral',
            context_shift,
            bias_applied: contextual_bias.overall_bias || 0
        };
    }

    // ضجيج إعادة البناء: لا استدعاء يطابق سابقه تمامًا
    add_reconstruction_variation(content, reconstruction_noise) {
        const variation_level = this._clamp(reconstruction_noise * 0.08, 0, 0.6);
        return {
            ...content,
            variation_level,
            detail_jitter: this.webppl.gaussian(0, 0.05 + variation_level * 0.1),
            emphasis_shifted: variation_level > 0.25
        };
    }

    /**
     * Speculative reconstruction for unmeasured possibilities (white agate)
     */
    speculate_white_agate(segment, emotional_filter, contextual_bias) {
        // White agate represents unmeasured possibilities - we must speculate
        const speculation_basis = segment.constraint_boundaries;

        // Generate multiple possible interpretations
        const possible_interpretations = this.generate_possible_interpretations(
            speculation_basis,
            emotional_filter,
            contextual_bias
        );

        // Select most likely interpretation based on constraints
        const selected_interpretation = this.select_constrained_interpretation(
            possible_interpretations,
            this.white_agate_constraints
        );

        // Apply emotional coloring to speculation
        const emotionally_colored = this.apply_emotional_speculation(
            selected_interpretation,
            emotional_filter
        );

        // Validate speculation plausibility
        const plausibility_check = this.validate_speculation_plausibility(
            emotionally_colored,
            segment.neighboring_colored_agate
        );

        return {
            type: "white_agate_speculation",
            original_segment: segment.id,
            content: emotionally_colored,
            speculation_basis: speculation_basis,
            alternative_interpretations: possible_interpretations.slice(0, 3), // Top 3 alternatives
            plausibility_score: plausibility_check.score,
            constraint_violations: plausibility_check.violations,
            speculation_confidence: this.webppl.beta(4, 6), // Lower confidence for speculation
            emotional_projection: emotional_filter.projection_strength
        };
    }

    // توليد تفسيرات ممكنة للفجوة - التخمين يميل لما يوافق المزاج (mood-congruent)
    generate_possible_interpretations(speculation_basis, emotional_filter, contextual_bias) {
        const bounds = speculation_basis || {};
        const anchor = (bounds.temporal_bounds || ['some_time']).join(' → ');
        const themes = [
            { theme: 'routine_continuation', valence: 0.1 },
            { theme: 'warm_social_moment', valence: 0.6 },
            { theme: 'quiet_transition', valence: 0.0 },
            { theme: 'minor_friction', valence: -0.5 },
            { theme: 'anxious_waiting', valence: -0.6 }
        ];
        const vb = emotional_filter.valence_bias || 0;
        return themes.map(t => ({
            theme: t.theme,
            description: `${t.theme.replace(/_/g, ' ')} (${anchor})`,
            valence: t.valence,
            plausibility: this._clamp(
                this.webppl.beta(4, 4) + vb * t.valence * 0.3 + (contextual_bias.overall_bias || 0) * 0.1
            )
        })).sort((a, b) => b.plausibility - a.plausibility);
    }

    // اختيار التفسير الأكثر معقولية بعد معاقبة انتهاكات القيود المنطقية
    select_constrained_interpretation(interpretations, constraints) {
        const constraint_names = Object.keys(constraints || {});
        const scored = (interpretations || []).map(interp => {
            const violations = constraint_names.filter(() => this.webppl.uniform(0, 1) < 0.04);
            return {
                ...interp,
                violations,
                constrained_plausibility: (interp.plausibility || 0.3) * Math.pow(0.6, violations.length)
            };
        });
        scored.sort((a, b) => b.constrained_plausibility - a.constrained_plausibility);
        return scored[0] || { theme: 'undetermined', plausibility: 0.3, violations: [], constrained_plausibility: 0.3 };
    }

    // تلوين التخمين عاطفيًا حسب انحياز التكافؤ الحالي
    apply_emotional_speculation(interpretation, emotional_filter) {
        const vb = emotional_filter.valence_bias || 0;
        return {
            ...interpretation,
            emotional_shade: vb > 0.15 ? 'hopeful_glow' : vb < -0.15 ? 'apprehensive_shadow' : 'neutral_haze',
            shade_strength: this._clamp(Math.abs(vb) * (emotional_filter.intensity_multiplier || 1)),
            projected_from_mood: emotional_filter.projection_strength || 0
        };
    }

    // كلما زادت المراسي الملوّنة المجاورة، ازداد التخمين رسوخًا
    validate_speculation_plausibility(speculation, neighboring_colored_agate) {
        const anchoring = this._clamp(
            (Array.isArray(neighboring_colored_agate) ? neighboring_colored_agate.length : 0) * 0.2, 0, 0.6);
        const base = speculation.constrained_plausibility ?? speculation.plausibility ?? 0.4;
        return {
            score: this._clamp(base * 0.7 + anchoring * 0.3 + this.webppl.gaussian(0, 0.05)),
            violations: speculation.violations || []
        };
    }

    /**
     * Experience storage with simulator voting
     * Decides what gets stored as colored vs white agate
     * يُرجع سجلًا عاديًا (كائن) لا غلاف توزيع
     */
    async store_experience(experience, context = {}) {
        // Gather votes from simulators on storage significance
        const voting_results = this.conduct_simulator_vote(experience, context);

        // Determine storage type based on consensus
        const storage_decision = this.determine_storage_type(voting_results);

        // Apply emotional encryption if storing
        const encrypted_experience = this.apply_emotional_encryption(
            experience,
            context.emotional_state || {}
        );

        // تحديث معدل الإجماع (متوسط متحرك أسي)
        this.metrics.voting_consensus_rate = this._clamp(
            this.metrics.voting_consensus_rate * 0.9 + (voting_results.consensus_reached ? 0.1 : 0));

        // Store in appropriate timeline location
        if (storage_decision.type === "colored_agate") {
            return this.store_as_colored_agate(encrypted_experience, voting_results);
        } else if (storage_decision.type === "white_agate") {
            return this.store_as_white_agate(encrypted_experience, voting_results);
        } else {
            return this.discard_experience(experience, voting_results);
        }
    }

    // قرار التخزين: إجماع قوي => عقيق ملوّن، دلالة جزئية => عقيق أبيض، وإلا يُهمل
    determine_storage_type(voting_results) {
        const consensus = voting_results.weighted_consensus;
        let decision;
        if (voting_results.consensus_reached) {
            decision = { type: 'colored_agate', reason: 'consensus_reached' };
        } else if (consensus >= 0.35) {
            decision = { type: 'white_agate', reason: 'partial_significance' };
        } else {
            decision = { type: 'discard', reason: 'below_significance_threshold' };
        }
        decision.consensus = consensus;
        decision.confidence = voting_results.voting_confidence;
        this.voting_system.storage_decisions.set(
            `decision_${Date.now()}_${this.voting_system.storage_decisions.size}`, decision);
        return decision;
    }

    store_as_colored_agate(encrypted_experience, voting_results) {
        const id = `colored_${Date.now()}_${this.timeline.colored_agate.size + 1}`;
        const record = {
            id,
            storage_type: 'colored_agate',
            stored: true,
            content: encrypted_experience,
            consensus: voting_results.weighted_consensus,
            voting_confidence: voting_results.voting_confidence,
            detail_level: this._clamp(this.brain_capacity / 1000, 0.05, 1),
            stored_at: Date.now()
        };
        this.timeline.colored_agate.set(id, record);
        this.timeline.voting_history.set(id, voting_results);
        this.timeline.compression_ratios.set(id, this._clamp(1 - record.detail_level * 0.5, 0.2, 0.95));
        return record;
    }

    store_as_white_agate(encrypted_experience, voting_results) {
        const id = `white_${Date.now()}_${this.timeline.white_agate.size + 1}`;
        const record = {
            id,
            storage_type: 'white_agate',
            stored: true,
            content: encrypted_experience,
            constraint_snapshot: { ...this.white_agate_constraints },
            consensus: voting_results.weighted_consensus,
            voting_confidence: voting_results.voting_confidence,
            detail_level: this._clamp(this.brain_capacity / 1000, 0.05, 1),
            stored_at: Date.now()
        };
        this.timeline.white_agate.set(id, record);
        this.timeline.voting_history.set(id, voting_results);
        return record;
    }

    // ما لا يبلغ عتبة الدلالة لا يُخزَّن - يبقى منه أثر جوهري فقط
    discard_experience(experience, voting_results) {
        return {
            storage_type: 'discarded',
            stored: false,
            reason: 'consensus_below_significance_threshold',
            consensus: voting_results.weighted_consensus,
            voting_confidence: voting_results.voting_confidence,
            gist_retained: this.extract_core_pattern(experience).keywords.slice(0, 2)
        };
    }

    /**
     * Simulator voting for experience significance
     * كل صوت يُختزل إلى رقم قياسي (متوسط توزيعه) قبل الترجيح
     */
    conduct_simulator_vote(experience, context) {
        const scalar_vote = (program) => {
            const dist = this.webppl.infer(program, { samples: 120 });
            return (dist && Number.isFinite(dist.mean)) ? this._clamp(dist.mean) : 0.5;
        };
        const safe_beta = (a, b) => this.webppl.beta(Math.max(0.2, a), Math.max(0.2, b));
        const votes = {};

        // Reality processor vote - how significant is this experience?
        const novelty_score = this.assess_novelty(experience);
        const importance_score = this.assess_importance(experience, context);
        votes.reality_processor = scalar_vote(() =>
            safe_beta((novelty_score + importance_score) * 5, (2 - novelty_score - importance_score) * 5));

        // Memory reconstructor vote - how memorable is this?
        const emotional_intensity = this.assess_emotional_intensity(experience);
        const pattern_match = this.assess_pattern_match(experience);
        votes.memory_reconstructor = scalar_vote(() =>
            safe_beta((emotional_intensity + pattern_match) * 5, (2 - emotional_intensity - pattern_match) * 5));

        // Prediction engine vote - how useful for future predictions?
        const predictive_value = this.assess_predictive_value(experience);
        const pattern_establishment = this.assess_pattern_establishment(experience);
        votes.prediction_engine = scalar_vote(() =>
            safe_beta((predictive_value + pattern_establishment) * 5, (2 - predictive_value - pattern_establishment) * 5));

        // Pattern explorer vote - how creative/interesting is this?
        const creativity_score = this.assess_creativity(experience);
        const uniqueness_score = this.assess_uniqueness(experience);
        votes.pattern_explorer = scalar_vote(() =>
            safe_beta((creativity_score + uniqueness_score) * 5, (2 - creativity_score - uniqueness_score) * 5));

        // Calculate weighted consensus
        const weighted_consensus = this.calculate_weighted_consensus(votes);

        return {
            individual_votes: votes,
            weighted_consensus: weighted_consensus,
            consensus_reached: weighted_consensus > this.voting_system.consensus_threshold,
            voting_confidence: this.calculate_voting_confidence(votes)
        };
    }

    /**
     * Emotional encryption and decryption
     */
    apply_emotional_encryption(experience, emotional_state) {
        const encryption_strength = this.calculate_encryption_strength(emotional_state);

        if (encryption_strength < 0.3) {
            return { content: experience, encryption: "minimal" };
        }

        // Strong emotions create strong encryption
        const encrypted_content = {
            surface_content: this.create_surface_representation(experience),
            deep_content: this.encrypt_deep_content(experience, emotional_state),
            encryption_key: this.generate_emotional_key(emotional_state),
            decay_pattern: this.calculate_decay_pattern(emotional_state)
        };

        return {
            content: encrypted_content,
            encryption: "strong",
            emotional_signature: emotional_state,
            decryption_triggers: this.identify_decryption_triggers(emotional_state)
        };
    }

    // التمثيل السطحي: الجوهر المتاح دون مفتاح عاطفي
    create_surface_representation(experience) {
        const pattern = this.extract_core_pattern(experience);
        return {
            gist: pattern.keywords.slice(0, 3).join(' / ') || 'faded general impression',
            keywords: pattern.keywords,
            layer: 'surface',
            certainty: 0.5
        };
    }

    // المحتوى العميق مقفول بمفتاح عاطفي - يتطلب رنينًا وجدانيًا مشابهًا
    encrypt_deep_content(experience, emotional_state) {
        return {
            payload: experience,
            locked_with: this.generate_emotional_key(emotional_state),
            emotional_charge: this.calculate_encryption_strength(emotional_state),
            access_rule: 'requires_emotional_resonance'
        };
    }

    // المفتاح العاطفي = متجه مُطَبَّع (L2) على المحاور الوجدانية
    generate_emotional_key(emotional_state = {}) {
        const axes = Object.keys(emotional_state).filter(k => typeof emotional_state[k] === 'number');
        const raw = axes.map(a => this._clamp(emotional_state[a]));
        const magnitude = Math.sqrt(raw.reduce((s, v) => s + v * v, 0));
        return {
            axes,
            vector: magnitude > 0 ? raw.map(v => v / magnitude) : raw,
            magnitude: this._clamp(magnitude / Math.sqrt(Math.max(1, axes.length))),
            generated_at: Date.now()
        };
    }

    // منحنى نسيان إبنغهاوس: الشحنة العاطفية تُبطئ التلاشي (توطيد أقوى)
    calculate_decay_pattern(emotional_state = {}) {
        const charge = this.calculate_encryption_strength(emotional_state);
        const decay_rate = Math.max(0.02, 0.15 * (1 - charge * 0.7));
        return {
            model: 'ebbinghaus_exponential',
            initial_strength: this._clamp(0.5 + charge * 0.5),
            decay_rate,
            consolidation: this._clamp(0.3 + charge * 0.5),
            half_life_days: Math.log(2) / decay_rate
        };
    }

    // المشاعر القوية وقت الترميز تصبح محفّزات فك التشفير لاحقًا
    identify_decryption_triggers(emotional_state = {}) {
        return Object.entries(emotional_state)
            .filter(([, v]) => typeof v === 'number' && v >= 0.5)
            .sort((a, b) => b[1] - a[1])
            .map(([emotion, intensity]) => ({
                trigger: emotion,
                intensity,
                activation_threshold: this._clamp(0.9 - intensity * 0.4, 0.2, 0.9)
            }));
    }

    /**
     * Apply emotional decryption during recall
     */
    apply_emotional_decryption(encrypted_content, current_emotional_filter, original_emotional_context) {
        // Calculate emotional key match
        const key_similarity = this._clamp(this.calculate_emotional_key_similarity(
            (current_emotional_filter && current_emotional_filter.emotional_state) || {},
            original_emotional_context || {}
        ));

        // محتوى غير مشفّر (أو تشفير ضعيف): وصول مفتوح مع تسجيل الرنين العاطفي
        if (!encrypted_content || !encrypted_content.encryption || encrypted_content.encryption === "minimal") {
            const plain = (encrypted_content && encrypted_content.encryption === "minimal")
                ? encrypted_content.content
                : encrypted_content;
            return {
                ...(plain && typeof plain === 'object' ? plain : { content: plain }),
                decryption_level: "open",
                emotional_resonance: key_similarity
            };
        }

        const inner = encrypted_content.content || {};

        // Partial decryption based on emotional similarity
        if (key_similarity > 0.7) {
            return {
                ...inner.deep_content,
                decryption_level: "full",
                emotional_resonance: key_similarity
            };
        } else if (key_similarity > 0.4) {
            return {
                ...inner.surface_content,
                partial_deep_access: this.partial_decrypt(inner.deep_content, key_similarity),
                decryption_level: "partial",
                emotional_resonance: key_similarity
            };
        } else {
            return {
                ...inner.surface_content,
                decryption_level: "surface_only",
                emotional_resonance: key_similarity,
                access_blocked: "emotional_key_mismatch"
            };
        }
    }

    // تشابه المفتاح العاطفي = تشابه جيب التمام بين حالتين وجدانيتين
    calculate_emotional_key_similarity(state_a = {}, state_b = {}) {
        const a = state_a && typeof state_a === 'object' ? state_a : {};
        const b = state_b && typeof state_b === 'object' ? state_b : {};
        const keys = new Set([
            ...Object.keys(a).filter(k => typeof a[k] === 'number'),
            ...Object.keys(b).filter(k => typeof b[k] === 'number')
        ]);
        if (!keys.size) return 0.3; // لا معلومات => رنين محايد ضعيف
        let dot = 0, mag_a = 0, mag_b = 0;
        for (const k of keys) {
            const va = typeof a[k] === 'number' ? a[k] : 0;
            const vb = typeof b[k] === 'number' ? b[k] : 0;
            dot += va * vb; mag_a += va * va; mag_b += vb * vb;
        }
        if (mag_a === 0 || mag_b === 0) return 0.3;
        return this._clamp(dot / (Math.sqrt(mag_a) * Math.sqrt(mag_b)));
    }

    // فك تشفير جزئي: نسبة من الحقول العميقة توازي قوة الرنين
    partial_decrypt(deep_content, key_similarity) {
        const payload = (deep_content && deep_content.payload && typeof deep_content.payload === 'object')
            ? deep_content.payload : {};
        const keys = Object.keys(payload);
        const accessible = Math.floor(keys.length * this._clamp(key_similarity));
        const fragments = {};
        keys.slice(0, accessible).forEach(k => { fragments[k] = payload[k]; });
        return {
            fragments,
            access_ratio: keys.length ? accessible / keys.length : this._clamp(key_similarity),
            still_locked: keys.slice(accessible)
        };
    }

    /**
     * Calculate emotional filter based on current mood
     * المعادلة القانونية للتشويه (من عرض العقيق):
     * distortion = despair*0.4 + min(recall_count*0.1, 0.5) + age*0.05 + (1-clarity)*0.3  (سقف 0.9)
     */
    calculate_emotional_filter(current_mood = {}, memory_meta = {}) {
        const despair_weight = current_mood.despair || 0;
        const clarity_weight = current_mood.clarity ?? 0.5;
        const anxiety_weight = current_mood.anxiety || 0;
        const joy_weight = current_mood.joy || 0;
        const recall_count = memory_meta.recall_count || 0;
        const age_days = memory_meta.age_days || 0;

        const distortion_level = this._clamp(
            despair_weight * 0.4 +
            Math.min(recall_count * 0.1, 0.5) +
            age_days * 0.05 +
            (1 - clarity_weight) * 0.3 +
            this.webppl.gaussian(0, 0.02),
            0, 0.9);

        // Valence bias affects memory interpretation
        const valence_bias = this._clamp(
            ((joy_weight + clarity_weight) - (despair_weight + anxiety_weight)) * 0.5 +
            this.webppl.gaussian(0, 0.15),
            -1, 1);

        // Intensity affects how strongly emotions color memories
        const intensity_multiplier = 1 + Math.max(despair_weight, anxiety_weight, joy_weight) * 0.5;

        return {
            distortion_level: distortion_level,
            valence_bias: valence_bias,
            intensity_multiplier: intensity_multiplier,
            emotional_state: current_mood,
            encryption_strength: this._clamp(Math.max(despair_weight, anxiety_weight) * 0.8),
            projection_strength: this._clamp((despair_weight + anxiety_weight) * 0.6)
        };
    }

    /**
     * Calculate contextual bias for reconstruction
     */
    calculate_contextual_bias(context = {}) {
        const similarity_score = context.similarity ?? 0.5;
        const relevance_score = context.relevance ?? 0.5;
        const urgency_score = context.urgency ?? 0.3;

        const bias_strength = this._clamp(
            (similarity_score + relevance_score + urgency_score) / 3 +
            this.webppl.gaussian(0, 0.1));

        return {
            similarity_influence: similarity_score,
            relevance_weight: relevance_score,
            urgency_pressure: urgency_score,
            overall_bias: bias_strength,
            context_strength: Math.max(similarity_score, relevance_score)
        };
    }

    /**
     * Identify memory segments relevant to cues
     * ذاكرة مسماة => مقاطع ملوّنة من محتواها الفعلي + فجوة بيضاء واحدة على الأقل
     */
    identify_memory_segments(memory_cues, named_memory = null) {
        const segments = [];

        if (named_memory) {
            const entries = Object.entries(named_memory.base_content || {});
            const detail_count = Math.min(Math.max(entries.length, 1), 2 + Math.floor(this.webppl.uniform(0, 2)));
            const shuffled = [...entries].sort(() => this.webppl.uniform(-1, 1));
            shuffled.slice(0, detail_count).forEach(([aspect, value], i) => {
                segments.push({
                    id: `colored_${named_memory.memory_id}_${aspect}`,
                    type: "colored_agate",
                    timestamp: named_memory.created_at - i,
                    measured_content: { aspect, content: value, certainty: named_memory.detail_level || 0.8 },
                    original_emotional_context: named_memory.raw_emotional_context,
                    original_context: { source: "named_memory", memory_id: named_memory.memory_id }
                });
            });
            // ما لم يُقَس يبقى فجوة بيضاء تُملأ بتخمين مقيّد
            segments.push({
                id: `white_${named_memory.memory_id}_gap`,
                type: "white_agate",
                constraint_boundaries: this.simulate_constraint_boundaries(memory_cues),
                neighboring_colored_agate: segments.map(s => s.id)
            });
            return segments;
        }

        // Colored agate segments (measured experiences)
        segments.push({
            id: `colored_${Date.now()}_1`,
            type: "colored_agate",
            timestamp: Date.now() - 86400000, // Yesterday
            measured_content: this.simulate_measured_content(memory_cues),
            original_emotional_context: { joy: 0.6, excitement: 0.5, intensity: 0.6, valence: 0.3 },
            original_context: { location: "home", social: "family" }
        });

        // White agate segments (unmeasured gaps)
        segments.push({
            id: `white_${Date.now()}_1`,
            type: "white_agate",
            constraint_boundaries: this.simulate_constraint_boundaries(memory_cues),
            neighboring_colored_agate: ["colored_segment_before", "colored_segment_after"]
        });

        return segments;
    }

    /**
     * Combine memory segments into coherent narrative
     */
    combine_memory_segments(segments, emotional_filter) {
        // Sort segments by timestamp/logical order
        const ordered_segments = this.order_segments_logically(segments);

        // Create narrative coherence
        const narrative_structure = this.create_narrative_structure(ordered_segments);

        // Apply emotional coherence across the narrative
        const emotionally_coherent = this.apply_emotional_coherence(
            narrative_structure,
            emotional_filter
        );

        // Fill gaps with plausible transitions
        const gap_filled = this.fill_narrative_gaps(emotionally_coherent);

        return {
            narrative: gap_filled,
            segment_count: segments.length,
            coherence_level: this.assess_narrative_coherence(gap_filled),
            emotional_consistency: this.assess_emotional_consistency(gap_filled),
            temporal_order: ordered_segments.map(s => s.id)
        };
    }

    // نبرة عاطفية واحدة مهيمنة تُفرَض على كل المقاطع (تماسك وجداني)
    apply_emotional_coherence(narrative_structure, emotional_filter) {
        const vb = emotional_filter.valence_bias || 0;
        const dominant_tone = vb > 0.15 ? 'warm' : vb < -0.15 ? 'somber' : 'neutral';
        const tone_strength = this._clamp(Math.abs(vb) * (emotional_filter.intensity_multiplier || 1));
        const segments = (narrative_structure.segments || []).map(segment => ({
            ...segment,
            emotional_tone: dominant_tone,
            tone_intensity: this._clamp(tone_strength + this.webppl.gaussian(0, 0.05))
        }));
        return { ...narrative_structure, segments, dominant_tone, tone_strength };
    }

    // الفجوات بين المقاطع تُملأ بجسور سردية معقولة
    fill_narrative_gaps(narrative) {
        const bridges = [
            'and then, almost without transition,',
            'somewhere in between,',
            'after a blurred stretch,'
        ];
        const transitions = (narrative.transitions || []).map(t => ({
            ...t,
            filler: this.webppl.categorical(bridges),
            plausibility: this.webppl.beta(6, 3)
        }));
        return { ...narrative, transitions, gaps_filled: transitions.length };
    }

    // تماسك السرد: نسبة الجسور المكتملة + قوة النبرة
    assess_narrative_coherence(narrative) {
        const segment_count = (narrative.segments || []).length;
        const transition_ratio = segment_count > 1
            ? (narrative.transitions || []).length / (segment_count - 1)
            : 1;
        return this._clamp(0.45 + transition_ratio * 0.3 + (narrative.tone_strength || 0) * 0.15 +
            this.webppl.gaussian(0, 0.04));
    }

    // الاتساق العاطفي: قلة تباين شدة النبرة عبر المقاطع
    assess_emotional_consistency(narrative) {
        const intensities = (narrative.segments || [])
            .map(s => s.tone_intensity)
            .filter(v => Number.isFinite(v));
        if (intensities.length < 2) return this._clamp(0.7 + this.webppl.gaussian(0, 0.05));
        return this._clamp(1 - this.calculate_variance(intensities) * 3);
    }

    /**
     * Validation methods
     */
    validate_reconstruction(memory, original_cues) {
        const coherence_score = this.assess_logical_coherence(memory);
        const plausibility_score = this.assess_plausibility(memory);
        const emotional_fit = this.assess_emotional_fit(memory, original_cues);

        const overall_confidence = (coherence_score + plausibility_score + emotional_fit) / 3;

        return {
            confidence: overall_confidence,
            coherence: coherence_score,
            plausibility: plausibility_score,
            emotional_fit: emotional_fit,
            validation_passed: overall_confidence > 0.5
        };
    }

    validate_against_constraints(reconstruction, timestamp) {
        // Apply white agate logical constraints
        const violations = [];

        // Temporal feasibility check
        if (!this.check_temporal_feasibility(reconstruction, timestamp)) {
            violations.push("temporal_violation");
        }

        // Causal consistency check
        if (!this.check_causal_consistency(reconstruction)) {
            violations.push("causal_violation");
        }

        // Physical plausibility check
        if (!this.check_physical_plausibility(reconstruction)) {
            violations.push("physical_violation");
        }

        // Return corrected reconstruction if violations found
        if (violations.length > 0) {
            return this.correct_constraint_violations(reconstruction, violations);
        }

        return reconstruction;
    }

    /**
     * Utility and calculation methods
     */
    calculate_variation_score(memory) {
        // How much this reconstruction varies from a "standard" recall
        return this.webppl.beta(3, 7); // Usually low variation, sometimes high
    }

    calculate_emotional_delta(original, current) {
        if (!original || !current.emotional_state) return 0;

        const original_valence = original.valence || 0;
        const current_valence = (current.emotional_state.joy || 0) - (current.emotional_state.despair || 0);

        return Math.abs(original_valence - current_valence);
    }

    calculate_contextual_shift(original, current) {
        if (!original || !current) return 0;

        const similarity = current.similarity_influence || 0.5;
        return 1 - similarity; // Higher shift when similarity is lower
    }

    calculate_weighted_consensus(votes) {
        let weighted_sum = 0;
        let weight_sum = 0;

        for (const [voter, vote] of Object.entries(votes)) {
            const weight = this.voting_system.voting_weights[voter] || 0.25;
            const value = Number.isFinite(vote) ? vote : 0.5; // الصوت رقم قياسي دائمًا
            weighted_sum += value * weight;
            weight_sum += weight;
        }

        return weight_sum > 0 ? weighted_sum / weight_sum : 0.5;
    }

    calculate_voting_confidence(votes) {
        const vote_values = Object.values(votes).filter(v => Number.isFinite(v));
        if (!vote_values.length) return 0.5;
        const variance = this.calculate_variance(vote_values);
        return Math.max(0.1, Math.min(1, 1 - variance)); // Lower variance = higher confidence
    }

    calculate_variance(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squared_diffs = values.map(value => Math.pow(value - mean, 2));
        return squared_diffs.reduce((a, b) => a + b, 0) / values.length;
    }

    /**
     * 🆕 وصول مُفلتر حسب المنظور - تستدعيه unified-cognitive-space.js
     * يُرجع مُغلَقين: خبرات معاد وزنها حسب قواعد المنظور + استدعاء منحاز بمزاج المنظور
     */
    create_filtered_access(perspective_config = {}) {
        const rules = perspective_config.memory_access || perspective_config.memory_access_rules || {};
        const prioritize = rules.prioritize || [];
        const de_emphasize = rules.de_emphasize || [];
        const amplify = rules.amplify || [];
        const affinity = (experience, tags) => tags.length
            ? Math.max(...tags.map(tag => this.token_overlap(experience.skill_id, tag)))
            : 0;

        return {
            // الخبرات ذات الصلة بعد إعادة الوزن وفق أولويات المنظور
            get_relevant: (context = {}, threshold = 0.3) => {
                return this.getRelevantExperiences(context, 0)
                    .map(exp => {
                        const perspective_weight = 1 +
                            affinity(exp, prioritize) * 0.5 +
                            affinity(exp, amplify) * 0.7 -
                            affinity(exp, de_emphasize) * 0.6;
                        return {
                            ...exp,
                            perspective_weight,
                            relevance_score: this._clamp(exp.relevance_score * Math.max(0.1, perspective_weight))
                        };
                    })
                    .filter(exp => exp.relevance_score > threshold)
                    .sort((a, b) => b.relevance_score - a.relevance_score);
            },
            // استدعاء تُمزَج فيه عاطفة المنظور مع المزاج الحالي
            recall_biased: (cues, mood = {}) => {
                const perspective_mood = this.interpret_emotional_filter(perspective_config.emotional_filter);
                const mixed_mood = { ...mood };
                for (const [emotion, value] of Object.entries(perspective_mood)) {
                    mixed_mood[emotion] = this._clamp((mood[emotion] || 0) * 0.6 + value * 0.4);
                }
                return this.recall(cues, mixed_mood, { perspective_filter: perspective_config.emotional_filter || null });
            }
        };
    }

    // ترجمة اسم الفلتر العاطفي للمنظور إلى مكوّنات مزاجية
    interpret_emotional_filter(filter) {
        if (!filter) return {};
        if (typeof filter === 'object') return filter;
        const name = String(filter).toLowerCase();
        const mood = {};
        if (/anx|vigilant|fear|caut/.test(name)) { mood.anxiety = 0.7; mood.clarity = 0.35; }
        if (/protect|caring|warm/.test(name)) { mood.connection = 0.7; mood.joy = 0.5; }
        if (/optimis|ambiti|hope/.test(name)) { mood.joy = 0.65; mood.clarity = 0.6; }
        if (/depress|despair|grief/.test(name)) { mood.despair = 0.7; mood.joy = 0.15; }
        return mood;
    }

    /**
     * Placeholder methods for simulation
     * In a real implementation, these would have sophisticated logic
     */
    simulate_measured_content(cues) {
        return { content: `Measured memory related to ${JSON.stringify(cues)}`, certainty: 0.8 };
    }

    simulate_constraint_boundaries(cues) {
        return {
            temporal_bounds: ["after_breakfast", "before_lunch"],
            spatial_bounds: ["kitchen", "living_room"],
            social_bounds: ["family_present"],
            emotional_bounds: ["positive_to_neutral"]
        };
    }

    order_segments_logically(segments) {
        return segments.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    }

    create_narrative_structure(segments) {
        return {
            segments: segments,
            beginning: segments[0],
            middle: segments.slice(1, -1),
            end: segments[segments.length - 1],
            transitions: this.generate_transitions(segments)
        };
    }

    generate_transitions(segments) {
        const transitions = [];
        for (let i = 0; i < segments.length - 1; i++) {
            transitions.push({
                from: segments[i].id,
                to: segments[i + 1].id,
                type: "temporal_progression"
            });
        }
        return transitions;
    }

    // Additional placeholder methods...
    assess_novelty(experience) { return 0.6; }
    assess_importance(experience, context) {
        const flagged = context && (context.importance ?? context.urgency);
        return typeof flagged === 'number' ? this._clamp(flagged) : 0.7;
    }
    assess_emotional_intensity(experience) {
        const emo = (experience && (experience.emotional_context || experience.emotional_state)) || {};
        const values = Object.values(emo).filter(v => typeof v === 'number');
        return values.length ? this._clamp(Math.max(...values)) : 0.5;
    }
    assess_pattern_match(experience) { return 0.6; }
    assess_predictive_value(experience) { return 0.5; }
    assess_pattern_establishment(experience) { return 0.4; }
    assess_creativity(experience) { return 0.6; }
    assess_uniqueness(experience) { return 0.5; }

    calculate_encryption_strength(emotional_state) {
        const intensity = Math.max(
            emotional_state.despair || 0,
            emotional_state.anxiety || 0,
            emotional_state.joy || 0
        );
        return intensity;
    }

    assess_logical_coherence(memory) {
        return (memory && typeof memory.coherence_level === 'number') ? memory.coherence_level : 0.75;
    }
    assess_plausibility(memory) {
        return this._clamp(0.8 + this.webppl.gaussian(0, 0.04));
    }
    assess_emotional_fit(memory, cues) {
        // متوسط الرنين العاطفي عبر المقاطع إن وُجد
        const segments = (memory && memory.narrative && memory.narrative.segments) || [];
        const resonances = segments
            .map(s => s.content && s.content.emotional_resonance)
            .filter(v => Number.isFinite(v));
        const base = resonances.length
            ? resonances.reduce((a, b) => a + b, 0) / resonances.length
            : 0.6;
        const consistency = (memory && typeof memory.emotional_consistency === 'number')
            ? memory.emotional_consistency : 0.6;
        return this._clamp(base * 0.7 + consistency * 0.3 + this.webppl.gaussian(0, 0.04));
    }

    check_temporal_feasibility(reconstruction, timestamp) { return true; }
    check_causal_consistency(reconstruction) { return true; }
    check_physical_plausibility(reconstruction) { return true; }

    correct_constraint_violations(reconstruction, violations) {
        return { ...reconstruction, violations_corrected: violations };
    }
}

module.exports = AgateMemory;
