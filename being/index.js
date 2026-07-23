/**
 * CPF Being - نقطة الدخول الموحدة لطبقة الكائن الحي
 *
 * const { WinoBeing, CPFNPC, Soul, LLMBridge, TextAffect, InnerVoice } = require('./being');
 */
module.exports = {
    WinoBeing: require('./mind'),
    InnerVoice: require('./inner-voice'),
    TextAffect: require('./text-affect'),
    LLMBridge: require('./llm-bridge'),
    CPFNPC: require('./npc'),
    Soul: require('./soul'),
    // النواة القديمة لمن يريد الوصول المباشر
    CPFVectorial: require('../lite/wino')
};
