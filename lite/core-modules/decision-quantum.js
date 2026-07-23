/**
 * Decision Quantum - Decision Wave Collapse System
 * 
 * Integrates: generative-collapse + trust-matrix + self-copies
 * 
 * Decision-making as quantum wave function collapse - multiple possibilities exist in 
 * superposition until trust evaluation and social modeling force a definitive choice.
 * 
 * @module DecisionQuantum
 * @version 3.0-quantum
 */

const ProbabilityCore = require('../probability-core');

class DecisionQuantum {
    constructor(config = {}) {
        this.webppl = new ProbabilityCore();
        
        // Trust Matrix Configuration
        this.trust_matrix = {
            trust_dimensions: {
                competence: "ability_to_deliver_expected_outcomes",
                benevolence: "caring_about_my_wellbeing",
                integrity: "consistency_between_values_and_actions",
                predictability: "behavioral_consistency_over_time",
                transparency: "openness_about_motivations_and_methods"
            },
            trust_calculation_weights: {
                competence: 0.25,
                benevolence: 0.25,
                integrity: 0.20,
                predictability: 0.15,
                transparency: 0.15
            },
            trust_decay_rates: {
                competence: 0.05,    // Competence fades slowly
                benevolence: 0.15,   // Benevolence fades faster
                integrity: 0.08,     // Integrity fades slowly
                predictability: 0.10, // Predictability fades moderately
                transparency: 0.12   // Transparency fades moderately
            },
            interaction_learning_rates: {
                positive_experience: 0.3,
                negative_experience: 0.5, // Negative experiences have stronger impact
                neutral_experience: 0.1
            }
        };
        
        // Self-Copies (Others Modeling) System
        this.self_copies_system = {
            model_types: {
                family_expectations: {
                    influence_weight: 0.8,
                    model_accuracy: 0.7,
                    emotional_impact: 0.9
                },
                peer_comparisons: {
                    influence_weight: 0.6,
                    model_accuracy: 0.5,
                    emotional_impact: 0.7
                },
                authority_figures: {
                    influence_weight: 0.7,
                    model_accuracy: 0.6,
                    emotional_impact: 0.8
                },
                future_self: {
                    influence_weight: 0.9,
                    model_accuracy: 0.4,
                    emotional_impact: 1.0
                },
                ideal_self: {
                    influence_weight: 0.8,
                    model_accuracy: 0.3,
                    emotional_impact: 0.9
                },
                social_groups: {
                    influence_weight: 0.5,
                    model_accuracy: 0.6,
                    emotional_impact: 0.6
                }
            },
            recursive_depth_limit: 3, // Prevent infinite "what do they think I think they think..."
            social_anxiety_threshold: 0.7,
            identity_protection_mechanisms: ["perspective_taking_limits", "reality_anchor_maintenance"]
        };
        
        // Generative Collapse Mechanics
        this.collapse_mechanics = {
            collapse_triggers: {
                time_pressure: { threshold: 0.7, urgency_multiplier: 2.0 },
                confidence_threshold: { threshold: 0.8, certainty_requirement: 0.9 },
                external_pressure: { threshold: 0.6, social_multiplier: 1.5 },
                resource_depletion: { threshold: 0.3, energy_conservation: 1.8 },
                opportunity_window: { threshold: 0.5, timing_criticality: 1.4 }
            },
            superposition_maintenance: {
                maximum_options: 7, // Miller's magic number ±2
                complexity_threshold: 0.8,
                coherence_requirement: 0.4
            },
            collapse_quality_factors: {
                information_completeness: 0.2,
                emotional_alignment: 0.25,
                social_appropriateness: 0.15,
                resource_feasibility: 0.2,
                value_consistency: 0.2
            }
        };
        
        // Decision state tracking
        this.decision_state = {
            active_superpositions: new Map(),
            collapsed_decisions: new Map(),
            trust_evaluations: new Map(),
            social_model_influences: new Map(),
            decision_quality_history: []
        };
        
        // Performance metrics
        this.metrics = {
            average_decision_quality: 0.68,
            trust_prediction_accuracy: 0.72,
            social_model_effectiveness: 0.65,
            collapse_timing_optimization: 0.70,
            decision_confidence_calibration: 0.74
        };
    }

    /**
     * Main decision evaluation function
     * Creates superposition of possibilities and manages collapse
     *
     * ملاحظة مهمة: هذه الدالة تُرجع كائناً عادياً (وليس غلاف توزيع احتمالي)
     * لأن unified-cognitive-space.internal_parliament يقرأ حقولها مباشرة.
     */
    evaluate(decision_context, context = {}) {
        // Create superposition of all possible decisions
        const decision_superposition = this.create_decision_superposition(decision_context);

        // Apply trust matrix evaluation
        const trust_weighted_options = this.apply_trust_weighting(
            decision_superposition,
            decision_context.trust_context || {}
        );

        // Apply social modeling influences
        const socially_influenced_options = this.apply_social_modeling(
            trust_weighted_options,
            decision_context.social_models || []
        );

        // Assess collapse conditions
        const collapse_assessment = this.assess_collapse_conditions(
            socially_influenced_options,
            decision_context,
            context
        );

        // نرتب الخيارات حسب احتمالها النهائي لعرضها في العقد الموحد للنتيجة
        const options_summary = [...socially_influenced_options]
            .sort((a, b) => b.social_adjusted_probability - a.social_adjusted_probability)
            .map(opt => ({
                option_id: opt.option_id,
                option: opt.option,
                probability: opt.social_adjusted_probability,
                trust_confidence: opt.trust_confidence,
                social_anxiety_level: opt.social_anxiety_level
            }));

        // Execute collapse if conditions are met
        if (collapse_assessment.should_collapse) {
            const collapsed_decision = this.execute_wave_collapse(
                socially_influenced_options,
                collapse_assessment
            );

            return {
                state: "collapsed",
                decision: {
                    option_id: collapsed_decision.option_id,
                    option: collapsed_decision.option,
                    confidence: collapsed_decision.confidence,
                    expected_outcome_quality: collapsed_decision.expected_outcome_quality,
                    residual_uncertainty: collapsed_decision.residual_uncertainty
                },
                confidence: collapsed_decision.confidence,
                collapse_trigger: collapse_assessment.primary_trigger,
                collapse_probability: collapse_assessment.collapse_probability,
                options: options_summary,
                recommendation: "commit_to_collapsed_decision",
                information_needs: this.identify_information_needs(socially_influenced_options),
                alternative_paths: socially_influenced_options.filter(opt =>
                    opt.option_id !== collapsed_decision.option_id
                ).slice(0, 3),
                reasoning: this.summarize_reasoning(collapsed_decision, collapse_assessment)
            };
        } else {
            // البقاء في حالة التراكب: نفس عقد النتيجة، بدون قرار نهائي
            const leading_probability = options_summary.length > 0 ? options_summary[0].probability : 0;

            return {
                state: "superposition",
                decision: null,
                confidence: leading_probability,
                collapse_trigger: null,
                collapse_probability: collapse_assessment.collapse_probability,
                options: options_summary,
                recommendation: this.generate_superposition_recommendation(collapse_assessment),
                information_needs: this.identify_information_needs(socially_influenced_options),
                alternative_paths: options_summary.slice(1, 4),
                reasoning: `superposition maintained: collapse probability ` +
                    `${(collapse_assessment.collapse_probability * 100).toFixed(1)}% below threshold, ` +
                    `${options_summary.length} options still coherent`
            };
        }
    }

    /**
     * Create quantum superposition of decision possibilities
     */
    create_decision_superposition(decision_context) {
        const options = decision_context.options || [];
        const superposition = [];
        
        for (const option of options) {
            const quantum_option = {
                option_id: this.generateOptionId(),
                option: option,
                base_probability: this.webppl.uniform(0.1, 1.0),
                
                // Quality dimensions
                feasibility: this.assess_feasibility(option, decision_context),
                desirability: this.assess_desirability(option, decision_context),
                risk_assessment: this.assess_risk(option, decision_context),
                
                // Uncertainty measures
                information_completeness: this.assess_information_completeness(option),
                outcome_predictability: this.assess_outcome_predictability(option),
                
                // Value alignment
                value_consistency: this.assess_value_consistency(option, decision_context),
                goal_alignment: this.assess_goal_alignment(option, decision_context),
                
                // Contextual factors
                timing_appropriateness: this.assess_timing(option, decision_context),
                resource_requirements: this.assess_resource_requirements(option),
                
                // Meta properties
                quantum_coherence: this.webppl.beta(7, 3),
                superposition_stability: this.webppl.beta(6, 4)
            };
            
            superposition.push(quantum_option);
        }
        
        // Normalize probabilities to maintain quantum coherence
        return this.normalize_superposition_probabilities(superposition);
    }

    /**
     * Apply trust matrix weighting to decision options
     * تُرجع مصفوفة خيارات عادية — وليس غلاف توزيع — لأن المسار الحي يمر عبرها
     */
    apply_trust_weighting(superposition, trust_context) {
        const trust_weighted_options = [];

        for (const option of superposition) {
            // Calculate trust scores for entities involved in this option
            const involved_entities = this.identify_involved_entities(option, trust_context);
            const trust_evaluations = this.evaluate_trust_for_entities(involved_entities);

            // Weight option probability by trust levels
            const trust_multiplier = this.calculate_trust_multiplier(trust_evaluations);

            const weighted_option = {
                ...option,
                trust_adjusted_probability: option.base_probability * trust_multiplier,
                trust_evaluations: trust_evaluations,
                trust_confidence: this.calculate_trust_confidence(trust_evaluations),

                // Trust-specific assessments
                competence_confidence: this.extract_competence_confidence(trust_evaluations),
                benevolence_assurance: this.extract_benevolence_assurance(trust_evaluations),
                integrity_alignment: this.extract_integrity_alignment(trust_evaluations),

                // Risk adjustments based on trust
                trust_adjusted_risk: this.adjust_risk_for_trust(option.risk_assessment, trust_evaluations)
            };

            trust_weighted_options.push(weighted_option);
        }

        return this.normalize_trust_weighted_probabilities(trust_weighted_options);
    }

    /**
     * Apply social modeling influences (self-copies system)
     * تُرجع مصفوفة خيارات عادية جاهزة لتقييم شروط الانهيار
     */
    apply_social_modeling(trust_weighted_options, social_models) {
        const socially_modeled_options = [];

        for (const option of trust_weighted_options) {
            // Model how each social entity would view this option
            const social_influences = this.model_social_influences(option, social_models);

            // Check for recursive modeling depth limits
            const recursive_safety_check = this.check_recursive_modeling_safety(social_influences);

            // Apply social influence weighting
            const social_multiplier = this.calculate_social_influence_multiplier(
                social_influences,
                recursive_safety_check
            );

            const socially_influenced_option = {
                ...option,
                social_adjusted_probability: option.trust_adjusted_probability * social_multiplier,
                social_influences: social_influences,
                social_anxiety_level: this.calculate_social_anxiety(social_influences),

                // Social validation measures
                family_approval: this.extract_family_approval(social_influences),
                peer_acceptance: this.extract_peer_acceptance(social_influences),
                authority_sanction: this.extract_authority_sanction(social_influences),

                // Future/ideal self alignment
                future_self_approval: this.extract_future_self_approval(social_influences),
                ideal_self_consistency: this.extract_ideal_self_consistency(social_influences),

                // Identity protection status
                identity_threats: recursive_safety_check.identity_threats,
                protective_mechanisms_active: recursive_safety_check.protections_applied
            };

            socially_modeled_options.push(socially_influenced_option);
        }

        return this.normalize_social_probabilities(socially_modeled_options);
    }

    /**
     * Assess conditions for wave function collapse
     */
    assess_collapse_conditions(options, decision_context, context) {
        const conditions = {
            time_pressure: this.assess_time_pressure(decision_context, context),
            confidence_threshold: this.assess_confidence_threshold(options),
            external_pressure: this.assess_external_pressure(decision_context, context),
            resource_depletion: this.assess_resource_depletion(context),
            opportunity_window: this.assess_opportunity_window(decision_context, context),
            cognitive_load: this.assess_cognitive_load(options)
        };

        // Calculate collapse probability
        let collapse_probability = 0;
        let primary_trigger = null;
        let trigger_strength = 0;

        for (const [trigger, value] of Object.entries(conditions)) {
            const trigger_config = this.collapse_mechanics.collapse_triggers[trigger];
            if (trigger_config && value > trigger_config.threshold) {
                const contribution = (value - trigger_config.threshold) *
                                   (trigger_config.urgency_multiplier || 1.0);
                collapse_probability += contribution;

                if (contribution > trigger_strength) {
                    trigger_strength = contribution;
                    primary_trigger = trigger;
                }
            }
        }

        // Normalize collapse probability
        collapse_probability = Math.min(1.0, collapse_probability);

        // Check maximum option complexity
        const option_complexity = options.length / this.collapse_mechanics.superposition_maintenance.maximum_options;
        if (option_complexity > this.collapse_mechanics.superposition_maintenance.complexity_threshold) {
            collapse_probability = Math.min(1.0, collapse_probability + 0.3);
            if (!primary_trigger) primary_trigger = "complexity_overload";
        }

        return {
            should_collapse: collapse_probability > 0.5,
            collapse_probability: collapse_probability,
            primary_trigger: primary_trigger,
            conditions: conditions,
            urgency_level: this.calculate_urgency_level(conditions),
            collapse_quality_prediction: this.predict_collapse_quality(options, conditions)
        };
    }

    /**
     * Execute wave function collapse to final decision
     */
    execute_wave_collapse(options, collapse_assessment) {
        // Sort options by final probability
        const sorted_options = [...options].sort((a, b) =>
            b.social_adjusted_probability - a.social_adjusted_probability
        );

        // Select winning option based on collapse conditions
        const winning_option = this.select_winning_option(sorted_options, collapse_assessment);

        // Calculate decision confidence
        const decision_confidence = this.calculate_decision_confidence(
            winning_option,
            sorted_options,
            collapse_assessment
        );

        // Generate decision reasoning
        const reasoning = this.generate_decision_reasoning(
            winning_option,
            sorted_options,
            collapse_assessment
        );

        // Create collapsed decision object
        const collapsed_decision = {
            option_id: winning_option.option_id,
            option: winning_option.option,
            confidence: decision_confidence,
            reasoning: reasoning,

            // Quality metrics
            expected_outcome_quality: this.predict_outcome_quality(winning_option),
            decision_process_quality: this.assess_decision_process_quality(collapse_assessment),

            // Component contributions
            trust_contribution: winning_option.trust_confidence || 0.5,
            social_contribution: 1 - (winning_option.social_anxiety_level || 0.5),
            value_contribution: winning_option.value_consistency || 0.5,

            // Risk and uncertainty
            residual_uncertainty: this.calculate_residual_uncertainty(winning_option),
            risk_acceptance: this.calculate_risk_acceptance(winning_option),

            // Meta-decision information
            collapse_trigger: collapse_assessment.primary_trigger,
            alternative_strength: this.calculate_alternative_strength(sorted_options),
            decision_reversibility: this.assess_decision_reversibility(winning_option),

            // Timestamps and tracking
            decision_timestamp: Date.now(),
            processing_duration: this.calculate_processing_duration(),
            decision_session_id: this.generateSessionId()
        };

        // Store decision for learning
        this.store_decision_for_learning(collapsed_decision, options, collapse_assessment);

        return collapsed_decision;
    }

    /**
     * Trust evaluation methods
     */
    evaluate_trust_for_entities(entities) {
        const trust_evaluations = {};

        for (const entity of entities) {
            // Historical trust components (كل واحدة عينة رقمية مباشرة من توزيع بيتا)
            const competence = this.calculate_competence_trust(entity);
            const benevolence = this.calculate_benevolence_trust(entity);
            const integrity = this.calculate_integrity_trust(entity);
            const predictability = this.calculate_predictability_trust(entity);
            const transparency = this.calculate_transparency_trust(entity);

            // Weighted overall trust score
            const weights = this.trust_matrix.trust_calculation_weights;
            const overall_trust = (
                competence * weights.competence +
                benevolence * weights.benevolence +
                integrity * weights.integrity +
                predictability * weights.predictability +
                transparency * weights.transparency
            );

            trust_evaluations[entity.id] = {
                overall_trust: overall_trust,
                components: {
                    competence: competence,
                    benevolence: benevolence,
                    integrity: integrity,
                    predictability: predictability,
                    transparency: transparency
                },
                trust_confidence: this.calculate_trust_measurement_confidence(entity),
                trust_volatility: this.calculate_trust_volatility(entity),
                historical_interactions: entity.interaction_history?.length || 0
            };
        }

        return trust_evaluations;
    }

    calculate_competence_trust(entity) {
        if (!entity.competence_history) return this.webppl.beta(5, 5); // Default moderate

        const successes = entity.competence_history.successes || 0;
        const failures = entity.competence_history.failures || 0;
        if (successes + failures === 0) return this.webppl.beta(5, 5); // لا محاولات مسجلة = حياد

        const success_rate = successes / (successes + failures);
        const confidence_from_sample_size = Math.min(1.0, (entity.competence_history.total || successes + failures) / 10);
        
        return this.webppl.beta(
            success_rate * 10 * confidence_from_sample_size + 1,
            (1 - success_rate) * 10 * confidence_from_sample_size + 1
        );
    }

    calculate_benevolence_trust(entity) {
        if (!entity.benevolence_indicators) return this.webppl.beta(4, 6); // Default slightly pessimistic
        
        const positive_indicators = entity.benevolence_indicators.positive || 0;
        const negative_indicators = entity.benevolence_indicators.negative || 0;
        
        return this.webppl.beta(
            positive_indicators + 1,
            negative_indicators + 1
        );
    }

    /**
     * Social modeling methods
     */
    model_social_influences(option, social_models) {
        const influences = {};
        
        for (const model_type of social_models) {
            if (this.self_copies_system.model_types[model_type]) {
                influences[model_type] = this.model_social_entity_response(option, model_type);
            }
        }
        
        return influences;
    }

    model_social_entity_response(option, model_type) {
        const model_config = this.self_copies_system.model_types[model_type];

        // Model how this social entity would evaluate the option
        // كائن عادي: مستهلكوه يقرؤون approval_probability وأخواتها مباشرة
        const entity_evaluation = {
            approval_probability: this.webppl.beta(5, 5), // Start neutral
            emotional_reaction: this.webppl.gaussian(0, 0.5), // Neutral to positive/negative
            influence_strength: model_config.influence_weight,
            model_accuracy: model_config.model_accuracy,
            emotional_impact: model_config.emotional_impact
        };

        // Adjust based on option characteristics and model type
        if (model_type === "family_expectations") {
            entity_evaluation.approval_probability = this.adjust_for_family_values(
                option, entity_evaluation.approval_probability
            );
        } else if (model_type === "future_self") {
            entity_evaluation.approval_probability = this.adjust_for_future_consequences(
                option, entity_evaluation.approval_probability
            );
        } else if (model_type === "ideal_self") {
            entity_evaluation.approval_probability = this.adjust_for_ideal_alignment(
                option, entity_evaluation.approval_probability
            );
        }

        return entity_evaluation;
    }

    check_recursive_modeling_safety(social_influences) {
        let recursive_depth = 0;
        let identity_threats = [];
        let protections_applied = [];
        
        // Count recursive depth
        for (const [model_type, influence] of Object.entries(social_influences)) {
            if (influence.model_accuracy < 0.3) recursive_depth++;
        }
        
        // Check for identity threats
        const high_anxiety_models = Object.entries(social_influences)
            .filter(([_, influence]) => influence.emotional_impact > 0.8);
        
        if (high_anxiety_models.length > 2) {
            identity_threats.push("social_overwhelm");
        }
        
        if (recursive_depth > this.self_copies_system.recursive_depth_limit) {
            identity_threats.push("recursive_loop");
            protections_applied.push("depth_limiting");
        }
        
        // Apply protective mechanisms
        if (identity_threats.length > 0) {
            protections_applied.push("perspective_taking_limits");
            protections_applied.push("reality_anchor_maintenance");
        }
        
        return {
            recursive_depth: recursive_depth,
            identity_threats: identity_threats,
            protections_applied: protections_applied,
            safety_level: identity_threats.length === 0 ? "safe" : "protected"
        };
    }

    /**
     * Assessment and calculation methods
     */
    assess_feasibility(option, context) {
        // Assess how feasible this option is given current resources and constraints
        return this.webppl.beta(6, 4); // Generally optimistic about feasibility
    }

    assess_desirability(option, context) {
        // Assess how much this option aligns with goals and preferences
        return this.webppl.beta(5, 5); // Neutral starting point
    }

    assess_risk(option, context) {
        // Assess potential negative outcomes and their probabilities
        return this.webppl.beta(3, 7); // Generally risk-averse
    }

    assess_information_completeness(option) {
        // How much information do we have about this option?
        return this.webppl.beta(4, 6); // Usually incomplete information
    }

    assess_outcome_predictability(option) {
        // How predictable are the outcomes of this option?
        return this.webppl.beta(5, 5); // Moderate predictability
    }

    assess_time_pressure(decision_context, context) {
        const deadline_pressure = context.deadline_pressure || 0;
        const time_pressure = decision_context.time_pressure || 0; // الضغط الزمني الصريح في سياق القرار
        const urgency = decision_context.urgency || 0;
        return Math.max(deadline_pressure, time_pressure, urgency);
    }

    assess_confidence_threshold(options) {
        const max_probability = Math.max(...options.map(opt => opt.social_adjusted_probability));
        return max_probability;
    }

    calculate_trust_multiplier(trust_evaluations) {
        if (Object.keys(trust_evaluations).length === 0) return 1.0;
        
        const trust_scores = Object.values(trust_evaluations).map(_eval => _eval.overall_trust);
        const average_trust = trust_scores.reduce((a, b) => a + b, 0) / trust_scores.length;
        
        return 0.5 + average_trust * 0.5; // Range from 0.5 to 1.0
    }

    calculate_social_influence_multiplier(social_influences, safety_check) {
        if (Object.keys(social_influences).length === 0) return 1.0;
        
        let total_influence = 0;
        let total_weight = 0;
        
        for (const [model_type, influence] of Object.entries(social_influences)) {
            const weight = influence.influence_strength;
            const approval = influence.approval_probability;
            
            total_influence += approval * weight;
            total_weight += weight;
        }
        
        const social_multiplier = total_weight > 0 ? total_influence / total_weight : 1.0;
        
        // Apply safety adjustments
        if (safety_check.identity_threats.length > 0) {
            return 0.7 + social_multiplier * 0.3; // Dampen social influence when threats detected
        }
        
        return 0.6 + social_multiplier * 0.4; // Range from 0.6 to 1.0
    }

    select_winning_option(sorted_options, collapse_assessment) {
        // In high urgency, go with highest probability option
        if (collapse_assessment.urgency_level > 0.8) {
            return sorted_options[0];
        }
        
        // Otherwise, use probabilistic selection weighted by probabilities
        // categorical(outcomes, probabilities) تُرجع عنصر الخيار نفسه مباشرة
        const probabilities = sorted_options.map(opt => opt.social_adjusted_probability);
        return this.webppl.categorical(sorted_options, probabilities);
    }

    calculate_decision_confidence(winning_option, all_options, collapse_assessment) {
        const probability_margin = winning_option.social_adjusted_probability - 
                                 (all_options[1]?.social_adjusted_probability || 0);
        
        const confidence_factors = {
            probability_margin: probability_margin,
            information_completeness: winning_option.information_completeness || 0.5,
            trust_confidence: winning_option.trust_confidence || 0.5,
            social_anxiety: 1 - (winning_option.social_anxiety_level || 0.5),
            process_quality: collapse_assessment.collapse_quality_prediction || 0.5
        };
        
        const weights = this.collapse_mechanics.collapse_quality_factors;
        let weighted_confidence = 0;
        
        for (const [factor, value] of Object.entries(confidence_factors)) {
            const weight = weights[factor] || 0.2;
            weighted_confidence += value * weight;
        }
        
        return Math.max(0.1, Math.min(0.95, weighted_confidence));
    }

    /**
     * Utility methods
     */
    normalize_superposition_probabilities(superposition) {
        const total_probability = superposition.reduce((sum, opt) => sum + opt.base_probability, 0);
        
        return superposition.map(opt => ({
            ...opt,
            base_probability: opt.base_probability / total_probability
        }));
    }

    normalize_trust_weighted_probabilities(options) {
        const total_probability = options.reduce((sum, opt) => sum + opt.trust_adjusted_probability, 0);
        
        return options.map(opt => ({
            ...opt,
            trust_adjusted_probability: opt.trust_adjusted_probability / total_probability
        }));
    }

    normalize_social_probabilities(options) {
        const total_probability = options.reduce((sum, opt) => sum + opt.social_adjusted_probability, 0);
        
        return options.map(opt => ({
            ...opt,
            social_adjusted_probability: opt.social_adjusted_probability / total_probability
        }));
    }

    generateOptionId() {
        return `option_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateSessionId() {
        return `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Placeholder methods for specific assessments
     * These would have more sophisticated implementations
     */
    identify_involved_entities(option, trust_context) {
        // Identify who/what entities are involved in this decision option
        return trust_context.entities || [];
    }

    calculate_trust_confidence(trust_evaluations) {
        const confidences = Object.values(trust_evaluations).map(_eval => _eval.trust_confidence || 0);
        if (confidences.length === 0) return 0.5; // لا كيانات = ثقة قياس محايدة
        return confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
    }

    extract_competence_confidence(trust_evaluations) {
        const evals = Object.values(trust_evaluations);
        if (evals.length === 0) return 0.5;
        const total = evals.reduce((sum, _eval) => sum + (_eval.components?.competence ?? 0.5), 0);
        return total / evals.length;
    }

    extract_benevolence_assurance(trust_evaluations) {
        const evals = Object.values(trust_evaluations);
        if (evals.length === 0) return 0.5;
        const total = evals.reduce((sum, _eval) => sum + (_eval.components?.benevolence ?? 0.5), 0);
        return total / evals.length;
    }

    extract_integrity_alignment(trust_evaluations) {
        const evals = Object.values(trust_evaluations);
        if (evals.length === 0) return 0.5;
        const total = evals.reduce((sum, _eval) => sum + (_eval.components?.integrity ?? 0.5), 0);
        return total / evals.length;
    }

    adjust_risk_for_trust(base_risk, trust_evaluations) {
        const evals = Object.values(trust_evaluations);
        const average_trust = evals.length > 0
            ? evals.reduce((sum, _eval) => sum + (_eval.overall_trust || 0), 0) / evals.length
            : 0.5;

        return base_risk * (1.5 - average_trust); // Higher trust reduces perceived risk
    }

    calculate_social_anxiety(social_influences) {
        const anxiety_contributors = Object.values(social_influences)
            .filter(influence => influence.emotional_impact > 0.7);
        
        return Math.min(1.0, anxiety_contributors.length * 0.25);
    }

    extract_family_approval(social_influences) {
        return social_influences.family_expectations?.approval_probability || 0.5;
    }

    extract_peer_acceptance(social_influences) {
        return social_influences.peer_comparisons?.approval_probability || 0.5;
    }

    extract_authority_sanction(social_influences) {
        return social_influences.authority_figures?.approval_probability || 0.5;
    }

    extract_future_self_approval(social_influences) {
        return social_influences.future_self?.approval_probability || 0.5;
    }

    extract_ideal_self_consistency(social_influences) {
        return social_influences.ideal_self?.approval_probability || 0.5;
    }

    calculate_risk_acceptance(option) {
        // قبول المخاطرة يرتفع مع الثقة والرغبة، وينخفض مع الخطر المُقيَّم بعد تعديل الثقة
        const perceived_risk = option.trust_adjusted_risk ?? option.risk_assessment ?? 0.5;
        const appetite = ((option.desirability || 0.5) + (option.trust_confidence || 0.5)) / 2;
        return Math.max(0, Math.min(1, appetite * (1 - perceived_risk * 0.6)));
    }

    assess_external_pressure(decision_context, context) {
        return context.social_pressure || decision_context.external_pressure || 0;
    }

    assess_resource_depletion(context) {
        const mental_energy = context.mental_energy || 0.5;
        const attention_level = context.attention_level || 0.5;
        return 1 - Math.min(mental_energy, attention_level);
    }

    assess_opportunity_window(decision_context, context) {
        return decision_context.opportunity_urgency || 0.3;
    }

    assess_cognitive_load(options) {
        return Math.min(1.0, options.length / 10); // More options = higher load
    }

    calculate_urgency_level(conditions) {
        const urgency_factors = [
            conditions.time_pressure,
            conditions.external_pressure,
            conditions.opportunity_window
        ];
        
        return Math.max(...urgency_factors);
    }

    predict_collapse_quality(options, conditions) {
        const quality_indicators = [
            1 - conditions.cognitive_load,
            Math.max(...options.map(opt => opt.information_completeness || 0.5)),
            1 - conditions.time_pressure * 0.5 // Time pressure reduces quality
        ];
        
        return quality_indicators.reduce((a, b) => a + b, 0) / quality_indicators.length;
    }

    generate_decision_reasoning(winning_option, all_options, collapse_assessment) {
        return {
            primary_factors: [
                "trust_evaluation",
                "social_modeling",
                collapse_assessment.primary_trigger
            ],
            confidence_contributors: [
                `probability_advantage: ${(winning_option.social_adjusted_probability * 100).toFixed(1)}%`,
                `trust_level: ${((winning_option.trust_confidence || 0.5) * 100).toFixed(1)}%`,
                `social_alignment: ${((1 - (winning_option.social_anxiety_level || 0.5)) * 100).toFixed(1)}%`
            ],
            decision_quality_prediction: "moderate_to_high"
        };
    }

    summarize_reasoning(collapsed_decision, collapse_assessment) {
        // ملخص نصي واحد لعقد النتيجة النهائي (evaluate يشترط reasoning: string)
        const option_label = typeof collapsed_decision.option === 'object'
            ? (collapsed_decision.option?.description || collapsed_decision.option?.id || 'selected_option')
            : String(collapsed_decision.option);

        return `wave collapse via ${collapse_assessment.primary_trigger || 'accumulated_pressure'}: ` +
            `"${option_label}" won with confidence ${(collapsed_decision.confidence * 100).toFixed(1)}%, ` +
            `trust contribution ${(collapsed_decision.trust_contribution * 100).toFixed(0)}%, ` +
            `social alignment ${(collapsed_decision.social_contribution * 100).toFixed(0)}%`;
    }

    predict_outcome_quality(option) {
        return (
            (option.feasibility || 0.5) * 0.3 +
            (option.desirability || 0.5) * 0.3 +
            (1 - (option.risk_assessment || 0.5)) * 0.2 +
            (option.value_consistency || 0.5) * 0.2
        );
    }

    assess_decision_process_quality(collapse_assessment) {
        return Math.max(0.3, 1 - collapse_assessment.urgency_level * 0.4);
    }

    calculate_residual_uncertainty(option) {
        return 1 - (option.information_completeness || 0.5);
    }

    calculate_alternative_strength(sorted_options) {
        if (sorted_options.length < 2) return 0;
        
        return sorted_options[1].social_adjusted_probability / sorted_options[0].social_adjusted_probability;
    }

    assess_decision_reversibility(option) {
        return option.reversibility_score || 0.5; // Would be calculated based on option characteristics
    }

    calculate_processing_duration() {
        return this.webppl.exponential(1/2000); // Average 2 seconds processing time
    }

    store_decision_for_learning(decision, options, assessment) {
        this.decision_state.collapsed_decisions.set(decision.decision_session_id, {
            decision: decision,
            options: options,
            assessment: assessment,
            timestamp: Date.now()
        });

        // سقف للذاكرة: نحتفظ بأحدث 200 قرار فقط (خرائط Map تحفظ ترتيب الإدراج، فالأقدم أولاً)
        const max_stored_decisions = 200;
        while (this.decision_state.collapsed_decisions.size > max_stored_decisions) {
            const oldest_key = this.decision_state.collapsed_decisions.keys().next().value;
            this.decision_state.collapsed_decisions.delete(oldest_key);
        }

        // Update metrics
        this.decision_state.decision_quality_history.push(decision.expected_outcome_quality);

        // Keep only recent decisions for memory management
        if (this.decision_state.decision_quality_history.length > 100) {
            this.decision_state.decision_quality_history =
                this.decision_state.decision_quality_history.slice(-50);
        }
    }

    // Trust dimension calculations from entity history (with sensible priors when history is absent)
    calculate_integrity_trust(entity) {
        // النزاهة: الاتساق بين القيم والأفعال — نستدل عليها من الاتساق العاطفي ومؤشرات النية
        if (typeof entity.emotional_consistency === 'number') {
            const c = Math.max(0, Math.min(1, entity.emotional_consistency));
            return this.webppl.beta(c * 8 + 1, (1 - c) * 8 + 1);
        }
        const positive = entity.benevolence_indicators?.positive || 0;
        const negative = entity.benevolence_indicators?.negative || 0;
        if (positive + negative > 0) {
            return this.webppl.beta(positive + 4, negative + 4); // مؤشرات النية دليل جزئي على النزاهة
        }
        return this.webppl.beta(5, 5); // Prior محايد بلا أي تاريخ
    }

    calculate_predictability_trust(entity) {
        // القابلية للتنبؤ: الاتساق السلوكي عبر الزمن — تزداد مع حجم التاريخ ونسبة النجاح المستقرة
        const history = entity.interaction_history || [];
        if (history.length > 0) {
            const consistent = history.filter(i => i && i.consistent !== false).length;
            return this.webppl.beta(consistent + 2, (history.length - consistent) + 2);
        }
        const total = entity.competence_history?.total || 0;
        if (total > 0) {
            const success_rate = (entity.competence_history.successes || 0) / total;
            const exposure = Math.min(1, total / 10); // خبرة أكبر = يقين أعلى
            return this.webppl.beta(2 + success_rate * exposure * 8, 2 + (1 - success_rate) * exposure * 8);
        }
        return this.webppl.beta(6, 4); // بلا تاريخ: تفاؤل خفيف بالاستقرار
    }

    calculate_transparency_trust(entity) {
        // الشفافية: إن كانت مُقاسة مباشرة على الكيان نستخدمها كمركز للتوزيع
        if (typeof entity.transparency === 'number') {
            const t = Math.max(0, Math.min(1, entity.transparency));
            return this.webppl.beta(t * 10 + 1, (1 - t) * 10 + 1);
        }
        return this.webppl.beta(4, 6); // Prior متشائم قليلاً: الشفافية لا تُفترض بل تُثبت
    }

    calculate_trust_measurement_confidence(entity) { return this.webppl.beta(6, 4); }
    calculate_trust_volatility(entity) { return this.webppl.beta(3, 7); }
    
    adjust_for_family_values(option, base_probability) { return base_probability; }
    adjust_for_future_consequences(option, base_probability) { return base_probability; }
    adjust_for_ideal_alignment(option, base_probability) { return base_probability; }
    
    assess_value_consistency(option, context) { return this.webppl.beta(6, 4); }
    assess_goal_alignment(option, context) { return this.webppl.beta(6, 4); }
    assess_timing(option, context) { return this.webppl.beta(5, 5); }
    assess_resource_requirements(option) { return this.webppl.beta(4, 6); }
    
    generate_superposition_recommendation(assessment) {
        if (assessment.collapse_probability > 0.3) {
            return "collapse_imminent_prepare_for_decision";
        } else {
            return "maintain_superposition_gather_more_information";
        }
    }
    
    identify_information_needs(options) {
        return options.map(opt => ({
            option: opt.option,
            information_gaps: 1 - (opt.information_completeness || 0.5),
            priority: opt.social_adjusted_probability
        })).sort((a, b) => b.priority - a.priority);
    }
}

module.exports = DecisionQuantum;
