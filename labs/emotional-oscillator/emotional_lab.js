/**
 * CPF Emotional Oscillator Laboratory
 * مختبر الهزاز العاطفي - ربط الهزاز الديناميكي بالتشفير العاطفي
 * 
 * يجمع بين:
 * - تحليل المشاعر (Sentiment Analysis)
 * - نظام الهزازات الثلاثة
 * - التشفير العاطفي مع البذرة الاحتمالية
 * - تجارب قابلة للقياس
 */

// سنستخدم مكتبة sentiment بدلاً من transformers للبساية في البداية
const Sentiment = require('sentiment');
const crypto = require('crypto');

class EmotionalOscillatorLab {
    constructor() {
        this.sentiment = new Sentiment();
        
        // === الهزازات الثلاثة ===
        this.oscillators = {
            existence: 0.5,              // ثابت - خط الأساس
            dynamic: 0.5,                // متغير - الحالة العاطفية
            judge: 0.0                   // المكتشف - |dynamic - existence|
        };
        
        // === طيف المشاعر المقلوب (حسب الورقة البحثية) ===
        this.emotionalSpectrum = {
            // 0.0 = العدم المطلق
            // 0.5 = الحياد والسكينة  
            // 1.0 = الألم المطلق
        };
        
        // === نظام التشفير العاطفي ===
        this.emotionalCrypto = {
            probably_ids: new Map(),     // البصمات العاطفية
            encryption_history: [],     // تاريخ التشفير
            resonance_patterns: new Map() // أنماط الرنين
        };
        
        // === إعدادات التجريب ===
        this.experiment_config = {
            precision: 8,               // دقة الحساب
            damping_factor: 0.7,        // عامل التخميد
            pattern_threshold: 0.001    // عتبة اكتشاف الأنماط
        };
        
        console.log("🧪 مختبر الهزاز العاطفي جاهز للتجريب!");
        console.log("📊 نظام الهزازات: الوجود=0.5, الديناميكي=متغير, القاضي=المكتشف");
    }

    /**
     * تجربة 1: تحليل النص وتحويله لطيف المشاعر المقلوب
     */
    analyzeTextToSpectrum(text, context = {}) {
        console.log(`\n🔬 تحليل النص: "${text}"`);
        
        // 1. تحليل المشاعر الأساسي
        const sentimentResult = this.sentiment.analyze(text);
        
        // 2. تحويل النتيجة لطيف المشاعر المقلوب
        const normalizedScore = this.normalizeSentimentToSpectrum(sentimentResult);
        
        // 3. تحديث الهزاز الديناميكي مع التخميد
        const old_dynamic = this.oscillators.dynamic;
        this.oscillators.dynamic = (old_dynamic * this.experiment_config.damping_factor) + 
                                  (normalizedScore * (1 - this.experiment_config.damping_factor));
        
        // 4. حساب هزاز القاضي (المكتشف)
        this.oscillators.judge = Math.abs(this.oscillators.dynamic - this.oscillators.existence);
        
        // 5. تحليل الطيف
        const spectrum_analysis = this.analyzeSpectrumPosition(this.oscillators.dynamic);
        
        const result = {
            original_text: text,
            sentiment_raw: sentimentResult,
            spectrum_position: this.oscillators.dynamic,
            judge_value: this.oscillators.judge,
            spectrum_analysis: spectrum_analysis,
            oscillator_state: { ...this.oscillators }
        };
        
        console.log(`📈 النتيجة: طيف=${this.oscillators.dynamic.toFixed(6)}, قاضي=${this.oscillators.judge.toFixed(6)}`);
        console.log(`🎯 التفسير: ${spectrum_analysis.interpretation}`);
        
        return result;
    }

    /**
     * تجربة 2: التشفير العاطفي باستخدام هزاز القاضي كبذرة
     */
    encryptEmotionalExperience(experience_data, context = {}) {
        console.log(`\n🔐 تشفير التجربة العاطفية...`);
        
        // 1. استخدام قيمة هزاز القاضي كبذرة احتمالية
        const probabilistic_seed = this.oscillators.judge;
        
        // 2. إنشاء توقيع عاطفي مركب
        const emotional_signature = this.generateEmotionalSignature(
            experience_data, 
            probabilistic_seed,
            context
        );
        
        // 3. توليد Probably ID فريد
        const probably_id = this.generateProbablyID(emotional_signature);
        
        // 4. تشفير التجربة
        const encrypted_experience = {
            probably_id: probably_id,
            emotional_signature: emotional_signature,
            seed_value: probabilistic_seed,
            spectrum_position: this.oscillators.dynamic,
            encryption_timestamp: Date.now(),
            experience_data: experience_data,
            context: context
        };
        
        // 5. حفظ في ذاكرة التشفير
        this.emotionalCrypto.probably_ids.set(probably_id, encrypted_experience);
        this.emotionalCrypto.encryption_history.push({
            timestamp: Date.now(),
            probably_id: probably_id,
            seed: probabilistic_seed
        });
        
        console.log(`✨ تم التشفير: ${probably_id}`);
        console.log(`🌱 البذرة: ${probabilistic_seed.toFixed(8)}`);
        
        return encrypted_experience;
    }

    /**
     * تجربة 3: البحث عن الرنين العاطفي بين الذكريات
     */
    findEmotionalResonance(target_seed, tolerance = 0.001) {
        console.log(`\n🔍 البحث عن الرنين العاطفي للبذرة: ${target_seed.toFixed(8)}`);
        
        const resonant_memories = [];
        
        for (const [probably_id, encrypted_exp] of this.emotionalCrypto.probably_ids) {
            const seed_similarity = 1 - Math.abs(target_seed - encrypted_exp.seed_value);
            
            if (seed_similarity > (1 - tolerance)) {
                resonant_memories.push({
                    probably_id: probably_id,
                    resonance_strength: seed_similarity,
                    spectrum_distance: Math.abs(this.oscillators.dynamic - encrypted_exp.spectrum_position),
                    experience: encrypted_exp.experience_data,
                    time_distance: Date.now() - encrypted_exp.encryption_timestamp
                });
            }
        }
        
        // ترتيب حسب قوة الرنين
        resonant_memories.sort((a, b) => b.resonance_strength - a.resonance_strength);
        
        console.log(`🎵 وُجد ${resonant_memories.length} ذكريات متناغمة`);
        
        return resonant_memories;
    }

    /**
     * تجربة 4: محاكاة تأثير الحالة المزاجية على استدعاء الذاكرة
     */
    simulateMoodInfluencedRecall(current_mood_text, memory_query) {
        console.log(`\n🧠 محاكاة تأثير المزاج على الذاكرة...`);
        console.log(`😊 المزاج الحالي: "${current_mood_text}"`);
        console.log(`🔍 البحث عن: "${memory_query}"`);
        
        // 1. تحليل المزاج الحالي
        const mood_analysis = this.analyzeTextToSpectrum(current_mood_text);
        
        // 2. تشفير استعلام الذاكرة
        const query_encryption = this.encryptEmotionalExperience({
            type: 'memory_query',
            content: memory_query
        });
        
        // 3. البحث عن ذكريات مماثلة
        const resonant_memories = this.findEmotionalResonance(
            query_encryption.seed_value, 
            0.002 // tolerance أكبر للبحث
        );
        
        // 4. تطبيق تأثير المزاج على النتائج
        const mood_filtered_memories = resonant_memories.map(memory => ({
            ...memory,
            mood_compatibility: this.calculateMoodCompatibility(
                mood_analysis.spectrum_position,
                memory.experience.spectrum_position || 0.5
            ),
            recall_probability: this.calculateRecallProbability(
                memory.resonance_strength,
                mood_analysis.judge_value
            )
        }));
        
        console.log(`💭 تأثير المزاج: ${mood_filtered_memories.length} ذكريات معدلة`);
        
        return {
            mood_analysis: mood_analysis,
            query_encryption: query_encryption,
            filtered_memories: mood_filtered_memories
        };
    }

    /**
     * تجربة 5: قياس تطور الهزاز عبر سلسلة من النصوص
     */
    runOscillatorEvolutionExperiment(texts) {
        console.log(`\n📈 تجربة تطور الهزاز عبر ${texts.length} نصوص...`);
        
        const evolution_data = [];
        
        texts.forEach((text, index) => {
            const analysis = this.analyzeTextToSpectrum(text);
            const patterns = this.detectMathematicalPatterns(this.oscillators.judge);
            
            evolution_data.push({
                step: index + 1,
                text: text,
                dynamic_value: this.oscillators.dynamic,
                judge_value: this.oscillators.judge,
                spectrum_interpretation: analysis.spectrum_analysis.interpretation,
                patterns_detected: patterns,
                oscillator_snapshot: { ...this.oscillators }
            });
            
            console.log(`⚡ خطوة ${index + 1}: ${this.oscillators.dynamic.toFixed(4)} | ${patterns.length} أنماط`);
        });
        
        // تحليل الاتجاهات
        const trends = this.analyzeEvolutionTrends(evolution_data);
        
        console.log(`📊 الاتجاهات: ${trends.overall_direction}, متوسط التذبذب: ${trends.average_oscillation.toFixed(4)}`);
        
        return {
            evolution_data: evolution_data,
            trends: trends,
            final_state: { ...this.oscillators }
        };
    }

    /**
     * تحويل نتيجة sentiment إلى طيف المشاعر المقلوب
     */
    normalizeSentimentToSpectrum(sentimentResult) {
        // sentiment.js يعطي نتائج من -infinity إلى +infinity تقريباً
        // نحتاج تحويلها لطيف 0.0 - 1.0 بحيث 0.5 = حياد
        
        const raw_score = sentimentResult.score;
        const comparative = sentimentResult.comparative; // النتيجة مقسومة على عدد الكلمات
        
        // استخدام tanh لتطبيع النتيجة
        const normalized = 0.5 + (Math.tanh(comparative * 2) * 0.4);
        
        // تطبيق بعض العشوائية لمحاكاة الضوضاء المعرفية
        const noise = (Math.random() - 0.5) * 0.05;
        
        return Math.max(0, Math.min(1, normalized + noise));
    }

    /**
     * تحليل موقع الطيف وتفسيره
     */
    analyzeSpectrumPosition(position) {
        let interpretation = "";
        let category = "";
        
        if (position >= 0.45 && position <= 0.55) {
            category = "حياد";
            interpretation = "حالة هدوء وسكينة، الوعي في توازن";
        } else if (position < 0.45) {
            const void_intensity = (0.45 - position) / 0.45;
            category = "اتجاه العدم";
            if (void_intensity < 0.3) {
                interpretation = "هدوء عميق، ميل للانطواء";
            } else if (void_intensity < 0.6) {
                interpretation = "حزن، لا مبالاة، انسحاب خفيف";
            } else {
                interpretation = "يأس عميق، اقتراب من العدم المطلق";
            }
        } else {
            const pain_intensity = (position - 0.55) / 0.45;
            category = "اتجاه الألم";
            if (pain_intensity < 0.3) {
                interpretation = "يقظة، حماس، طاقة إيجابية";
            } else if (pain_intensity < 0.6) {
                interpretation = "توتر، قلق، إثارة مفرطة";
            } else {
                interpretation = "ألم نفسي، هلع، طاقة مدمرة";
            }
        }
        
        return {
            position: position,
            category: category,
            interpretation: interpretation,
            void_tendency: Math.max(0, 0.5 - position) * 2,
            pain_tendency: Math.max(0, position - 0.5) * 2
        };
    }

    /**
     * توليد التوقيع العاطفي المركب
     */
    generateEmotionalSignature(experience_data, seed, context) {
        // استخدام البذرة في حساب توقيع معقد
        const signature_components = {
            seed_hash: this.hashSeed(seed),
            experience_hash: this.hashExperience(experience_data),
            temporal_component: Date.now() % 1000000,
            oscillator_state: this.oscillators.dynamic,
            context_influence: this.calculateContextInfluence(context)
        };
        
        // دمج المكونات في توقيع موحد
        const combined_hash = crypto
            .createHash('sha256')
            .update(JSON.stringify(signature_components))
            .digest('hex');
        
        // تحويل إلى رقم كسري للمعالجة الرياضية
        const numeric_signature = parseInt(combined_hash.substring(0, 15), 16) / Math.pow(16, 15);
        
        return {
            numeric_signature: numeric_signature,
            hash_signature: combined_hash,
            components: signature_components,
            complexity_level: this.calculateSignatureComplexity(signature_components)
        };
    }

    /**
     * توليد Probably ID فريد
     */
    generateProbablyID(emotional_signature) {
        const timestamp = Date.now().toString(36);
        const signature_fragment = emotional_signature.hash_signature.substring(0, 8);
        const complexity_code = Math.floor(emotional_signature.complexity_level * 9) + 1;
        
        return `EMO_${complexity_code}${signature_fragment}_${timestamp}`;
    }

    /**
     * اكتشاف الأنماط الرياضية في قيمة هزاز القاضي
     */
    detectMathematicalPatterns(judge_value) {
        const patterns = [];
        const value_string = judge_value.toString();
        const decimal_part = value_string.split('.')[1] || '';
        
        // البحث عن تسلسل فيبوناتشي
        if (this.containsFibonacci(decimal_part)) {
            patterns.push({
                type: 'fibonacci',
                significance: 0.8,
                description: 'تسلسل فيبوناتشي مكتشف'
            });
        }
        
        // البحث عن النسبة الذهبية
        if (Math.abs(judge_value - 0.618033988749895) < 0.001) {
            patterns.push({
                type: 'golden_ratio',
                significance: 1.0,
                description: 'النسبة الذهبية'
            });
        }
        
        // البحث عن الأنماط المتكررة
        const repetitions = this.findRepetitivePatterns(decimal_part);
        if (repetitions.length > 0) {
            patterns.push({
                type: 'repetitive',
                significance: 0.6,
                description: `${repetitions.length} أنماط متكررة`
            });
        }
        
        return patterns;
    }

    /**
     * حساب توافق المزاج
     */
    calculateMoodCompatibility(mood_position, memory_position) {
        const distance = Math.abs(mood_position - memory_position);
        return 1 - distance; // كلما قل البعد، زاد التوافق
    }

    /**
     * حساب احتمالية الاستدعاء
     */
    calculateRecallProbability(resonance_strength, judge_intensity) {
        // الرنين القوي + شدة القاضي = احتمالية أعلى
        return (resonance_strength * 0.7) + (judge_intensity * 0.3);
    }

    /**
     * تحليل اتجاهات التطور
     */
    analyzeEvolutionTrends(evolution_data) {
        if (evolution_data.length < 2) return { overall_direction: "insufficient_data" };
        
        const first_value = evolution_data[0].dynamic_value;
        const last_value = evolution_data[evolution_data.length - 1].dynamic_value;
        
        // حساب متوسط التذبذب
        const oscillations = evolution_data.slice(1).map((item, index) => 
            Math.abs(item.dynamic_value - evolution_data[index].dynamic_value)
        );
        const average_oscillation = oscillations.reduce((a, b) => a + b, 0) / oscillations.length;
        
        // تحديد الاتجاه العام
        let overall_direction;
        const total_change = last_value - first_value;
        if (Math.abs(total_change) < 0.1) {
            overall_direction = "مستقر";
        } else if (total_change > 0) {
            overall_direction = "صاعد نحو الألم";
        } else {
            overall_direction = "هابط نحو العدم";
        }
        
        return {
            overall_direction: overall_direction,
            total_change: total_change,
            average_oscillation: average_oscillation,
            stability_score: 1 - average_oscillation,
            pattern_count: evolution_data.reduce((sum, item) => sum + item.patterns_detected.length, 0)
        };
    }

    // Helper Methods
    hashSeed(seed) {
        return crypto.createHash('md5').update(seed.toString()).digest('hex');
    }

    hashExperience(experience) {
        return crypto.createHash('md5').update(JSON.stringify(experience)).digest('hex');
    }

    calculateContextInfluence(context) {
        return Object.keys(context).length * 0.1; // تأثير بسيط للسياق
    }

    calculateSignatureComplexity(components) {
        return Math.min(1.0, Object.keys(components).length / 10);
    }

    containsFibonacci(decimal_str) {
        const fib_patterns = ["112", "123", "235", "358", "581"];
        return fib_patterns.some(pattern => decimal_str.includes(pattern));
    }

    findRepetitivePatterns(decimal_str) {
        const patterns = [];
        for (let i = 0; i < decimal_str.length - 2; i++) {
            const char = decimal_str[i];
            let count = 1;
            for (let j = i + 1; j < decimal_str.length && decimal_str[j] === char; j++) {
                count++;
            }
            if (count >= 3) {
                patterns.push({ digit: char, count: count, position: i });
            }
        }
        return patterns;
    }

    /**
     * تقرير شامل عن حالة المختبر
     */
    generateLabReport() {
        console.log("\n📋 تقرير مختبر الهزاز العاطفي");
        console.log("=" * 50);
        console.log(`🔧 حالة الهزازات:`);
        console.log(`   الوجود: ${this.oscillators.existence}`);
        console.log(`   الديناميكي: ${this.oscillators.dynamic.toFixed(6)}`);
        console.log(`   القاضي: ${this.oscillators.judge.toFixed(6)}`);
        
        console.log(`\n🔐 إحصائيات التشفير:`);
        console.log(`   عدد الـ Probably IDs: ${this.emotionalCrypto.probably_ids.size}`);
        console.log(`   تاريخ التشفير: ${this.emotionalCrypto.encryption_history.length} حدث`);
        
        const spectrum_analysis = this.analyzeSpectrumPosition(this.oscillators.dynamic);
        console.log(`\n🎯 تحليل الطيف الحالي:`);
        console.log(`   الموقع: ${spectrum_analysis.position.toFixed(6)}`);
        console.log(`   الفئة: ${spectrum_analysis.category}`);
        console.log(`   التفسير: ${spectrum_analysis.interpretation}`);
        
        return {
            oscillator_state: { ...this.oscillators },
            encryption_stats: {
                total_ids: this.emotionalCrypto.probably_ids.size,
                encryption_events: this.emotionalCrypto.encryption_history.length
            },
            spectrum_analysis: spectrum_analysis
        };
    }
}

// ===== تجارب للاختبار =====

async function runExperiments() {
    const lab = new EmotionalOscillatorLab();
    
    console.log("\n🧪 بدء التجارب العملية...\n");
    
    // تجربة 1: تحليل نصوص متنوعة
    console.log("=== التجربة 1: تحليل النصوص وطيف المشاعر ===");
    const test_texts = [
        "أنا سعيد جداً اليوم! الطقس رائع والشمس مشرقة",
        "أشعر بالحزن والوحدة في هذا اليوم الممطر",
        "لا أدري ماذا أشعر... كل شيء عادي",
        "أنا غاضب جداً! هذا غير عادل!",
        "السكينة والهدوء يملآن قلبي في هذه اللحظة"
    ];
    
    const text_analyses = test_texts.map(text => lab.analyzeTextToSpectrum(text));
    
    // تجربة 2: التشفير العاطفي
    console.log("\n=== التجربة 2: التشفير العاطفي ===");
    text_analyses.forEach((analysis, index) => {
        const encrypted = lab.encryptEmotionalExperience({
            type: 'text_analysis',
            content: analysis.original_text,
            analysis: analysis
        }, { experiment_id: index + 1 });
    });
    
    // تجربة 3: البحث عن الرنين
    console.log("\n=== التجربة 3: البحث عن الرنين العاطفي ===");
    const current_judge = lab.oscillators.judge;
    const resonant_memories = lab.findEmotionalResonance(current_judge, 0.005);
    
    // تجربة 4: تأثير المزاج على الذاكرة
    console.log("\n=== التجربة 4: تأثير المزاج على استدعاء الذاكرة ===");
    const mood_experiment = lab.simulateMoodInfluencedRecall(
        "أشعر بالحماس والطاقة اليوم",
        "أتذكر يوماً جميلاً من الطفولة"
    );
    
    // تجربة 5: تطور الهزاز
    console.log("\n=== التجربة 5: تطور الهزاز عبر سلسلة نصوص ===");
    const evolution_texts = [
        "صباح الخير يا عالم",
        "القهوة لذيذة هذا الصباح",
        "عندي اجتماع مهم اليوم",
        "الاجتماع لم يسر كما توقعت",
        "أحتاج إلى راحة قليلة",
        "كل شيء سيكون بخير في النهاية"
    ];
    
    const evolution_result = lab.runOscillatorEvolutionExperiment(evolution_texts);
    
    // تقرير نهائي
    console.log("\n=== التقرير النهائي ===");
    const final_report = lab.generateLabReport();
    
    return {
        text_analyses: text_analyses,
        resonant_memories: resonant_memories,
        mood_experiment: mood_experiment,
        evolution_result: evolution_result,
        final_report: final_report
    };
}

// تشغيل التجارب إذا تم استدعاء الملف مباشرة
if (require.main === module) {
    // npm install sentiment first
    try {
        runExperiments().then(results => {
            console.log("\n✅ انتهت جميع التجارب بنجاح!");
            console.log("\n📊 ملخص النتائج:");
            console.log(`- تم تحليل ${results.text_analyses.length} نصوص`);
            console.log(`- تم إنشاء ${results.final_report.encryption_stats.total_ids} بصمة عاطفية`);
            console.log(`- وُجد ${results.resonant_memories.length} ذكريات متناغمة`);
            console.log(`- تطور الهزاز عبر ${results.evolution_result.evolution_data.length} خطوات`);
        });
    } catch (error) {
        console.error("❌ خطأ في التجارب:", error.message);
        console.log("\n💡 تأكد من تثبيت المكتبات المطلوبة:");
        console.log("npm install sentiment");
    }
}

module.exports = EmotionalOscillatorLab;