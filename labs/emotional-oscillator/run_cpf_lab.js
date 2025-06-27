/**
 * CPF + GPT-4o-mini Emotional Analysis Lab
 * مختبر التحليل العاطفي المتقدم باستخدام GPT-4o-mini
 * 
 * مميزات:
 * - تحليل عاطفي متقدم ودقيق
 * - فهم السياق والتعقيد العاطفي
 * - دعم ممتاز للعربية والإنجليزية
 * - تكامل مثالي مع نظام CPF
 */

const crypto = require('crypto');

// محاولة تحميل node-fetch أو الاعتماد على fetch المدمج
let fetch;
try {
    fetch = require('node-fetch');
} catch (error) {
    fetch = globalThis.fetch;
    if (!fetch) {
        console.warn("⚠️ fetch غير متاح. ثبت node-fetch: npm install node-fetch");
    }
}

const EmotionalOscillatorLab = require('./emotional_lab.js');

class GPT4oEmotionalLab extends EmotionalOscillatorLab {
    constructor(api_key = null) {
        super();
        
        this.api_key = api_key || process.env.OPENAI_API_KEY;
        this.api_base = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-4o-mini'; // النموذج المحدد
        
        // إعدادات متقدمة للتحليل العاطفي
        this.analysis_config = {
            temperature: 0.3,          // دقة عالية
            max_tokens: 1500,          // مساحة كافية للتحليل
            response_format: 'json',   // استجابة منظمة
            timeout: 30000            // 30 ثانية timeout
        };
        
        // نظام التحليل العاطفي المتقدم
        this.emotion_categories = {
            // الطيف الأساسي
            'void_emotions': ['emptiness', 'numbness', 'detachment', 'dissociation'],
            'pain_emotions': ['agony', 'anguish', 'torment', 'overwhelm'],
            'neutral_emotions': ['calm', 'peace', 'balance', 'serenity'],
            
            // العواطف المركبة
            'complex_love': ['bittersweet', 'longing', 'unrequited', 'torn'],
            'existential': ['dread', 'awe', 'transcendence', 'meaninglessness'],
            'ambivalent': ['conflicted', 'mixed', 'contradictory', 'paradoxical']
        };
        
        // إحصائيات الاستخدام
        this.gpt_stats = {
            total_requests: 0,
            successful_requests: 0,
            failed_requests: 0,
            total_tokens_used: 0,
            average_response_time: 0,
            analysis_accuracy: 0
        };
        
        // نظام التحليل التدريجي
        this.analysis_stages = [
            'surface_emotion',      // العاطفة السطحية
            'underlying_feelings',  // المشاعر الكامنة
            'emotional_complexity', // التعقيد العاطفي
            'spectrum_mapping',     // تحديد موقع الطيف
            'pattern_recognition'   // اكتشاف الأنماط
        ];
        
        if (!this.api_key) {
            console.warn("⚠️ مفتاح OpenAI API غير موجود!");
            console.log("💡 للحصول على مفتاح API:");
            console.log("   1. اذهب إلى https://platform.openai.com/");
            console.log("   2. سجل دخولك أو أنشئ حساب");
            console.log("   3. اذهب إلى API Keys");
            console.log("   4. أنشئ مفتاح جديد");
            console.log("   5. أضفه كـ: OPENAI_API_KEY=sk-your-key");
        } else {
            console.log("✅ مفتاح OpenAI API متاح!");
            console.log(`🤖 النموذج المحدد: ${this.model}`);
        }
    }

    /**
     * استدعاء GPT-4o-mini لتحليل المشاعر المتقدم
     */
    async callGPT4oAPI(text, analysis_type = 'comprehensive') {
        if (!this.api_key) {
            console.warn("⚠️ مفتاح API مفقود - استخدام محاكي");
            return this.mockGPTResponse(text, analysis_type);
        }

        const start_time = Date.now();
        this.gpt_stats.total_requests++;

        // بناء الـ prompt المتخصص
        const system_prompt = this.buildSystemPrompt(analysis_type);
        const user_prompt = this.buildUserPrompt(text, analysis_type);

        try {
            console.log(`🤖 استدعاء GPT-4o-mini للتحليل ${analysis_type}`);
            
            const response = await fetch(this.api_base, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.api_key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: system_prompt },
                        { role: 'user', content: user_prompt }
                    ],
                    temperature: this.analysis_config.temperature,
                    max_tokens: this.analysis_config.max_tokens,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            // تحديث الإحصائيات
            const response_time = Date.now() - start_time;
            this.gpt_stats.successful_requests++;
            this.gpt_stats.total_tokens_used += result.usage?.total_tokens || 0;
            this.gpt_stats.average_response_time = 
                (this.gpt_stats.average_response_time * (this.gpt_stats.successful_requests - 1) + response_time) 
                / this.gpt_stats.successful_requests;

            console.log(`✅ نجح التحليل في ${response_time}ms`);
            console.log(`📊 استهلاك الرموز: ${result.usage?.total_tokens || 'غير محدد'}`);
            
            // تحليل الاستجابة
            return this.parseGPTResponse(result.choices[0].message.content);

        } catch (error) {
            this.gpt_stats.failed_requests++;
            console.error(`❌ خطأ في GPT API:`, error.message);
            
            // Fallback للمحاكي
            console.log("🔄 استخدام محاكي بديل...");
            return this.mockGPTResponse(text, analysis_type);
        }
    }

    /**
     * بناء الـ System Prompt المتخصص
     */
    buildSystemPrompt(analysis_type) {
        const base_prompt = `أنت محلل عاطفي متخصص يعمل ضمن إطار CPF (Cognitive Probabilistic Framework). 

مهمتك تحليل النصوص العاطفية ضمن "طيف المشاعر المقلوب":
- 0.0 = العدم المطلق (فراغ، يأس، انسحاب تام)
- 0.5 = الحياد المثالي (سكينة، توازن، هدوء)  
- 1.0 = الألم المطلق (إفراط، هلع، فوضى عاطفية)

عليك تحليل:
1. العاطفة السطحية المباشرة
2. المشاعر الكامنة العميقة
3. التعقيد والتناقضات العاطفية
4. موقع دقيق في الطيف (0.0-1.0)
5. مستوى الثقة في التحليل
6. الأنماط الرياضية المحتملة

استجب بـ JSON صحيح فقط.`;

        const specialized_prompts = {
            'comprehensive': base_prompt + `\n\nأجري تحليلاً شاملاً ومتعدد الطبقات.`,
            'complex_emotions': base_prompt + `\n\nركز على العواطف المعقدة والمتناقضة.`,
            'spectrum_precise': base_prompt + `\n\nحدد موقع الطيف بدقة رياضية عالية.`,
            'pattern_discovery': base_prompt + `\n\nركز على اكتشاف الأنماط الرياضية والمعرفية.`
        };

        return specialized_prompts[analysis_type] || specialized_prompts['comprehensive'];
    }

    /**
     * بناء الـ User Prompt
     */
    buildUserPrompt(text, analysis_type) {
        return `حلل هذا النص عاطفياً: "${text}"

أريد استجابة JSON بهذا التنسيق:
{
    "surface_emotion": {
        "primary": "العاطفة الأساسية",
        "intensity": "شدة من 0-1",
        "confidence": "ثقة من 0-1"
    },
    "underlying_feelings": [
        "مشاعر كامنة مخفية"
    ],
    "emotional_complexity": {
        "level": "بسيط/معتدل/معقد/شديد التعقيد",
        "contradictions": ["تناقضات موجودة"],
        "ambivalence_score": "نقاط من 0-1"
    },
    "cpf_spectrum": {
        "position": "موقع دقيق من 0.0-1.0",
        "tendency": "void/neutral/pain",
        "confidence": "ثقة من 0-1",
        "reasoning": "سبب هذا الموقع"
    },
    "mathematical_patterns": {
        "detected": ["أنماط رياضية محتملة"],
        "significance": "أهمية من 0-1"
    },
    "insights": [
        "رؤى عميقة حول الحالة العاطفية"
    ]
}`;
    }

    /**
     * تحليل متقدم باستخدام GPT-4o-mini
     */
    async analyzeWithGPT4o(text, options = {}) {
        console.log(`\n🤖 تحليل متقدم مع GPT-4o-mini`);
        console.log(`📝 النص: "${text}"`);
        
        const analysis_start = Date.now();
        
        try {
            // 1. التحليل الشامل الأساسي
            const comprehensive_analysis = await this.callGPT4oAPI(text, 'comprehensive');
            
            // 2. تحليل العواطف المعقدة (إذا اكتُشف تعقيد)
            let complex_analysis = null;
            if (comprehensive_analysis.emotional_complexity?.level === 'معقد' || 
                comprehensive_analysis.emotional_complexity?.level === 'شديد التعقيد') {
                
                console.log("🔍 اكتُشف تعقيد عاطفي - تحليل إضافي...");
                complex_analysis = await this.callGPT4oAPI(text, 'complex_emotions');
            }
            
            // 3. تحليل الطيف الدقيق
            const spectrum_analysis = await this.callGPT4oAPI(text, 'spectrum_precise');
            
            // 4. دمج النتائج وتحديث CPF
            const unified_analysis = this.unifyGPTAnalyses(
                comprehensive_analysis, 
                complex_analysis, 
                spectrum_analysis
            );
            
            // 5. تحديث نظام الهزازات
            this.updateDynamicOscillator(unified_analysis.cpf_spectrum.position, options);
            this.updateJudgeOscillator();
            
            // 6. التشفير العاطفي المتقدم
            const encrypted_experience = await this.advancedGPTEmotionalEncryption({
                text: text,
                gpt_analysis: unified_analysis,
                spectrum_position: unified_analysis.cpf_spectrum.position,
                complexity_level: unified_analysis.emotional_complexity.level
            });
            
            // 7. اكتشاف الأنماط المعرفية
            const cognitive_patterns = this.discoverCognitivePatterns(unified_analysis);
            
            const analysis_time = Date.now() - analysis_start;
            
            const result = {
                text: text,
                gpt_analysis: unified_analysis,
                cpf_integration: {
                    spectrum_position: unified_analysis.cpf_spectrum.position,
                    oscillator_state: { ...this.oscillators },
                    cognitive_patterns: cognitive_patterns,
                    analysis_confidence: unified_analysis.cpf_spectrum.confidence
                },
                encryption: encrypted_experience,
                advanced_insights: this.generateGPTInsights(unified_analysis),
                performance: {
                    analysis_time: analysis_time,
                    gpt_stats: { ...this.gpt_stats }
                }
            };
            
            this.displayGPTAnalysisResults(result);
            return result;
            
        } catch (error) {
            console.error("❌ خطأ في التحليل المتقدم:", error.message);
            
            // Fallback للتحليل الأساسي
            console.log("🔄 التبديل للتحليل الأساسي...");
            return this.analyzeTextToSpectrum(text);
        }
    }

    /**
     * دمج تحليلات GPT المتعددة
     */
    unifyGPTAnalyses(comprehensive, complex, spectrum) {
        // دمج ذكي للتحليلات المختلفة
        const unified = {
            surface_emotion: comprehensive.surface_emotion,
            underlying_feelings: [
                ...comprehensive.underlying_feelings,
                ...(complex?.underlying_feelings || [])
            ].filter((v, i, a) => a.indexOf(v) === i), // إزالة التكرار
            
            emotional_complexity: {
                level: complex?.emotional_complexity?.level || comprehensive.emotional_complexity.level,
                contradictions: [
                    ...(comprehensive.emotional_complexity?.contradictions || []),
                    ...(complex?.emotional_complexity?.contradictions || [])
                ],
                ambivalence_score: Math.max(
                    comprehensive.emotional_complexity?.ambivalence_score || 0,
                    complex?.emotional_complexity?.ambivalence_score || 0
                )
            },
            
            cpf_spectrum: {
                position: this.calculateUnifiedSpectrumPosition([
                    comprehensive.cpf_spectrum,
                    spectrum.cpf_spectrum
                ]),
                tendency: spectrum.cpf_spectrum?.tendency || comprehensive.cpf_spectrum.tendency,
                confidence: this.calculateUnifiedConfidence([
                    comprehensive.cpf_spectrum,
                    spectrum.cpf_spectrum
                ]),
                reasoning: spectrum.cpf_spectrum?.reasoning || comprehensive.cpf_spectrum.reasoning
            },
            
            mathematical_patterns: {
                detected: [
                    ...(comprehensive.mathematical_patterns?.detected || []),
                    ...(spectrum.mathematical_patterns?.detected || [])
                ],
                significance: Math.max(
                    comprehensive.mathematical_patterns?.significance || 0,
                    spectrum.mathematical_patterns?.significance || 0
                )
            },
            
            insights: [
                ...comprehensive.insights,
                ...(complex?.insights || []),
                ...(spectrum?.insights || [])
            ]
        };
        
        return unified;
    }

    /**
     * حساب موقع الطيف الموحد
     */
    calculateUnifiedSpectrumPosition(spectrum_analyses) {
        const positions = spectrum_analyses
            .filter(analysis => analysis && analysis.position)
            .map(analysis => parseFloat(analysis.position));
        
        if (positions.length === 0) return 0.5;
        
        // متوسط مرجح بالثقة
        const confidences = spectrum_analyses
            .filter(analysis => analysis && analysis.confidence)
            .map(analysis => parseFloat(analysis.confidence));
        
        if (confidences.length === positions.length) {
            const totalWeight = confidences.reduce((sum, conf) => sum + conf, 0);
            const weightedSum = positions.reduce((sum, pos, i) => sum + pos * confidences[i], 0);
            return weightedSum / totalWeight;
        }
        
        // متوسط بسيط إذا لم تتوفر معلومات الثقة
        return positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
    }

    /**
     * حساب الثقة الموحدة
     */
    calculateUnifiedConfidence(spectrum_analyses) {
        const confidences = spectrum_analyses
            .filter(analysis => analysis && analysis.confidence)
            .map(analysis => parseFloat(analysis.confidence));
        
        if (confidences.length === 0) return 0.5;
        
        // متوسط الثقة مع معامل تصحيح للاتساق
        const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
        const variance = confidences.reduce((sum, conf) => sum + Math.pow(conf - avgConfidence, 2), 0) / confidences.length;
        const consistency_factor = 1 - Math.min(variance, 0.3);
        
        return avgConfidence * consistency_factor;
    }

    /**
     * التشفير العاطفي المتقدم مع GPT
     */
    async advancedGPTEmotionalEncryption(experience_data) {
        const judge_seed = this.oscillators.judge;
        
        // توقيع معقد يدمج تحليل GPT
        const gpt_signature = this.generateGPTSignature(
            experience_data.gpt_analysis,
            judge_seed
        );
        
        // تطبيق الأنماط المكتشفة
        const pattern_enhanced_signature = this.enhanceWithGPTPatterns(
            gpt_signature,
            experience_data.gpt_analysis.mathematical_patterns
        );
        
        // Probably ID متقدم
        const probably_id = this.generateGPTProbablyID(
            pattern_enhanced_signature,
            experience_data.complexity_level
        );
        
        const encrypted_experience = {
            probably_id: probably_id,
            gpt_signature: pattern_enhanced_signature,
            judge_seed: judge_seed,
            complexity_level: experience_data.complexity_level,
            gpt_confidence: experience_data.gpt_analysis.cpf_spectrum.confidence,
            encryption_timestamp: Date.now(),
            experience_data: experience_data
        };
        
        this.emotionalCrypto.probably_ids.set(probably_id, encrypted_experience);
        
        console.log(`🔐 تشفير متقدم مع GPT: ${probably_id}`);
        console.log(`🧠 تعقيد: ${experience_data.complexity_level}`);
        console.log(`📊 ثقة GPT: ${(experience_data.gpt_analysis.cpf_spectrum.confidence * 100).toFixed(1)}%`);
        
        return encrypted_experience;
    }

    /**
     * اكتشاف الأنماط المعرفية
     */
    discoverCognitivePatterns(unified_analysis) {
        const patterns = [];
        
        // أنماط التعقيد العاطفي
        if (unified_analysis.emotional_complexity.level === 'شديد التعقيد') {
            patterns.push({
                type: 'extreme_complexity',
                significance: 0.9,
                description: 'تعقيد عاطفي استثنائي يتطلب معالجة متقدمة'
            });
        }
        
        // أنماط التناقض
        if (unified_analysis.emotional_complexity.ambivalence_score > 0.7) {
            patterns.push({
                type: 'high_ambivalence',
                significance: 0.8,
                description: 'تناقض عاطفي عالي - صراع داخلي معقد'
            });
        }
        
        // أنماط الطيف القصوى
        const spectrum_pos = parseFloat(unified_analysis.cpf_spectrum.position);
        if (spectrum_pos < 0.2 || spectrum_pos > 0.8) {
            patterns.push({
                type: 'extreme_spectrum_position',
                significance: 0.85,
                description: `موقع طيفي قصوى - ${spectrum_pos < 0.2 ? 'اقتراب من العدم' : 'اقتراب من الألم'}`
            });
        }
        
        // أنماط رياضية مكتشفة من GPT
        if (unified_analysis.mathematical_patterns.significance > 0.6) {
            patterns.push({
                type: 'gpt_mathematical_resonance',
                significance: unified_analysis.mathematical_patterns.significance,
                description: 'أنماط رياضية معقدة مكتشفة بواسطة GPT'
            });
        }
        
        return patterns;
    }

    /**
     * عرض نتائج تحليل GPT
     */
    displayGPTAnalysisResults(result) {
        console.log("\n📊 نتائج التحليل المتقدم مع GPT-4o-mini:");
        console.log("=" * 60);
        
        // التحليل السطحي
        const surface = result.gpt_analysis.surface_emotion;
        console.log("😊 العاطفة السطحية:");
        console.log(`   ${surface.primary} (شدة: ${(surface.intensity * 100).toFixed(1)}%, ثقة: ${(surface.confidence * 100).toFixed(1)}%)`);
        
        // المشاعر الكامنة
        console.log("\n💭 المشاعر الكامنة:");
        result.gpt_analysis.underlying_feelings.slice(0, 3).forEach((feeling, i) => {
            console.log(`   ${i + 1}. ${feeling}`);
        });
        
        // التعقيد العاطفي
        const complexity = result.gpt_analysis.emotional_complexity;
        console.log(`\n🧩 التعقيد العاطفي: ${complexity.level}`);
        console.log(`   تناقضات: ${complexity.contradictions.length}`);
        console.log(`   درجة التضارب: ${(complexity.ambivalence_score * 100).toFixed(1)}%`);
        
        // طيف CPF
        const spectrum = result.gpt_analysis.cpf_spectrum;
        console.log(`\n🌈 طيف CPF:`);
        console.log(`   الموقع: ${spectrum.position} (${spectrum.tendency})`);
        console.log(`   الثقة: ${(spectrum.confidence * 100).toFixed(1)}%`);
        console.log(`   التفسير: ${spectrum.reasoning}`);
        
        // حالة الهزازات
        console.log("\n🎛️ حالة الهزازات:");
        console.log(`   🔵 الوجود: ${result.cpf_integration.oscillator_state.existence}`);
        console.log(`   🟡 الديناميكي: ${result.cpf_integration.oscillator_state.dynamic.toFixed(6)}`);
        console.log(`   🔴 القاضي: ${result.cpf_integration.oscillator_state.judge.toFixed(6)}`);
        
        // الأنماط المعرفية
        if (result.cpf_integration.cognitive_patterns.length > 0) {
            console.log("\n🔢 الأنماط المعرفية المكتشفة:");
            result.cpf_integration.cognitive_patterns.forEach((pattern, i) => {
                console.log(`   ${i + 1}. ${pattern.type} (${(pattern.significance * 100).toFixed(1)}%)`);
                console.log(`      ${pattern.description}`);
            });
        }
        
        // التشفير
        if (result.encryption) {
            console.log("\n🔐 التشفير العاطفي:");
            console.log(`   🏷️  Probably ID: ${result.encryption.probably_id}`);
            console.log(`   🌱 البذرة: ${result.encryption.judge_seed.toFixed(8)}`);
            console.log(`   🧠 مستوى التعقيد: ${result.encryption.complexity_level}`);
        }
        
        // الرؤى المتقدمة
        if (result.advanced_insights.length > 0) {
            console.log("\n💡 الرؤى المتقدمة:");
            result.advanced_insights.slice(0, 3).forEach((insight, i) => {
                console.log(`   ${i + 1}. ${insight}`);
            });
        }
        
        // الأداء
        console.log("\n📈 إحصائيات الأداء:");
        console.log(`   ⏱️  وقت التحليل: ${result.performance.analysis_time}ms`);
        console.log(`   📞 طلبات GPT: ${result.performance.gpt_stats.total_requests}`);
        console.log(`   ✅ نجح: ${result.performance.gpt_stats.successful_requests}`);
        console.log(`   🪙 رموز مستهلكة: ${result.performance.gpt_stats.total_tokens_used}`);
        console.log(`   ⚡ متوسط الاستجابة: ${result.performance.gpt_stats.average_response_time.toFixed(0)}ms`);
    }

    /**
     * تحليل الاستجابة من GPT
     */
    parseGPTResponse(content) {
        try {
            return JSON.parse(content);
        } catch (error) {
            console.warn("⚠️ خطأ في تحليل JSON من GPT:", error.message);
            
            // محاولة استخراج معلومات أساسية من النص
            return this.extractBasicInfoFromText(content);
        }
    }

    /**
     * استخراج معلومات أساسية من النص (fallback)
     */
    extractBasicInfoFromText(content) {
        // تحليل بسيط إذا فشل JSON parsing
        const spectrum_match = content.match(/(\d+\.?\d*)/);
        const spectrum_position = spectrum_match ? Math.min(1, Math.max(0, parseFloat(spectrum_match[1]))) : 0.5;
        
        return {
            surface_emotion: {
                primary: "عاطفة معقدة",
                intensity: 0.7,
                confidence: 0.6
            },
            underlying_feelings: ["مشاعر كامنة"],
            emotional_complexity: {
                level: "معتدل",
                contradictions: [],
                ambivalence_score: 0.5
            },
            cpf_spectrum: {
                position: spectrum_position,
                tendency: spectrum_position < 0.4 ? "void" : spectrum_position > 0.6 ? "pain" : "neutral",
                confidence: 0.6,
                reasoning: "تحليل تلقائي بديل"
            },
            mathematical_patterns: {
                detected: [],
                significance: 0.3
            },
            insights: ["تحليل تم باستخدام نظام بديل"]
        };
    }

    /**
     * محاكي GPT للحالات الطارئة
     */
    mockGPTResponse(text, analysis_type) {
        console.log(`🔄 محاكاة GPT-4o-mini للتحليل ${analysis_type}`);
        
        // محاكاة ذكية بناءً على النص
        const hasNegativeWords = /sad|pain|hurt|cry|death|hate|fear|angry/i.test(text);
        const hasPositiveWords = /happy|joy|love|beautiful|amazing|wonderful|great/i.test(text);
        const hasComplexWords = /yet|but|however|although|conflicted|torn|mixed/i.test(text);
        
        let spectrum_position = 0.5;
        if (hasNegativeWords && !hasPositiveWords) {
            spectrum_position = 0.2 + Math.random() * 0.2;
        } else if (hasPositiveWords && !hasNegativeWords) {
            spectrum_position = 0.6 + Math.random() * 0.2;
        } else if (hasComplexWords) {
            spectrum_position = 0.3 + Math.random() * 0.4;
        }
        
        return {
            surface_emotion: {
                primary: hasComplexWords ? "عاطفة معقدة" : hasNegativeWords ? "سلبية" : "إيجابية",
                intensity: 0.7 + Math.random() * 0.3,
                confidence: 0.6 + Math.random() * 0.3
            },
            underlying_feelings: ["محاكاة تحليل المشاعر"],
            emotional_complexity: {
                level: hasComplexWords ? "معقد" : "معتدل",
                contradictions: hasComplexWords ? ["تناقض محاكي"] : [],
                ambivalence_score: hasComplexWords ? 0.8 : 0.3
            },
            cpf_spectrum: {
                position: spectrum_position,
                tendency: spectrum_position < 0.4 ? "void" : spectrum_position > 0.6 ? "pain" : "neutral",
                confidence: 0.7,
                reasoning: "تحليل محاكي ذكي"
            },
            mathematical_patterns: {
                detected: [],
                significance: 0.4
            },
            insights: ["رؤى محاكية للتجريب"]
        };
    }

    // Helper methods
    generateGPTSignature(gpt_analysis, seed) {
        const signature_data = {
            spectrum_position: gpt_analysis.cpf_spectrum.position,
            complexity_hash: crypto.createHash('md5').update(gpt_analysis.emotional_complexity.level).digest('hex'),
            ambivalence_factor: gpt_analysis.emotional_complexity.ambivalence_score,
            gpt_confidence: gpt_analysis.cpf_spectrum.confidence,
            seed_multiplier: seed
        };
        
        return signature_data;
    }

    enhanceWithGPTPatterns(signature, mathematical_patterns) {
        signature.pattern_enhancement = {
            detected_patterns: mathematical_patterns.detected,
            pattern_significance: mathematical_patterns.significance,
            enhancement_factor: mathematical_patterns.significance * 1.618 // Golden ratio
        };
        
        return signature;
    }

    generateGPTProbablyID(signature, complexity_level) {
        const timestamp = Date.now().toString(36);
        const complexity_prefix = {
            'بسيط': 'SMP',
            'معتدل': 'MOD', 
            'معقد': 'CPX',
            'شديد التعقيد': 'XTR'
        }[complexity_level] || 'UNK';
        
        const signature_hash = crypto.createHash('sha256')
            .update(JSON.stringify(signature))
            .digest('hex')
            .substring(0, 8);
        
        return `GPT_${complexity_prefix}_${signature_hash}_${timestamp}`;
    }

    generateGPTInsights(unified_analysis) {
        const insights = [];
        
        // رؤى بناءً على التعقيد
        if (unified_analysis.emotional_complexity.level === 'شديد التعقيد') {
            insights.push("تعقيد عاطفي استثنائي يشير إلى خبرة إنسانية عميقة ومتطورة");
        }
        
        // رؤى بناءً على التناقض
        if (unified_analysis.emotional_complexity.ambivalence_score > 0.8) {
            insights.push("مستوى عالٍ من التناقض العاطفي - قد يكون مؤشراً على نمو شخصي");
        }
        
        // رؤى بناءً على الطيف
        const pos = parseFloat(unified_analysis.cpf_spectrum.position);
        if (pos < 0.2) {
            insights.push("اقتراب خطير من العدم العاطفي - يحتاج انتباه ودعم");
        } else if (pos > 0.8) {
            insights.push("طاقة عاطفية عالية جداً - قد تحتاج توجيه وتهذيب");
        }
        
        return insights;
    }
}

// تشغيل مع GPT-4o-mini
async function runGPT4oExperiment(api_key, test_text) {
    if (!api_key) {
        console.error("❌ مفتاح OpenAI API مطلوب!");
        console.log("💡 استخدم: node script.js sk-your-key 'نص للتحليل'");
        return;
    }
    
    const lab = new GPT4oEmotionalLab(api_key);
    
    if (!test_text) {
        // نصوص افتراضية للاختبار
        const test_cases = [
            "I love him with every fiber of my being yet this love slowly kills me",
            "أحبه بكل جوارحي لكن حبي له يقتلني ببطء، كل نظرة منه تحييني وتميتني",
            "I feel simultaneously drowning in despair yet floating on hope, utterly alone in a crowded room"
        ];
        
        console.log("🧪 تشغيل اختبار شامل مع GPT-4o-mini...");
        
        const results = [];
        for (const [index, text] of test_cases.entries()) {
            console.log(`\n--- اختبار ${index + 1} ---`);
            const result = await lab.analyzeWithGPT4o(text);
            results.push(result);
            
            // فترة انتظار بين الطلبات
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        return results;
    } else {
        // تحليل نص واحد
        return await lab.analyzeWithGPT4o(test_text);
    }
}

module.exports = { GPT4oEmotionalLab, runGPT4oExperiment };

// تشغيل مباشر
if (require.main === module) {
    const api_key = process.argv[2];
    const test_text = process.argv[3];
    
    runGPT4oExperiment(api_key, test_text)
        .then(result => {
            console.log("\n🎉 انتهى التحليل بنجاح!");
        })
        .catch(error => {
            console.error("❌ خطأ:", error.message);
        });
}