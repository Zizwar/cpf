/**
 * Text Affect - محلل المشاعر النصي
 *
 * يحوّل النص (عربي أو إنجليزي) إلى طيف عاطفي بدون أي اعتماديات خارجية.
 * هذا هو "الحس" الخارجي للكائن: كل رسالة تصله تتحول إلى موجة عاطفية
 * تُضخ في المذبذبات وتُشفّر في الذاكرة.
 *
 * الطيف: 0.0 = عدم/انطفاء ، 0.5 = سكينة ، 1.0 = ألم/هياج
 * (نفس اصطلاح مختبرات emotional-oscillator، موحّداً)
 *
 * @module TextAffect
 */

// معجم عاطفي مصغّر: كلمة => { عاطفة: شدة }
// القيم بين -1 و 1: الإشارة تحدد اتجاه التكافؤ (سلبي/إيجابي)
const LEXICON = {
    // فرح وإيجابية - عربي
    'سعيد': { joy: 0.8 }, 'سعيدة': { joy: 0.8 }, 'فرح': { joy: 0.9 }, 'فرحان': { joy: 0.9 },
    'رائع': { joy: 0.7, excitement: 0.5 }, 'جميل': { joy: 0.6 }, 'حب': { joy: 0.7, trust: 0.6 },
    'أحبك': { joy: 0.8, trust: 0.8 }, 'احبك': { joy: 0.8, trust: 0.8 }, 'شكرا': { joy: 0.5, trust: 0.5 },
    'شكراً': { joy: 0.5, trust: 0.5 }, 'ممتاز': { joy: 0.7 }, 'نجحت': { joy: 0.8, excitement: 0.6 },
    'ضحك': { joy: 0.7 }, 'أمل': { joy: 0.5, curiosity: 0.4 }, 'سلام': { calmness: 0.7 },
    'هدوء': { calmness: 0.8 }, 'مطمئن': { calmness: 0.7, trust: 0.5 },

    // حزن وسلبية - عربي
    'حزين': { sadness: 0.8 }, 'حزينة': { sadness: 0.8 }, 'حزن': { sadness: 0.8 },
    'يأس': { despair: 0.9 }, 'يائس': { despair: 0.9 }, 'اكتئاب': { despair: 0.9, sadness: 0.8 },
    'وحيد': { sadness: 0.7, loneliness: 0.8 }, 'وحدة': { loneliness: 0.8 },
    'بكاء': { sadness: 0.8 }, 'ألم': { sadness: 0.7, pain: 0.8 }, 'تعب': { fatigue: 0.7 },
    'تعبان': { fatigue: 0.7, sadness: 0.4 }, 'مرهق': { fatigue: 0.8 },
    'فقدت': { sadness: 0.7, despair: 0.4 }, 'مات': { sadness: 0.9, despair: 0.5 },

    // خوف وقلق - عربي
    'خوف': { fear: 0.8 }, 'خائف': { fear: 0.8 }, 'قلق': { anxiety: 0.8 }, 'قلقان': { anxiety: 0.8 },
    'رعب': { fear: 0.95 }, 'هلع': { fear: 0.9, anxiety: 0.8 }, 'توتر': { anxiety: 0.7 },
    'خطر': { fear: 0.7, alertness: 0.8 },

    // غضب - عربي
    'غضب': { anger: 0.8 }, 'غاضب': { anger: 0.8 }, 'زعلان': { anger: 0.5, sadness: 0.5 },
    'كره': { anger: 0.7 }, 'أكره': { anger: 0.8 }, 'ظلم': { anger: 0.7, sadness: 0.4 },

    // فضول ومعرفة - عربي
    'لماذا': { curiosity: 0.6 }, 'كيف': { curiosity: 0.5 }, 'ماذا': { curiosity: 0.4 },
    'فضول': { curiosity: 0.8 }, 'أتساءل': { curiosity: 0.7 }, 'اتساءل': { curiosity: 0.7 },
    'تعلم': { curiosity: 0.6 }, 'اكتشف': { curiosity: 0.7, excitement: 0.5 },
    'حكمة': { curiosity: 0.5, calmness: 0.5 }, 'معنى': { curiosity: 0.6 },

    // امتنان وعلاقات - عربي
    'ساعدني': { trust: 0.7, joy: 0.5 }, 'ساعد': { trust: 0.5, joy: 0.3 },
    'مساعدة': { trust: 0.5 }, 'امتنان': { joy: 0.6, trust: 0.7 },
    'ممتن': { joy: 0.6, trust: 0.7 }, 'ثقة': { trust: 0.8 }, 'صديق': { trust: 0.6, joy: 0.4 },
    'صديقي': { trust: 0.6, joy: 0.4 }, 'حنين': { nostalgia: 0.8, sadness: 0.3 },
    'اشتياق': { nostalgia: 0.8 }, 'أشتاق': { nostalgia: 0.8, sadness: 0.3 },
    'وفاء': { trust: 0.7 }, 'أمان': { calmness: 0.7, trust: 0.6 },

    // Joy & positive - English
    'happy': { joy: 0.8 }, 'joy': { joy: 0.9 }, 'great': { joy: 0.6 }, 'wonderful': { joy: 0.8 },
    'love': { joy: 0.7, trust: 0.6 }, 'thanks': { joy: 0.5, trust: 0.5 }, 'thank': { joy: 0.5, trust: 0.5 },
    'amazing': { joy: 0.7, excitement: 0.6 }, 'excellent': { joy: 0.7 }, 'beautiful': { joy: 0.6 },
    'peace': { calmness: 0.7 }, 'calm': { calmness: 0.8 }, 'hope': { joy: 0.5, curiosity: 0.4 },
    'laugh': { joy: 0.7 }, 'win': { joy: 0.7, excitement: 0.6 }, 'success': { joy: 0.7 },

    // Sadness & negative - English
    'sad': { sadness: 0.8 }, 'depressed': { despair: 0.9, sadness: 0.8 }, 'despair': { despair: 0.9 },
    'lonely': { loneliness: 0.8, sadness: 0.6 }, 'alone': { loneliness: 0.6 }, 'cry': { sadness: 0.8 },
    'pain': { pain: 0.8, sadness: 0.6 }, 'hurt': { pain: 0.7, sadness: 0.6 }, 'tired': { fatigue: 0.7 },
    'exhausted': { fatigue: 0.9 }, 'lost': { sadness: 0.6, despair: 0.4 }, 'grief': { sadness: 0.9 },

    // Fear & anxiety - English
    'afraid': { fear: 0.8 }, 'fear': { fear: 0.8 }, 'scared': { fear: 0.8 }, 'anxious': { anxiety: 0.8 },
    'anxiety': { anxiety: 0.8 }, 'panic': { fear: 0.9, anxiety: 0.8 }, 'worried': { anxiety: 0.7 },
    'stress': { anxiety: 0.7 }, 'danger': { fear: 0.7, alertness: 0.8 },

    // Anger - English
    'angry': { anger: 0.8 }, 'anger': { anger: 0.8 }, 'hate': { anger: 0.8 }, 'furious': { anger: 0.9 },
    'unfair': { anger: 0.6, sadness: 0.4 },

    // Curiosity - English
    'why': { curiosity: 0.6 }, 'how': { curiosity: 0.4 }, 'wonder': { curiosity: 0.7 },
    'curious': { curiosity: 0.8 }, 'learn': { curiosity: 0.6 }, 'discover': { curiosity: 0.7 },
    'meaning': { curiosity: 0.6 }, 'wisdom': { curiosity: 0.5, calmness: 0.5 }
};

// اتجاه كل عاطفة على الطيف: +1 نحو الألم/الهياج، -1 نحو العدم/الانطفاء، 0 نحو السكينة
const SPECTRUM_DIRECTION = {
    joy: +0.25, excitement: +0.4, trust: -0.05, calmness: -0.15,
    curiosity: +0.15, alertness: +0.35,
    sadness: -0.35, despair: -0.5, loneliness: -0.35, fatigue: -0.3, nostalgia: -0.1,
    fear: +0.45, anxiety: +0.4, anger: +0.5, pain: +0.5
};

class TextAffect {
    /**
     * تحليل نص إلى حالة عاطفية
     * @returns {{ emotions, spectrum_position, intensity, dominant_emotion, matched_words }}
     */
    static analyze(text) {
        const emotions = {};
        const matched_words = [];

        if (typeof text === 'string' && text.length > 0) {
            // تقطيع بسيط يدعم العربية والإنجليزية
            const words = text
                .toLowerCase()
                .replace(/[.,!?؛،؟:;"'()\[\]{}]/g, ' ')
                .split(/\s+/)
                .filter(Boolean);

            for (const word of words) {
                // البحث مع تجريد البادئات العربية الشائعة (ال، و، ف، ب، لل)
                const entry = LEXICON[word]
                    || LEXICON[word.replace(/^(ال|لل)/, '')]
                    || LEXICON[word.replace(/^[وفب]/, '')]
                    || LEXICON[word.replace(/^[وفب](ال|لل)/, '')];
                if (!entry) continue;
                matched_words.push(word);
                for (const [emotion, strength] of Object.entries(entry)) {
                    emotions[emotion] = Math.min(1, (emotions[emotion] || 0) + strength * 0.6);
                }
            }

            // علامات ترقيم قوية = رفع الإثارة
            const exclamations = (text.match(/[!؟?]/g) || []).length;
            if (exclamations > 1) {
                emotions.excitement = Math.min(1, (emotions.excitement || 0) + exclamations * 0.1);
            }
        }

        // حساب موضع الطيف: نبدأ من السكينة 0.5 ونزيح حسب العواطف
        let shift = 0;
        let total_intensity = 0;
        let dominant_emotion = null;
        let dominant_value = 0;

        for (const [emotion, value] of Object.entries(emotions)) {
            const direction = SPECTRUM_DIRECTION[emotion] ?? 0;
            shift += direction * value;
            total_intensity += value;
            if (value > dominant_value) {
                dominant_value = value;
                dominant_emotion = emotion;
            }
        }

        const spectrum_position = Math.max(0.02, Math.min(0.98, 0.5 + shift));
        const intensity = Math.min(1, total_intensity / 2);

        return {
            emotions,
            spectrum_position,
            intensity,
            dominant_emotion: dominant_emotion || 'neutral',
            matched_words
        };
    }

    /**
     * تفسير موضع على الطيف إلى وصف مقروء (عربي + إنجليزي)
     * "مناطق الطيف" الموروثة من مختبر الهزاز العاطفي
     */
    static interpretSpectrum(position) {
        if (position < 0.15) return { zone: 'void', ar: 'انطفاء وانسحاب عميق', en: 'deep void / withdrawal' };
        if (position < 0.35) return { zone: 'low', ar: 'خفوت وحزن هادئ', en: 'low / quiet sadness' };
        if (position < 0.45) return { zone: 'settling', ar: 'ركود يميل للسكينة', en: 'settling toward calm' };
        if (position < 0.55) return { zone: 'calm', ar: 'سكينة وتوازن', en: 'calm equilibrium' };
        if (position < 0.68) return { zone: 'engaged', ar: 'انتباه ونشاط متزن', en: 'engaged / balanced activity' };
        if (position < 0.85) return { zone: 'aroused', ar: 'استثارة عالية (حماس أو توتر)', en: 'high arousal (thrill or tension)' };
        return { zone: 'overload', ar: 'فيض مشاعر وحمل زائد', en: 'emotional flood / overload' };
    }
}

module.exports = TextAffect;
