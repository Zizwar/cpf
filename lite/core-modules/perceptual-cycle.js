/**
 * Perceptual Cycle - الدورة الإدراكية
 *
 * العقل الذي لا ينام: دورة الوعي المستمرة التي تحوّل نبضات الإيقاع المعرفي
 * (قيمة "القاضي") إلى إطارات واعية وإطارات خلفية وموجات بناء فيكتوري.
 *
 * ملاحظة تاريخية: النسخة الأصلية من هذا الملف فُقدت (كانت نسخة مكررة من wino.js).
 * أعيد بناؤها هنا وفق العقد الذي تتوقعه بقية الوحدات:
 *   - CognitiveRhythm يستدعي:  execute_frame(judge_value), schedule_update(type)
 *   - wino.js يستدعي:          start(), stop(), getLastScalingInfo()
 *   - GrowthEngine يستدعي:     trigger_construction_wave(new_capacity) عند النمو
 *
 * @module PerceptualCycle
 * @version 5.0-living
 */

class PerceptualCycle {
    constructor(unified_space) {
        this.unified_space = unified_space;
        this.is_active = false;

        // === عتبات الإطارات ===
        // رنين ضعيف => إطار خلفي (صيانة)، رنين قوي => إطار واعٍ (تنفيذ المهام)
        this.CONSCIOUS_THRESHOLD = 0.15;
        this.DEEP_FOCUS_THRESHOLD = 0.45;

        // === طابور المهام المعلقة (تُنفذ في الإطارات الواعية) ===
        this.pending_updates = [];
        this.max_queue_size = 64;

        // === سجل الإطارات ===
        this.frame_log = {
            total_frames: 0,
            conscious_frames: 0,
            background_frames: 0,
            construction_waves: 0,
            last_frame_type: 'none',
            last_resonance: 0
        };

        // === معلومات آخر إعادة تحجيم فيكتوري ===
        this.last_scaling_info = null;

        // === مستمعون خارجيون (المستوى الأعلى يمكنه مراقبة الأحداث الداخلية) ===
        this.listeners = new Map(); // event -> [callback]
    }

    /**
     * بدء الدورة الإدراكية
     */
    start() {
        if (this.is_active) return;
        this.is_active = true;
        this.emit('cycle_started', {});
    }

    /**
     * إيقاف الدورة الإدراكية
     */
    stop() {
        if (!this.is_active) return;
        this.is_active = false;
        this.emit('cycle_stopped', { frames: this.frame_log.total_frames });
    }

    /**
     * الإطار الواحد - يُستدعى من CognitiveRhythm في كل نبضة
     * قيمة الرنين (القاضي) تحدد نوع الإطار.
     */
    execute_frame(resonance) {
        if (!this.is_active) return null;

        this.frame_log.total_frames++;
        this.frame_log.last_resonance = resonance;

        let frame_result;
        if (resonance >= this.CONSCIOUS_THRESHOLD) {
            frame_result = this.conscious_frame(resonance);
        } else {
            frame_result = this.background_frame(resonance);
        }

        this.frame_log.last_frame_type = frame_result.type;
        return frame_result;
    }

    /**
     * إطار واعٍ: رنين قوي => تنفيذ المهام المعلقة والمعالجة العميقة
     */
    conscious_frame(resonance) {
        this.frame_log.conscious_frames++;

        const executed = [];
        // تنفيذ المهام المعلقة (الأقدم أولاً)، بعمق يتناسب مع قوة الرنين
        const batch = resonance >= this.DEEP_FOCUS_THRESHOLD ? 4 : 1;
        for (let i = 0; i < batch && this.pending_updates.length > 0; i++) {
            const update = this.pending_updates.shift();
            executed.push(this.run_update(update, resonance));
        }

        const result = {
            type: resonance >= this.DEEP_FOCUS_THRESHOLD ? 'deep_focus_frame' : 'conscious_frame',
            resonance,
            executed_updates: executed
        };
        this.emit('conscious_frame', result);
        return result;
    }

    /**
     * إطار خلفي: صيانة خفيفة ومراقبة
     */
    background_frame(resonance) {
        this.frame_log.background_frames++;

        // صيانة خفيفة: تسريب بطيء لطابور المهام منخفضة الأهمية
        if (this.pending_updates.length > this.max_queue_size / 2) {
            const dropped = this.pending_updates.splice(0, 1);
            this.emit('maintenance_drop', { dropped });
        }

        return { type: 'background_frame', resonance };
    }

    /**
     * جدولة مهمة معلقة - يستدعيها CognitiveRhythm عند اكتشاف نمط مهم
     */
    schedule_update(update_type, payload = {}) {
        if (this.pending_updates.length >= this.max_queue_size) {
            this.pending_updates.shift(); // الأقدم يفسح المجال
        }
        this.pending_updates.push({
            type: update_type,
            payload,
            scheduled_at: Date.now()
        });
        return this.pending_updates.length;
    }

    /**
     * تنفيذ مهمة معلقة واحدة
     */
    run_update(update, resonance) {
        switch (update.type) {
            case 'pattern_integration':
                // دمج نمط مكتشف حديثاً في الذاكرة طويلة المدى
                this.emit('pattern_integrated', { update, resonance });
                return { type: update.type, status: 'integrated' };

            case 'capacity_assessment': {
                // تقييم هل تحتاج السعة إلى توسع
                const growth = this.unified_space?.space?.growth_engine;
                if (growth?.assess_capacity_need) {
                    growth.assess_capacity_need(resonance);
                }
                return { type: update.type, status: 'assessed' };
            }

            default:
                this.emit('unknown_update', { update });
                return { type: update.type, status: 'skipped' };
        }
    }

    /**
     * موجة البناء الفيكتوري - يستدعيها GrowthEngine عند نمو السعة
     * "المهارات القديمة تُعرض من جديد بدقة أعلى"
     */
    trigger_construction_wave(new_capacity, old_capacity = null) {
        this.frame_log.construction_waves++;

        this.last_scaling_info = {
            wave_number: this.frame_log.construction_waves,
            old_capacity,
            new_capacity,
            rescaled_at: Date.now(),
            note: 'vectorial re-rendering: old noise may now resolve into ornament'
        };

        // إعادة عرض المحتوى الفيكتوري: نطلب من الذاكرة إعادة التحجيم إن دعمت ذلك
        const memory = this.unified_space?.space?.agate_memory;
        if (memory?.rescale_experiences) {
            memory.rescale_experiences(new_capacity);
        }

        this.emit('construction_wave', this.last_scaling_info);
        return this.last_scaling_info;
    }

    /**
     * معلومات آخر إعادة تحجيم - يستدعيها wino.js
     */
    getLastScalingInfo() {
        return this.last_scaling_info;
    }

    /**
     * حالة الدورة الحالية (للتقارير والمراقبة)
     */
    getState() {
        return {
            is_active: this.is_active,
            pending_updates: this.pending_updates.length,
            ...this.frame_log
        };
    }

    // =================== نظام أحداث بسيط ===================

    on(event, callback) {
        if (!this.listeners.has(event)) this.listeners.set(event, []);
        this.listeners.get(event).push(callback);
        return this;
    }

    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (!callbacks) return;
        for (const cb of callbacks) {
            try { cb(data); } catch (e) { /* مستمع فاشل لا يوقف الدورة */ }
        }
    }
}

module.exports = PerceptualCycle;
