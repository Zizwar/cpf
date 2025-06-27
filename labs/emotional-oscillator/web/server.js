/**
 * CPF Enhanced Emotional Analysis Server
 * خادم التحليل العاطفي المطور - إطار CPF
 */

import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import OpenAI from 'openai'

const app = new Hono()

// OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Models & Pricing (per 1M tokens)
const MODELS = {
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'gpt-4': { input: 30.00, output: 60.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 }
}

// Advanced CPF Emotional Lab
class CPFEmotionalLab {
  constructor() {
    // الهزازات الثلاثة - نبضة الوعي
    this.oscillators = { 
      existence: 0.5,              // ثابت مقدس
      dynamic: 0.5,                // متغير حسب الحالة
      judge: 0.0                   // مكتشف الأنماط
    }
    
    // مستويات السعة المعرفية
    this.capacityLevels = {
      100: { name: 'صرصور', precision: 1, emoji: '🪳' },
      1000: { name: 'سمكة', precision: 2, emoji: '🐟' },
      10000: { name: 'طائر', precision: 3, emoji: '🐦' },
      100000: { name: 'إنسان', precision: 4, emoji: '👤' },
      1000000: { name: 'عبقري', precision: 6, emoji: '🧠' }
    }
    
    this.currentCapacity = 100000
    this.memories = new Map()
    this.patternHistory = []
  }

  // تحديث السعة المعرفية
  setCapacity(capacity) {
    this.currentCapacity = capacity
    return this.capacityLevels[capacity] || this.capacityLevels[100000]
  }

  // تحليل النص للطيف العاطفي المقلوب
  analyzeEmotionalSpectrum(text) {
    const lowerText = text.toLowerCase()
    
    // كلمات العدم (نحو 0.0)
    const voidWords = {
      'عدم': 0.4, 'فراغ': 0.35, 'يأس': 0.3, 'موت': 0.25, 'لا شيء': 0.3,
      'انسحاب': 0.2, 'وحدة': 0.15, 'ضياع': 0.2, 'اكتئاب': 0.25, 'حزن': 0.15,
      'empty': 0.3, 'void': 0.4, 'despair': 0.3, 'death': 0.25, 'nothing': 0.3
    }
    
    // كلمات الألم (نحو 1.0)
    const painWords = {
      'ألم': 0.3, 'هلع': 0.4, 'ذعر': 0.35, 'غضب': 0.25, 'انفجار': 0.3,
      'جنون': 0.35, 'فوضى': 0.3, 'صراخ': 0.25, 'عنف': 0.3, 'كراهية': 0.25,
      'pain': 0.3, 'panic': 0.4, 'rage': 0.35, 'chaos': 0.3, 'violence': 0.3
    }
    
    // كلمات الحياد (حول 0.5)
    const neutralWords = {
      'هدوء': 0.05, 'سكينة': 0.03, 'توازن': 0.02, 'استقرار': 0.04, 'طبيعي': 0.03,
      'calm': 0.05, 'peace': 0.04, 'balance': 0.02, 'stable': 0.04, 'normal': 0.03
    }
    
    // كلمات إيجابية معتدلة (نحو 0.6-0.7)
    const positiveWords = {
      'سعادة': 0.15, 'فرح': 0.2, 'حب': 0.1, 'جميل': 0.1, 'رائع': 0.15,
      'نجاح': 0.12, 'أمل': 0.1, 'تفاؤل': 0.12, 'حماس': 0.18,
      'happiness': 0.15, 'joy': 0.2, 'love': 0.1, 'beautiful': 0.1, 'success': 0.12
    }
    
    let spectrum = 0.5 // نقطة البداية الحيادية
    let wordCount = 0
    
    // تحليل كلمات العدم
    Object.entries(voidWords).forEach(([word, impact]) => {
      if (lowerText.includes(word)) {
        spectrum -= impact
        wordCount++
      }
    })
    
    // تحليل كلمات الألم
    Object.entries(painWords).forEach(([word, impact]) => {
      if (lowerText.includes(word)) {
        spectrum += impact
        wordCount++
      }
    })
    
    // تحليل كلمات إيجابية
    Object.entries(positiveWords).forEach(([word, impact]) => {
      if (lowerText.includes(word)) {
        spectrum += impact
        wordCount++
      }
    })
    
    // تحليل كلمات الحياد (تجذب نحو 0.5)
    Object.entries(neutralWords).forEach(([word, impact]) => {
      if (lowerText.includes(word)) {
        spectrum = spectrum + (0.5 - spectrum) * impact
        wordCount++
      }
    })
    
    // تأثير طول النص والتعقيد
    const complexity = Math.min(text.length / 200, 1)
    const complexityNoise = (Math.random() - 0.5) * complexity * 0.1
    spectrum += complexityNoise
    
    // تأثير السعة المعرفية على الدقة
    const capacityNoise = (Math.random() - 0.5) * (1 / Math.sqrt(this.currentCapacity / 1000))
    spectrum += capacityNoise
    
    // ضمان البقاء في النطاق
    spectrum = Math.max(0.01, Math.min(0.99, spectrum))
    
    return {
      spectrum,
      wordCount,
      complexity,
      rawAnalysis: { voidWords: Object.keys(voidWords), painWords: Object.keys(painWords) }
    }
  }

  // اكتشاف الأنماط الرياضية
  detectMathematicalPatterns(value) {
    const patterns = []
    const valueStr = value.toString()
    const decimalPart = valueStr.split('.')[1] || ''
    
    // أنماط فيبوناتشي
    const fibPatterns = ['112', '123', '235', '358', '581', '1123', '3581']
    fibPatterns.forEach(pattern => {
      if (decimalPart.includes(pattern)) {
        patterns.push({
          type: 'fibonacci',
          name: 'تسلسل فيبوناتشي',
          pattern,
          significance: 0.9,
          description: 'نمو طبيعي في البنية العاطفية'
        })
      }
    })
    
    // النسبة الذهبية
    if (Math.abs(value - 0.618033988749895) < 0.001) {
      patterns.push({
        type: 'golden_ratio',
        name: 'النسبة الذهبية',
        significance: 1.0,
        description: 'توازن جمالي مثالي'
      })
    }
    
    // أنماط Pi
    const piPatterns = ['314', '159', '265', '358', '979']
    piPatterns.forEach(pattern => {
      if (decimalPart.includes(pattern)) {
        patterns.push({
          type: 'pi',
          name: 'نمط Pi',
          pattern,
          significance: 0.8,
          description: 'دورية رياضية في التجربة العاطفية'
        })
      }
    })
    
    // تسلسلات رقمية
    const sequences = ['1234', '2345', '3456', '4567', '5678', '6789']
    sequences.forEach(seq => {
      if (decimalPart.includes(seq)) {
        patterns.push({
          type: 'sequence',
          name: 'تسلسل رقمي',
          pattern: seq,
          significance: 0.7,
          description: 'تدرج منطقي في العمليات المعرفية'
        })
      }
    })
    
    // أنماط تكرارية
    const repetitions = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999', '0202', '1212', '2323']
    repetitions.forEach(rep => {
      if (decimalPart.includes(rep)) {
        patterns.push({
          type: 'repetitive',
          name: 'نمط تكراري',
          pattern: rep,
          significance: 0.6,
          description: 'استقرار أو حلقة معرفية'
        })
      }
    })
    
    // أنماط E (euler)
    const ePatterns = ['271', '828', '182']
    ePatterns.forEach(pattern => {
      if (decimalPart.includes(pattern)) {
        patterns.push({
          type: 'euler',
          name: 'ثابت أويلر',
          pattern,
          significance: 0.85,
          description: 'نمو أسي في التعقيد العاطفي'
        })
      }
    })
    
    return patterns
  }

  // توليد Probably ID
  generateProbablyId(judgeValue, complexity) {
    const timestamp = Date.now().toString(36)
    const judgeHex = Math.floor(judgeValue * 1000000).toString(16).padStart(6, '0')
    
    const complexityMap = {
      'بسيط': 'SMP',
      'متوسط': 'MOD', 
      'معقد': 'CPX',
      'معقد جداً': 'XTR'
    }
    
    const complexityCode = complexityMap[complexity] || 'UNK'
    const capacityCode = this.currentCapacity >= 1000000 ? 'G' : 
                        this.currentCapacity >= 100000 ? 'H' : 
                        this.currentCapacity >= 10000 ? 'A' : 'B'
    
    return `EMO_${capacityCode}${complexityCode}_${judgeHex}_${timestamp}`
  }

  // تحليل شامل مع تحديث الهزازات
  updateFromSpectrum(spectrum, text) {
    // تحديث الهزاز الديناميكي مع تخميد
    const dampingFactor = 0.7
    this.oscillators.dynamic = (this.oscillators.dynamic * dampingFactor) + 
                              (spectrum * (1 - dampingFactor))
    
    // حساب هزاز القاضي
    this.oscillators.judge = Math.abs(this.oscillators.dynamic - this.oscillators.existence)
    
    // تحليل المنطقة الطيفية
    const zone = this.getSpectrumZone(this.oscillators.dynamic)
    const interpretation = this.getEmotionalInterpretation(this.oscillators.dynamic)
    const complexity = this.calculateComplexity(text)
    
    // اكتشاف الأنماط
    const patterns = this.detectMathematicalPatterns(this.oscillators.judge)
    
    // حفظ في التاريخ
    this.patternHistory.push({
      timestamp: Date.now(),
      judgeValue: this.oscillators.judge,
      patterns: patterns.length,
      text: text.substring(0, 50) + '...'
    })
    
    // الاحتفاظ بآخر 100 قراءة فقط
    if (this.patternHistory.length > 100) {
      this.patternHistory = this.patternHistory.slice(-100)
    }
    
    return {
      oscillators: { ...this.oscillators },
      spectrum_position: this.oscillators.dynamic,
      spectrum_zone: zone,
      interpretation,
      complexity,
      patterns,
      capacity_info: this.capacityLevels[this.currentCapacity],
      consciousness_level: this.getConsciousnessLevel()
    }
  }

  // تحليل المنطقة الطيفية
  getSpectrumZone(value) {
    if (value >= 0.48 && value <= 0.52) return 'منطقة الحياد المثالي'
    if (value < 0.1) return 'منطقة العدم الخطرة'
    if (value < 0.3) return 'منطقة العدم العميق'
    if (value < 0.45) return 'اتجاه العدم'
    if (value > 0.9) return 'منطقة الألم المدمرة'
    if (value > 0.7) return 'منطقة الألم الشديد'
    if (value > 0.55) return 'اتجاه الألم'
    return 'منطقة انتقالية'
  }

  // التفسير العاطفي المفصل
  getEmotionalInterpretation(value) {
    if (value >= 0.48 && value <= 0.52) {
      return 'حالة حياد مثالية - سكينة وتوازن داخلي كامل'
    }
    
    const precision = this.capacityLevels[this.currentCapacity].precision
    const valueStr = value.toFixed(precision)
    
    if (value < 0.1) {
      return `عدم مطلق (${valueStr}) - فراغ وجودي خطير، تلاشي الوعي`
    } else if (value < 0.2) {
      return `عدم عميق (${valueStr}) - يأس شديد، انسحاب من الوجود`
    } else if (value < 0.3) {
      return `ميل قوي نحو العدم (${valueStr}) - حزن عميق، لا مبالاة متقدمة`
    } else if (value < 0.45) {
      return `هدوء عميق (${valueStr}) - استرخاء مع ميل للانطواء`
    } else if (value > 0.9) {
      return `ألم مطلق (${valueStr}) - فوضى عاطفية مدمرة، انهيار الوعي`
    } else if (value > 0.8) {
      return `ألم شديد (${valueStr}) - هلع، ذعر، فقدان السيطرة`
    } else if (value > 0.7) {
      return `توتر عالي (${valueStr}) - قلق شديد، إثارة مفرطة`
    } else if (value > 0.6) {
      return `طاقة عالية (${valueStr}) - حماس، يقظة، أو غضب معتدل`
    } else {
      return `حالة إيجابية (${valueStr}) - فرح، اهتمام، انتباه`
    }
  }

  // حساب التعقيد
  calculateComplexity(text) {
    const length = text.length
    const words = text.split(/\s+/).length
    const sentences = text.split(/[.!?]+/).length
    const emotionalWords = (text.match(/[حزن|فرح|غضب|خوف|أمل|يأس|سعادة|ألم|هلع|سكينة]/g) || []).length
    
    const complexityScore = (length / 50) + (words / 20) + (sentences / 5) + (emotionalWords * 2)
    
    if (complexityScore > 15) return 'معقد جداً'
    if (complexityScore > 10) return 'معقد'
    if (complexityScore > 5) return 'متوسط'
    return 'بسيط'
  }

  // مستوى الوعي
  getConsciousnessLevel() {
    const capacity = this.capacityLevels[this.currentCapacity]
    const patterns = this.patternHistory.slice(-10).reduce((sum, h) => sum + h.patterns, 0)
    
    let level = capacity.name
    if (patterns > 20) level += ' متطور'
    if (patterns > 50) level += ' فائق'
    
    return level
  }

  // تشفير التجربة العاطفية
  encrypt(text, analysisData) {
    const id = this.generateProbablyId(analysisData.oscillators.judge, analysisData.complexity)
    
    const encrypted = { 
      probably_id: id,
      judge_seed: analysisData.oscillators.judge,
      dynamic_value: analysisData.oscillators.dynamic,
      spectrum_zone: analysisData.spectrum_zone,
      patterns: analysisData.patterns,
      complexity: analysisData.complexity,
      capacity: this.currentCapacity,
      precision: this.capacityLevels[this.currentCapacity].precision,
      timestamp: Date.now(),
      text_hash: this.hashText(text)
    }
    
    this.memories.set(id, encrypted)
    return encrypted
  }

  // hash للنص
  hashText(text) {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }

  // إحصائيات النظام
  getStats() {
    return {
      memories: this.memories.size,
      oscillators: this.oscillators,
      current_capacity: this.currentCapacity,
      capacity_info: this.capacityLevels[this.currentCapacity],
      pattern_history: this.patternHistory.length,
      recent_patterns: this.patternHistory.slice(-5),
      uptime: process.uptime()
    }
  }
}

const lab = new CPFEmotionalLab()

// Static files
app.use('/*', serveStatic({ root: './public' }))

// Set Capacity API
app.post('/api/capacity', async (c) => {
  try {
    const { capacity } = await c.req.json()
    
    if (!lab.capacityLevels[capacity]) {
      return c.json({ error: 'سعة غير مدعومة' }, 400)
    }
    
    const info = lab.setCapacity(capacity)
    
    return c.json({
      success: true,
      capacity: capacity,
      info: info,
      message: `تم تعيين السعة إلى ${info.name} (${capacity})`
    })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// Enhanced Analyze API
app.post('/api/analyze', async (c) => {
  try {
    const { text, model = 'gpt-4o-mini', temperature = 0.3, capacity } = await c.req.json()
    
    if (!text?.trim()) {
      return c.json({ error: 'النص مطلوب' }, 400)
    }

    if (!MODELS[model]) {
      return c.json({ error: 'نموذج غير مدعوم' }, 400)
    }

    // تعيين السعة إذا تم تمريرها
    if (capacity && lab.capacityLevels[capacity]) {
      lab.setCapacity(capacity)
    }

    const start = Date.now()
    
    // التحليل المحلي أولاً
    const localAnalysis = lab.analyzeEmotionalSpectrum(text)
    const cpfResult = lab.updateFromSpectrum(localAnalysis.spectrum, text)
    const encryption = lab.encrypt(text, cpfResult)

    let aiResult = null
    let cost = null

    // استدعاء OpenAI للتحليل المتقدم
    if (process.env.OPENAI_API_KEY) {
      const prompt = `أنت محلل مشاعر متخصص في إطار CPF للطيف العاطفي المقلوب.

الطيف المقلوب:
- 0.0 = العدم المطلق (فراغ، يأس، انسحاب تام)
- 0.5 = الحياد المثالي (سكينة، توازن مثالي)
- 1.0 = الألم المطلق (هلع، فوضى، طاقة مدمرة)

النص: "${text}"

التحليل المحلي أعطى: ${localAnalysis.spectrum.toFixed(6)}

أعط تحليلاً متقدماً بـ JSON:
{
  "spectrum_refined": 0.234567,
  "confidence": 0.89,
  "emotion_primary": "حزن عميق مع رنين وجودي", 
  "emotion_layers": ["طبقة سطحية", "طبقة عميقة"],
  "intensity": 8,
  "complexity": "عالي",
  "consciousness_insights": "رؤى حول مستوى الوعي المطلوب لهذا التعقيد"
}`

      try {
        const response = await openai.chat.completions.create({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: parseFloat(temperature),
          max_tokens: 500
        })

        const content = response.choices[0].message.content
        
        try {
          aiResult = JSON.parse(content.replace(/```json|```/g, '').trim())
        } catch {
          aiResult = {
            spectrum_refined: localAnalysis.spectrum,
            confidence: 0.6,
            emotion_primary: 'تحليل تلقائي',
            emotion_layers: ['تحليل أساسي'],
            intensity: 5,
            complexity: 'متوسط',
            consciousness_insights: 'تحليل محلي مع دعم AI محدود'
          }
        }

        // حساب التكلفة
        const inputTokens = response.usage.prompt_tokens
        const outputTokens = response.usage.completion_tokens
        cost = {
          input_cost: (inputTokens / 1000000) * MODELS[model].input,
          output_cost: (outputTokens / 1000000) * MODELS[model].output,
          total_cost: ((inputTokens / 1000000) * MODELS[model].input) + ((outputTokens / 1000000) * MODELS[model].output),
          tokens: response.usage
        }

        // تحديث التحليل المحلي بنتائج AI
        if (aiResult.spectrum_refined) {
          const refinedResult = lab.updateFromSpectrum(aiResult.spectrum_refined, text)
          Object.assign(cpfResult, refinedResult)
        }

      } catch (aiError) {
        console.warn('AI Analysis failed, using local analysis:', aiError.message)
        aiResult = {
          spectrum_refined: localAnalysis.spectrum,
          confidence: 0.8,
          emotion_primary: 'تحليل محلي متقدم',
          emotion_layers: ['تحليل لغوي', 'تحليل سياقي'],
          intensity: Math.round(Math.abs(cpfResult.oscillators.dynamic - 0.5) * 20),
          complexity: cpfResult.complexity,
          consciousness_insights: `تحليل محلي بدقة ${lab.capacityLevels[lab.currentCapacity].precision} أرقام عشرية`
        }
      }
    } else {
      aiResult = {
        spectrum_refined: localAnalysis.spectrum,
        confidence: 0.7,
        emotion_primary: 'تحليل محلي',
        emotion_layers: ['تحليل أساسي'],
        intensity: Math.round(Math.abs(cpfResult.oscillators.dynamic - 0.5) * 20),
        complexity: cpfResult.complexity,
        consciousness_insights: 'تحليل محلي فقط - لا يوجد مفتاح OpenAI'
      }
    }

    const duration = Date.now() - start

    return c.json({
      text,
      model,
      temperature,
      capacity: lab.currentCapacity,
      capacity_info: lab.capacityLevels[lab.currentCapacity],
      local_analysis: localAnalysis,
      ai_result: aiResult,
      cpf_result: cpfResult,
      encryption,
      cost,
      duration_ms: duration,
      timestamp: Date.now()
    })

  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// Pattern History API
app.get('/api/patterns', (c) => {
  return c.json({
    recent_patterns: lab.patternHistory.slice(-20),
    pattern_summary: {
      total_analyses: lab.patternHistory.length,
      patterns_found: lab.patternHistory.reduce((sum, h) => sum + h.patterns, 0),
      average_judge: lab.patternHistory.length > 0 ? 
        lab.patternHistory.reduce((sum, h) => sum + h.judgeValue, 0) / lab.patternHistory.length : 0
    }
  })
})

// Memory Search API
app.post('/api/memory/search', async (c) => {
  try {
    const { judge_threshold = 0.001, limit = 10 } = await c.req.json()
    const currentJudge = lab.oscillators.judge
    
    const similarMemories = Array.from(lab.memories.values())
      .filter(memory => Math.abs(memory.judge_seed - currentJudge) < judge_threshold)
      .sort((a, b) => Math.abs(a.judge_seed - currentJudge) - Math.abs(b.judge_seed - currentJudge))
      .slice(0, limit)
    
    return c.json({
      current_judge: currentJudge,
      threshold: judge_threshold,
      found: similarMemories.length,
      memories: similarMemories
    })
  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

// Models API
app.get('/api/models', (c) => {
  return c.json({
    models: Object.keys(MODELS).map(model => ({
      id: model,
      name: model,
      pricing: MODELS[model]
    }))
  })
})

// Enhanced Stats API
app.get('/api/stats', (c) => {
  return c.json(lab.getStats())
})

export default app

// Node.js Server
if (import.meta.url === `file://${process.argv[1]}`) {
  const { serve } = await import('@hono/node-server')
  
  console.log('🚀 CPF Enhanced Emotional Lab')
  console.log('🌐 http://localhost:3000')
  console.log('🧠 OpenAI API:', process.env.OPENAI_API_KEY ? '✅ Ready' : '❌ Missing (Local analysis only)')
  console.log('🎛️ الهزازات الثلاثة: الوجود (0.5) | الديناميكي (متغير) | القاضي (مكتشف)')
  console.log('🌈 طيف مقلوب: العدم (0.0) ← الحياد (0.5) → الألم (1.0)')
  
  serve({
    fetch: app.fetch,
    port: 3000
  })
}