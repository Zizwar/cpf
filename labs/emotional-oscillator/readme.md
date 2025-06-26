# 🧠 CPF Emotional Oscillator Lab
## مختبر الهزاز العاطفي - ربط الهزاز الديناميكي بالتشفير العاطفي

![CPF Version](https://img.shields.io/badge/CPF-4.0--vectorial-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

### 🎯 المشكلة | The Problem

في إطار **CPF (الإطار المعرفي الاحتمالي)**، كيف يمكن ربط **الهزاز الديناميكي** مع **التشفير العاطفي** بطريقة تجريبية قابلة للقياس؟

In the **CPF (Cognitive Probabilistic Framework)**, how can we experimentally connect the **Dynamic Oscillator** with **Emotional Cryptography** in a measurable way?

### 💡 الحل | The Solution

هذا المختبر يقدم **تجارب عملية** تجمع بين:

This lab provides **practical experiments** combining:

- **🎛️ نظام الهزازات الثلاثة** | Three Oscillator System
- **🌈 طيف المشاعر المقلوب** | Inverted Emotional Spectrum  
- **🔐 التشفير العاطفي مع البذرة الاحتمالية** | Emotional Encryption with Probabilistic Seed
- **🔢 اكتشاف الأنماط الرياضية** | Mathematical Pattern Discovery
- **🤖 تحليل المشاعر بـ Transformers** | Sentiment Analysis with Transformers

---

## 🚀 البدء السريع | Quick Start

### 1. التثبيت | Installation

```bash
# تثبيت المتطلبات الأساسية | Basic requirements
npm install

# للتحليل المتقدم (اختياري) | For advanced analysis (optional)
npm install @xenova/transformers
```

### 2. التشغيل السريع | Quick Run

```bash
# عرض تفاعلي شامل | Interactive full demo
npm start

# عرض سريع للمفاهيم | Quick concepts demo  
node quick_demo.js quick

# اختبار شامل للأداء | Full performance benchmark
npm run benchmark

# تحليل متقدم مع Transformers | Advanced analysis with Transformers
npm run advanced
```

### 3. أول تجربة | First Experiment

```javascript
const EmotionalOscillatorLab = require('./emotional_lab.js');

const lab = new EmotionalOscillatorLab();

// تحليل نص عاطفي | Analyze emotional text
const result = lab.analyzeTextToSpectrum("أشعر بسعادة غامرة!");

console.log("📊 النتيجة:", result.spectrum_position);
console.log("🔴 هزاز القاضي:", result.judge_value);
console.log("💭 التفسير:", result.spectrum_analysis.interpretation);
```

---

## 🧪 المفاهيم الأساسية | Core Concepts

### 🎛️ الهزازات الثلاثة | Three Oscillators

```
🔵 هزاز الوجود (Existence): 0.5 (ثابت - خط الأساس المقدس)
🟡 الهزاز الديناميكي (Dynamic): متغير (الحالة العاطفية الحالية)  
🔴 هزاز القاضي (Judge): |الديناميكي - الوجود| (مكتشف الأنماط)
```

### 🌈 طيف المشاعر المقلوب | Inverted Emotional Spectrum

```
0.0 ←── العدم المطلق | Absolute Void ──→ (فراغ، يأس، انسحاب)
0.5 ←── الحياد المثالي | Perfect Neutral ──→ (سكينة، توازن)
1.0 ←── الألم المطلق | Absolute Pain ──→ (إفراط، هلع، فوضى)
```

### 🔐 التشفير العاطفي | Emotional Encryption

كل تجربة عاطفية تحصل على:
- **🏷️ Probably ID**: بصمة رقمية فريدة
- **🌱 البذرة الاحتمالية**: قيمة هزاز القاضي لحظة الحدوث  
- **📊 التوقيع الرياضي**: تشفير معقد للحالة العاطفية

Each emotional experience gets:
- **🏷️ Probably ID**: Unique digital fingerprint
- **🌱 Probabilistic Seed**: Judge oscillator value at moment of occurrence
- **📊 Mathematical Signature**: Complex encryption of emotional state

---

## 🔬 التجارب المتاحة | Available Experiments

### 1. 📊 تحليل النصوص | Text Analysis

```javascript
// تجربة أساسية | Basic experiment
const result = lab.analyzeTextToSpectrum("نص عاطفي هنا");

// مع سياق متقدم | With advanced context  
const result = lab.analyzeTextToSpectrum("النص", {
    damping: 0.8,
    urgency: 0.5,
    context_id: "test_1"
});
```

### 2. 🔐 التشفير العاطفي | Emotional Encryption

```javascript
const encrypted = lab.encryptEmotionalExperience({
    type: 'personal_memory',
    content: 'ذكرى من الطفولة',
    emotional_intensity: 0.8
});

console.log("🏷️ البصمة:", encrypted.probably_id);
console.log("🌱 البذرة:", encrypted.seed_value);
```

### 3. 🎵 البحث عن الرنين | Resonance Search

```javascript
// البحث عن ذكريات مماثلة | Search for similar memories
const resonant = lab.findEmotionalResonance(
    target_seed_value,  // البذرة المستهدفة
    0.001              // عتبة التشابه
);

console.log(`🎵 وُجد ${resonant.length} ذكريات متناغمة`);
```

### 4. 🧠 تأثير المزاج | Mood Influence

```javascript
const result = lab.simulateMoodInfluencedRecall(
    "أشعر بالحزن اليوم",     // المزاج الحالي
    "أتذكر يوماً جميلاً"      // استعلام الذاكرة
);

console.log("تأثير المزاج:", result.mood_analysis);
console.log("الذكريات المفلترة:", result.filtered_memories.length);
```

### 5. 📈 تطور الهزاز | Oscillator Evolution

```javascript
const evolution = lab.runOscillatorEvolutionExperiment([
    "صباح الخير",
    "القهوة لذيذة", 
    "يوم مليء بالعمل",
    "أخيراً وقت الراحة",
    "تأمل قبل النوم"
]);

console.log("الاتجاه العام:", evolution.trends.overall_direction);
```

---

## 🤖 التحليل المتقدم مع Transformers | Advanced Analysis with Transformers

### التثبيت | Installation

```bash
npm install @xenova/transformers
```

### الاستخدام | Usage

```javascript
const { AdvancedEmotionalLab } = require('./advanced_transformers_lab.js');

const lab = new AdvancedEmotionalLab();

// انتظار التهيئة | Wait for initialization
await lab.initialize();

// تحليل متقدم | Advanced analysis
const result = await lab.analyzeWithTransformers("نص للتحليل", {
    precision_mode: 'high',
    pattern_discovery: true
});

console.log("تحليل Transformers:", result.transformers);
console.log("أنماط مكتشفة:", result.cpf_analysis.patterns);
```

---

## 📊 قياس الأداء | Performance Benchmarking

### تشغيل الاختبار الشامل | Run Full Benchmark

```bash
npm run benchmark
```

### المقاييس المتاحة | Available Metrics

- **🎯 دقة اكتشاف الأنماط** | Pattern Recognition Accuracy
- **🔢 دقة الأنماط الرياضية** | Mathematical Pattern Precision  
- **⚡ سرعة التشفير** | Encryption Speed
- **🎵 دقة الرنين العاطفي** | Emotional Resonance Accuracy
- **🌍 ثبات عبر اللغات** | Cross-Language Consistency

### نتائج نموذجية | Sample Results

```
📊 النتيجة الإجمالية: 78.5/100
🎯 دقة الأنماط: 82.3%
🔢 الأنماط الرياضية: 91.2%
⚡ سرعة التشفير: 147 ops/sec
🎵 الرنين العاطفي: 76.4%
🌍 ثبات اللغات: 73.1%
```

---

## 🔧 الإعدادات المتقدمة | Advanced Configuration

### تخصيص الهزازات | Oscillator Customization

```javascript
const lab = new EmotionalOscillatorLab();

// تعديل إعدادات النظام | Modify system settings
lab.experiment_config = {
    precision: 10,              // دقة أعلى
    damping_factor: 0.9,        // تخميد أقوى
    pattern_threshold: 0.0005   // حساسية أعلى للأنماط
};

// تعديل نقطة الوجود (متقدم) | Modify existence point (advanced)
lab.oscillators.existence = 0.5; // لا يُنصح بتغييرها
```

### إعدادات التشفير | Encryption Settings

```javascript
lab.emotionalCrypto = {
    precision_level: 12,        // دقة تشفير أعلى
    mathematical_constants: {
        golden_ratio: 1.618033988749895,
        custom_constant: 2.718281828459045
    }
};
```

---

## 📈 تحليل النتائج | Results Analysis

### فهم قيم الطيف | Understanding Spectrum Values

| النطاق | Range | التفسير | Interpretation |
|--------|-------|---------|----------------|
| 0.0-0.2 | شديد السلبية | اكتئاب، يأس | Severe negativity, depression |
| 0.2-0.4 | سلبي معتدل | حزن، قلق | Moderate negativity, sadness |
| 0.4-0.6 | حياد | هدوء، توازن | Neutrality, calm |
| 0.6-0.8 | إيجابي معتدل | فرح، حماس | Moderate positivity, joy |
| 0.8-1.0 | شديد الإيجابية | نشوة، هوس | Extreme positivity, mania |

### تفسير الأنماط المكتشفة | Interpreting Discovered Patterns

```javascript
// أنماط فيبوناتشي | Fibonacci patterns
if (pattern.type === 'fibonacci_sequence') {
    console.log("🌱 نمو طبيعي ومتدرج في الحالة العاطفية");
}

// النسبة الذهبية | Golden ratio
if (pattern.type === 'golden_ratio_resonance') {
    console.log("✨ توازن جمالي مثالي - حالة عاطفية متناغمة");
}

// أنماط Pi | Pi patterns  
if (pattern.type === 'pi_resonance') {
    console.log("🔄 دورية رياضية - تكرار عاطفي منتظم");
}
```

---

## 🛠️ التطوير والتوسيع | Development & Extension

### إضافة تحليل مخصص | Adding Custom Analysis

```javascript
class CustomEmotionalLab extends EmotionalOscillatorLab {
    
    // تحليل مخصص للعواطف | Custom emotion analysis
    analyzeCustomEmotion(text, custom_parameters) {
        // تحليلك المخصص هنا | Your custom analysis here
        const base_result = this.analyzeTextToSpectrum(text);
        
        // إضافة منطق مخصص | Add custom logic
        const enhanced_result = this.enhanceWithCustomLogic(
            base_result, 
            custom_parameters
        );
        
        return enhanced_result;
    }
    
    // كشف أنماط مخصصة | Custom pattern detection
    detectCustomPatterns(value) {
        const base_patterns = this.detectMathematicalPatterns(value);
        
        // أضف أنماطك المخصصة | Add your custom patterns
        const custom_patterns = this.findMyCustomPatterns(value);
        
        return [...base_patterns, ...custom_patterns];
    }
}
```

### ربط مع مصادر خارجية | External Data Integration

```javascript
// ربط مع API خارجي | Connect to external API
async function integrateExternalEmotionAPI(text) {
    const external_result = await fetch('https://emotion-api.com/analyze', {
        method: 'POST',
        body: JSON.stringify({ text: text })
    }).then(res => res.json());
    
    // دمج النتائج مع CPF | Merge results with CPF
    const cpf_result = lab.analyzeTextToSpectrum(text);
    
    return {
        cpf_analysis: cpf_result,
        external_analysis: external_result,
        merged_insights: mergeInsights(cpf_result, external_result)
    };
}
```

---

## 🔍 استكشاف الأخطاء | Troubleshooting

### مشاكل شائعة | Common Issues

#### 1. خطأ في تحميل Transformers | Transformers Loading Error

```bash
# الحل | Solution
npm install @xenova/transformers --save
# أو استخدم المحاكي | Or use mock mode
node emotional_lab.js --mock
```

#### 2. بطء في التحليل | Slow Analysis

```javascript
// تقليل دقة المعالجة | Reduce processing precision
lab.experiment_config.precision = 6; // بدلاً من 8

// تقليل حجم العينة | Reduce sample size  
lab.experiment_config.sample_size = 100; // بدلاً من 1000
```

#### 3. نتائج غير متوقعة | Unexpected Results

```javascript
// إعادة تعيين النظام | Reset system
lab.oscillators.existence = 0.5;
lab.oscillators.dynamic = 0.5;
lab.oscillators.judge = 0.0;

// مسح الذاكرة | Clear memory
lab.emotionalCrypto.probably_ids.clear();
```

---

## 📚 الأدبيات والمراجع | Literature & References

### الأوراق البحثية | Research Papers

1. **"الإيقاع المعرفي وطيف المشاعر: نموذج مقلوب للانفعال ضمن إطار CPF"**
   - تحليل نظري للهزازات الثلاثة
   - شرح طيف المشاعر المقلوب
   - آلية البذرة الاحتمالية

2. **"CPF~ Lite v4 - Probabilistic Vectorial Cognitive Framework"**
   - الإطار النظري الشامل
   - التطبيقات العملية
   - مقاييس الأداء

### المفاهيم النظرية | Theoretical Concepts

- **الوعي الفيكتوري** | Vectorial Consciousness
- **التشفير العاطفي الرقمي** | Digital Emotional Encryption  
- **الرنين الاحتمالي** | Probabilistic Resonance
- **الأنماط الرياضية المعرفية** | Cognitive Mathematical Patterns

---

## 🤝 المساهمة | Contributing

### كيفية المساهمة | How to Contribute

1. **Fork** المشروع
2. أنشئ **branch** للميزة الجديدة
3. **Commit** التغييرات مع وصف واضح
4. **Push** إلى الـ branch
5. افتح **Pull Request**

### مجالات التطوير المطلوبة | Areas for Development

- [ ] **دعم لغات إضافية** | Additional language support
- [ ] **ربط مع بيانات حيوية** | Biometric data integration
- [ ] **واجهة ويب تفاعلية** | Interactive web interface
- [ ] **تطبيقات علاجية** | Therapeutic applications
- [ ] **شبكات الرنين المعقدة** | Complex resonance networks

---

## 📞 التواصل والدعم | Contact & Support

### المؤلف | Author
**Brahim BIDI** - مطور إطار CPF

### التقارير والأخطاء | Issues & Bugs
يرجى فتح **Issue** في GitHub مع:
- وصف المشكلة
- خطوات إعادة الإنتاج  
- البيئة المستخدمة
- النتائج المتوقعة مقابل الفعلية

### طلبات الميزات | Feature Requests
نرحب بأفكاركم لتطوير المختبر! 

---

## 📄 الترخيص | License

هذا المشروع مرخص تحت **MIT License** - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 🎯 الخطوات التالية | Next Steps

### للباحثين | For Researchers
1. **تشغيل الاختبار الشامل** للحصول على خط أساس
2. **تجريب نصوص متنوعة** من مجالك البحثي
3. **تحليل الأنماط المكتشفة** وربطها بالنظريات الموجودة
4. **نشر النتائج** والمساهمة في تطوير النظرية

### للمطورين | For Developers  
1. **استكشاف الكود** وفهم البنية
2. **تجريب إضافات مخصصة** للوحدات الموجودة
3. **تطوير واجهات جديدة** (ويب، موبايل، سطح المكتب)
4. **دمج مع أنظمة أخرى** (AI، IoT، البيانات الضخمة)

### للمستخدمين العاديين | For General Users
1. **تشغيل العرض التفاعلي** لفهم المفاهيم
2. **تجريب نصوص شخصية** ومراقبة النتائج
3. **استكشاف تأثير المزاج** على الذاكرة
4. **مشاركة النتائج المثيرة** مع المجتمع

---

### 🌟 شكر خاص | Special Thanks

- **Claude AI** - للمساعدة في التطوير والتوثيق
- **Gemini AI** - للمساهمة في الورقة البحثية  
- **Grok AI** - لاقتراح استخدام Transformers
- **مجتمع CPF** - للدعم والتشجيع المستمر

---

**🎉 استمتع بالاستكشاف والتجريب! | Happy Exploring & Experimenting!**