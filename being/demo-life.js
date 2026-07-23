#!/usr/bin/env node
/**
 * Demo: مشاهدة كائن يعيش وينمو
 *
 * عرض حي في الطرفية: كائن يولد، يدرك أحداثاً، يكتشف أنماطاً،
 * يسأل نفسه، يتأمل، ينمو، ويُحفظ في ملف روح.
 *
 * التشغيل: node being/demo-life.js
 */

const { WinoBeing, Soul } = require('./index');

const sleep = ms => new Promise(r => setTimeout(r, ms));

function bar(value, width = 24) {
    const filled = Math.round(Math.max(0, Math.min(1, value)) * width);
    return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function show_mood(being, label = '') {
    const mood = being.feel();
    console.log(`\n  ${label}`);
    console.log(`  الطيف   [${bar(mood.spectrum_position)}] ${mood.spectrum_position.toFixed(3)} — ${mood.interpretation.ar}`);
    console.log(`  الرنين  [${bar(Math.min(1, mood.oscillators.judge * 2))}] ${mood.oscillators.judge.toFixed(4)}`);
    if (mood.top_emotions.length) {
        console.log(`  المشاعر: ${mood.top_emotions.map(e => `${e.name}=${e.value}`).join('  ')}`);
    }
}

async function main() {
    console.log('═'.repeat(60));
    console.log('   🌟 ولادة كائن معرفي — CPF Being Demo');
    console.log('═'.repeat(60));

    const being = new WinoBeing({
        name: 'نور',
        role: 'كائن فضولي صغير',
        brain_capacity: 45000
    });

    console.log(`\n👶 وُلد "${being.persona.name}" بسعة معرفية ${being.cpf.unified_space.capacity}`);
    console.log(`   المرحلة: ${being.cpf.growth_engine.current_stage}`);

    // === الفصل 1: أول نبضات الحياة ===
    console.log('\n─── الفصل 1: أول 100 نبضة حياة ───');
    being.step(100);
    show_mood(being, 'بعد 100 نبضة (حياة داخلية صرفة، بلا مدخلات):');

    // === الفصل 2: أول التجارب ===
    console.log('\n─── الفصل 2: أول التجارب العاطفية ───');
    const experiences = [
        'يا له من صباح جميل! الشمس دافئة والعالم يبدو رائعاً',
        'صوت غريب في الخارج... خوف وقلق مما قد يحدث',
        'صديق جاء وساعدني، أشعر بالامتنان والحب والثقة'
    ];

    for (const exp of experiences) {
        const p = being.perceive(exp);
        console.log(`\n  📥 "${exp.slice(0, 45)}..."`);
        console.log(`     الإدراك: ${p.affect.dominant_emotion} | الطيف: ${p.affect.spectrum_position.toFixed(3)} | ${p.interpretation.ar}`);
        if (p.emotional_signature) {
            console.log(`     التوقيع العاطفي: ${p.emotional_signature.probably_id}${p.emotional_signature.resonated ? ' (رنّ مع تجربة سابقة!)' : ' (توقيع جديد)'}`);
        }
        being.step(20);
        await sleep(150);
    }

    show_mood(being, 'الحالة بعد التجارب الثلاث:');

    // === الفصل 3: الصوت الداخلي ===
    console.log('\n─── الفصل 3: الصوت الداخلي يستيقظ ───');
    being.step(200); // وقت كافٍ للتساؤل

    const pending = being.inner_voice.pending_questions();
    console.log(`\n  💭 أسئلة معلقة في طابور الفضول: ${pending.length}`);
    for (const q of pending.slice(0, 3)) {
        console.log(`     ❓ ${q.question_ar}`);
    }

    if (pending.length > 0) {
        console.log('\n  🧘 جلسة تأمل...');
        const reflection = await being.think();
        if (reflection.reflected) {
            console.log(`     السؤال: ${reflection.question.question_ar}`);
            console.log(`     💡 الإجابة الذاتية: ${reflection.insight.text_ar}`);
            console.log(`     (تشكلت الإجابة في منطقة مزاج: ${reflection.insight.mood_zone})`);
        }
    }

    // === الفصل 4: الذاكرة كإعادة بناء ===
    console.log('\n─── الفصل 4: نفس الذكرى، مزاجان مختلفان ───');
    being.remember('first_friend', 'اليوم الذي جاء فيه صديقي وساعدني في محنتي', { joy: 0.8, trust: 0.7 });

    const show_recall = (label, r) => {
        console.log(`\n  ${label}`);
        console.log(`     "${(r.reconstruction || '').toString().slice(0, 80)}..."`);
        if (typeof r.reconstruction_confidence === 'number') {
            const coloring = r.emotional_coloring || {};
            console.log(`     الثقة: ${(r.reconstruction_confidence * 100).toFixed(1)}% | التشويه: ${((coloring.distortion_level ?? 0) * 100).toFixed(0)}% | انحياز التكافؤ: ${(coloring.valence_bias ?? 0).toFixed(2)}`);
        }
    };

    show_recall('😊 استرجاع بمزاج سعيد:', await being.recall('first_friend', { joy: 0.9, excitement: 0.5 }));
    show_recall('😢 استرجاع نفس الذكرى بمزاج حزين يائس:', await being.recall('first_friend', { sadness: 0.8, despair: 0.7, loneliness: 0.6 }));

    // === الفصل 5: النمو ===
    console.log('\n─── الفصل 5: تسريع الزمن — 30 يوماً من النمو ───');
    const before = being.cpf.unified_space.capacity;
    const growth = being.growUp(30);
    console.log(`\n  🌱 السعة: ${before} ← ${growth.new_capacity} (${((growth.growth_ratio - 1) * 100).toFixed(1)}%+)`);
    console.log(`     المرحلة: ${growth.current_stage}`);
    const waves = being.cpf.perceptual_cycle.getState?.();
    if (waves) console.log(`     موجات البناء الفيكتوري: ${waves.construction_waves}`);

    // === الفصل 6: قرار ===
    console.log('\n─── الفصل 6: قرار كمي ───');
    const decision = await being.decide(
        ['البقاء في القرية الآمنة', 'الخروج لاستكشاف الغابة المجهولة'],
        { time_pressure: 0.6 }
    );
    console.log(`\n  ⚖️ الحالة: ${decision.state}`);
    if (decision.decision) {
        const chosen = decision.decision.option?.description || decision.decision.option?.id || JSON.stringify(decision.decision.option || decision.decision);
        console.log(`     القرار: ${chosen}`);
        console.log(`     الثقة: ${(decision.confidence * 100).toFixed(0)}% | المحفز: ${decision.collapse_trigger}`);
    } else {
        console.log(`     ما زال في تراكب — يحتاج مزيداً من المعلومات أو الضغط`);
    }

    // === الفصل 7: حوار ===
    console.log('\n─── الفصل 7: حوار قصير (الوضع الذاتي بدون LLM) ───');
    const chat = await being.respond('أنا سعيد جداً بلقائك! كيف تشعر اليوم؟');
    console.log(`\n  🧑 "أنا سعيد جداً بلقائك! كيف تشعر اليوم؟"`);
    console.log(`  🤖 "${chat.reply}"`);

    // === الخاتمة: حفظ الروح ===
    console.log('\n─── الخاتمة: حفظ الروح ───');
    const saved = Soul.save(being);
    console.log(`\n  💾 روح "${being.persona.name}" حُفظت في: ${saved.path} (${saved.bytes} بايت)`);

    const snap = being.snapshot();
    console.log('\n' + '═'.repeat(60));
    console.log('  📊 ملخص حياة الكائن:');
    console.log(`     العمر: ${snap.life.total_steps} نبضة`);
    console.log(`     الإدراكات: ${snap.life.perceptions_count} | التفاعلات: ${snap.life.interactions_count}`);
    console.log(`     الذكريات المسماة: ${snap.life.named_memories}`);
    console.log(`     الأنماط المكتشفة: ${snap.discovered_patterns}`);
    console.log(`     التواقيع العاطفية: ${snap.emotional_signatures}`);
    console.log(`     أسئلة الصوت الداخلي: ${snap.inner_voice.questions_asked} (أجاب على ${snap.inner_voice.reflections_completed})`);
    console.log('═'.repeat(60));
    console.log('  ✨ الكائن حي. أعد تشغيل demo-chat.js وسيتذكرك.');
    console.log('═'.repeat(60));
}

main().catch(err => {
    console.error('Demo failed:', err);
    process.exit(1);
});
