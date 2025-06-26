#!/usr/bin/env node
/**
 * CPF Unified Lab Runner - منصة التشغيل الموحدة
 * 
 * واجهة موحدة لتشغيل جميع تجارب مختبر الهزاز العاطفي
 * 
 * الاستخدام:
 * node run_cpf_lab.js [التجربة] [المعاملات]
 * 
 * التجارب المتاحة:
 * - demo: عرض تفاعلي شامل
 * - quick: عرض سريع للمفاهيم
 * - analyze: تحليل نص واحد
 * - benchmark: قياس الأداء الشامل
 * - advanced: تحليل متقدم مع Transformers
 * - experiment: تجربة مخصصة
 */

const fs = require('fs');
const path = require('path');

// محاولة تحميل الوحدات
let EmotionalOscillatorLab, AdvancedEmotionalLab, CPFBenchmark, CPFQuickDemo;

try {
    EmotionalOscillatorLab = require('./emotional_lab.js');
    console.log("✅ تم تحميل المختبر الأساسي");
} catch (error) {
    console.error("❌ فشل تحميل المختبر الأساسي:", error.message);
    process.exit(1);
}

try {
    const advanced = require('./advanced_transformers_lab.js');
    AdvancedEmotionalLab = advanced.AdvancedEmotionalLab;
    console.log("✅ تم تحميل المختبر المتقدم");
} catch (error) {
    console.warn("⚠️ المختبر المتقدم غير متاح:", error.message);
}

try {
    const benchmark = require('./benchmark.js');
    CPFBenchmark = benchmark.CPFBenchmark;
    console.log("✅ تم تحميل نظام القياس");
} catch (error) {
    console.warn("⚠️ نظام القياس غير متاح:", error.message);
}

try {
    const demo = require('./quick_demo.js');
    CPFQuickDemo = demo.CPFQuickDemo;
    console.log("✅ تم تحميل نظام العرض");
} catch (error) {
    console.warn("⚠️ نظام العرض غير متاح:", error.message);
}

class CPFUnifiedRunner {
    constructor() {
        this.available_experiments = {
            'demo': 'عرض تفاعلي شامل للمفاهيم',
            'quick': 'عرض سريع للمفاهيم الأساسية',
            'analyze': 'تحليل نص واحد',
            'encrypt': 'تشفير تجربة عاطفية',
            'resonance': 'البحث عن الرنين العاطفي',
            'patterns': 'اكتشاف الأنماط الرياضية',
            'mood': 'تأثير المزاج على الذاكرة',
            'evolution': 'تطور الهزاز عبر نصوص متعددة',
            'benchmark': 'قياس أداء شامل',
            'advanced': 'تحليل متقدم مع Transformers',
            'experiment': 'تجربة مخصصة حرة',
            'help': 'عرض هذه المساعدة'
        };
        
        this.basic_lab = new EmotionalOscillatorLab();
        this.advanced_lab = null;
        this.benchmark_lab = null;
        this.demo_lab = null;
        
        console.log("\n🧪 منصة CPF الموحدة جاهزة للعمل!");
    }

    /**
     * تشغيل التجربة المطلوبة
     */
    async runExperiment(experiment_name, ...args) {
        console.log(`\n🔬 تشغيل تجربة: ${experiment_name}`);
        console.log("=" * 50);
        
        switch (experiment_name.toLowerCase()) {
            case 'demo':
                return await this.runDemo('interactive');
                
            case 'quick':
                return await this.runDemo('quick');
                
            case 'analyze':
                return await this.runTextAnalysis(args[0]);
                
            case 'encrypt':
                return await this.runEmotionalEncryption(args[0]);
                
            case 'resonance':
                return await this.runResonanceSearch(parseFloat(args[0]), parseFloat(args[1]));
                
            case 'patterns':
                return await this.runPatternDiscovery(parseFloat(args[0]));
                
            case 'mood':
                return await this.runMoodInfluence(args[0], args[1]);
                
            case 'evolution':
                return await this.runEvolution(args);
                
            case 'benchmark':
                return await this.runBenchmark();
                
            case 'advanced':
                return await this.runAdvancedAnalysis(args[0]);
                
            case 'experiment':
                return await this.runCustomExperiment(args);
                
            case 'help':
                return this.showHelp();
                
            default:
                console.error(`❌ تجربة غير معروفة: ${experiment_name}`);
                this.showHelp();
                return false;
        }
    }

    /**
     * تشغيل العرض التفاعلي
     */
    async runDemo(mode = 'interactive') {
        if (!CPFQuickDemo) {
            console.error("❌ نظام العرض غير متاح");
            return false;
        }
        
        this.demo_lab = new CPFQuickDemo();
        
        if (mode === 'quick') {
            await this.demo_lab.runQuickConcepts();
        } else {
            await this.demo_lab.runInteractiveDemo();
        }
        
        return true;
    }

    /**
     * تحليل نص واحد
     */
    async runTextAnalysis(text) {
        if (!text) {
            text = "أشعر بسعادة غامرة في هذا اليوم المشرق!";
            console.log(`📝 استخدام نص افتراضي: "${text}"`);
        }
        
        console.log(`🔬 تحليل النص: "${text}"`);
        
        const result = this.basic_lab.analyzeTextToSpectrum(text);
        
        console.log("\n📊 النتائج:");
        console.log(`   🌈 موقع الطيف: ${result.spectrum_position.toFixed(6)}`);
        console.log(`   🔴 هزاز القاضي: ${result.judge_value.toFixed(6)}`);
        console.log(`   📋 الفئة: ${result.spectrum_analysis.category}`);
        console.log(`   💭 التفسير: ${result.spectrum_analysis.interpretation}`);
        console.log(`   ⬇️  ميل العدم: ${(result.spectrum_analysis.void_tendency * 100).toFixed(1)}%`);
        console.log(`   ⬆️  ميل الألم: ${(result.spectrum_analysis.pain_tendency * 100).toFixed(1)}%`);
        
        // حالة الهزازات
        console.log("\n🎛️ حالة الهزازات:");
        console.log(`   🔵 الوجود: ${this.basic_lab.oscillators.existence}`);
        console.log(`   🟡 الديناميكي: ${this.basic_lab.oscillators.dynamic.toFixed(6)}`);
        console.log(`   🔴 القاضي: ${this.basic_lab.oscillators.judge.toFixed(6)}`);
        
        return result;
    }

    /**
     * تشفير تجربة عاطفية
     */
    async runEmotionalEncryption(experience_text) {
        if (!experience_text) {
            experience_text = "ذكرى جميلة من أيام الطفولة";
            console.log(`📝 استخدام تجربة افتراضية: "${experience_text}"`);
        }
        
        console.log(`🔐 تشفير التجربة: "${experience_text}"`);
        
        // تحليل التجربة أولاً
        const analysis = this.basic_lab.analyzeTextToSpectrum(experience_text);
        
        // تشفير التجربة
        const encrypted = this.basic_lab.encryptEmotionalExperience({
            type: 'user_experience',
            content: experience_text,
            analysis: analysis
        });
        
        console.log("\n🔐 نتائج التشفير:");
        console.log(`   🏷️  Probably ID: ${encrypted.probably_id}`);
        console.log(`   🌱 البذرة الاحتمالية: ${encrypted.seed_value.toFixed(8)}`);
        console.log(`   📊 موقع الطيف: ${analysis.spectrum_position.toFixed(6)}`);
        console.log(`   🕐 وقت التشفير: ${new Date(encrypted.encryption_timestamp).toLocaleString()}`);
        
        // عرض تفاصيل التوقيع
        if (encrypted.emotional_signature) {
            console.log(`   🔢 التوقيع الرقمي: ${encrypted.emotional_signature.numeric_signature?.toFixed(8) || 'غير متاح'}`);
            console.log(`   🎯 مستوى التعقيد: ${(encrypted.emotional_signature.complexity_level * 100).toFixed(1)}%`);
        }
        
        return encrypted;
    }

    /**
     * البحث عن الرنين العاطفي
     */
    async runResonanceSearch(target_seed, tolerance = 0.001) {
        if (!target_seed) {
            target_seed = this.basic_lab.oscillators.judge;
            console.log(`🎯 استخدام البذرة الحالية: ${target_seed.toFixed(8)}`);
        }
        
        console.log(`🔍 البحث عن الرنين للبذرة: ${target_seed.toFixed(8)}`);
        console.log(`📏 عتبة التشابه: ${tolerance}`);
        
        const resonant_memories = this.basic_lab.findEmotionalResonance(target_seed, tolerance);
        
        console.log(`\n🎵 النتائج: وُجد ${resonant_memories.length} ذكريات متناغمة`);
        
        if (resonant_memories.length > 0) {
            console.log("\n📋 أقوى الذكريات المتناغمة:");
            resonant_memories.slice(0, 5).forEach((memory, index) => {
                console.log(`   ${index + 1}. ${memory.probably_id}`);
                console.log(`      🎵 قوة الرنين: ${(memory.resonance_strength * 100).toFixed(2)}%`);
                console.log(`      📊 بعد الطيف: ${memory.spectrum_distance.toFixed(6)}`);
                console.log(`      🕐 بعد زمني: ${Math.floor(memory.time_distance / 1000)} ثانية`);
                console.log("");
            });
        } else {
            console.log("⭕ لم توجد ذكريات متناغمة في هذا النطاق");
            console.log("💡 جرب زيادة عتبة التشابه أو إنشاء المزيد من الذكريات");
        }
        
        return resonant_memories;
    }

    /**
     * اكتشاف الأنماط الرياضية
     */
    async runPatternDiscovery(test_value) {
        if (!test_value) {
            test_value = this.basic_lab.oscillators.judge;
            console.log(`🎯 استخدام قيمة القاضي الحالية: ${test_value.toFixed(8)}`);
        }
        
        console.log(`🔢 اكتشاف الأنماط في القيمة: ${test_value.toFixed(8)}`);
        
        // تحديث هزاز القاضي
        this.basic_lab.oscillators.judge = test_value;
        
        const patterns = this.basic_lab.detectMathematicalPatterns(test_value);
        
        console.log(`\n📊 النتائج: اكتُشف ${patterns.length} نمط`);
        
        if (patterns.length > 0) {
            console.log("\n🎯 الأنماط المكتشفة:");
            patterns.forEach((pattern, index) => {
                console.log(`   ${index + 1}. ${pattern.type}`);
                console.log(`      ⭐ الأهمية: ${(pattern.significance * 100).toFixed(1)}%`);
                console.log(`      📝 الوصف: ${pattern.description || 'نمط رياضي مكتشف'}`);
                
                // تفسير المعنى العاطفي
                const emotional_meaning = this.interpretPatternMeaning(pattern.type);
                console.log(`      💭 المعنى العاطفي: ${emotional_meaning}`);
                console.log("");
            });
        } else {
            console.log("⭕ لم يتم اكتشاف أنماط رياضية معروفة");
            console.log("💡 جرب قيماً قريبة من النسبة الذهبية (0.618) أو فيبوناتشي");
        }
        
        return patterns;
    }

    /**
     * تأثير المزاج على استدعاء الذاكرة
     */
    async runMoodInfluence(current_mood, memory_query) {
        if (!current_mood) {
            current_mood = "أشعر بالحماس والطاقة اليوم";
            console.log(`😊 استخدام مزاج افتراضي: "${current_mood}"`);
        }
        
        if (!memory_query) {
            memory_query = "أتذكر يوماً جميلاً من الماضي";
            console.log(`🔍 استخدام استعلام افتراضي: "${memory_query}"`);
        }
        
        console.log(`🧠 محاكاة تأثير المزاج على الذاكرة`);
        console.log(`😊 المزاج الحالي: "${current_mood}"`);
        console.log(`🔍 استعلام الذاكرة: "${memory_query}"`);
        
        const result = this.basic_lab.simulateMoodInfluencedRecall(current_mood, memory_query);
        
        console.log("\n📊 تحليل المزاج:");
        console.log(`   🌈 موقع الطيف: ${result.mood_analysis.spectrum_position.toFixed(6)}`);
        console.log(`   🔴 قيمة القاضي: ${result.mood_analysis.judge_value.toFixed(6)}`);
        console.log(`   📋 التفسير: ${result.mood_analysis.spectrum_analysis.interpretation}`);
        
        console.log("\n🔐 تشفير الاستعلام:");
        console.log(`   🏷️  Probably ID: ${result.query_encryption.probably_id}`);
        console.log(`   🌱 البذرة: ${result.query_encryption.seed_value.toFixed(8)}`);
        
        console.log(`\n💭 الذكريات المتأثرة: ${result.filtered_memories.length}`);
        
        if (result.filtered_memories.length > 0) {
            console.log("\n📋 أقوى الذكريات المتأثرة:");
            result.filtered_memories.slice(0, 3).forEach((memory, index) => {
                console.log(`   ${index + 1}. ${memory.probably_id}`);
                console.log(`      🎭 توافق مزاجي: ${(memory.mood_compatibility * 100).toFixed(1)}%`);
                console.log(`      🧠 احتمال الاستدعاء: ${(memory.recall_probability * 100).toFixed(1)}%`);
                console.log(`      🎵 قوة الرنين: ${(memory.resonance_strength * 100).toFixed(1)}%`);
                console.log("");
            });
        }
        
        return result;
    }

    /**
     * تطور الهزاز عبر نصوص متعددة
     */
    async runEvolution(texts) {
        if (!texts || texts.length === 0) {
            texts = [
                "صباح الخير يا عالم",
                "القهوة لذيذة هذا الصباح",
                "عندي اجتماع مهم اليوم",
                "الاجتماع لم يسر كما توقعت",
                "أحتاج إلى راحة قليلة",
                "كل شيء سيكون بخير في النهاية"
            ];
            console.log("📝 استخدام نصوص افتراضية لمحاكاة يوم كامل");
        }
        
        console.log(`📈 تتبع تطور الهزاز عبر ${texts.length} نصوص`);
        
        const result = this.basic_lab.runOscillatorEvolutionExperiment(texts);
        
        console.log("\n📊 نتائج التطور:");
        console.log(`   📈 الاتجاه العام: ${result.trends.overall_direction}`);
        console.log(`   📏 التغيير الكلي: ${result.trends.total_change.toFixed(6)}`);
        console.log(`   🔄 متوسط التذبذب: ${result.trends.average_oscillation.toFixed(6)}`);
        console.log(`   📐 نقاط الاستقرار: ${(result.trends.stability_score * 100).toFixed(1)}%`);
        console.log(`   🔢 أنماط مكتشفة: ${result.trends.pattern_count}`);
        
        console.log("\n📋 تفاصيل الخطوات:");
        result.evolution_data.slice(0, 5).forEach((step, index) => {
            console.log(`   ${step.step}. "${step.text}"`);
            console.log(`      🟡 ديناميكي: ${step.dynamic_value.toFixed(4)}`);
            console.log(`      🔴 قاضي: ${step.judge_value.toFixed(4)}`);
            console.log(`      🔢 أنماط: ${step.patterns_detected.length}`);
            console.log("");
        });
        
        if (result.evolution_data.length > 5) {
            console.log(`   ... و ${result.evolution_data.length - 5} خطوات أخرى`);
        }
        
        return result;
    }

    /**
     * قياس الأداء الشامل
     */
    async runBenchmark() {
        if (!CPFBenchmark) {
            console.error("❌ نظام القياس غير متاح");
            console.log("💡 تأكد من وجود ملف benchmark.js");
            return false;
        }
        
        console.log("📊 بدء قياس الأداء الشامل...");
        console.log("⏳ هذا قد يستغرق دقيقة أو دقيقتين...");
        
        try {
            this.benchmark_lab = new CPFBenchmark();
            const results = await this.benchmark_lab.runFullBenchmark();
            
            console.log("\n🏆 نتائج القياس:");
            console.log(`   📊 النتيجة الإجمالية: ${results.overall_performance.score.toFixed(1)}/100`);
            console.log(`   🏅 التقدير: ${results.overall_performance.grade}`);
            console.log(`   ⏱️  وقت الاختبار: ${(results.overall_performance.total_test_time / 1000).toFixed(1)}s`);
            
            return results;
            
        } catch (error) {
            console.error("❌ خطأ في قياس الأداء:", error.message);
            return false;
        }
    }

    /**
     * التحليل المتقدم مع Transformers
     */
    async runAdvancedAnalysis(text) {
        if (!AdvancedEmotionalLab) {
            console.error("❌ المختبر المتقدم غير متاح");
            console.log("💡 ثبت المكتبات المطلوبة: npm install @xenova/transformers");
            return false;
        }
        
        if (!text) {
            text = "أشعر بمشاعر معقدة من الفرح والقلق في آن واحد";
            console.log(`📝 استخدام نص افتراضي: "${text}"`);
        }
        
        console.log(`🤖 تحليل متقدم مع Transformers: "${text}"`);
        console.log("⏳ جاري تحميل النماذج...");
        
        try {
            this.advanced_lab = new AdvancedEmotionalLab();
            await this.advanced_lab.initialize();
            
            const result = await this.advanced_lab.analyzeWithTransformers(text);
            
            console.log("\n🤖 نتائج Transformers:");
            if (result.transformers.sentiment) {
                console.log(`   😊 المشاعر: ${result.transformers.sentiment[0].label} (${(result.transformers.sentiment[0].score * 100).toFixed(1)}%)`);
            }
            if (result.transformers.emotion) {
                console.log(`   💭 العاطفة: ${result.transformers.emotion[0].label} (${(result.transformers.emotion[0].score * 100).toFixed(1)}%)`);
            }
            
            console.log("\n🧠 تحليل CPF:");
            console.log(`   🌈 طيف المشاعر: ${result.cpf_analysis.spectrum_position.toFixed(6)}`);
            console.log(`   🔢 أنماط مكتشفة: ${result.cpf_analysis.patterns.length}`);
            
            if (result.insights && result.insights.length > 0) {
                console.log("\n💡 الرؤى:");
                result.insights.forEach((insight, index) => {
                    console.log(`   ${index + 1}. ${insight.message} (${insight.urgency})`);
                });
            }
            
            return result;
            
        } catch (error) {
            console.error("❌ خطأ في التحليل المتقدم:", error.message);
            return false;
        }
    }

    /**
     * تجربة مخصصة حرة
     */
    async runCustomExperiment(args) {
        console.log("🧪 تجربة مخصصة حرة");
        console.log("💡 يمكنك هنا تجريب أي مزيج من الوظائف");
        
        if (args.length === 0) {
            console.log("\n🔬 تجربة افتراضية: مقارنة المشاعر المتضادة");
            
            const emotions = [
                "أشعر بسعادة غامرة!",
                "حزن عميق يملأ قلبي",
                "غضب شديد يغلي بداخلي!",
                "هدوء وسكينة تامة"
            ];
            
            console.log("\n📊 تحليل ومقارنة:");
            const results = [];
            
            for (const emotion of emotions) {
                const result = this.basic_lab.analyzeTextToSpectrum(emotion);
                results.push({ emotion, result });
                
                console.log(`\n"${emotion}"`);
                console.log(`   🌈 طيف: ${result.spectrum_position.toFixed(4)}`);
                console.log(`   🔴 قاضي: ${result.judge_value.toFixed(4)}`);
                console.log(`   📋 فئة: ${result.spectrum_analysis.category}`);
            }
            
            // تحليل المقارنة
            const positions = results.map(r => r.result.spectrum_position);
            const range = Math.max(...positions) - Math.min(...positions);
            const average = positions.reduce((a, b) => a + b, 0) / positions.length;
            
            console.log("\n📈 تحليل المقارنة:");
            console.log(`   📏 نطاق التغطية: ${range.toFixed(4)}`);
            console.log(`   📊 متوسط الطيف: ${average.toFixed(4)}`);
            console.log(`   🎯 توزيع المشاعر: ${range > 0.5 ? 'متنوع' : 'محدود'}`);
            
            return results;
        }
        
        // إذا أُعطيت معاملات، نفذ تجربة مخصصة
        console.log("\n🔬 تنفيذ تجربة مخصصة بالمعاملات المُعطاة:");
        args.forEach((arg, index) => {
            console.log(`   معامل ${index + 1}: ${arg}`);
        });
        
        // هنا يمكن إضافة منطق التجارب المخصصة
        return { custom: true, args: args };
    }

    /**
     * عرض المساعدة
     */
    showHelp() {
        console.log("\n📖 دليل استخدام منصة CPF الموحدة");
        console.log("=" * 60);
        
        console.log("\n🎯 الاستخدام:");
        console.log("   node run_cpf_lab.js [التجربة] [المعاملات]");
        
        console.log("\n🧪 التجارب المتاحة:");
        Object.entries(this.available_experiments).forEach(([command, description]) => {
            console.log(`   ${command.padEnd(12)} - ${description}`);
        });
        
        console.log("\n📝 أمثلة:");
        console.log('   node run_cpf_lab.js demo');
        console.log('   node run_cpf_lab.js analyze "أشعر بسعادة كبيرة"');
        console.log('   node run_cpf_lab.js encrypt "ذكرى جميلة"');
        console.log('   node run_cpf_lab.js resonance 0.618 0.001');
        console.log('   node run_cpf_lab.js patterns 0.618033988');
        console.log('   node run_cpf_lab.js mood "سعيد اليوم" "أتذكر طفولتي"');
        console.log('   node run_cpf_lab.js evolution "نص1" "نص2" "نص3"');
        console.log('   node run_cpf_lab.js benchmark');
        console.log('   node run_cpf_lab.js advanced "نص للتحليل المتقدم"');
        
        console.log("\n💡 نصائح:");
        console.log("   • استخدم demo للحصول على فهم شامل");
        console.log("   • جرب analyze مع نصوص مختلفة");
        console.log("   • استخدم benchmark لقياس الأداء");
        console.log("   • advanced يتطلب مكتبات إضافية");
        
        return true;
    }

    /**
     * تفسير معنى الأنماط الرياضية
     */
    interpretPatternMeaning(pattern_type) {
        const meanings = {
            'fibonacci_sequence': 'نمو طبيعي ومتدرج في الحالة العاطفية',
            'golden_ratio_resonance': 'توازن جمالي مثالي وتناغم عاطفي',
            'pi_resonance': 'دورية رياضية ونمط تكراري منتظم',
            'harmonic_series': 'تناغم رياضي وانسجام متعدد المستويات',
            'repetitive': 'تكرار عاطفي قد يشير لثبات أو جمود',
            'arithmetic_sequence': 'تصاعد منطقي ومنهجي في المشاعر'
        };
        
        return meanings[pattern_type] || 'نمط رياضي ذو دلالة عاطفية خاصة';
    }
}

// تشغيل المنصة الموحدة
async function main() {
    const runner = new CPFUnifiedRunner();
    
    // قراءة المعاملات من سطر الأوامر
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log("\n🎯 لم تُحدد تجربة - عرض المساعدة:");
        runner.showHelp();
        
        console.log("\n🚀 تشغيل العرض التفاعلي الافتراضي...");
        await runner.runDemo('quick');
        return;
    }
    
    const experiment = args[0];
    const experiment_args = args.slice(1);
    
    try {
        const result = await runner.runExperiment(experiment, ...experiment_args);
        
        if (result !== false) {
            console.log("\n✅ اكتملت التجربة بنجاح!");
        }
        
    } catch (error) {
        console.error("\n❌ خطأ في تشغيل التجربة:", error.message);
        console.log("\n💡 استخدم 'help' لعرض التعليمات");
    }
}

// تشغيل المنصة إذا تم استدعاؤها مباشرة
if (require.main === module) {
    main().catch(error => {
        console.error("❌ خطأ عام:", error.message);
        process.exit(1);
    });
}

module.exports = CPFUnifiedRunner;