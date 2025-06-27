/**
 * CPF OpenAI Server
 */

import { Hono } from 'hono'
import { serveStatic } from 'hono/node-server/serve-static'
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
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  'gpt-4.1-nano': { input: 0.05, output: 0.20 } // mock model
}

// Emotional Lab
class EmotionalLab {
  constructor() {
    this.oscillators = { existence: 0.5, dynamic: 0.5, judge: 0.0 }
    this.memories = new Map()
  }

  updateFromSpectrum(spectrum) {
    this.oscillators.dynamic = spectrum
    this.oscillators.judge = Math.abs(spectrum - this.oscillators.existence)
    
    return {
      spectrum_position: spectrum,
      spectrum_analysis: this.getAnalysis(spectrum),
      oscillator_state: { ...this.oscillators }
    }
  }

  getAnalysis(pos) {
    if (pos < 0.3) return { category: 'ميل العدم', interpretation: 'حزن وانطواء وانسحاب من العالم' }
    if (pos > 0.7) return { category: 'ميل الألم', interpretation: 'طاقة عالية وتوتر وإثارة مفرطة' }
    return { category: 'حياد', interpretation: 'توازن وهدوء وسكينة' }
  }

  encrypt(data) {
    const id = `EMO_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    const encrypted = { 
      probably_id: id, 
      seed_value: this.oscillators.judge,
      timestamp: Date.now(),
      ...data 
    }
    this.memories.set(id, encrypted)
    return encrypted
  }
}

const lab = new EmotionalLab()

// Static files
app.use('/*', serveStatic({ root: './public' }))

// Analyze API
app.post('/api/analyze', async (c) => {
  try {
    const { text, model = 'gpt-4o-mini', temperature = 0.3 } = await c.req.json()
    
    if (!text?.trim()) {
      return c.json({ error: 'النص مطلوب' }, 400)
    }

    if (!MODELS[model]) {
      return c.json({ error: 'نموذج غير مدعوم' }, 400)
    }

    const prompt = `أنت محلل مشاعر متخصص في إطار CPF للهزاز العاطفي.

النص: "${text}"

حلل النص وأعط رقم دقيق من 0.0 إلى 1.0 لطيف المشاعر:
- 0.0 = العدم المطلق (يأس، فراغ، انسحاب تام)
- 0.5 = الحياد المثالي (سكينة، توازن)
- 1.0 = الألم المطلق (هوس، فوضى، طاقة مدمرة)

أعط الإجابة بـ JSON:
{
  "spectrum": 0.234567,
  "confidence": 0.89,
  "emotion": "حزن عميق",
  "intensity": 8,
  "complexity": "عالي"
}`

    const start = Date.now()
    
    const response = await openai.chat.completions.create({
      model: model === 'gpt-4.1-nano' ? 'gpt-4o-mini' : model, // fallback for mock
      messages: [{ role: 'user', content: prompt }],
      temperature: parseFloat(temperature),
      max_tokens: 200
    })

    const duration = Date.now() - start
    const content = response.choices[0].message.content
    
    // Parse AI response
    let aiResult
    try {
      aiResult = JSON.parse(content.replace(/```json|```/g, '').trim())
    } catch {
      aiResult = {
        spectrum: 0.5,
        confidence: 0.5,
        emotion: 'غير محدد',
        intensity: 5,
        complexity: 'متوسط'
      }
    }

    // Update CPF lab
    const cpfResult = lab.updateFromSpectrum(aiResult.spectrum)
    const encryption = lab.encrypt({ type: 'openai_analysis', content: text })

    // Calculate cost
    const inputTokens = response.usage.prompt_tokens
    const outputTokens = response.usage.completion_tokens
    const cost = {
      input_cost: (inputTokens / 1000000) * MODELS[model].input,
      output_cost: (outputTokens / 1000000) * MODELS[model].output,
      total_cost: ((inputTokens / 1000000) * MODELS[model].input) + ((outputTokens / 1000000) * MODELS[model].output),
      tokens: response.usage
    }

    return c.json({
      text,
      model,
      temperature,
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

// Stats API
app.get('/api/stats', (c) => {
  return c.json({
    memories: lab.memories.size,
    oscillators: lab.oscillators,
    models: Object.keys(MODELS),
    uptime: process.uptime()
  })
})

export default app

// Node.js Server
if (import.meta.url === `file://${process.argv[1]}`) {
  const { serve } = await import('@hono/node-server')
  
  console.log('🚀 CPF OpenAI Lab')
  console.log('🌐 http://localhost:3000')
  console.log('💰 OpenAI API:', process.env.OPENAI_API_KEY ? '✅ Ready' : '❌ Missing')
  
  serve({
    fetch: app.fetch,
    port: 3000
  })
}