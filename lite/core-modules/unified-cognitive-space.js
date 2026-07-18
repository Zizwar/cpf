/**
 * Unified Cognitive Space - الفضاء المعرفي الموحد
 * 
 * يحتوي على جميع المكونات المعرفية ويعالج المدخلات من خلال المناظير.
 * @module UnifiedCognitiveSpace
 */
const AgateMemory = require('./agate-memory');
const CoreSimulator = require('./core-simulator');
const PerspectivesManager = require('./perspectives-manager');
const DynamicOthersModeling = require('./dynamic-others-modeling');
const ScriptManager = require('./script-manager');
const RealityEngine = require('./reality-engine'); // Assuming RealityEngine is also part of the space
const WaveDynamics = require('./wave-dynamics');   // And WaveDynamics
const DecisionQuantum = require('./decision-quantum'); // And DecisionQuantum
const QuantumSimulators = require('./quantum-simulators'); // المحاكيات الكمية المتوازية
 
class UnifiedCognitiveSpace {
    constructor(brain_capacity = 1000) {
        this.capacity = brain_capacity;
        
        // كل شيء في فضاء واحد
        this.space = {
            // الذاكرة الموحدة
            agate_memory: new AgateMemory(),
            
            // المحاكي الأساسي الواحد
            core_simulator: new CoreSimulator(),
            
            // مدير المناظير
            perspectives_manager: new PerspectivesManager(),
            
            // نماذج الآخرين
            others_models: new DynamicOthersModeling(brain_capacity),
            
            // مدير السكريبتات
            script_manager: new ScriptManager(),

            // محرك الواقع والوعي الذاتي
            reality_engine: new RealityEngine(),

            // ديناميكيات الموجات والتداخل المعرفي
            wave_dynamics: new WaveDynamics(),

            // نظام اتخاذ القرار الكمي
            decision_quantum: new DecisionQuantum(),

            // المحاكيات الكمية المتوازية (واقع/ذاكرة/تنبؤ/أنماط)
            quantum_simulators: new QuantumSimulators({ brain_capacity }),

            // الحالة الحالية
            current_script_name: 'default_reality.script', // Default script
            active_perspectives: new Set(),
            system_state: {
                current_cognitive_modifier: { processing_speed_modifier: 1.0, error_probability_modifier: 1.0, creativity_boost_modifier: 1.0 }
            }

        };
    }

    // معالجة بمنظور واحد
    async process_with_perspective(query, perspective_name, context = {}) {
        const perspective_config = this.space.perspectives_manager.get_perspective(perspective_name);
        if (!perspective_config) {
            throw new Error(`Perspective "${perspective_name}" not found.`);
        }
        this.space.active_perspectives = new Set([perspective_name]);
        const script_parameters = this.space.script_manager.get_script_parameters(this.space.current_script_name);

        // 1. Reality Engine: معالجة التجسيد، التحقق من الواقع، والحصول على CognitiveModifier
        const reality_processing_result = await this.space.reality_engine.process_embodiment_and_validate(query, context);
        this.space.system_state.current_cognitive_modifier = reality_processing_result.cognitive_modifier;
        const validation_from_reality_engine = reality_processing_result.reality_validation;

        // 2. Agate Memory: الحصول على الخبرات الكمية ذات الصلة
        // السياق يمكن أن يشمل query.details, context.situation, etc.
        const query_context_for_experiences = { ...context, query_content: query, perspective: perspective_name };
        const relevant_experiences = await this.space.agate_memory.getRelevantExperiences(query_context_for_experiences, 0.4 /* example threshold */);

        // 3. Wave Dynamics: تحديث المذبذبات بناءً على الخبرات المفعلة
        // (يفترض أن WaveDynamics لديها الآن طريقة للقيام بذلك، مثل update_oscillators_from_experiences)
        await this.space.wave_dynamics.update_oscillators_from_experiences(relevant_experiences, context);
        // لا نحتاج بالضرورة إلى حالة الموجة هنا مباشرة، بل قبل استدعاء DecisionQuantum

        // 4. CoreSimulator (QuantumSimulators): معالجة الاستعلام، مع إثراءه بالخبرات والمعدل المعرفي
        const simulation_result = await this.space.core_simulator.process({
            query: query,
            context: context,
            // فلاتر المنظور
            trust_matrix: perspective_config.trust_matrix,
            emotional_filter: perspective_config.emotional_filter,
            script_bias: perspective_config.script_bias || perspective_config.script_name, // Pass script name or bias
            
            // الذاكرة المفلترة حسب المنظور
            memory_access: this.space.agate_memory.create_filtered_access(perspective_config),
            
            // نماذج الآخرين المفلترة (بالمفتاح الذي يقرأه المحاكي فعلاً)
            others_models: this.space.others_models.filter_by_perspective(perspective_config),
            script_parameters: script_parameters,
            // (جديد) تمرير الخبرات والمعدل المعرفي
            active_experiences: relevant_experiences,
            cognitive_modifier: this.space.system_state.current_cognitive_modifier
        });

        // تجميع وجهة النظر النهائية لهذا المنظور
        const viewpoint = {
            ...simulation_result,
            validation: validation_from_reality_engine, // استخدام نتيجة التحقق التي حصلنا عليها بالفعل
            source_perspective: perspective_name,
            influencing_experiences_summary: relevant_experiences.map(e => ({ skill_id: e.skill_id, proficiency: e.proficiency_level })),
            // قد نرغب في تمرير تفاصيل الخبرات الكاملة إذا احتاجتها DecisionQuantum لاحقًا
        };
        return viewpoint;
    }

    // البرلمان الداخلي - عدة مناظير في نفس الوقت
    async internal_parliament(query, perspective_names, context = {}) {
        this.space.active_perspectives = new Set(perspective_names);
        const concurrent_processing = perspective_names.map(name => 
            this.process_with_perspective(query, name, context)
        );
        const all_viewpoints = await Promise.all(concurrent_processing);

        // (جديد) الحصول على حالة التداخل الموجي الحالية بعد معالجة جميع المناظير وتفعيل خبراتها
        const current_wave_dynamics_state = await this.space.wave_dynamics.calculate_current_interference(context);

        // تهيئة سياق القرار لوحدة القرار الكمي
        const decision_context_for_quantum = {
            options: all_viewpoints, // كل وجهة نظر هي خيار محتمل
            type: 'parliamentary_synthesis', // نعطي العملية نوعاً مميزاً
            social_models: context.social_models || query.social_models || [],
            trust_context: context.trust_context || query.trust_context || {},
            // (جديد) تمرير المعدل المعرفي وحالة الموجات
            cognitive_modifier: this.space.system_state.current_cognitive_modifier,
            wave_dynamics_state: current_wave_dynamics_state,
            // يمكن أيضًا تمرير قائمة مجمعة للـ relevant_experiences إذا كانت DecisionQuantum تحتاجها بشكل عام
            // all_relevant_experiences: all_viewpoints.reduce((acc, vp) => acc.concat(vp.influencing_experiences_details || []), []),
            ...(context.decision_details || {}), // إذا كان السياق يحتوي على تفاصيل قرار محددة
            ...context // نمرر السياق العام
        };

        // استدعاء DecisionQuantum
        const final_decision = await this.space.decision_quantum.evaluate(
            decision_context_for_quantum, 
            context // السياق العام يمكن أن يمرر هنا أيضاً للتأثيرات البيئية وغيرها
        );
        return final_decision;
    }

    set_active_script(script_name) {
        if (this.space.script_manager.get_script(script_name)) {
            this.space.current_script_name = script_name;
            console.log(`Active script set to: ${script_name}`);
        } else {
            console.error(`Script "${script_name}" not found.`);
        }
    }
}

module.exports = UnifiedCognitiveSpace;