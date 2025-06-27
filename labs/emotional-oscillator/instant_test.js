#!/usr/bin/env node

/**
 * Instant CPF Test - اختبار فوري لمختبر الهزاز العاطفي
 * 
 * للاستخدام السريع مع GPT-4o-mini:
 * node instant_test.js sk-your-openai-key "نص معقد عاطفياً"
 * 
 * أو للاختبار السريع بدون مفاتيح:
 * node instant_test.js
 */

// محاولة تحميل مكتبة sentiment (أساسية)
let sentiment_available = false;
try {
    const Sentiment = require('sentiment');
    sentiment_available = true;
} catch (error) {
    console.log("⚠️ مكتبة sentiment غير متاحة - سيتم استخدام محاكي");
}

// محاولة تحميل node-fetch
let fetch;
try {
    fetch = require('node-fetch');
} catch (error) {
    fetch = globalThis.fetch;
    if (!fetch) {
        console.log("⚠️ fetch غير متاح - سيعمل بدون APIs");
    }
}

class InstantCPFTest {
    constructor() {
        this.oscillators = {
            existence: 0.5,
            dynamic: 0.5,
            judge: 0.0
        };
        
        if (sentiment_available) {
            const Sentiment = require('sentiment');
            this.sentiment = new Sentiment();
            console.log("✅ نظام التحليل الأساسي جاهز");
        } else {
            console.log("🔄 استخدام محاكي التحليل");
        }
    }

    // تحليل أساسي سريع
    quickAnalyze(text) {
        console.log(`\n🔬 تحليل سريع: "${text}"`);
        
        let sentiment_result;
        if (sentiment_available) {
            sentiment_result = this.sentiment.analyze(text);
        } else {
            // محاكي بسيط
            const hasPositive = /happy|joy|love|good|great|amazing|wonderful|beautiful/i.test(text);
            const hasNegative = /sad|pain|hurt|bad|terrible|awful|hate|angry|fear/i.test(text);
            
            sentiment_result = {
                score: hasPositive ? 3 : hasNegative ? -3 : 0,
                comparative: hasPositive ? 0.5 : hasNegative ? -0.5 : 0
            };
        }
        
        // تحويل لطيف CPF
        const spectrum_position = 0.5 + (Math.tanh(sentiment_result.comparative * 2) * 0.4);
        const clamped_position = Math.max(0.05, Math.min(0.95, spectrum_position));
        
        // تحديث الهزازات
        this.oscillators.dynamic = clamped_position;
        this.oscillators.judge = Math.abs(clamped_position - this.oscillators.existence);
        
        // تحليل الطيف
        let category, interpretation;
        if (clamped_position < 0.3) {
            category = "اتجاه العدم";
            interpretation = "مشاعر سلبية، ميل للانسحاب";
        } else if (clamped_position > 0.7) {
            category = "اتجاه الألم";
            interpretation = "طاقة عالية، قد تكون مفرطة";
        } else {
            category = "حياد نسبي";
            interpretation = "توازن عاطفي معتدل";
        }
        
        const result = {
            text: text,
            spectrum_position: clamped_position,
            judge_value: this.oscillators.judge,
            category: category,
            interpretation: interpretation,
            oscillator_state: { ...this.oscillators }
        };
        
        console.log(`📊 النتيجة:`);
        console.log(`   🌈 طيف المشاعر: ${clamped_position.toFixed(6)}`);
        console.log(`   🔴 هزاز القاضي: ${this.oscillators.judge.toFixed(6)}`);
        console.log(`   📋 الفئة: ${category}`);
        console.log(`   💭 التفسير: ${interpretation}`);
        
        return result;
    }

    // تحليل متقدم مع GPT-4o-mini
    async gptAnalyze(text, api_key) {
        if (!fetch) {
            console.error("❌ fetch غير متاح - لا يمكن استدعاء GPT");
            return this.quickAnalyze(text);
        }
        
        if (!api_key) {
            console.error("❌ مفتاح OpenAI مطلوب للتحليل المتقدم");
            return this.quickAnalyze(text);
        }
        
        console.log(`\n🧠 تحليل متقدم مع GPT-4o-mini: "${text}"`);
        console.log("⏳ جاري الاتصال...");
        
        const prompt = `حلل هذا النص عاطفياً ضمن إطار CPF حيث:
- 0.0 = العدم المطلق (فراغ، يأس)
- 0.5 = الحياد (سكينة، توازن)  
- 1.0 = الألم المطلق (إفراط، هلع)

النص: "${text}"

أريد فقط رقم دقيق بين 0.0 و 1.0 يمثل موقع النص في هذا الطيف، متبوعاً بتفسير قصير.

مثال: 0.234567 - اتجاه نحو العدم مع حزن عميق`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${api_key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            const gpt_response = result.choices[0].message.content;
            
            console.log(`🤖 استجابة GPT: ${gpt_response}`);
            
            // استخراج الرقم
            const number_match = gpt_response.match(/(\d+\.?\d*)/);
            let spectrum_position = 0.5;
            
            if (number_match) {
                spectrum_position = Math.max(0.05, Math.min(0.95, parseFloat(number_match[1])));
            }
            
            // تحديث الهزازات
            this.oscillators.dynamic = spectrum_position;
            this.oscillators.judge = Math.abs(spectrum_position - this.oscillators.existence);
            
            // تحليل الطيف
            let category, interpretation;
            if (spectrum_position < 0.3) {
                category = "اتجاه العدم";
                interpretation = gpt_response.split(' - ')[1] || "مشاعر سلبية عميقة";
            } else if (spectrum_position > 0.7) {
                category = "اتجاه الألم";
                interpretation = gpt_response.split(' - ')[1] || "طاقة عالية مفرطة";
            } else {
                category = "حياد نسبي";
                interpretation = gpt_response.split(' - ')[1] || "توازن عاطفي";
            }
            
            const analysis_result = {
                text: text,
                spectrum_position: spectrum_position,
                judge_value: this.oscillators.judge,
                category: category,
                interpretation: interpretation,
                gpt_response: gpt_response,
                oscillator_state: { ...this.oscillators },
                tokens_used: result.usage?.total_tokens || 0,
                cost_estimate: (result.usage?.total_tokens || 0) * 0.00000015
            };
            
            console.log(`📊 النتيجة المتقدمة:`);
            console.log(`   🌈 طيف المشاعر: ${spectrum_position.toFixed(6)}`);
            console.log(`   🔴 هزاز القاضي: ${this.oscillators.judge.toFixed(6)}`);
            console.log(`   📋 الفئة: ${category}`);
            console.log(`   💭 التفسير: ${interpretation}`);
            console.log(`   🪙 رموز مستهلكة: ${analysis_result.tokens_used}`);
            console.log(`   💰 تكلفة تقديرية: $${analysis_result.cost_estimate.toFixed(6)}`);
            
            return analysis_result;
            
        } catch (error) {
            console.error(`❌ خطأ في GPT:`, error.message);
            console.log("🔄 التبديل للتحليل الأساسي...");
            return this.quickAnalyze(text);
        }
    }

    // تشفير عاطفي بسيط
    encryptEmotion(analysis_result) {
        const judge_seed = analysis_result.judge_value;
        const timestamp = Date.now().toString(36);
        const complexity = analysis_result.gpt_response ? 'GPT' : 'BASIC';
        
        // توقيع بسيط
        const signature = {
            spectrum: analysis_result.spectrum_position,
            judge_seed: judge_seed,
            timestamp: Date.now()
        };
        
        const crypto = require('crypto');
        const hash = crypto.createHash('md5')
            .update(JSON.stringify(signature))
            .digest('hex')
            .substring(0, 8);
        
        const probably_id = `EMO_${complexity}_${hash}_${timestamp}`;
        
        console.log(`\n🔐 تشفير عاطفي:`);
        console.log(`   🏷️  Probably ID: ${probably_id}`);
        console.log(`   🌱 البذرة الاحتمالية: ${judge_seed.toFixed(8)}`);
        
        return {
            probably_id: probably_id,
            seed: judge_seed,
            signature: signature,
            encrypted_experience: analysis_result
        };
    }

    // تجربة شاملة
    async runCompleteTest(text, api_key = null) {
        console.log("🧪 اختبار شامل لمختبر الهزاز العاطفي");
        console.log("=" * 50);
        
        let analysis_result;
        
        if (api_key && fetch) {
            analysis_result = await this.gptAnalyze(text, api_key);
        } else {
            analysis_result = this.quickAnalyze(text);
        }
        
        // تشفير النتيجة
        const encrypted = this.encryptEmotion(analysis_result);
        
        // اكتشاف أنماط بسيط
        console.log(`\n🔢 اكتشاف الأنماط:`);
        const judge_value = analysis_result.judge_value;
        
        if (Math.abs(judge_value - 0.618033988) < 0.001) {
            console.log("   ✨ اكتُشفت النسبة الذهبية!");
        } else if (judge_value.toString().includes('112358')) {
            console.log("   🌱 اكتُشف تسلسل فيبوناتشي!");
        } else if (judge_value.toString().includes('141592')) {
            console.log("   🥧 اكتُشفت أجزاء من π!");
        } else {
            console.log("   ⭕ لم يتم اكتشاف أنماط رياضية معروفة");
        }
        
        console.log(`\n🎯 الخلاصة:`);
        console.log(`   النص يقع في فئة "${analysis_result.category}"`);
        console.log(`   مستوى التحليل: ${analysis_result.gpt_response ? 'متقدم (GPT)' : 'أساسي'}`);
        console.log(`   البصمة العاطفية: ${encrypted.probably_id}`);
        
        return {
            analysis: analysis_result,
            encryption: encrypted,
            success: true
        };
    }
}

// تشغيل مباشر
async function main() {
    const api_key = process.argv[2];
    const text = process.argv[3];
    
    console.log("🎭 اختبار فوري لمختبر الهزاز العاطفي");
    console.log("=" * 45);
    
    if (!api_key && !text) {
        console.log("💡 طرق الاستخدام:");
        console.log("   node instant_test.js sk-your-key 'نص معقد'");
        console.log("   node instant_test.js 'نص للتحليل الأساسي'");
        console.log("   node instant_test.js");
        console.log("");
    }
    
    const test = new InstantCPFTest();
    
    // تحديد النص
    let test_text = text;
    if (!test_text) {
        if (api_key && api_key.startsWith('sk-')) {
            test_text = "I love him with every fiber of my being yet this love slowly kills me, each glance from him revives and destroys me, I wish I could hate him to find peace from this impossible love's torment";
        } else {
            test_text = api_key || "أشعر بمزيج معقد من الفرح والحزن في آن واحد";
        }
    }
    
    // تحديد المفتاح
    let openai_key = null;
    if (api_key && api_key.startsWith('sk-')) {
        openai_key = api_key;
    }
    
    try {
        const result = await test.runCompleteTest(test_text, openai_key);
        
        console.log("\n✅ اكتمل الاختبار بنجاح!");
        
        if (!openai_key) {
            console.log("\n💡 للحصول على تحليل أكثر تطوراً:");
            console.log("   1. احصل على مفتاح من https://platform.openai.com/");
            console.log("   2. استخدم: node instant_test.js sk-your-key 'نصك'");
        }
        
    } catch (error) {
        console.error("❌ خطأ في الاختبار:", error.message);
    }
}

// تشغيل إذا تم استدعاء الملف مباشرة
if (require.main === module) {
    main();
}

module.exports = InstantCPFTest;