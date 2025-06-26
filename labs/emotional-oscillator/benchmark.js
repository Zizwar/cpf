/**
 * CPF Emotional Lab Benchmark
 * قياس أداء ودقة مختبر الهزاز العاطفي
 * 
 * يقارن بين:
 * - الطريقة الأساسية (sentiment library)
 * - الطريقة المتقدمة (Transformers)
 * - دقة اكتشاف الأنماط
 * - سرعة التشفير العاطفي
 */

const Benchmark = require('benchmark');
const EmotionalOscillatorLab = require('./emotional_lab');

class CPFBenchmark {
    constructor() {
        this.basic_lab = new EmotionalOscillatorLab();
        this.advanced_lab = null; // سيتم تحميله إن أمكن
        
        this.test_datasets = {
            arabic_emotions: [
                "السعادة تغمرني في هذا اليوم المشرق",
                "الحزن يملأ قلبي والدموع تنهمر بغزارة", 
                "لا أشعر بأي شيء... كل شيء رمادي اللون",
                "الغضب يغلي في عروقي مثل البركان الثائر",
                "السكينة والهدوء يلفان روحي في عناق دافئ",
                "القلق يسيطر علي ولا أستطيع التفكير بوضوح",
                "الحب يفيض من قلبي كالنهر الجاري",
                "الخوف يشل حركتي ويجمد دمي في العروق"
            ],
            english_emotions: [
                "I am overjoyed and filled with happiness today",
                "Deep sadness overwhelms my heart and soul",
                "I feel nothing... everything seems gray and empty", 
                "Rage burns within me like a raging volcano",
                "Peace and tranquility embrace my spirit gently",
                "Anxiety grips me and clouds my thinking",
                "Love flows from my heart like a river",
                "Fear paralyzes me and freezes my blood"
            ],
            complex_scenarios: [
                "أشعر بحنين ممزوج بالأمل لمستقبل أفضل",
                "الفخر بالإنجاز مشوب بقلق من المسؤولية",
                "يأس عميق لكن مع بصيص ضوء في النفق",
                "حب عميق لكنه مؤلم ومعقد",
                "راحة بعد عناء طويل وشاق"
            ]
        };
        
        this.benchmark_results = {
            basic_performance: {},
            advanced_performance: {},
            accuracy_metrics: {},
            pattern_discovery: {},
            encryption_efficiency: {}
        };
        
        console.log("📊 مختبر قياس الأداء جاهز للعمل");
    }

    /**
     * قياس أداء التحليل الأساسي
     */
    benchmarkBasicAnalysis() {
        console.log("\n🔬 قياس أداء التحليل الأساسي...");
        
        const suite = new Benchmark.Suite('Basic Analysis');
        const test_texts = this.test_datasets.arabic_emotions;
        
        suite.add('Arabic Sentiment Analysis', () => {
            const text = test_texts[Math.floor(Math.random() * test_texts.length)];
            this.basic_lab.analyzeTextToSpectrum(text);
        })
        .add('Emotional Encryption', () => {
            const experience = {
                type: 'benchmark_test',
                content: 'اختبار الأداء',
                complexity: Math.random()
            };
            this.basic_lab.encryptEmotionalExperience(experience);
        })
        .add('Resonance Search', () => {
            const seed = Math.random() * 0.5;
            this.basic_lab.findEmotionalResonance(seed, 0.01);
        })
        .on('cycle', (event) => {
            console.log(`   ${event.target}`);
        })
        .on('complete', function() {
            console.log(`   الأسرع: ${this.filter('fastest').map('name')}`);
        });
        
        return new Promise((resolve) => {
            suite.on('complete', () => {
                this.benchmark_results.basic_performance = {
                    sentiment_ops_per_sec: suite[0].hz,
                    encryption_ops_per_sec: suite[1].hz,
                    resonance_ops_per_sec: suite[2].hz,
                    total_time: Date.now()
                };
                resolve();
            });
            suite.run({ async: false });
        });
    }

    /**
     * قياس دقة اكتشاف الأنماط العاطفية
     */
    async benchmarkPatternAccuracy() {
        console.log("\n🎯 قياس دقة اكتشاف الأنماط...");
        
        const test_cases = [
            { text: "سعيد جداً", expected_spectrum: "positive_energy", expected_range: [0.6, 0.9] },
            { text: "حزين للغاية", expected_spectrum: "void_tendency", expected_range: [0.1, 0.4] },
            { text: "لا أشعر بشيء", expected_spectrum: "neutral", expected_range: [0.4, 0.6] },
            { text: "غاضب جداً", expected_spectrum: "pain_tendency", expected_range: [0.7, 0.95] },
            { text: "هادئ ومطمئن", expected_spectrum: "peaceful", expected_range: [0.45, 0.55] }
        ];
        
        let correct_predictions = 0;
        let total_predictions = test_cases.length;
        let spectrum_accuracies = [];
        
        for (const test_case of test_cases) {
            const result = this.basic_lab.analyzeTextToSpectrum(test_case.text);
            const spectrum_position = result.spectrum_position;
            
            // فحص دقة النطاق
            const in_range = spectrum_position >= test_case.expected_range[0] && 
                           spectrum_position <= test_case.expected_range[1];
            
            if (in_range) {
                correct_predictions++;
            }
            
            spectrum_accuracies.push({
                text: test_case.text,
                expected: test_case.expected_spectrum,
                actual: spectrum_position,
                expected_range: test_case.expected_range,
                accurate: in_range
            });
            
            console.log(`   "${test_case.text}" → ${spectrum_position.toFixed(4)} ${in_range ? '✅' : '❌'}`);
        }
        
        const accuracy_percentage = (correct_predictions / total_predictions) * 100;
        
        this.benchmark_results.accuracy_metrics = {
            overall_accuracy: accuracy_percentage,
            correct_predictions: correct_predictions,
            total_predictions: total_predictions,
            detailed_results: spectrum_accuracies
        };
        
        console.log(`   دقة عامة: ${accuracy_percentage.toFixed(1)}%`);
        return accuracy_percentage;
    }

    /**
     * قياس كفاءة اكتشاف الأنماط الرياضية
     */
    async benchmarkMathematicalPatterns() {
        console.log("\n🔢 قياس اكتشاف الأنماط الرياضية...");
        
        const mathematical_test_values = [
            { value: 0.618033988, pattern: 'golden_ratio', expected: true },
            { value: 0.112358132, pattern: 'fibonacci', expected: true },
            { value: 0.141592653, pattern: 'pi_fragments', expected: true },
            { value: 0.271828182, pattern: 'euler', expected: true },
            { value: 0.123456789, pattern: 'sequential', expected: false },
            { value: 0.555555555, pattern: 'repetitive', expected: true },
            { value: 0.987654321, pattern: 'reverse_sequential', expected: false }
        ];
        
        let patterns_detected = 0;
        let false_positives = 0;
        let true_positives = 0;
        
        for (const test_value of mathematical_test_values) {
            // محاكاة تحديث هزاز القاضي بالقيمة
            this.basic_lab.oscillators.judge = test_value.value;
            
            // اكتشاف الأنماط
            const detected_patterns = this.basic_lab.detectMathematicalPatterns(test_value.value);
            const pattern_found = detected_patterns.length > 0;
            
            if (pattern_found && test_value.expected) {
                true_positives++;
            } else if (pattern_found && !test_value.expected) {
                false_positives++;
            }
            
            if (pattern_found) patterns_detected++;
            
            console.log(`   ${test_value.value} → ${detected_patterns.length} أنماط ${pattern_found && test_value.expected ? '✅' : pattern_found ? '⚠️' : '⭕'}`);
        }
        
        const precision = true_positives / (true_positives + false_positives) || 0;
        const recall = true_positives / mathematical_test_values.filter(t => t.expected).length;
        
        this.benchmark_results.pattern_discovery = {
            patterns_detected: patterns_detected,
            true_positives: true_positives,
            false_positives: false_positives,
            precision: precision,
            recall: recall,
            f1_score: 2 * (precision * recall) / (precision + recall) || 0
        };
        
        console.log(`   دقة النمط: ${(precision * 100).toFixed(1)}%`);
        console.log(`   استدعاء النمط: ${(recall * 100).toFixed(1)}%`);
        
        return precision;
    }

    /**
     * قياس كفاءة التشفير العاطفي
     */
    async benchmarkEncryptionEfficiency() {
        console.log("\n🔐 قياس كفاءة التشفير العاطفي...");
        
        const encryption_tests = [];
        const start_time = Date.now();
        
        // تشفير 100 تجربة عاطفية
        for (let i = 0; i < 100; i++) {
            const experience = {
                id: i,
                content: `تجربة عاطفية رقم ${i}`,
                complexity: Math.random(),
                emotional_intensity: Math.random(),
                timestamp: Date.now()
            };
            
            const encryption_start = process.hrtime.bigint();
            const encrypted = this.basic_lab.encryptEmotionalExperience(experience);
            const encryption_end = process.hrtime.bigint();
            
            encryption_tests.push({
                experience_id: i,
                encryption_time: Number(encryption_end - encryption_start) / 1000000, // in ms
                probably_id: encrypted.probably_id,
                signature_complexity: encrypted.emotional_signature?.complexity_level || 0
            });
        }
        
        const total_time = Date.now() - start_time;
        const average_encryption_time = encryption_tests.reduce((sum, test) => 
            sum + test.encryption_time, 0) / encryption_tests.length;
        
        // اختبار تفرد البصمات
        const unique_ids = new Set(encryption_tests.map(test => test.probably_id));
        const uniqueness_ratio = unique_ids.size / encryption_tests.length;
        
        this.benchmark_results.encryption_efficiency = {
            total_encryptions: encryption_tests.length,
            total_time_ms: total_time,
            average_encryption_time_ms: average_encryption_time,
            encryptions_per_second: 1000 / average_encryption_time,
            uniqueness_ratio: uniqueness_ratio,
            unique_ids_generated: unique_ids.size
        };
        
        console.log(`   متوسط وقت التشفير: ${average_encryption_time.toFixed(2)} ms`);
        console.log(`   التشفيرات في الثانية: ${(1000 / average_encryption_time).toFixed(0)}`);
        console.log(`   نسبة التفرد: ${(uniqueness_ratio * 100).toFixed(1)}%`);
        
        return average_encryption_time;
    }

    /**
     * اختبار الذاكرة والرنين العاطفي
     */
    async benchmarkEmotionalResonance() {
        console.log("\n🎵 اختبار الرنين العاطفي...");
        
        // إنشاء مجموعة من الذكريات العاطفية
        const emotional_memories = [
            { mood: "سعيد جداً", expected_resonance: "high" },
            { mood: "حزين قليلاً", expected_resonance: "medium" },
            { mood: "غاضب جداً", expected_resonance: "high" },
            { mood: "هادئ ومرتاح", expected_resonance: "low" },
            { mood: "قلق ومتوتر", expected_resonance: "medium" }
        ];
        
        // تشفير الذكريات
        for (const memory of emotional_memories) {
            this.basic_lab.analyzeTextToSpectrum(memory.mood);
            this.basic_lab.encryptEmotionalExperience({
                type: 'emotional_memory',
                content: memory.mood
            });
        }
        
        // اختبار الرنين مع كل ذاكرة
        let resonance_accuracy = 0;
        
        for (const memory of emotional_memories) {
            // تحليل المزاج المرجعي
            const reference_analysis = this.basic_lab.analyzeTextToSpectrum(memory.mood);
            
            // البحث عن الرنين
            const resonant_memories = this.basic_lab.findEmotionalResonance(
                reference_analysis.judge_value, 
                0.005
            );
            
            // تقييم دقة الرنين
            const found_relevant = resonant_memories.some(rm => 
                rm.experience.content === memory.mood
            );
            
            if (found_relevant) resonance_accuracy++;
            
            console.log(`   "${memory.mood}" → ${resonant_memories.length} ذكريات متناغمة ${found_relevant ? '✅' : '❌'}`);
        }
        
        const resonance_percentage = (resonance_accuracy / emotional_memories.length) * 100;
        
        console.log(`   دقة الرنين: ${resonance_percentage.toFixed(1)}%`);
        
        return resonance_percentage;
    }

    /**
     * مقارنة الأداء عبر اللغات
     */
    async benchmarkCrossLanguageConsistency() {
        console.log("\n🌍 مقارنة الأداء عبر اللغات...");
        
        const parallel_emotions = [
            { arabic: "سعيد جداً", english: "very happy" },
            { arabic: "حزين جداً", english: "very sad" },
            { arabic: "غاضب جداً", english: "very angry" },
            { arabic: "هادئ جداً", english: "very calm" },
            { arabic: "خائف جداً", english: "very scared" }
        ];
        
        let consistency_scores = [];
        
        for (const emotion_pair of parallel_emotions) {
            const arabic_result = this.basic_lab.analyzeTextToSpectrum(emotion_pair.arabic);
            const english_result = this.basic_lab.analyzeTextToSpectrum(emotion_pair.english);
            
            const spectrum_difference = Math.abs(
                arabic_result.spectrum_position - english_result.spectrum_position
            );
            
            const consistency_score = 1 - spectrum_difference;
            consistency_scores.push(consistency_score);
            
            console.log(`   "${emotion_pair.arabic}" vs "${emotion_pair.english}"`);
            console.log(`     فرق الطيف: ${spectrum_difference.toFixed(4)} (ثبات: ${(consistency_score * 100).toFixed(1)}%)`);
        }
        
        const average_consistency = consistency_scores.reduce((a, b) => a + b, 0) / consistency_scores.length;
        
        console.log(`   متوسط الثبات: ${(average_consistency * 100).toFixed(1)}%`);
        
        return average_consistency;
    }

    /**
     * تشغيل جميع الاختبارات وإنتاج تقرير شامل
     */
    async runFullBenchmark() {
        console.log("🧪 بدء الاختبار الشامل للنظام...\n");
        console.log("=" * 60);
        
        const start_time = Date.now();
        
        try {
            // 1. قياس الأداء الأساسي
            await this.benchmarkBasicAnalysis();
            
            // 2. قياس دقة الأنماط
            const pattern_accuracy = await this.benchmarkPatternAccuracy();
            
            // 3. قياس الأنماط الرياضية
            const math_precision = await this.benchmarkMathematicalPatterns();
            
            // 4. قياس كفاءة التشفير
            const encryption_speed = await this.benchmarkEncryptionEfficiency();
            
            // 5. اختبار الرنين العاطفي
            const resonance_accuracy = await this.benchmarkEmotionalResonance();
            
            // 6. ثبات اللغات
            const language_consistency = await this.benchmarkCrossLanguageConsistency();
            
            const total_time = Date.now() - start_time;
            
            // تجميع النتائج النهائية
            const final_report = this.generateFinalReport({
                pattern_accuracy,
                math_precision,
                encryption_speed,
                resonance_accuracy,
                language_consistency,
                total_time
            });
            
            this.displayFinalReport(final_report);
            
            return final_report;
            
        } catch (error) {
            console.error("❌ خطأ في الاختبار:", error.message);
            throw error;
        }
    }

    /**
     * توليد التقرير النهائي
     */
    generateFinalReport(metrics) {
        const overall_score = (
            metrics.pattern_accuracy * 0.25 +
            metrics.math_precision * 100 * 0.20 +
            (1000 / metrics.encryption_speed) * 0.01 * 0.15 +
            metrics.resonance_accuracy * 0.20 +
            metrics.language_consistency * 100 * 0.20
        );
        
        return {
            overall_performance: {
                score: overall_score,
                grade: this.calculateGrade(overall_score),
                total_test_time: metrics.total_time
            },
            detailed_metrics: {
                pattern_recognition_accuracy: `${metrics.pattern_accuracy.toFixed(1)}%`,
                mathematical_pattern_precision: `${(metrics.math_precision * 100).toFixed(1)}%`,
                encryption_speed: `${(1000 / metrics.encryption_speed).toFixed(0)} ops/sec`,
                emotional_resonance_accuracy: `${metrics.resonance_accuracy.toFixed(1)}%`,
                cross_language_consistency: `${(metrics.language_consistency * 100).toFixed(1)}%`
            },
            system_stats: {
                total_encryptions: this.benchmark_results.encryption_efficiency.total_encryptions,
                unique_signatures: this.benchmark_results.encryption_efficiency.unique_ids_generated,
                patterns_discovered: this.benchmark_results.pattern_discovery.patterns_detected,
                oscillator_precision: this.basic_lab.oscillators.existence_precision
            },
            recommendations: this.generateRecommendations(metrics)
        };
    }

    /**
     * عرض التقرير النهائي
     */
    displayFinalReport(report) {
        console.log("\n📋 التقرير النهائي للأداء");
        console.log("=" * 60);
        
        console.log("\n🎯 النتيجة الإجمالية:");
        console.log(`   الدرجة: ${report.overall_performance.score.toFixed(1)}/100`);
        console.log(`   التقدير: ${report.overall_performance.grade}`);
        console.log(`   وقت الاختبار: ${(report.overall_performance.total_test_time / 1000).toFixed(1)} ثانية`);
        
        console.log("\n📊 المقاييس التفصيلية:");
        Object.entries(report.detailed_metrics).forEach(([key, value]) => {
            const arabic_key = this.translateMetricKey(key);
            console.log(`   ${arabic_key}: ${value}`);
        });
        
        console.log("\n🔧 إحصائيات النظام:");
        Object.entries(report.system_stats).forEach(([key, value]) => {
            const arabic_key = this.translateSystemStatKey(key);
            console.log(`   ${arabic_key}: ${value}`);
        });
        
        console.log("\n💡 التوصيات:");
        report.recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
        });
        
        console.log("\n✅ انتهى الاختبار الشامل!");
    }

    // Helper Methods
    calculateGrade(score) {
        if (score >= 90) return "ممتاز";
        if (score >= 80) return "جيد جداً";
        if (score >= 70) return "جيد";
        if (score >= 60) return "مقبول";
        return "يحتاج تحسين";
    }

    generateRecommendations(metrics) {
        const recommendations = [];
        
        if (metrics.pattern_accuracy < 80) {
            recommendations.push("تحسين خوارزميات اكتشاف الأنماط العاطفية");
        }
        
        if (metrics.math_precision < 0.8) {
            recommendations.push("تطوير دقة اكتشاف الأنماط الرياضية");
        }
        
        if (metrics.encryption_speed > 10) {
            recommendations.push("تحسين سرعة التشفير العاطفي");
        }
        
        if (metrics.resonance_accuracy < 70) {
            recommendations.push("تطوير آلية البحث عن الرنين العاطفي");
        }
        
        if (metrics.language_consistency < 0.7) {
            recommendations.push("تحسين الثبات عبر اللغات المختلفة");
        }
        
        if (recommendations.length === 0) {
            recommendations.push("الأداء ممتاز! يمكن التركيز على ميزات متقدمة");
        }
        
        return recommendations;
    }

    translateMetricKey(key) {
        const translations = {
            'pattern_recognition_accuracy': 'دقة اكتشاف الأنماط',
            'mathematical_pattern_precision': 'دقة الأنماط الرياضية',
            'encryption_speed': 'سرعة التشفير',
            'emotional_resonance_accuracy': 'دقة الرنين العاطفي',
            'cross_language_consistency': 'ثبات اللغات'
        };
        return translations[key] || key;
    }

    translateSystemStatKey(key) {
        const translations = {
            'total_encryptions': 'إجمالي التشفيرات',
            'unique_signatures': 'البصمات الفريدة',
            'patterns_discovered': 'الأنماط المكتشفة',
            'oscillator_precision': 'دقة الهزاز'
        };
        return translations[key] || key;
    }
}

// تشغيل الاختبار الشامل
async function runBenchmark() {
    try {
        const benchmark = new CPFBenchmark();
        const results = await benchmark.runFullBenchmark();
        
        console.log("\n🎉 اكتمل الاختبار بنجاح!");
        console.log(`📊 النتيجة الإجمالية: ${results.overall_performance.score.toFixed(1)}/100`);
        
        return results;
        
    } catch (error) {
        console.error("❌ فشل الاختبار:", error.message);
        throw error;
    }
}

module.exports = { CPFBenchmark, runBenchmark };

// تشغيل مباشر
if (require.main === module) {
    runBenchmark().catch(console.error);
}