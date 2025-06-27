/**
 * CPF Web API - Hono.js + GPT-4o-mini
 * API سريع وبسيط للهزاز العاطفي
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/node-server/serve-static'

const EmotionalOscillatorLab = require('./emotional_lab.js');

const app = new Hono()

// CORS + Static files
app.use('/*', cors())
app.use('/static/*', serveStatic({ root: './' }))

// المختبر العاطفي
const lab = new EmotionalOscillatorLab();

// GPT-4o-mini config
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GPT_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * 🏠 الصفحة الرئيسية
 */
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧠 مختبر الهزاز العاطفي</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen text-white">
    
    <div x-data="emotionalLab()" class="container mx-auto px-4 py-8">
        
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2">🧠 مختبر الهزاز العاطفي</h1>
            <p class="text-blue-200">CPF Emotional Oscillator Lab - تحليل المشاعر بالذكاء الاصطناعي</p>
        </div>

        <!-- Input Section -->
        <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">💭 النص للتحليل:</label>
                <textarea 
                    x-model="inputText" 
                    class="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
                    rows="3" 
                    placeholder="اكتب نصاً يعبر عن مشاعرك...">
                </textarea>
            </div>
            
            <div class="flex gap-4">
                <button 
                    @click="analyzeEmotion()" 
                    :disabled="loading"
                    class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 px-6 py-2 rounded-lg font-medium transition">
                    <i class="fas fa-brain" x-show="!loading"></i>
                    <i class="fas fa-spinner fa-spin" x-show="loading"></i>
                    <span x-text="loading ? 'جاري التحليل...' : 'تحليل المشاعر'"></span>
                </button>
                
                <button 
                    @click="clearResults()" 
                    class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg">
                    🗑️ مسح
                </button>
            </div>
        </div>

        <!-- Results Section -->
        <div x-show="results" class="grid md:grid-cols-2 gap-6">
            
            <!-- Oscillators -->
            <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 class="text-xl font-bold mb-4">🎛️ الهزازات الثلاثة</h3>
                
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between mb-1">
                            <span>🔵 الوجود</span>
                            <span x-text="results?.oscillators?.existence"></span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full" :style="'width: ' + (results?.oscillators?.existence * 100) + '%'"></div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex justify-between mb-1">
                            <span>🟡 الديناميكي</span>
                            <span x-text="results?.oscillators?.dynamic?.toFixed(4)"></span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-yellow-500 h-2 rounded-full" :style="'width: ' + (results?.oscillators?.dynamic * 100) + '%'"></div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex justify-between mb-1">
                            <span>🔴 القاضي</span>
                            <span x-text="results?.oscillators?.judge?.toFixed(4)"></span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-red-500 h-2 rounded-full" :style="'width: ' + (results?.oscillators?.judge * 100) + '%'"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Spectrum Analysis -->
            <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 class="text-xl font-bold mb-4">🌈 طيف المشاعر</h3>
                
                <div class="mb-4">
                    <div class="text-2xl font-bold" x-text="results?.spectrum_position?.toFixed(6)"></div>
                    <div class="text-sm text-blue-200" x-text="results?.spectrum_analysis?.category"></div>
                </div>
                
                <div class="mb-4">
                    <div class="w-full h-6 bg-gradient-to-r from-purple-600 via-blue-500 to-red-600 rounded-full relative">
                        <div 
                            class="absolute w-4 h-4 bg-white rounded-full border-2 border-gray-800 top-1 transform -translate-x-2"
                            :style="'left: ' + (results?.spectrum_position * 100) + '%'">
                        </div>
                    </div>
                    <div class="flex justify-between text-xs mt-1">
                        <span>عدم مطلق</span>
                        <span>حياد</span>
                        <span>ألم مطلق</span>
                    </div>
                </div>
                
                <div class="text-sm" x-text="results?.spectrum_analysis?.interpretation"></div>
            </div>

            <!-- GPT Analysis -->
            <div x-show="results?.gpt_analysis" class="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 class="text-xl font-bold mb-4">🤖 تحليل GPT-4o-mini</h3>
                <div class="space-y-2">
                    <div><strong>😊 المشاعر:</strong> <span x-text="results?.gpt_analysis?.sentiment"></span></div>
                    <div><strong>💭 العاطفة:</strong> <span x-text="results?.gpt_analysis?.emotion"></span></div>
                    <div><strong>🎯 الشدة:</strong> <span x-text="results?.gpt_analysis?.intensity"></span></div>
                </div>
            </div>

            <!-- Encryption -->
            <div x-show="results?.encryption" class="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h3 class="text-xl font-bold mb-4">🔐 التشفير العاطفي</h3>
                <div class="space-y-2 text-sm">
                    <div><strong>🏷️ ID:</strong> <code x-text="results?.encryption?.probably_id" class="bg-black/30 px-2 py-1 rounded"></code></div>
                    <div><strong>🌱 البذرة:</strong> <span x-text="results?.encryption?.seed_value?.toFixed(8)"></span></div>
                    <div><strong>🔢 الأنماط:</strong> <span x-text="results?.patterns?.length || 0"></span></div>
                </div>
            </div>
        </div>

        <!-- Error Display -->
        <div x-show="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mt-4">
            <div class="flex items-center gap-2">
                <i class="fas fa-exclamation-triangle text-red-400"></i>
                <span x-text="error"></span>
            </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-blue-200 text-sm">
            🧪 CPF Emotional Oscillator Lab - Powered by GPT-4o-mini & Alpine.js
        </div>
    </div>

    <script>
        function emotionalLab() {
            return {
                inputText: 'أشعر بسعادة غامرة لكن قلبي يحمل قلقاً خفياً من المستقبل',
                results: null,
                loading: false,
                error: null,

                async analyzeEmotion() {
                    if (!this.inputText.trim()) {
                        this.error = 'يرجى إدخال نص للتحليل';
                        return;
                    }

                    this.loading = true;
                    this.error = null;

                    try {
                        const response = await fetch('/api/analyze', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: this.inputText })
                        });

                        if (!response.ok) {
                            throw new Error('خطأ في التحليل');
                        }

                        this.results = await response.json();
                    } catch (error) {
                        this.error = 'خطأ: ' + error.message;
                    } finally {
                        this.loading = false;
                    }
                },

                clearResults() {
                    this.results = null;
                    this.error = null;
                    this.inputText = '';
                }
            }
        }
    </script>
</body>
</html>
  `)
})

/**
 * 🔬 API للتحليل العاطفي
 */
app.post('/api/analyze', async (c) => {
  try {
    const { text } = await c.req.json()
    
    if (!text) {
      return c.json({ error: 'النص مطلوب' }, 400)
    }

    // 1. تحليل CPF
    const cpf_result = lab.analyzeTextToSpectrum(text);
    
    // 2. تشفير عاطفي
    const encrypted = lab.encryptEmotionalExperience({
      type: 'web_analysis',
      content: text
    });
    
    // 3. اكتشاف أنماط
    const patterns = lab.detectMathematicalPatterns(lab.oscillators.judge);
    
    // 4. تحليل GPT-4o-mini (اختياري)
    let gpt_analysis = null;
    if (OPENAI_API_KEY) {
      try {
        gpt_analysis = await analyzeWithGPT(text);
      } catch (error) {
        console.warn('GPT تحليل فشل:', error.message);
      }
    }

    return c.json({
      text: text,
      spectrum_position: cpf_result.spectrum_position,
      spectrum_analysis: cpf_result.spectrum_analysis,
      oscillators: cpf_result.oscillator_state,
      encryption: encrypted,
      patterns: patterns,
      gpt_analysis: gpt_analysis,
      timestamp: Date.now()
    })

  } catch (error) {
    return c.json({ error: error.message }, 500)
  }
})

/**
 * 🤖 تحليل مع GPT-4o-mini
 */
async function analyzeWithGPT(text) {
  if (!OPENAI_API_KEY) return null;

  const response = await fetch(GPT_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `حلل هذا النص عاطفياً واعط النتيجة بصيغة JSON:
النص: "${text}"

أريد:
- sentiment: إيجابي/سلبي/محايد
- emotion: العاطفة الرئيسية
- intensity: شدة العاطفة (1-10)
- complexity: هل المشاعر معقدة؟

JSON فقط:`
      }],
      max_tokens: 150,
      temperature: 0.3
    })
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  try {
    return JSON.parse(content);
  } catch {
    return {
      sentiment: 'غير محدد',
      emotion: 'معقد',
      intensity: '5',
      complexity: true
    };
  }
}

/**
 * 📊 API إحصائيات
 */
app.get('/api/stats', (c) => {
  return c.json({
    total_encryptions: lab.emotionalCrypto.probably_ids.size,
    current_oscillators: lab.oscillators,
    patterns_discovered: lab.emotionalCrypto.encryption_history.length
  })
})

export default app

// للتشغيل المحلي
if (import.meta.url === `file://${process.argv[1]}`) {
  const { serve } = await import('@hono/node-server')
  
  console.log('🚀 CPF Emotional Lab API starting...')
  console.log('🌐 http://localhost:3000')
  console.log('📡 API: http://localhost:3000/api/analyze')
  
  serve({
    fetch: app.fetch,
    port: 3000
  })
}