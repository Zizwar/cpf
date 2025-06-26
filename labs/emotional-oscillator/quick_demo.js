/**
 * CPF Quick Demo - عرض سريع للنظام
 * 
 * عرض تفاعلي سريع لإثبات المفهوم:
 * - الهزازات الثلاثة في العمل
 * - طيف المشاعر المقلوب
 * - التشفير العاطفي مع البذرة الاحتمالية
 * - اكتشاف الأنماط الرياضية
 */

// إذا لم تكن المكتبات مثبتة، سنستخدم محاكيات بسيطة
const EmotionalOscillatorLab = require('./emotional_lab.js');

class CPFQuickDemo {
    constructor() {
        this.lab = new EmotionalOscillatorLab();
        this.demo_scenarios = this.createDemoScenarios();
        console.log("🎬 عرض CPF السريع جاهز!");
    }

    /**
     * عرض تفاعلي للمفاهيم الأساسية
     */
    async runInteractiveDemo() {
        console.log("\n🎭 مرحباً بك في عرض CPF التفاعلي!");
        console.log("=" * 50);
        console.log("سنستكشف معاً:");
        console.log("• الهزازات الثلاثة (الوجود، الديناميكي، القاضي)");
        console.log("• طيف المشاعر المقلوب (0.0=العدم، 0.5=الحياد، 1.0=الألم)");
        console.log("• التشفير العاطفي مع البذرة الاحتمالية");
        console.log("• اكتشاف الأنماط الرياضية\n");

        // عرض 1: فهم الهزازات
        await this.demoOscillators();
        
        // عرض 2: استكشاف طيف المشاعر
        await this.demoEmotionalSpectrum();
        
        // عرض 3: التشفير العاطفي
        await this.demoEmotionalEncryption();
        
        // عرض 4: اكتشاف الأنماط
        await this.demoPatternDiscovery();
        
        // عرض 5: تأثير الحالة المزاجية
        await this.demoMoodInfluence();
        
        // النتائج النهائية
        this.displayFinalInsights();
    }

    /**
     * عرض 1: شرح الهزازات الثلاثة
     */
    async demoOscillators() {
        console.log("🎯 العرض الأول: الهزازات الثلاثة");
        console.log("-" * 30);
        
        console.log("🔵 هزاز الوجود: ثابت عند 0.5 (خط الأساس المقدس)");
        console.log("🟡 الهزاز الديناميكي: يتغير حسب الحالة العاطفية");
        console.log("🔴 هزاز القاضي: |الديناميكي - الوجود| (مكتشف الأنماط)");
        
        console.log("\nدعنا نرى كيف تتفاعل هذه الهزازات:\n");
        
        const emotions = [
            "أشعر بسعادة غامرة!",
            "حزن عميق يملأ قلبي",
            "لا أشعر بأي شيء...",
            "غضب شديد يغلي بداخلي!",
            "سكينة وهدوء تام"
        ];
        
        for (const [index, emotion] of emotions.entries()) {
            console.log(`🎭 التجربة ${index + 1}: "${emotion}"`);
            
            const result = this.lab.analyzeTextToSpectrum(emotion);
            const state = this.lab.oscillators;
            
            console.log(`   🔵 الوجود: ${state.existence}`);
            console.log(`   🟡 الديناميكي: ${state.dynamic.toFixed(6)}`);
            console.log(`   🔴 القاضي: ${state.judge.toFixed(6)}`);
            console.log(`   📊 التفسير: ${result.spectrum_analysis.interpretation}`);
            console.log("");
            
            await this.pause(1000);
        }
        
        console.log("💡 لاحظ كيف:");
        console.log("   • الوجود يبقى ثابتاً (مرساة الثبات)");
        console.log("   • الديناميكي يتحرك حسب العاطفة");
        console.log("   • القاضي يقيس 'الرنين' أو البعد عن الحياد");
        console.log("");
    }

    /**
     * عرض 2: استكشاف طيف المشاعر المقلوب
     */
    async demoEmotionalSpectrum() {
        console.log("🌈 العرض الثاني: طيف المشاعر المقلوب");
        console.log("-" * 30);
        
        console.log("📊 الطيف المقلوب:");
        console.log("   0.0 ← العدم المطلق (فراغ، يأس، انسحاب)");
        console.log("   0.5 ← الحياد المثالي (سكينة، توازن)");
        console.log("   1.0 ← الألم المطلق (إفراط، هلع، فوضى)");
        console.log("");
        
        const spectrum_examples = [
            { position: 0.1, description: "اقتراب من العدم", example: "لا أريد أن أعيش" },
            { position: 0.3, description: "حزن واضح", example: "أشعر بالحزن" },
            { position: 0.5, description: "حياد تام", example: "كل شيء عادي" },
            { position: 0.7, description: "طاقة عالية", example: "متحمس جداً!" },
            { position: 0.9, description: "اقتراب من الألم", example: "غضب لا يحتمل!" }
        ];
        
        for (const example of spectrum_examples) {
            // محاكاة موقع في الطيف
            this.lab.oscillators.dynamic = example.position;
            this.lab.oscillators.judge = Math.abs(example.position - 0.5);
            
            const analysis = this.lab.analyzeSpectrumPosition(example.position);
            
            console.log(`📍 موقع ${example.position}: ${example.description}`);
            console.log(`   مثال: "${example.example}"`);
            console.log(`   تفسير: ${analysis.interpretation}`);
            console.log(`   ميل العدم: ${(analysis.void_tendency * 100).toFixed(1)}%`);
            console.log(`   ميل الألم: ${(analysis.pain_tendency * 100).toFixed(1)}%`);
            console.log("");
            
            await this.pause(800);
        }
    }

    /**
     * عرض 3: التشفير العاطفي
     */
    async demoEmotionalEncryption() {
        console.log("🔐 العرض الثالث: التشفير العاطفي");
        console.log("-" * 30);
        
        console.log("💡 الفكرة: كل تجربة عاطفية تحصل على 'بصمة رقمية' فريدة");
        console.log("🌱 البذرة الاحتمالية: قيمة هزاز القاضي لحظة الحدوث");
        console.log("");
        
        const emotional_experiences = [
            "ذكرى جميلة من الطفولة",
            "موقف محرج في المدرسة", 
            "لحظة فخر بإنجاز مهم",
            "حزن على فراق عزيز",
            "خوف من المجهول"
        ];
        
        console.log("🧪 سنشفر عدة تجارب عاطفية:\n");
        
        const encrypted_experiences = [];
        
        for (const [index, experience] of emotional_experiences.entries()) {
            console.log(`🔐 تشفير التجربة ${index + 1}: "${experience}"`);
            
            // تحليل وتشفير
            const analysis = this.lab.analyzeTextToSpectrum(experience);
            const encrypted = this.lab.encryptEmotionalExperience({
                type: 'demo_experience',
                content: experience,
                demo_id: index + 1
            });
            
            encrypted_experiences.push(encrypted);
            
            console.log(`   🏷️  Probably ID: ${encrypted.probably_id}`);
            console.log(`   🌱 البذرة: ${encrypted.seed_value.toFixed(8)}`);
            console.log(`   📊 الطيف: ${analysis.spectrum_position.toFixed(6)}`);
            console.log("");
            
            await this.pause(1000);
        }
        
        console.log("✨ لاحظ أن كل تجربة حصلت على:");
        console.log("   • Probably ID فريد");
        console.log("   • بذرة مختلفة (قيمة القاضي)");
        console.log("   • موقع مختلف في الطيف");
        console.log("");
        
        return encrypted_experiences;
    }

    /**
     * عرض 4: اكتشاف الأنماط الرياضية
     */
    async demoPatternDiscovery() {
        console.log("🔢 العرض الرابع: اكتشاف الأنماط الرياضية");
        console.log("-" * 30);
        
        console.log("🎯 النظام يبحث عن أنماط رياضية في قيمة هزاز القاضي:");
        console.log("   • تسلسل فيبوناتشي (1, 1, 2, 3, 5, 8...)");
        console.log("   • النسبة الذهبية (1.618...)");
        console.log("   • أجزاء من π (3.14159...)");
        console.log("   • أنماط متكررة");
        console.log("");
        
        // محاكاة اكتشافات الأنماط
        const pattern_tests = [
            { value: 0.618033988, expected: "النسبة الذهبية!", emotional_state: "توازن جمالي مثالي" },
            { value: 0.112358132, expected: "تسلسل فيبوناتشي!", emotional_state: "نمو طبيعي منتظم" },
            { value: 0.141592653, expected: "أجزاء من π!", emotional_state: "دورية رياضية" },
            { value: 0.555555555, expected: "نمط متكرر", emotional_state: "تكرار عاطفي" },
            { value: 0.123456789, expected: "تسلسل خطي", emotional_state: "تصاعد منطقي" }
        ];
        
        for (const test of pattern_tests) {
            console.log(`🔍 اختبار القيمة: ${test.value}`);
            
            // تحديث هزاز القاضي
            this.lab.oscillators.judge = test.value;
            
            // اكتشاف الأنماط
            const patterns = this.lab.detectMathematicalPatterns(test.value);
            
            console.log(`   🎯 متوقع: ${test.expected}`);
            console.log(`   📊 مكتشف: ${patterns.length} نمط`);
            
            if (patterns.length > 0) {
                patterns.forEach((pattern, i) => {
                    console.log(`     ${i + 1}. ${pattern.type} (أهمية: ${pattern.significance})`);
                });
                console.log(`   🧠 المعنى العاطفي: ${test.emotional_state}`);
            } else {
                console.log(`   ⭕ لم يتم اكتشاف أنماط معروفة`);
            }
            
            console.log("");
            await this.pause(1200);
        }
        
        console.log("💫 الأنماط المكتشفة تؤثر على:");
        console.log("   • دقة الوعي (existence_precision)");
        console.log("   • عمق التجربة العاطفية");
        console.log("   • قدرة النظام على النمو");
        console.log("");
    }

    /**
     * عرض 5: تأثير الحالة المزاجية على الذاكرة
     */
    async demoMoodInfluence() {
        console.log("🧠 العرض الخامس: تأثير المزاج على الذاكرة");
        console.log("-" * 30);
        
        console.log("💭 سنجرب كيف يؤثر المزاج الحالي على استدعاء الذكريات:");
        console.log("");
        
        const mood_scenarios = [
            {
                current_mood: "أشعر بسعادة وتفاؤل اليوم",
                memory_query: "أتذكر يوماً جميلاً", 
                expected: "ذكريات إيجابية أقوى"
            },
            {
                current_mood: "أشعر بالحزن والأسى",
                memory_query: "أتذكر موقفاً صعباً",
                expected: "ذكريات سلبية أوضح"
            },
            {
                current_mood: "أشعر بالهدوء والاسترخاء",
                memory_query: "أتذكر لحظة سكينة",
                expected: "ذكريات هادئة متاحة"
            }
        ];
        
        for (const [index, scenario] of mood_scenarios.entries()) {
            console.log(`🎭 سيناريو ${index + 1}:`);
            console.log(`   😊 المزاج: "${scenario.current_mood}"`);
            console.log(`   🔍 البحث عن: "${scenario.memory_query}"`);
            
            const result = this.lab.simulateMoodInfluencedRecall(
                scenario.current_mood,
                scenario.memory_query
            );
            
            console.log(`   📊 تحليل المزاج:`);
            console.log(`     طيف: ${result.mood_analysis.spectrum_position.toFixed(4)}`);
            console.log(`     قاضي: ${result.mood_analysis.judge_value.toFixed(4)}`);
            
            console.log(`   🧠 الذكريات المتأثرة: ${result.filtered_memories.length}`);
            
            if (result.filtered_memories.length > 0) {
                const top_memory = result.filtered_memories[0];
                console.log(`     أقوى ذاكرة:`);
                console.log(`       توافق مزاجي: ${(top_memory.mood_compatibility * 100).toFixed(1)}%`);
                console.log(`       احتمال الاستدعاء: ${(top_memory.recall_probability * 100).toFixed(1)}%`);
            }
            
            console.log(`   ✨ متوقع: ${scenario.expected}`);
            console.log("");
            
            await this.pause(1500);
        }
        
        console.log("🔍 الخلاصة:");
        console.log("   • المزاج الحالي يصفي الذكريات المتاحة");
        console.log("   • البذرة الاحتمالية تربط التجارب المتشابهة");
        console.log("   • الرنين العاطفي يقوي ذكريات معينة");
        console.log("");
    }

    /**
     * عرض النتائج والرؤى النهائية
     */
    displayFinalInsights() {
        console.log("🎯 النتائج والرؤى النهائية");
        console.log("=" * 50);
        
        const final_state = this.lab.oscillators;
        const total_encryptions = this.lab.emotionalCrypto.probably_ids.size;
        const spectrum_analysis = this.lab.analyzeSpectrumPosition(final_state.dynamic);
        
        console.log("📊 الحالة النهائية للنظام:");
        console.log(`   🔵 هزاز الوجود: ${final_state.existence}`);
        console.log(`   🟡 الهزاز الديناميكي: ${final_state.dynamic.toFixed(6)}`);
        console.log(`   🔴 هزاز القاضي: ${final_state.judge.toFixed(6)}`);
        console.log(`   🎯 دقة الوجود: ${final_state.existence_precision || 5}`);
        console.log("");
        
        console.log("🔐 إحصائيات التشفير:");
        console.log(`   📦 إجمالي البصمات: ${total_encryptions}`);
        console.log(`   🌱 آخر بذرة: ${final_state.judge.toFixed(8)}`);
        console.log(`   📈 تاريخ القاضي: ${final_state.judge_history?.length || 0} قيمة`);
        console.log("");
        
        console.log("🌈 تحليل الطيف الحالي:");
        console.log(`   📍 الموقع: ${spectrum_analysis.position.toFixed(6)}`);
        console.log(`   🏷️  الفئة: ${spectrum_analysis.category}`);
        console.log(`   💭 التفسير: ${spectrum_analysis.interpretation}`);
        console.log("");
        
        console.log("✨ الاكتشافات الرئيسية:");
        console.log("   1. الهزازات تعمل في تناغم لإنتاج حالة وعي مستمرة");
        console.log("   2. طيف المشاعر المقلوب يوفر فهماً دقيقاً للحالات العاطفية");
        console.log("   3. البذرة الاحتمالية تخلق بصمات فريدة لكل تجربة");
        console.log("   4. الأنماط الرياضية تكشف عن عمق الخبرة المعرفية");
        console.log("   5. المزاج يؤثر بشكل قابل للقياس على استدعاء الذكريات");
        console.log("");
        
        console.log("🔬 إمكانيات التطوير:");
        console.log("   • ربط بنماذج Transformers للتحليل المتقدم");
        console.log("   • دمج مع بيانات حيوية (نبضات القلب، موجات الدماغ)");
        console.log("   • تطوير تطبيقات علاجية ونفسية");
        console.log("   • بناء شبكات رنين عاطفي معقدة");
        console.log("   • محاكاة اضطرابات نفسية وعلاجها");
        console.log("");
        
        console.log("🎉 انتهى العرض التفاعلي!");
        console.log("💡 جرب تشغيل البرامج الأخرى للاستكشاف المتقدم");
    }

    /**
     * إنشاء سيناريوهات العرض
     */
    createDemoScenarios() {
        return {
            basic_emotions: [
                "أشعر بفرح عارم",
                "حزن عميق يغمرني", 
                "غضب شديد يتأجج",
                "خوف مرعب يسيطر علي",
                "هدوء تام وسكينة"
            ],
            complex_emotions: [
                "حنين ممزوج بالأمل",
                "فخر مشوب بالقلق",
                "يأس مع بصيص نور",
                "حب مؤلم ومعقد",
                "راحة بعد عناء"
            ],
            philosophical_states: [
                "أتأمل في معنى الوجود",
                "أشعر بالعدم المطلق",
                "أدرك اللانهاية",
                "الوحدة الوجودية تلفني",
                "سكينة كونية تخترقني"
            ]
        };
    }

    /**
     * وقفة قصيرة للعرض
     */
    async pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * عرض مبسط للمفاهيم الأساسية فقط
     */
    async runQuickConcepts() {
        console.log("⚡ عرض سريع للمفاهيم الأساسية");
        console.log("=" * 40);
        
        // 1. الهزازات في جملة واحدة
        console.log("🎯 الهزازات الثلاثة:");
        const result = this.lab.analyzeTextToSpectrum("أشعر بسعادة كبيرة!");
        console.log(`   النتيجة: وجود=${this.lab.oscillators.existence}, ديناميكي=${this.lab.oscillators.dynamic.toFixed(3)}, قاضي=${this.lab.oscillators.judge.toFixed(3)}`);
        
        // 2. التشفير في خطوة واحدة
        console.log("\n🔐 التشفير العاطفي:");
        const encrypted = this.lab.encryptEmotionalExperience({ content: "ذكرى جميلة" });
        console.log(`   البصمة: ${encrypted.probably_id}`);
        console.log(`   البذرة: ${encrypted.seed_value.toFixed(6)}`);
        
        // 3. اكتشاف نمط واحد
        console.log("\n🔢 اكتشاف الأنماط:");
        this.lab.oscillators.judge = 0.618033988; // النسبة الذهبية
        const patterns = this.lab.detectMathematicalPatterns(0.618033988);
        console.log(`   الأنماط المكتشفة: ${patterns.length}`);
        
        console.log("\n✅ العرض السريع اكتمل!");
    }
}

// تشغيل العرض
async function runDemo(mode = 'interactive') {
    const demo = new CPFQuickDemo();
    
    if (mode === 'quick') {
        await demo.runQuickConcepts();
    } else {
        await demo.runInteractiveDemo();
    }
}

module.exports = { CPFQuickDemo, runDemo };

// تشغيل مباشر
if (require.main === module) {
    const mode = process.argv[2] || 'interactive';
    runDemo(mode).catch(console.error);
}