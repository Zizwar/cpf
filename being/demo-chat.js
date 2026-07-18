#!/usr/bin/env node
/**
 * Demo: دردشة حية مع كائن CPF
 *
 * محادثة تفاعلية في الطرفية مع كائن يعيش فعلياً أثناء الحديث:
 * مزاجه يتغير بكلامك، يتذكرك بين الجلسات (ملف روح)، ويسأل نفسه أسئلة.
 *
 * التشغيل:
 *   node being/demo-chat.js                    (الوضع الذاتي بدون LLM)
 *   ANTHROPIC_API_KEY=... node being/demo-chat.js   (ردود عبر Claude من حالته الحية)
 *
 * أوامر خاصة داخل الدردشة:
 *   /mood      عرض المزاج الحالي     /think    جلسة تأمل
 *   /snapshot  لقطة كاملة            /grow     نمو 7 أيام
 *   /save      حفظ الروح             /exit     خروج (مع حفظ تلقائي)
 */

const readline = require('readline');
const { Soul, LLMBridge } = require('./index');

const BEING_NAME = process.env.CPF_BEING_NAME || 'وينو';

async function main() {
    // استعادة الكائن إن كان له روح محفوظة
    const { being, resurrected, path: soul_path } = Soul.loadOrCreate(BEING_NAME, {
        role: 'رفيق رقمي يكبر ويتعلم',
        brain_capacity: 60000
    });

    const bridge = new LLMBridge();
    const has_llm = !!bridge.api_key;

    console.log('═'.repeat(58));
    if (resurrected) {
        const age_steps = being.life.total_steps;
        console.log(`  🌅 "${being.persona.name}" استيقظ من ملف روحه (${age_steps} نبضة سابقة،`);
        console.log(`     ${being.life.named_memories} ذكرى، ${being.inner_voice.stats.questions_asked} سؤال داخلي)`);
    } else {
        console.log(`  👶 كائن جديد وُلد الآن: "${being.persona.name}"`);
    }
    console.log(`  🔌 وضع الكلام: ${has_llm ? `Claude API (${bridge.model})` : 'ذاتي قالبي (بدون LLM)'}`);
    console.log(`  💬 اكتب رسالة، أو أمراً يبدأ بـ / (مثل /mood /think /exit)`);
    console.log('═'.repeat(58));

    // الكائن يعيش بالوقت الحقيقي أثناء المحادثة
    being.live();

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    // قراءة قائمة على طابور: لا تضيع الأسطر الواردة أثناء المعالجة
    // (يدعم الإدخال التفاعلي والموجّه بالأنابيب معاً)
    const line_buffer = [];
    const line_waiters = [];
    rl.on('line', line => {
        const waiter = line_waiters.shift();
        if (waiter) waiter(line);
        else line_buffer.push(line);
    });
    rl.on('close', () => {
        const waiter = line_waiters.shift();
        if (waiter) waiter('/exit');
        else line_buffer.push('/exit');
    });
    const ask = prompt => {
        process.stdout.write(prompt);
        const buffered = line_buffer.shift();
        if (buffered !== undefined) return Promise.resolve(buffered);
        return new Promise(resolve => line_waiters.push(resolve));
    };

    const mood_line = () => {
        const mood = being.feel();
        return `[${mood.interpretation.zone} ${mood.spectrum_position.toFixed(2)} | رنين ${mood.oscillators.judge.toFixed(3)} | سعة ${mood.capacity}]`;
    };

    let running = true;
    while (running) {
        const input = (await ask(`\n${mood_line()}\n🧑 أنت: `)).trim();
        if (!input) continue;

        if (input.startsWith('/')) {
            const command = input.slice(1).toLowerCase();
            switch (command) {
                case 'exit':
                case 'quit': {
                    being.sleep();
                    const saved = Soul.save(being, soul_path);
                    console.log(`\n💾 حُفظت الروح في ${saved.path}`);
                    console.log(`🌙 "${being.persona.name}" نام. أعد التشغيل وسيتذكر كل شيء.`);
                    running = false;
                    break;
                }
                case 'mood': {
                    const mood = being.feel();
                    console.log(`\n🎭 المزاج: ${mood.interpretation.ar}`);
                    console.log(`   الطيف: ${mood.spectrum_position} | الوعي: ${mood.consciousness}`);
                    console.log(`   المشاعر: ${JSON.stringify(mood.top_emotions)}`);
                    break;
                }
                case 'think': {
                    const reflection = await being.think();
                    if (reflection.reflected) {
                        console.log(`\n💭 تأمل في: "${reflection.question.question_ar}"`);
                        console.log(`💡 ${reflection.insight.text_ar}`);
                    } else {
                        console.log('\n😌 لا أسئلة معلقة الآن — ذهن صافٍ.');
                    }
                    break;
                }
                case 'snapshot': {
                    console.log(JSON.stringify(being.snapshot(), null, 2));
                    break;
                }
                case 'grow': {
                    const growth = being.growUp(7);
                    console.log(`\n🌱 نمو 7 أيام: ${growth.old_capacity} ← ${growth.new_capacity} (${growth.current_stage})`);
                    break;
                }
                case 'save': {
                    const saved = Soul.save(being, soul_path);
                    console.log(`\n💾 ${saved.path}`);
                    break;
                }
                default:
                    console.log('أوامر: /mood /think /snapshot /grow /save /exit');
            }
            continue;
        }

        // حوار عادي
        const result = await bridge.speak(being, input);
        console.log(`\n🤖 ${being.persona.name}: ${result.reply}`);
        if (result.llm_error) {
            console.log(`   (تعذر الوصول لـ LLM: ${result.llm_error} — استُخدم الرد الذاتي)`);
        }
    }

    rl.close();
}

main().catch(err => {
    console.error('Chat failed:', err);
    process.exit(1);
});
