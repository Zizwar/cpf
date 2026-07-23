#!/usr/bin/env node
/**
 * CPF Smoke Tests - اختبارات الدخان الشاملة
 *
 * بدون أي إطار اختبار خارجي: node test/smoke.test.js
 * تتحقق أن كل طبقات المشروع تُحمَّل وتعمل من البداية للنهاية.
 */

let passed = 0, failed = 0;
const failures = [];

function test(name, fn) {
    return Promise.resolve()
        .then(fn)
        .then(() => { passed++; console.log(`  ✅ ${name}`); })
        .catch(err => {
            failed++;
            failures.push({ name, error: err.message });
            console.log(`  ❌ ${name}\n     ${err.message}`);
        });
}

function assert(condition, message) {
    if (!condition) throw new Error(message || 'assertion failed');
}

async function main() {
    console.log('\n═══ 1. تحميل الوحدات ═══');

    await test('probability-core loads and gaussian works', () => {
        const ProbabilityCore = require('../lite/probability-core');
        const p = new ProbabilityCore({ seed: 42 });
        const samples = Array.from({ length: 2000 }, () => p.gaussian(0, 1));
        const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
        const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length;
        assert(Math.abs(mean) < 0.15, `gaussian mean off: ${mean}`);
        assert(Math.abs(variance - 1) < 0.25, `gaussian variance off: ${variance} (spare-scaling bug?)`);
        // قابلية التكرار بعد إعادة البذر
        p.setSeed(7); const a = p.gaussian(0, 1);
        p.setSeed(7); const b = p.gaussian(0, 1);
        assert(a === b, 'setSeed not reproducible');
    });

    await test('all 14 core modules load', () => {
        const modules = [
            'agate-memory', 'cognitive-rhythm', 'core-simulator', 'decision-quantum',
            'dynamic-others-modeling', 'emotional-cryptography', 'growth-engine',
            'perceptual-cycle', 'perspectives-manager', 'quantum-simulators',
            'reality-engine', 'script-manager', 'unified-cognitive-space', 'wave-dynamics'
        ];
        for (const name of modules) require(`../lite/core-modules/${name}`);
    });

    await test('CPFVectorial (wino) constructs without consciousness', () => {
        const CPF = require('../lite/wino');
        const mind = new CPF({ auto_start_consciousness: false, brain_capacity: 5000 });
        assert(mind.unified_space.capacity === 5000, 'capacity mismatch');
        assert(mind.unified_space.space.growth_engine === mind.growth_engine, 'growth engine not wired into space');
    });

    await test('wino-quantum compatibility shim resolves', () => {
        const WinoQuantum = require('../lite/wino-quantum');
        const CPF = require('../lite/wino');
        assert(WinoQuantum === CPF, 'shim does not re-export wino');
    });

    console.log('\n═══ 2. النواة المعرفية حية ═══');

    const CPF = require('../lite/wino');
    const mind = new CPF({ auto_start_consciousness: false, brain_capacity: 60000 });

    await test('cognitive rhythm ticks without errors (500 ticks)', () => {
        for (let i = 0; i < 500; i++) mind.cognitive_rhythm.tick();
        const state = mind.cognitive_rhythm.getCurrentState();
        assert(typeof state.judge === 'number' && isFinite(state.judge), 'judge not finite');
        assert(mind.cognitive_rhythm.metrics.emergency_interventions === 0,
            `emergency stabilization fired ${mind.cognitive_rhythm.metrics.emergency_interventions} times`);
    });

    await test('perceptual cycle executes frames from rhythm', () => {
        mind.perceptual_cycle.start();
        mind.cognitive_rhythm.connect_to_cycle(mind.perceptual_cycle);
        mind.cognitive_rhythm.tick();
        const state = mind.perceptual_cycle.getState();
        assert(state.total_frames > 0, 'no frames executed');
    });

    await test('emotional cryptography: encrypt + resonance dedupe', () => {
        const c1 = mind.emotional_crypto.encrypt_emotion({ joy: 0.8, excitement: 0.9 });
        const c2 = mind.emotional_crypto.encrypt_emotion({ joy: 0.79, excitement: 0.91 });
        const c3 = mind.emotional_crypto.encrypt_emotion({ despair: 0.7, anxiety: 0.8 });
        assert(typeof c1.crypto_score === 'number' && c1.crypto_score > 0 && c1.crypto_score < 1, 'crypto_score not in (0,1)');
        assert(c1.probably_id === c2.probably_id, 'similar emotions did not resonate to same ID');
        assert(c1.probably_id !== c3.probably_id, 'opposite emotions got same ID');
    });

    await test('process() end-to-end returns viewpoint', async () => {
        const result = await mind.process({ type: 'perception', content: 'test stimulus' }, {});
        assert(result && typeof result === 'object', 'no result');
        assert(result.vectorial_metadata, 'no vectorial metadata');
    });

    await test('makeDecision() returns full contract', async () => {
        const decision = await mind.makeDecision({
            options: [{ id: 'a', description: 'stay' }, { id: 'b', description: 'leave' }],
            trust_context: { entities: [] },
            social_models: ['family_expectations'],
            time_pressure: 0.9
        });
        assert(typeof decision.state === 'string', 'no state string');
        assert(['collapsed', 'superposition'].includes(decision.state), `bad state: ${decision.state}`);
        assert(typeof decision.confidence === 'number' && isFinite(decision.confidence), 'confidence not numeric');
    });

    await test('agate memory: store + mood-colored recall', async () => {
        const memory = mind.unified_space.space.agate_memory;
        assert(typeof memory.store_memory === 'function', 'store_memory missing');
        memory.store_memory('test_mem', 'يوم جميل في الحديقة مع الأصدقاء', { joy: 0.8 });
        const recall1 = await mind.recallMemory({ memory_id: 'test_mem', current_mood: { joy: 0.9 } });
        const recall2 = await mind.recallMemory({ memory_id: 'test_mem', current_mood: { sadness: 0.9, despair: 0.7 } });
        assert(recall1 && typeof recall1 === 'object', 'recall1 empty');
        assert(recall2 && typeof recall2 === 'object', 'recall2 empty');
        assert(typeof recall1.reconstruction_confidence === 'number' || recall1.reconstruction, 'no reconstruction fields');
    });

    await test('growth engine: biologicalGrowth(days) fast-forward', () => {
        const before = mind.unified_space.capacity;
        const result = mind.growth_engine.biologicalGrowth(10);
        assert(result.new_capacity >= before, 'capacity shrank');
        assert(typeof result.current_stage === 'string', 'no stage');
    });

    await test('reality engine: process_embodiment_and_validate contract', async () => {
        const rp = await mind.unified_space.space.reality_engine.process_embodiment_and_validate(
            { type: 'test' }, {}
        );
        assert(rp.reality_validation, 'no reality_validation');
        assert(rp.cognitive_modifier, 'no cognitive_modifier');
        for (const key of ['processing_speed_modifier', 'error_probability_modifier', 'creativity_boost_modifier']) {
            assert(typeof rp.cognitive_modifier[key] === 'number' && isFinite(rp.cognitive_modifier[key]),
                `${key} not finite`);
        }
    });

    await test('external influence injection (therapy + addiction) does not throw', () => {
        mind.injectExternalInfluence({ type: 'therapeutic_noise', intensity: 0.5 });
        mind.injectExternalInfluence({ type: 'addiction_amplifier', target: 'emotional_waves', intensity: 0.6 });
        mind.injectExternalInfluence({ type: 'cognitive_enhancer', intensity: 0.4 });
    });

    console.log('\n═══ 3. طبقة الكائن الحي (being/) ═══');

    const { WinoBeing, CPFNPC, Soul, TextAffect, LLMBridge } = require('../being');

    await test('TextAffect analyzes Arabic and English', () => {
        const ar = TextAffect.analyze('أنا حزين ووحيد اليوم');
        assert(ar.emotions.sadness > 0.3, 'Arabic sadness not detected');
        assert(ar.spectrum_position < 0.5, 'sad text should be below calm');
        const en = TextAffect.analyze('I am so happy and excited!');
        assert(en.emotions.joy > 0.3, 'English joy not detected');
        assert(en.spectrum_position > 0.5, 'joyful text should be above calm');
    });

    const being = new WinoBeing({ name: 'اختبار', brain_capacity: 30000 });

    await test('being lives: step(200) + events', () => {
        const events = being.step(200);
        assert(being.life.total_steps === 200, 'steps not counted');
        assert(events.some(e => e.type === 'rhythm'), 'no rhythm event');
    });

    await test('being perceives text and mood shifts', () => {
        const before = being.feel().spectrum_position;
        const perception = being.perceive('خوف شديد! خطر قادم! رعب');
        assert(perception.perceived, 'not perceived');
        const after = being.feel().spectrum_position;
        assert(after > before, `fear should raise spectrum (${before} -> ${after})`);
    });

    await test('inner voice asks and reflects', async () => {
        being.step(300);
        // ضمان وجود سؤال واحد على الأقل
        if (being.inner_voice.pending_questions().length === 0) {
            being.inner_voice.ask({
                type: 'test', question_ar: 'سؤال اختباري؟', question_en: 'test question?'
            });
        }
        const reflection = await being.think();
        assert(reflection.reflected, 'reflection failed');
        assert(reflection.insight.text_ar, 'no Arabic insight');
    });

    await test('being remembers and recalls with mood coloring', async () => {
        being.remember('golden_day', 'يوم ذهبي لا يُنسى', { joy: 0.9 });
        const recall = await being.recall('golden_day');
        assert(recall, 'no recall result');
        assert(!recall.error, `recall error: ${recall.error}`);
    });

    await test('being responds to dialogue (offline)', async () => {
        const result = await being.respond('مرحباً! أنا سعيد بلقائك');
        assert(typeof result.reply === 'string' && result.reply.length > 3, 'no reply');
        assert(result.mood, 'no mood in response');
    });

    await test('LLM bridge builds system prompt from live state', () => {
        const bridge = new LLMBridge({ api_key: null });
        const prompt = bridge.buildSystemPrompt(being);
        assert(prompt.includes(being.persona.name), 'prompt missing name');
        assert(prompt.includes('الطيف العاطفي'), 'prompt missing spectrum');
        assert(prompt.length > 400, 'prompt too short');
    });

    await test('soul save/load roundtrip preserves identity', () => {
        const fs = require('fs');
        const os = require('os');
        const path = require('path');
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cpf-soul-'));
        const file = path.join(dir, 'test.soul.json');

        being.remember('before_death', 'ذكرى ما قبل الحفظ', { nostalgia: 0.7 });
        const steps_before = being.life.total_steps;
        Soul.save(being, file);

        const revived = Soul.load(file);
        assert(revived.persona.name === being.persona.name, 'name lost');
        assert(revived.life.total_steps === steps_before, 'life steps lost');
        assert(revived.life.named_memories > 0, 'memories lost');
        assert(revived.inner_voice.stats.questions_asked === being.inner_voice.stats.questions_asked,
            'inner voice stats lost');

        // الكائن المستعاد يواصل الحياة
        revived.step(10);
        assert(revived.life.total_steps === steps_before + 10, 'revived being cannot live');
        fs.rmSync(dir, { recursive: true, force: true });
    });

    console.log('\n═══ 4. طبقة NPC ═══');

    await test('NPC full lifecycle: tick, events, dialogue, hud', async () => {
        const npc = new CPFNPC({ name: 'حارس الاختبار', archetype: 'wise_guard', brain_capacity: 40000 });

        // نبضات لعبة (60fps لمدة ثانيتين)
        for (let i = 0; i < 120; i++) npc.tick(16.6);
        assert(npc.being.life.total_steps > 0, 'NPC not living');

        // أحداث لعبة
        const gift = npc.onEvent('player_gift');
        assert(npc.player_trust > 0.5, 'gift did not raise trust');
        const attack = npc.onEvent('player_attack');
        assert(npc.player_trust < gift.player_trust, 'attack did not lower trust');

        // حوار
        const chat = await npc.interact('مرحباً أيها الحارس');
        assert(typeof chat.reply === 'string' && chat.reply.length > 0, 'no NPC reply');

        // HUD
        const hud = npc.hud();
        assert(hud.emoji && hud.color && hud.animation, 'incomplete HUD');
        assert(typeof hud.spectrum === 'number', 'no spectrum in HUD');

        // قرار
        const decision = await npc.decide(['حراسة البوابة', 'مطاردة المهاجم']);
        assert(decision.state, 'no decision state');
    });

    await test('NPC save/load keeps trust and memories', async () => {
        const fs = require('fs');
        const os = require('os');
        const path = require('path');
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cpf-npc-'));
        const file = path.join(dir, 'guard.soul.json');

        const npc = new CPFNPC({ name: 'حارس دائم', brain_capacity: 35000 });
        npc.onEvent('player_gift');
        npc.onEvent('player_help');
        const trust_before = npc.player_trust;
        npc.save(file);

        const revived = CPFNPC.load(file);
        assert(Math.abs(revived.player_trust - trust_before) < 0.001, 'trust lost');
        assert(revived.being.persona.name === 'حارس دائم', 'name lost');
        fs.rmSync(dir, { recursive: true, force: true });
    });

    console.log('\n═══ 5. الأمثلة القديمة (توافقية) ═══');

    await test('legacy examples load without MODULE_NOT_FOUND', () => {
        // نتحقق فقط من إمكانية الحل (examples تشغل نفسها عند require المباشر)
        require.resolve('../lite/examples/butterfly-quantum-perception.js');
        require.resolve('../lite/wino-quantum');
    });

    // ═══ النتيجة ═══
    console.log('\n' + '═'.repeat(50));
    console.log(`  النتيجة: ${passed} نجح ✅ | ${failed} فشل ❌`);
    if (failures.length > 0) {
        console.log('\n  الإخفاقات:');
        for (const f of failures) console.log(`   - ${f.name}: ${f.error}`);
    }
    console.log('═'.repeat(50) + '\n');

    process.exit(failed > 0 ? 1 : 0);
}

main();
