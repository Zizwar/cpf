/**
 * Emotional Cryptography - التشفير العاطفي الرقمي
 * 
 * يحول التجارب العاطفية إلى توقيعات رقمية مشفرة و"معرفات احتمالية"
 * كل شعور له بصمة رقمية فريدة يمكن من خلالها استدعاء تجارب مشابهة
 * 
 * @module EmotionalCryptography
 * @version 4.0-vectorial
 */

const ProbabilityCore = require('../probability-core');

class EmotionalCryptography {
    constructor() {
        this.webppl = new ProbabilityCore();
        
        // === إعدادات التشفير ===
        this.crypto_settings = {
            base_precision: 8,                      // دقة التشفير الأساسية
            max_precision: 15,                      // أقصى دقة
            similarity_threshold: 0.005,            // عتبة التشابه العاطفي (المشاعر شبه المتطابقة ترن معاً)
            crypto_base: 0.5,                      // النقطة المحايدة
            mathematical_constants: {
                golden_ratio: 1.618033988749895,
                fibonacci_base: 0.112358132134,     // تسلسل فيبوناتشي كعشريات
                pi_fragments: 0.141592653589,       // أجزاء من π
                euler_fragments: 0.271828182845     // أجزاء من e
            }
        };

        // === معجم الأثر العاطفي (نموذج VAD: التكافؤ / الإثارة / الهيمنة) ===
        // كل شعور معروف له بصمة VAD — والمشاعر المجهولة تعامل بشكل محايد (تكافؤ 0، إثارة 0.5)
        this.affect_lexicon = {
            joy:           { valence:  0.9,  arousal: 0.7,  dominance: 0.6  },
            satisfaction:  { valence:  0.8,  arousal: 0.4,  dominance: 0.6  },
            love:          { valence:  0.9,  arousal: 0.6,  dominance: 0.55 },
            gratitude:     { valence:  0.8,  arousal: 0.4,  dominance: 0.55 },
            hope:          { valence:  0.6,  arousal: 0.5,  dominance: 0.55 },
            excitement:    { valence:  0.6,  arousal: 0.9,  dominance: 0.6  },
            calmness:      { valence:  0.5,  arousal: 0.1,  dominance: 0.6  },
            relaxation:    { valence:  0.6,  arousal: 0.15, dominance: 0.55 },
            curiosity:     { valence:  0.5,  arousal: 0.6,  dominance: 0.55 },
            insight:       { valence:  0.6,  arousal: 0.55, dominance: 0.6  },
            understanding: { valence:  0.5,  arousal: 0.4,  dominance: 0.6  },
            pride:         { valence:  0.7,  arousal: 0.6,  dominance: 0.75 },
            confidence:    { valence:  0.6,  arousal: 0.5,  dominance: 0.8  },
            control:       { valence:  0.3,  arousal: 0.4,  dominance: 0.85 },
            energy:        { valence:  0.4,  arousal: 0.8,  dominance: 0.6  },
            empathy:       { valence:  0.4,  arousal: 0.45, dominance: 0.5  },
            surprise:      { valence:  0.1,  arousal: 0.9,  dominance: 0.45 },
            nostalgia:     { valence:  0.2,  arousal: 0.35, dominance: 0.45 },
            sadness:       { valence: -0.8,  arousal: 0.3,  dominance: 0.3  },
            grief:         { valence: -0.85, arousal: 0.45, dominance: 0.25 },
            anger:         { valence: -0.7,  arousal: 0.85, dominance: 0.6  },
            fear:          { valence: -0.8,  arousal: 0.8,  dominance: 0.25 },
            despair:       { valence: -0.9,  arousal: 0.4,  dominance: 0.15 },
            anxiety:       { valence: -0.6,  arousal: 0.85, dominance: 0.3  },
            craving:       { valence: -0.3,  arousal: 0.75, dominance: 0.35 },
            guilt:         { valence: -0.6,  arousal: 0.5,  dominance: 0.3  },
            shame:         { valence: -0.7,  arousal: 0.5,  dominance: 0.2  },
            helplessness:  { valence: -0.7,  arousal: 0.4,  dominance: 0.1  },
            boredom:       { valence: -0.3,  arousal: 0.15, dominance: 0.4  },
            confusion:     { valence: -0.3,  arousal: 0.55, dominance: 0.35 },
            tension:       { valence: -0.4,  arousal: 0.7,  dominance: 0.4  },
            fatigue:       { valence: -0.3,  arousal: 0.2,  dominance: 0.3  },
            embarrassment: { valence: -0.5,  arousal: 0.6,  dominance: 0.25 },
            startle:       { valence: -0.2,  arousal: 0.9,  dominance: 0.3  },
            loneliness:    { valence: -0.7,  arousal: 0.35, dominance: 0.25 },
            frustration:   { valence: -0.6,  arousal: 0.75, dominance: 0.45 },
            jealousy:      { valence: -0.6,  arousal: 0.7,  dominance: 0.4  },
            disgust:       { valence: -0.7,  arousal: 0.6,  dominance: 0.5  }
        };
        this.neutral_affect = { valence: 0, arousal: 0.5, dominance: 0.5 };

        // مفاتيح رقمية ليست مشاعر (لا تدخل في حسابات VAD)
        this.non_emotion_keys = new Set([
            'duration', 'context_novelty', 'personal_meaning', 'suppressed', 'amplified'
        ]);

        // === معرفات احتمالية (Probably IDs) ===
        this.probably_ids = new Map();              // المعرفات العاطفية
        this.crypto_signatures = new Map();         // التوقيعات المشفرة
        this.emotional_clusters = new Map();        // مجموعات المشاعر المتشابهة
        this.resonance_networks = new Map();        // شبكات الرنين العاطفي
        
        // === أنماط التشفير المتقدمة ===
        this.encryption_patterns = {
            valence: {
                positive: { multiplier: 0.123456789, offset: 0.1 },
                negative: { multiplier: 0.098765432, offset: -0.1 },
                neutral: { multiplier: 0.111111111, offset: 0.0 }
            },
            arousal: {
                high: { multiplier: 0.161803398, offset: 0.2 },     // النسبة الذهبية
                medium: { multiplier: 0.141592653, offset: 0.0 },   // π
                low: { multiplier: 0.271828182, offset: -0.1 }      // e
            },
            complexity: {
                simple: { pattern: 'linear', depth: 1 },
                moderate: { pattern: 'fibonacci', depth: 3 },
                complex: { pattern: 'golden_spiral', depth: 5 },
                transcendent: { pattern: 'harmonic_series', depth: 8 }
            }
        };
        
        // === ذاكرة التجارب العاطفية ===
        this.emotional_memory = {
            recent_encryptions: [],                 // التشفيرات الحديثة
            pattern_evolution: new Map(),           // تطور الأنماط
            signature_history: new Map(),           // تاريخ التوقيعات
            resonance_discoveries: []               // اكتشافات الرنين
        };
        
        // === خرائط الترابط ===
        this.association_maps = {
            semantic: new Map(),                    // الترابط الدلالي
            temporal: new Map(),                    // الترابط الزمني
            causal: new Map(),                      // الترابط السببي
            harmonic: new Map()                     // الترابط التناغمي
        };
        
        // === إحصائيات ===
        this.metrics = {
            total_encryptions: 0,
            unique_probably_ids: 0,
            resonance_discoveries: 0,
            pattern_evolutions: 0,
            cross_references: 0,
            average_encryption_complexity: 0.0
        };
        
        // حالة آخر تشفير: هل رنّ مع توقيع موجود؟
        this.last_encryption_resonated = false;

        // تهيئة النظام
        this.initialize_encryption_system();
    }

    /**
     * تشفير تجربة عاطفية إلى توقيع رقمي
     */
    encrypt_emotion(emotional_experience, context = {}) {
        // حماية المدخلات: أي كائن مسطح من حقول عاطفية رقمية مقبول — ولا نرمي استثناء أبداً
        if (!emotional_experience || typeof emotional_experience !== 'object') {
            emotional_experience = {};
        }
        context = (context && typeof context === 'object') ? context : {};

        this.metrics.total_encryptions++;
        
        console.log("🔐 Encrypting emotional experience...");
        
        // 1. تحليل المكونات العاطفية
        const emotional_components = this.analyze_emotional_components(emotional_experience);
        
        // 2. حساب الطيف العاطفي
        const emotional_spectrum = this.calculate_emotional_spectrum(emotional_components);
        
        // 3. تطبيق التشفير الرياضي
        const crypto_score = this.apply_mathematical_encryption(emotional_spectrum, context);
        
        // 4. تحسين التوقيع بناءً على التعقيد
        const enhanced_signature = this.enhance_signature_complexity(crypto_score, emotional_components);
        
        // 5. البحث عن معرف احتمالي أو إنشاء واحد جديد
        const probably_id = this.find_or_create_probably_id(enhanced_signature, emotional_components);
        
        // 6. تسجيل العلاقات والروابط
        this.register_emotional_associations(probably_id, enhanced_signature, context);
        
        const encryption_result = {
            crypto_score: enhanced_signature.final_score,
            probably_id: probably_id,
            signature: enhanced_signature,
            components: emotional_components,
            resonated_with_existing: this.last_encryption_resonated,
            emotional_signature: enhanced_signature,        // اسم قديم محفوظ للتوافق
            encryption_metadata: {
                precision_used: this.crypto_settings.base_precision,
                pattern_type: enhanced_signature.pattern_type,
                complexity_level: enhanced_signature.complexity_level,
                mathematical_elements: enhanced_signature.mathematical_elements,
                timestamp: Date.now()
            }
        };
        
        // حفظ في الذاكرة
        this.store_encryption_result(encryption_result, emotional_experience, context);
        
        console.log(`✨ Emotional encryption completed`);
        console.log(`   Crypto score: ${enhanced_signature.final_score}`);
        console.log(`   Probably ID: ${probably_id}`);
        console.log(`   Pattern: ${enhanced_signature.pattern_type}`);
        
        return encryption_result;
    }

    /**
     * تحليل المكونات العاطفية الأساسية
     */
    analyze_emotional_components(emotional_experience) {
        const components = {
            // الأبعاد الأساسية
            valence: this.calculate_valence(emotional_experience),
            arousal: this.calculate_arousal(emotional_experience),
            dominance: this.calculate_dominance(emotional_experience),
            
            // أبعاد متقدمة
            complexity: this.calculate_emotional_complexity(emotional_experience),
            authenticity: this.calculate_authenticity(emotional_experience),
            intensity: this.calculate_intensity(emotional_experience),
            duration: this.estimate_duration(emotional_experience),
            
            // عوامل خاصة
            social_component: this.extract_social_component(emotional_experience),
            cognitive_component: this.extract_cognitive_component(emotional_experience),
            physical_component: this.extract_physical_component(emotional_experience),
            
            // بصمة فريدة
            uniqueness_factor: this.calculate_uniqueness_factor(emotional_experience)
        };
        
        console.log(`🧬 Emotional components analyzed:`);
        console.log(`   Valence: ${components.valence.toFixed(3)}`);
        console.log(`   Arousal: ${components.arousal.toFixed(3)}`);
        console.log(`   Complexity: ${components.complexity.toFixed(3)}`);
        
        return components;
    }

    /**
     * حساب الطيف العاطفي الشامل
     */
    calculate_emotional_spectrum(components) {
        // ملاحظة: infer() تُرجع غلاف توزيع {samples, mean, ...} وليس قيمة البرنامج،
        // لذلك نحسب الطيف مباشرة مع ضجيج غاوسي مجهري كنكهة احتمالية
        const base_spectrum = {
            primary_frequency: components.valence * 0.5 + 0.25,  // 0.25 - 0.75
            secondary_frequency: components.arousal * 0.3 + 0.1, // 0.1 - 0.4
            harmonic_content: Math.max(0, Math.min(1,
                this.calculate_harmonic_content(components) + this.webppl.gaussian(0, 0.01))),

            // طبقات الطيف
            emotional_layers: {
                surface: components.valence * components.arousal,
                deep: components.dominance * components.authenticity,
                core: components.intensity * components.uniqueness_factor
            },

            // تفاعلات غير خطية
            resonance_patterns: this.find_resonance_patterns(components),
            interference_patterns: this.find_interference_patterns(components)
        };

        return base_spectrum;
    }

    /**
     * تطبيق التشفير الرياضي المتقدم
     */
    apply_mathematical_encryption(spectrum, context) {
        const crypto_base = this.crypto_settings.crypto_base;
        const constants = this.crypto_settings.mathematical_constants;

        // التشفير الأساسي — حساب مباشر (وليس عبر infer التي تُرجع غلاف توزيع بدل الرقم)
        let crypto_value = crypto_base;

        // إضافة مكونات الطيف
        crypto_value += spectrum.primary_frequency * constants.golden_ratio * 0.1;
        crypto_value += spectrum.secondary_frequency * constants.fibonacci_base * 0.1;
        crypto_value += spectrum.harmonic_content * constants.pi_fragments * 0.05;

        // طبقات التشفير
        const layers = spectrum.emotional_layers;
        crypto_value += layers.surface * 0.123456789;      // نمط متكرر
        crypto_value += layers.deep * constants.euler_fragments;
        crypto_value += layers.core * 0.0618033988;        // النسبة الذهبية المعكوسة

        // أنماط الرنين والتداخل
        crypto_value += this.encode_resonance_patterns(spectrum.resonance_patterns);
        crypto_value += this.encode_interference_patterns(spectrum.interference_patterns);

        // تطبيق السياق
        if (context.temporal_context) {
            crypto_value += this.encode_temporal_context(context.temporal_context);
        }

        if (context.social_context) {
            crypto_value += this.encode_social_context(context.social_context);
        }

        // نكهة احتمالية مجهرية — صغيرة بما يكفي حتى لا تكسر رنين التجارب المتشابهة
        crypto_value += this.webppl.gaussian(0, 0.01) * 0.05;

        // ضغط ناعم بدالة tanh رتيبة: يضمن بقاء التوقيع داخل المجال (0, 1) مع حفظ الترتيب
        if (!Number.isFinite(crypto_value)) crypto_value = crypto_base;
        crypto_value = 0.5 + Math.tanh((crypto_value - 0.5) * 1.5) * 0.47;

        // تطبيق دقة التشفير
        const precision = this.crypto_settings.base_precision;
        return parseFloat(crypto_value.toFixed(precision));
    }

    /**
     * تحسين التوقيع بناءً على التعقيد
     */
    enhance_signature_complexity(base_crypto_score, components) {
        const complexity_level = components.complexity;
        const enhancement_pattern = this.determine_enhancement_pattern(complexity_level);
        
        let enhanced_score = base_crypto_score;
        let mathematical_elements = [];
        
        switch (enhancement_pattern) {
            case 'fibonacci_enhancement':
                enhanced_score = this.apply_fibonacci_enhancement(enhanced_score);
                mathematical_elements.push('fibonacci_sequence');
                break;
                
            case 'golden_ratio_enhancement':
                enhanced_score = this.apply_golden_ratio_enhancement(enhanced_score);
                mathematical_elements.push('golden_ratio');
                break;
                
            case 'harmonic_series_enhancement':
                enhanced_score = this.apply_harmonic_enhancement(enhanced_score);
                mathematical_elements.push('harmonic_series');
                break;
                
            case 'transcendent_enhancement':
                enhanced_score = this.apply_transcendent_enhancement(enhanced_score);
                mathematical_elements.push('transcendent_functions');
                break;
        }
        
        // البحث عن أنماط رياضية مخفية في النتيجة
        const hidden_patterns = this.discover_hidden_mathematical_patterns(enhanced_score);
        mathematical_elements.push(...hidden_patterns);
        
        return {
            final_score: enhanced_score,
            pattern_type: enhancement_pattern,
            complexity_level: complexity_level,
            mathematical_elements: mathematical_elements,
            enhancement_applied: true
        };
    }

    /**
     * البحث عن معرف احتمالي أو إنشاء واحد جديد
     */
    find_or_create_probably_id(signature, components) {
        const crypto_score = signature.final_score;
        const similarity_threshold = this.crypto_settings.similarity_threshold;
        
        // البحث عن توقيعات مشابهة
        for (const [existing_id, existing_data] of this.probably_ids) {
            const similarity = this.calculate_emotional_similarity(
                crypto_score, existing_data.crypto_score,
                components, existing_data.components
            );
            
            if (similarity > 1 - similarity_threshold) {
                // وجد توقيع مشابه!
                console.log(`🎭 Emotional resonance detected!`);
                console.log(`   Matching Probably ID: ${existing_id}`);
                console.log(`   Similarity: ${(similarity * 100).toFixed(2)}%`);

                this.last_encryption_resonated = true;
                this.metrics.resonance_discoveries++;
                
                // تحديث البيانات الموجودة
                existing_data.occurrence_count++;
                existing_data.confidence_score = Math.min(0.99, 
                    existing_data.confidence_score + 0.05);
                existing_data.last_experienced = Date.now();
                
                // إضافة هذا التوقيع كتنويعة
                if (!existing_data.signature_variations) {
                    existing_data.signature_variations = [];
                }
                existing_data.signature_variations.push({
                    crypto_score: crypto_score,
                    timestamp: Date.now(),
                    similarity_to_original: similarity
                });
                
                return existing_id;
            }
        }
        
        // إنشاء معرف احتمالي جديد
        this.last_encryption_resonated = false;
        const new_probably_id = this.generate_new_probably_id(signature, components);
        
        this.probably_ids.set(new_probably_id, {
            crypto_score: crypto_score,
            components: components,
            signature: signature,
            first_experienced: Date.now(),
            last_experienced: Date.now(),
            occurrence_count: 1,
            confidence_score: 0.3,
            signature_variations: [],
            associated_memories: [],
            trigger_patterns: [],
            resonance_network: new Set()
        });
        
        this.metrics.unique_probably_ids++;
        
        console.log(`✨ New emotional signature created: ${new_probably_id}`);
        return new_probably_id;
    }

    /**
     * استدعاء الذكريات بناءً على التوقيع العاطفي
     */
    recall_by_emotional_signature(target_crypto_score, intensity_filter = null, max_results = 10) {
        console.log(`🔍 Searching for emotional memories...`);
        console.log(`   Target signature: ${target_crypto_score}`);
        
        const matching_memories = [];
        const tolerance = this.crypto_settings.similarity_threshold * 2; // tolerance أكبر للبحث
        
        for (const [probably_id, emotional_data] of this.probably_ids) {
            // حساب التشابه العاطفي
            const signature_similarity = this.calculate_signature_similarity(
                target_crypto_score, emotional_data.crypto_score
            );
            
            // تطبيق فلتر الشدة إذا كان موجود
            let intensity_match = 1.0;
            if (intensity_filter) {
                intensity_match = this.calculate_intensity_match(
                    intensity_filter, emotional_data.components.intensity
                );
            }
            
            // التشابه الإجمالي
            const overall_similarity = signature_similarity * 0.7 + intensity_match * 0.3;
            
            if (overall_similarity > (1 - tolerance)) {
                matching_memories.push({
                    probably_id: probably_id,
                    similarity: overall_similarity,
                    signature_data: {
                        crypto_score: emotional_data.crypto_score,
                        components: emotional_data.components,
                        signature: emotional_data.signature,
                        confidence: emotional_data.confidence_score,
                        occurrence_count: emotional_data.occurrence_count,
                        associated_memories: emotional_data.associated_memories,
                        resonance_network: Array.from(emotional_data.resonance_network)
                    },
                    signature_similarity: signature_similarity,
                    intensity_match: intensity_match
                });
            }
        }

        // ترتيب حسب قوة الرنين العاطفي
        matching_memories.sort((a, b) => b.similarity - a.similarity);

        // تحديد شبكات الرنين
        const resonance_networks = this.discover_resonance_networks(matching_memories);

        // النتيجة مصفوفة من {probably_id, similarity, signature_data}
        // مع بيانات وصفية إضافية ملحقة بالمصفوفة نفسها
        const results = matching_memories.slice(0, max_results);
        results.resonance_networks = resonance_networks;
        results.search_metadata = {
            target_signature: target_crypto_score,
            total_matches: matching_memories.length,
            tolerance_used: tolerance,
            search_timestamp: Date.now()
        };

        console.log(`📋 Found ${matching_memories.length} emotional matches`);
        console.log(`   Top match resonance: ${results[0] ? results[0].similarity.toFixed(3) : 'N/A'}`);

        return results;
    }

    /**
     * اكتشاف الأنماط في التوقيع العاطفي
     */
    discover_emotional_patterns(probably_id) {
        const emotional_data = this.probably_ids.get(probably_id);
        if (!emotional_data) return null;
        
        console.log(`🔬 Analyzing emotional patterns for: ${probably_id}`);
        
        const patterns = {
            mathematical_patterns: this.discover_mathematical_patterns_in_signature(emotional_data.crypto_score),
            temporal_patterns: this.discover_temporal_patterns(emotional_data),
            resonance_patterns: this.discover_signature_resonance_patterns(emotional_data),
            evolution_patterns: this.discover_evolution_patterns(emotional_data)
        };
        
        // تسجيل الاكتشافات
        if (patterns.mathematical_patterns.length > 0) {
            this.emotional_memory.pattern_evolution.set(probably_id, patterns);
            this.metrics.pattern_evolutions++;
        }
        
        return patterns;
    }

    /**
     * بناء شبكة الرنين العاطفي
     */
    build_resonance_network(central_probably_id, max_connections = 8) {
        const central_data = this.probably_ids.get(central_probably_id);
        if (!central_data) return null;
        
        console.log(`🕸️ Building resonance network for: ${central_probably_id}`);
        
        const network = {
            central_node: central_probably_id,
            connections: [],
            resonance_strength: 0,
            network_coherence: 0
        };
        
        // البحث عن العقد المتصلة
        for (const [other_id, other_data] of this.probably_ids) {
            if (other_id === central_probably_id) continue;
            
            const resonance = this.calculate_resonance_strength(central_data, other_data);
            
            if (resonance > 0.3) { // عتبة الرنين
                network.connections.push({
                    probably_id: other_id,
                    resonance_strength: resonance,
                    connection_type: this.classify_connection_type(central_data, other_data),
                    harmonic_relationship: this.find_harmonic_relationship(
                        central_data.crypto_score, other_data.crypto_score
                    )
                });
            }
        }
        
        // ترتيب الاتصالات حسب قوة الرنين
        network.connections.sort((a, b) => b.resonance_strength - a.resonance_strength);
        network.connections = network.connections.slice(0, max_connections);
        
        // حساب قوة الشبكة الإجمالية (مع حماية من القسمة على صفر)
        network.resonance_strength = network.connections.length > 0 ?
            network.connections.reduce((sum, conn) =>
                sum + conn.resonance_strength, 0) / network.connections.length : 0;
        
        network.network_coherence = this.calculate_network_coherence(network.connections);
        
        // تحديث شبكة الرنين للعقدة المركزية
        central_data.resonance_network = new Set(
            network.connections.map(conn => conn.probably_id)
        );
        
        console.log(`🕸️ Resonance network built: ${network.connections.length} connections`);
        console.log(`   Average resonance: ${network.resonance_strength.toFixed(3)}`);
        
        return network;
    }

    // =================== Helper Methods - التحليل والحساب ===================

    get_affect_profile(emotion_name) {
        // بصمة VAD للشعور — المشاعر المجهولة تعامل بشكل محايد (تكافؤ 0، إثارة 0.5)
        return this.affect_lexicon[emotion_name] || this.neutral_affect;
    }

    extract_emotion_entries(experience) {
        // استخراج أزواج (اسم الشعور، الشدة) الرقمية الصالحة فقط
        return Object.entries(experience).filter(([name, value]) =>
            typeof value === 'number' && Number.isFinite(value) && !this.non_emotion_keys.has(name)
        );
    }

    calculate_valence(experience) {
        // حساب القطبية العاطفية (إيجابي/سلبي) كمتوسط مرجح عبر معجم VAD
        let weighted = 0, total = 0;
        for (const [name, value] of this.extract_emotion_entries(experience)) {
            const magnitude = Math.min(1, Math.abs(value));
            weighted += this.get_affect_profile(name).valence * magnitude;
            total += magnitude;
        }
        return total > 0 ? Math.max(-1, Math.min(1, weighted / total)) : 0;
    }

    calculate_arousal(experience) {
        // حساب مستوى الإثارة/التفعيل كمتوسط مرجح عبر معجم VAD
        let weighted = 0, total = 0;
        for (const [name, value] of this.extract_emotion_entries(experience)) {
            const magnitude = Math.min(1, Math.abs(value));
            weighted += this.get_affect_profile(name).arousal * magnitude;
            total += magnitude;
        }
        return total > 0 ? Math.max(0, Math.min(1, weighted / total)) : 0.5;
    }

    calculate_dominance(experience) {
        // حساب الشعور بالسيطرة/القوة كمتوسط مرجح عبر معجم VAD
        let weighted = 0, total = 0;
        for (const [name, value] of this.extract_emotion_entries(experience)) {
            const magnitude = Math.min(1, Math.abs(value));
            weighted += this.get_affect_profile(name).dominance * magnitude;
            total += magnitude;
        }
        return total > 0 ? Math.max(0, Math.min(1, weighted / total)) : 0.5;
    }

    calculate_emotional_complexity(experience) {
        // حساب تعقيد التجربة العاطفية
        const emotion_count = Object.keys(experience).filter(key => 
            typeof experience[key] === 'number' && experience[key] > 0
        ).length;
        
        const intensity_variance = this.calculate_intensity_variance(experience);
        const mixed_emotions = this.detect_mixed_emotions(experience);
        
        return Math.min(1, (emotion_count / 10) + intensity_variance + mixed_emotions);
    }

    calculate_intensity_variance(experience) {
        // تباين شدة المشاعر — مقياس لتشتت التجربة العاطفية
        const values = this.extract_emotion_entries(experience)
            .map(([, value]) => Math.min(1, Math.abs(value)));
        if (values.length === 0) return 0;

        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        return values.reduce((sum, val) => sum + (val - mean) * (val - mean), 0) / values.length;
    }

    detect_mixed_emotions(experience) {
        // مشاعر مختلطة: حضور شعور إيجابي التكافؤ وآخر سلبي التكافؤ فوق 0.3 معاً
        let has_positive = false;
        let has_negative = false;

        for (const [name, value] of this.extract_emotion_entries(experience)) {
            if (value <= 0.3) continue;
            const affect = this.get_affect_profile(name);
            if (affect.valence > 0.2) has_positive = true;
            if (affect.valence < -0.2) has_negative = true;
        }

        return (has_positive && has_negative) ? 0.25 : 0;
    }

    calculate_authenticity(experience) {
        // تقدير مدى أصالة التجربة العاطفية (مقابل المصطنعة)
        if (experience.artificial_source) return 0.1;
        if (experience.suppressed) return 0.3;
        if (experience.amplified) return 0.6;
        
        return 0.8; // افتراض أن معظم التجارب أصيلة
    }

    calculate_intensity(experience) {
        // حساب الشدة الإجمالية (جذر متوسط المربعات لشدات المشاعر)
        const all_values = this.extract_emotion_entries(experience)
            .map(([, value]) => Math.min(1, Math.abs(value)));
        return all_values.length > 0 ?
            Math.sqrt(all_values.reduce((sum, val) => sum + val * val, 0) / all_values.length) : 0;
    }

    estimate_duration(experience) {
        // تقدير مدة التجربة العاطفية
        if (experience.duration) return Math.min(1, experience.duration / 3600); // تطبيع للساعات
        
        // تقدير بناءً على نوع المشاعر
        const quick_emotions = (experience.surprise || 0) + (experience.startle || 0);
        const lasting_emotions = (experience.love || 0) + (experience.grief || 0);
        
        return Math.max(0.1, Math.min(1, 0.3 + lasting_emotions * 0.4 - quick_emotions * 0.2));
    }

    extract_social_component(experience) {
        // استخراج المكون الاجتماعي
        const social_emotions = (experience.embarrassment || 0) + (experience.pride || 0) + 
                               (experience.guilt || 0) + (experience.empathy || 0);
        return Math.min(1, social_emotions);
    }

    extract_cognitive_component(experience) {
        // استخراج المكون المعرفي
        const cognitive_emotions = (experience.curiosity || 0) + (experience.confusion || 0) + 
                                  (experience.insight || 0) + (experience.understanding || 0);
        return Math.min(1, cognitive_emotions);
    }

    extract_physical_component(experience) {
        // استخراج المكون الجسدي
        const physical_emotions = (experience.tension || 0) + (experience.relaxation || 0) + 
                                 (experience.energy || 0) + (experience.fatigue || 0);
        return Math.min(1, physical_emotions);
    }

    calculate_uniqueness_factor(experience) {
        // حساب عامل التفرد — بصمة حتمية مشتقة من بنية التجربة نفسها
        // (العشوائية الصرفة كانت تكسر رنين التجارب المتطابقة، وinfer تُرجع غلاف توزيع)
        const sorted_keys = Object.keys(experience).sort();
        let name_hash = 0;
        for (const key of sorted_keys) {
            for (let i = 0; i < key.length; i++) {
                name_hash = (name_hash * 31 + key.charCodeAt(i)) % 997;
            }
        }

        const numeric_values = this.extract_emotion_entries(experience)
            .map(([, value]) => Math.min(1, Math.abs(value)));
        const value_mass = numeric_values.length > 0 ?
            numeric_values.reduce((sum, val) => sum + val, 0) / numeric_values.length : 0.5;

        const structural_uniqueness = 0.1 + (name_hash / 997) * 0.5 + value_mass * 0.3;
        const context_uniqueness = experience.context_novelty || 0.5;
        const personal_significance = experience.personal_meaning || 0.5;

        const uniqueness = (structural_uniqueness + context_uniqueness + personal_significance) / 3
            + this.webppl.gaussian(0, 0.01);
        return Math.max(0, Math.min(1, uniqueness));
    }

    // =================== Spectrum Helpers - مساعدات الطيف ===================

    calculate_harmonic_content(components) {
        // المحتوى التوافقي: تراكب الأبعاد العاطفية كمتسلسلة توافقية (1 + 1/2 + 1/3 ...)
        const dimensions = [
            components.valence * 0.5 + 0.5,   // تطبيع التكافؤ إلى [0, 1]
            components.arousal,
            components.dominance,
            components.complexity,
            components.intensity
        ];

        let harmonic_sum = 0;
        dimensions.forEach((dimension, index) => {
            harmonic_sum += dimension / (index + 1);
        });

        return Math.max(0, Math.min(1, harmonic_sum / 2.283333)); // القسمة على مجموع 1..1/5
    }

    find_resonance_patterns(components) {
        // أنماط الرنين: أزواج الأبعاد التي تتعزز عندما تتقارب قيمها
        const patterns = [];
        const normalized_valence = components.valence * 0.5 + 0.5;
        const candidate_pairs = [
            ['valence_arousal_resonance', normalized_valence, components.arousal],
            ['dominance_intensity_resonance', components.dominance, components.intensity],
            ['complexity_authenticity_resonance', components.complexity, components.authenticity]
        ];

        for (const [pattern_name, first, second] of candidate_pairs) {
            const alignment = 1 - Math.abs(first - second);
            if (alignment > 0.6) {
                patterns.push({
                    pattern: pattern_name,
                    strength: alignment * ((first + second) / 2)
                });
            }
        }

        return patterns;
    }

    find_interference_patterns(components) {
        // أنماط التداخل: أبعاد في حالة توتر تخفض صفاء التوقيع
        const patterns = [];
        const normalized_valence = components.valence * 0.5 + 0.5;

        if (components.arousal > 0.6 && components.dominance < 0.4) {
            patterns.push({
                pattern: 'arousal_dominance_conflict',
                strength: components.arousal - components.dominance
            });
        }
        if (normalized_valence < 0.4 && components.intensity > 0.6) {
            patterns.push({
                pattern: 'negative_intensity_turbulence',
                strength: components.intensity * (0.4 - normalized_valence)
            });
        }
        if (components.social_component > 0.5 && components.cognitive_component > 0.5) {
            patterns.push({
                pattern: 'social_cognitive_interference',
                strength: (components.social_component + components.cognitive_component) / 2 - 0.5
            });
        }

        return patterns;
    }

    encode_resonance_patterns(patterns) {
        // ترميز أنماط الرنين كإزاحة موجبة صغيرة على أساس فيبوناتشي
        const fibonacci_base = this.crypto_settings.mathematical_constants.fibonacci_base;
        return patterns.reduce((sum, pattern) => sum + pattern.strength * fibonacci_base * 0.1, 0);
    }

    encode_interference_patterns(patterns) {
        // ترميز أنماط التداخل كإزاحة سالبة صغيرة على أساس أجزاء π
        const pi_fragments = this.crypto_settings.mathematical_constants.pi_fragments;
        return -patterns.reduce((sum, pattern) => sum + pattern.strength * pi_fragments * 0.1, 0);
    }

    encode_temporal_context(temporal_context) {
        // ترميز السياق الزمني (وقت اليوم أو أي مقياس زمني معياري) كإزاحة دقيقة
        const raw = typeof temporal_context === 'number' ?
            temporal_context : (temporal_context.time_of_day || 0.5);
        const normalized = Math.max(0, Math.min(1, raw));
        return (normalized - 0.5) * this.crypto_settings.mathematical_constants.euler_fragments * 0.05;
    }

    encode_social_context(social_context) {
        // ترميز السياق الاجتماعي (الحضور/الألفة الاجتماعية) كإزاحة دقيقة بالنسبة الذهبية
        const raw = typeof social_context === 'number' ?
            social_context : (social_context.social_presence || social_context.intimacy || 0.5);
        const normalized = Math.max(0, Math.min(1, raw));
        return (normalized - 0.5) * this.crypto_settings.mathematical_constants.golden_ratio * 0.01;
    }

    // =================== Enhancement Methods - طرق التحسين ===================

    determine_enhancement_pattern(complexity_level) {
        // اختيار نمط التحسين وفق طبقات التعقيد: بسيط → متسامٍ
        if (complexity_level < 0.25) return 'linear_baseline';
        if (complexity_level < 0.5) return 'fibonacci_enhancement';
        if (complexity_level < 0.75) return 'golden_ratio_enhancement';
        if (complexity_level < 0.9) return 'harmonic_series_enhancement';
        return 'transcendent_enhancement';
    }

    apply_fibonacci_enhancement(base_score) {
        const fib_sequence = "1123581321345589"; // أول أرقام فيبوناتشي
        const base_str = base_score.toString();
        const decimal_part = base_str.split('.')[1] || '';
        
        // البحث عن تطابق مع فيبوناتشي
        for (let i = 0; i < fib_sequence.length - 3; i++) {
            const fib_pattern = fib_sequence.substr(i, 4);
            if (decimal_part.includes(fib_pattern)) {
                // تعزيز التوقيع بنمط فيبوناتشي
                return base_score + parseFloat(`0.000${fib_pattern}`);
            }
        }
        
        // إضافة نمط فيبوناتشي خفيف
        return base_score + 0.0001123;
    }

    apply_golden_ratio_enhancement(base_score) {
        const golden_ratio = this.crypto_settings.mathematical_constants.golden_ratio;
        const ratio_fragments = golden_ratio.toString().substr(2, 6); // 618033
        
        // دمج أجزاء من النسبة الذهبية
        const enhancement = parseFloat(`0.0000${ratio_fragments.substr(0, 3)}`);
        return base_score + enhancement;
    }

    apply_harmonic_enhancement(base_score) {
        // تطبيق المتسلسلة التوافقية
        const harmonic_sum = 1 + 1/2 + 1/3 + 1/4 + 1/5; // أول 5 حدود
        const harmonic_fragment = (harmonic_sum % 1).toFixed(6);
        
        return base_score + parseFloat(`0.000${harmonic_fragment.substr(2, 3)}`);
    }

    apply_transcendent_enhancement(base_score) {
        // دمج عدة ثوابت رياضية متسامية
        const pi_e_combination = Math.PI * Math.E % 1;
        const enhancement = parseFloat(pi_e_combination.toFixed(8).substr(1, 8));
        
        return base_score + enhancement * 0.0001;
    }

    // =================== Pattern Discovery Methods ===================

    discover_hidden_mathematical_patterns(crypto_score) {
        const patterns = [];
        const score_str = crypto_score.toString();
        const decimal_part = score_str.split('.')[1] || '';
        
        // البحث عن أنماط فيبوناتشي
        if (this.contains_fibonacci_pattern(decimal_part)) {
            patterns.push('fibonacci_hidden');
        }
        
        // البحث عن النسبة الذهبية
        if (this.contains_golden_ratio_pattern(decimal_part)) {
            patterns.push('golden_ratio_hidden');
        }
        
        // البحث عن أنماط متكررة
        const repetitions = this.find_digit_repetitions(decimal_part);
        if (repetitions.length > 0) {
            patterns.push('repetitive_pattern');
        }
        
        // البحث عن متتاليات حسابية أو هندسية
        if (this.contains_arithmetic_sequence(decimal_part)) {
            patterns.push('arithmetic_sequence');
        }
        
        return patterns;
    }

    contains_fibonacci_pattern(decimal_str) {
        const fib_patterns = ["112", "123", "235", "358", "581"];
        return fib_patterns.some(pattern => decimal_str.includes(pattern));
    }

    contains_golden_ratio_pattern(decimal_str) {
        const golden_patterns = ["618", "1618", "0618"];
        return golden_patterns.some(pattern => decimal_str.includes(pattern));
    }

    find_digit_repetitions(decimal_str) {
        const repetitions = [];
        for (let i = 0; i < decimal_str.length - 2; i++) {
            const char = decimal_str[i];
            let count = 1;
            
            for (let j = i + 1; j < decimal_str.length && decimal_str[j] === char; j++) {
                count++;
            }
            
            if (count >= 3) {
                repetitions.push({ digit: char, count: count, position: i });
            }
        }
        return repetitions;
    }

    contains_arithmetic_sequence(decimal_str) {
        // البحث عن متتاليات حسابية بسيطة مثل 123, 456, 789
        const sequences = ["123", "234", "345", "456", "567", "678", "789"];
        return sequences.some(seq => decimal_str.includes(seq));
    }

    discover_mathematical_patterns_in_signature(crypto_score) {
        // الأنماط الرياضية الكامنة في التمدد العشري للتوقيع
        return this.discover_hidden_mathematical_patterns(crypto_score).map(pattern => ({
            pattern: pattern,
            source: 'decimal_expansion',
            crypto_score: crypto_score
        }));
    }

    discover_temporal_patterns(emotional_data) {
        // الأنماط الزمنية: التكرار والحداثة ودورة حياة الشعور
        const lifespan_ms = emotional_data.last_experienced - emotional_data.first_experienced;
        const occurrences = emotional_data.occurrence_count || 1;

        return {
            is_recurring: occurrences > 1,
            occurrence_count: occurrences,
            lifespan_ms: lifespan_ms,
            average_interval_ms: occurrences > 1 ? lifespan_ms / (occurrences - 1) : 0,
            recency: Math.exp(-(Date.now() - emotional_data.last_experienced) / (24 * 3600 * 1000))
        };
    }

    discover_signature_resonance_patterns(emotional_data) {
        // أنماط رنين التوقيع: انحراف التنويعات عن التوقيع الأصلي واستقراره
        const variations = emotional_data.signature_variations || [];
        const base_score = emotional_data.crypto_score;
        const average_drift = variations.length > 0 ?
            variations.reduce((sum, variation) =>
                sum + Math.abs(variation.crypto_score - base_score), 0) / variations.length : 0;

        return {
            variation_count: variations.length,
            average_drift: average_drift,
            stability: Math.max(0, Math.min(1, 1 - average_drift * 20)),
            network_size: emotional_data.resonance_network ? emotional_data.resonance_network.size : 0
        };
    }

    discover_evolution_patterns(emotional_data) {
        // أنماط التطور: نضج التوقيع مع تكرار المعايشة ونمو الثقة
        const maturity = Math.min(1, (emotional_data.occurrence_count || 1) / 10);
        const evolution_stage = maturity < 0.3 ? 'nascent' :
            maturity < 0.7 ? 'developing' : 'established';

        return {
            maturity: maturity,
            confidence_growth: emotional_data.confidence_score - 0.3, // 0.3 هي ثقة الميلاد
            variation_richness: Math.min(1, (emotional_data.signature_variations || []).length / 5),
            evolution_stage: evolution_stage
        };
    }

    discover_resonance_networks(matching_memories) {
        // اكتشاف شبكات الرنين: أزواج الذكريات المتطابقة ذات العلاقات التوافقية
        const networks = [];

        for (let i = 0; i < matching_memories.length; i++) {
            for (let j = i + 1; j < matching_memories.length; j++) {
                const resonance = this.calculate_harmonic_resonance(
                    matching_memories[i].signature_data.crypto_score,
                    matching_memories[j].signature_data.crypto_score
                );

                if (resonance > 0.85) {
                    networks.push({
                        nodes: [matching_memories[i].probably_id, matching_memories[j].probably_id],
                        harmonic_resonance: resonance
                    });
                }
            }
        }

        return networks;
    }

    // =================== Similarity and Resonance Methods ===================

    calculate_emotional_similarity(crypto1, crypto2, components1, components2) {
        // التشابه في التوقيع المشفر
        const signature_similarity = 1 - Math.abs(crypto1 - crypto2) / 2;
        
        // التشابه في المكونات
        const component_similarity = this.calculate_component_similarity(components1, components2);
        
        // التشابه في الأنماط
        const pattern_similarity = this.calculate_pattern_similarity(crypto1, crypto2);
        
        // التشابه الإجمالي مرجح
        return (signature_similarity * 0.4 + component_similarity * 0.4 + pattern_similarity * 0.2);
    }

    calculate_component_similarity(comp1, comp2) {
        const keys = ['valence', 'arousal', 'dominance', 'complexity', 'intensity'];
        let similarity_sum = 0;
        
        for (const key of keys) {
            const val1 = comp1[key] || 0;
            const val2 = comp2[key] || 0;
            similarity_sum += 1 - Math.abs(val1 - val2);
        }
        
        return similarity_sum / keys.length;
    }

    calculate_signature_similarity(score1, score2) {
        return 1 - Math.abs(score1 - score2);
    }

    calculate_intensity_match(target_intensity, actual_intensity) {
        return 1 - Math.abs(target_intensity - actual_intensity);
    }

    calculate_resonance_strength(data1, data2) {
        // قوة الرنين بين توقيعين عاطفيين
        const signature_resonance = this.calculate_harmonic_resonance(
            data1.crypto_score, data2.crypto_score
        );
        
        const component_resonance = this.calculate_component_resonance(
            data1.components, data2.components
        );
        
        const temporal_resonance = this.calculate_temporal_resonance(
            data1.first_experienced, data2.first_experienced
        );
        
        return (signature_resonance * 0.5 + component_resonance * 0.3 + temporal_resonance * 0.2);
    }

    calculate_harmonic_resonance(score1, score2) {
        // البحث عن علاقات توافقية بين التوقيعين
        const ratio = score1 / score2;
        const harmonics = [1, 2, 3, 1/2, 1/3, 1.618, 0.618]; // بما في ذلك النسبة الذهبية
        
        let max_resonance = 0;
        for (const harmonic of harmonics) {
            const resonance = 1 - Math.abs(ratio - harmonic) / harmonic;
            max_resonance = Math.max(max_resonance, resonance);
        }

        return Math.max(0, max_resonance);
    }

    calculate_pattern_similarity(crypto1, crypto2) {
        // تشابه الأنماط: قرب التوقيعين في الفضاء الرقمي مع لمسة توافقية
        const proximity = Math.max(0, 1 - Math.abs(crypto1 - crypto2) * 2);
        const harmonic_affinity = this.calculate_harmonic_resonance(crypto1, crypto2);
        return proximity * 0.7 + harmonic_affinity * 0.3;
    }

    calculate_component_resonance(comp1, comp2) {
        // رنين المكونات: تقارب الأبعاد الجوهرية الثلاثة (VAD)
        const vad_keys = ['valence', 'arousal', 'dominance'];
        let resonance_sum = 0;

        for (const key of vad_keys) {
            resonance_sum += 1 - Math.abs((comp1[key] || 0) - (comp2[key] || 0)) / 2;
        }

        return Math.max(0, Math.min(1, resonance_sum / vad_keys.length));
    }

    calculate_temporal_resonance(time1, time2) {
        // الرنين الزمني: التجارب المتقاربة زمنياً ترن أقوى (تلاشٍ أسي على مدى يوم)
        const gap_hours = Math.abs(time1 - time2) / 3600000;
        return Math.exp(-gap_hours / 24);
    }

    classify_connection_type(data1, data2) {
        // تصنيف نوع الاتصال بين توقيعين عاطفيين
        const valence_gap = Math.abs(data1.components.valence - data2.components.valence);
        const arousal_gap = Math.abs(data1.components.arousal - data2.components.arousal);

        if (valence_gap < 0.3 && arousal_gap < 0.3) return 'kindred_resonance';
        if (data1.components.valence * data2.components.valence < -0.05) return 'complementary_opposition';
        if (arousal_gap < 0.2) return 'arousal_alignment';
        return 'ambient_association';
    }

    find_harmonic_relationship(score1, score2) {
        // البحث عن أقرب علاقة توافقية موسيقية/ذهبية بين توقيعين
        const ratio = score2 !== 0 ? score1 / score2 : Infinity;
        const relationships = [
            { name: 'unison', value: 1 },
            { name: 'octave', value: 2 },
            { name: 'perfect_fifth', value: 1.5 },
            { name: 'golden_ratio', value: this.crypto_settings.mathematical_constants.golden_ratio },
            { name: 'inverse_golden', value: 0.618033988749895 },
            { name: 'sub_octave', value: 0.5 }
        ];

        let best = { relationship: 'dissonant', ratio: ratio, deviation: 1 };
        for (const candidate of relationships) {
            const deviation = Math.abs(ratio - candidate.value) / candidate.value;
            if (deviation < best.deviation) {
                best = { relationship: candidate.name, ratio: ratio, deviation: deviation };
            }
        }

        if (best.deviation > 0.15) best.relationship = 'dissonant';
        return best;
    }

    calculate_network_coherence(connections) {
        // تماسك الشبكة: متوسط قوة الرنين مخفّضاً بتشتت القوى بين الاتصالات
        if (connections.length === 0) return 0;

        const strengths = connections.map(connection => connection.resonance_strength);
        const mean = strengths.reduce((sum, val) => sum + val, 0) / strengths.length;
        const variance = strengths.reduce((sum, val) =>
            sum + (val - mean) * (val - mean), 0) / strengths.length;

        return Math.max(0, Math.min(1, mean * (1 - Math.sqrt(variance))));
    }

    // =================== Utility Methods ===================

    generate_new_probably_id(signature, components) {
        const timestamp = Date.now();
        const complexity_code = Math.floor(components.complexity * 9) + 1;
        const crypto_fragment = signature.final_score.toString().substr(-4);
        
        return `EMO_${complexity_code}${crypto_fragment}_${timestamp.toString(36)}`;
    }

    store_encryption_result(result, experience, context) {
        // حفظ النتيجة في الذاكرة العاطفية
        this.emotional_memory.recent_encryptions.push({
            ...result,
            original_experience: experience,
            context: context
        });
        
        // الاحتفاظ بآخر 50 تشفير فقط
        if (this.emotional_memory.recent_encryptions.length > 50) {
            this.emotional_memory.recent_encryptions = 
                this.emotional_memory.recent_encryptions.slice(-50);
        }
        
        // تحديث المتوسطات
        this.update_complexity_average(result.emotional_signature.complexity_level);
    }

    register_emotional_associations(probably_id, signature, context) {
        // تسجيل الروابط والعلاقات
        if (context.memory_id) {
            this.association_maps.semantic.set(probably_id, context.memory_id);
        }
        
        if (context.trigger_event) {
            this.association_maps.causal.set(probably_id, context.trigger_event);
        }
        
        this.association_maps.temporal.set(probably_id, Date.now());
    }

    update_complexity_average(new_complexity) {
        const total_encryptions = this.metrics.total_encryptions;
        this.metrics.average_encryption_complexity = 
            (this.metrics.average_encryption_complexity * (total_encryptions - 1) + new_complexity) / 
            total_encryptions;
    }

    initialize_encryption_system() {
        console.log("🔐 Emotional Cryptography System Initialized");
        console.log(`   Base precision: ${this.crypto_settings.base_precision}`);
        console.log(`   Similarity threshold: ${this.crypto_settings.similarity_threshold}`);
        console.log(`   Mathematical constants loaded: ${Object.keys(this.crypto_settings.mathematical_constants).length}`);
    }

    // =================== Public Interface ===================

    get_probably_id_details(probably_id) {
        return this.probably_ids.get(probably_id);
    }

    get_all_probably_ids() {
        return Array.from(this.probably_ids.keys());
    }

    get_encryption_statistics() {
        return {
            ...this.metrics,
            active_probably_ids: this.probably_ids.size,
            recent_encryptions: this.emotional_memory.recent_encryptions.length,
            discovered_patterns: this.emotional_memory.pattern_evolution.size
        };
    }

    update_crypto_precision(new_precision) {
        this.crypto_settings.base_precision = Math.max(6, Math.min(15, new_precision));
        console.log(`🎯 Crypto precision updated to: ${this.crypto_settings.base_precision}`);
    }
}

module.exports = EmotionalCryptography;
