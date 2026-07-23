/**
 * Soul File - ملف الروح
 *
 * حفظ واستعادة "روح" الكائن: كل حالته الداخلية (شخصية، مشاعر، ذكريات،
 * أنماط مكتشفة، يوميات، مرحلة نمو) في ملف JSON واحد.
 * الكائن الذي يُستعاد من ملف روحه يواصل حياته من حيث توقف —
 * بنفس الذكريات ونفس الأسئلة المعلقة.
 *
 * @module Soul
 */

const fs = require('fs');
const path = require('path');
const WinoBeing = require('./mind');

const DEFAULT_DIR = path.join(process.cwd(), 'souls');

class Soul {
    /**
     * حفظ روح الكائن إلى ملف
     */
    static save(being, filepath = null) {
        const target = filepath || path.join(DEFAULT_DIR, `${Soul.slug(being.persona.name)}.soul.json`);
        fs.mkdirSync(path.dirname(target), { recursive: true });

        const data = being.toJSON();
        fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf8');

        return { saved: true, path: target, bytes: fs.statSync(target).size };
    }

    /**
     * استعادة كائن من ملف روحه
     */
    static load(filepath, extra_config = {}) {
        const raw = fs.readFileSync(filepath, 'utf8');
        const data = JSON.parse(raw);

        if (data.format !== 'cpf-soul') {
            throw new Error(`Not a soul file: ${filepath}`);
        }

        return WinoBeing.fromJSON(data, extra_config);
    }

    /**
     * استعادة إن وُجد الملف، وإلا إنشاء كائن جديد (نمط "الرفيق الدائم")
     */
    static loadOrCreate(name, config = {}) {
        const filepath = path.join(DEFAULT_DIR, `${Soul.slug(name)}.soul.json`);
        if (fs.existsSync(filepath)) {
            const being = Soul.load(filepath, config);
            return { being, resurrected: true, path: filepath };
        }
        const being = new WinoBeing({ name, ...config });
        return { being, resurrected: false, path: filepath };
    }

    /**
     * قائمة الأرواح المحفوظة
     */
    static list(dir = DEFAULT_DIR) {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir)
            .filter(f => f.endsWith('.soul.json'))
            .map(f => {
                try {
                    const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
                    return {
                        file: f,
                        name: data.persona?.name,
                        saved_at: data.saved_at,
                        capacity: data.brain_capacity,
                        stage: data.growth_stage,
                        memories: (data.named_memories || []).length
                    };
                } catch {
                    return { file: f, corrupted: true };
                }
            });
    }

    static slug(name) {
        return String(name).trim().replace(/\s+/g, '-').replace(/[^\w؀-ۿ-]/g, '') || 'being';
    }
}

module.exports = Soul;
