/**
 * Probability Core - WebPPL Integration Engine
 * 
 * The heart of probabilistic programming for CPF~ Lite
 * Transforms linear AI thinking into probabilistic human cognition understanding
 * 
 * @module ProbabilityCore
 * @version 3.0-quantum
 */

class ProbabilityCore {
    constructor(config = {}) {
        // Probabilistic distribution implementations
        // ربط الدوال بـ this حتى تعمل عند استدعائها من السجل مباشرة
        this.distributions = {
            uniform: this.createUniform.bind(this),
            gaussian: this.createGaussian.bind(this),
            beta: this.createBeta.bind(this),
            exponential: this.createExponential.bind(this),
            categorical: this.createCategorical.bind(this),
            dirichlet: this.createDirichlet.bind(this)
        };
        
        // Inference engine configuration
        this.inference_config = {
            default_samples: config.samples || 1000,
            burn_in: config.burn_in || 100,
            thinning: config.thinning || 1,
            convergence_threshold: config.convergence || 0.01
        };
        
        // Memoization for performance
        this.memo_cache = new Map();
        this.cache_size_limit = config.cache_limit || 10000;
        
        // Random number generator state
        this.rng_state = {
            seed: config.seed || Date.now(),
            counter: 0
        };
    }

    /**
     * Main inference function - replaces WebPPL's infer
     * Executes probabilistic programs and returns distributions
     */
    infer(program, options = {}) {
        const samples = options.samples || this.inference_config.default_samples;
        const method = options.method || 'forward_sampling';
        
        try {
            switch (method) {
                case 'forward_sampling':
                    return this.forward_sampling(program, samples);
                case 'rejection_sampling':
                    return this.rejection_sampling(program, samples, options.condition);
                case 'importance_sampling':
                    return this.importance_sampling(program, samples, options.importance_fn);
                case 'mcmc':
                    return this.mcmc_sampling(program, samples, options);
                default:
                    return this.forward_sampling(program, samples);
            }
        } catch (error) {
            return this.handle_inference_error(error, program, options);
        }
    }

    /**
     * تنفيذ برنامج احتمالي مرة واحدة وإرجاع قيمته الفعلية مباشرة
     * (بعكس infer الذي يرجع غلاف توزيع). كل استدعاء يعيد تشغيل البرنامج
     * فتبقى النتيجة احتمالية متغيرة، لكن شكلها هو الكائن الحقيقي.
     */
    realize(program, fallback = null) {
        try {
            return program();
        } catch (error) {
            console.warn('Realize error:', error.message);
            return fallback;
        }
    }

    /**
     * Forward sampling - basic Monte Carlo
     */
    forward_sampling(program, num_samples) {
        const samples = [];
        
        for (let i = 0; i < num_samples; i++) {
            try {
                const sample = program();
                samples.push(sample);
            } catch (error) {
                // Skip failed samples
                continue;
            }
        }
        
        return this.create_distribution_from_samples(samples);
    }

    /**
     * Rejection sampling with condition
     */
    rejection_sampling(program, num_samples, condition) {
        const samples = [];
        let attempts = 0;
        const max_attempts = num_samples * 100; // Prevent infinite loops
        
        while (samples.length < num_samples && attempts < max_attempts) {
            attempts++;
            try {
                const sample = program();
                if (!condition || condition(sample)) {
                    samples.push(sample);
                }
            } catch (error) {
                continue;
            }
        }
        
        return this.create_distribution_from_samples(samples);
    }

    /**
     * Importance sampling
     */
    importance_sampling(program, num_samples, importance_fn) {
        const weighted_samples = [];
        
        for (let i = 0; i < num_samples; i++) {
            try {
                const sample = program();
                const weight = importance_fn ? importance_fn(sample) : 1.0;
                weighted_samples.push({ value: sample, weight: weight });
            } catch (error) {
                continue;
            }
        }
        
        return this.create_weighted_distribution(weighted_samples);
    }

    /**
     * MCMC sampling (simplified Metropolis-Hastings)
     */
    mcmc_sampling(program, num_samples, options) {
        const samples = [];
        let current_state = this.initialize_mcmc_state(program);
        let accepted = 0;
        
        for (let i = 0; i < num_samples + this.inference_config.burn_in; i++) {
            const proposal = this.mcmc_proposal(current_state, options);
            const acceptance_ratio = this.mcmc_acceptance_ratio(current_state, proposal, program);
            
            if (this.uniform(0, 1) < acceptance_ratio) {
                current_state = proposal;
                accepted++;
            }
            
            // Collect samples after burn-in
            if (i >= this.inference_config.burn_in && i % this.inference_config.thinning === 0) {
                samples.push(current_state);
            }
        }
        
        const acceptance_rate = accepted / (num_samples + this.inference_config.burn_in);
        const distribution = this.create_distribution_from_samples(samples);
        distribution.mcmc_info = { acceptance_rate: acceptance_rate };
        
        return distribution;
    }

    /**
     * Distribution implementations
     */
    
    // Uniform distribution
    createUniform(a, b) {
        return () => a + (b - a) * this.random();
    }
    
    uniform(a, b) {
        return a + (b - a) * this.random();
    }

    // Gaussian/Normal distribution (Box-Muller transform)
    createGaussian(mu, sigma) {
        return () => this.gaussian(mu, sigma);
    }
    
    gaussian(mu, sigma) {
        // Box-Muller transform
        // ملاحظة: القيمة الاحتياطية تُخزَّن كتوزيع معياري (بدون sigma)
        // حتى لا تُضرب في sigma مرتين عند إعادة الاستخدام
        if (this.spare_gaussian !== undefined) {
            const result = this.spare_gaussian;
            this.spare_gaussian = undefined;
            return result * sigma + mu;
        }

        const u1 = this.random();
        const u2 = this.random();
        const mag = Math.sqrt(-2.0 * Math.log(u1)); // standard normal magnitude
        const spare = mag * Math.cos(2.0 * Math.PI * u2);
        const result = mag * Math.sin(2.0 * Math.PI * u2);

        this.spare_gaussian = spare;
        return result * sigma + mu;
    }

    // Beta distribution
    createBeta(alpha, beta) {
        return () => this.beta(alpha, beta);
    }
    
    beta(alpha, beta) {
        // Use gamma distribution to generate beta
        const x = this.gamma(alpha, 1);
        const y = this.gamma(beta, 1);
        return x / (x + y);
    }

    // Gamma distribution (Marsaglia and Tsang's method)
    gamma(shape, scale) {
        if (shape < 1) {
            return this.gamma(shape + 1, scale) * Math.pow(this.random(), 1.0 / shape);
        }
        
        const d = shape - 1.0 / 3.0;
        const c = 1.0 / Math.sqrt(9.0 * d);
        
        while (true) {
            let x, v;
            do {
                x = this.gaussian(0, 1);
                v = 1.0 + c * x;
            } while (v <= 0);
            
            v = v * v * v;
            const u = this.random();
            
            if (u < 1.0 - 0.0331 * x * x * x * x) {
                return d * v * scale;
            }
            
            if (Math.log(u) < 0.5 * x * x + d * (1.0 - v + Math.log(v))) {
                return d * v * scale;
            }
        }
    }

    // Exponential distribution
    createExponential(rate) {
        return () => this.exponential(rate);
    }
    
    exponential(rate) {
        return -Math.log(this.random()) / rate;
    }

    // Categorical distribution
    createCategorical(outcomes, probabilities) {
        return () => this.categorical(outcomes, probabilities);
    }
    
    categorical(outcomes, probabilities = null) {
        if (!probabilities) {
            // Uniform probabilities
            probabilities = new Array(outcomes.length).fill(1.0 / outcomes.length);
        }
        
        // Normalize probabilities
        const total = probabilities.reduce((sum, p) => sum + p, 0);
        const normalized = probabilities.map(p => p / total);
        
        const rand = this.random();
        let cumulative = 0;
        
        for (let i = 0; i < outcomes.length; i++) {
            cumulative += normalized[i];
            if (rand < cumulative) {
                return outcomes[i];
            }
        }
        
        return outcomes[outcomes.length - 1];
    }

    // Dirichlet distribution
    createDirichlet(alphas) {
        return () => this.dirichlet(alphas);
    }
    
    dirichlet(alphas) {
        const samples = alphas.map(alpha => this.gamma(alpha, 1));
        const sum = samples.reduce((total, sample) => total + sample, 0);
        return samples.map(sample => sample / sum);
    }

    /**
     * Advanced probabilistic operations
     */
    
    // Condition on evidence
    condition(predicate) {
        if (!predicate) {
            throw new Error("Condition failed - rejecting sample");
        }
        return true;
    }
    
    // Factor (soft conditioning)
    factor(score) {
        // In a full implementation, this would affect sampling weights
        return score;
    }
    
    // Observe data
    observe(distribution, data) {
        // Calculate likelihood of data under distribution
        return this.calculate_likelihood(distribution, data);
    }
    
    // Query marginal distributions
    marginalize(joint_samples, variable) {
        return joint_samples.map(sample => sample[variable]);
    }
    
    // Calculate expectations
    expectation(samples, func = null) {
        if (!func) func = x => x;
        
        if (Array.isArray(samples)) {
            const values = samples.map(func);
            return values.reduce((sum, val) => sum + val, 0) / values.length;
        } else {
            // Assume it's a distribution object
            return this.expectation(samples.samples, func);
        }
    }
    
    // Calculate variance
    variance(samples, func = null) {
        const mean = this.expectation(samples, func);
        if (!func) func = x => x;
        
        const sample_array = Array.isArray(samples) ? samples : samples.samples;
        const squared_diffs = sample_array.map(sample => {
            const val = func(sample);
            return (val - mean) * (val - mean);
        });
        
        return squared_diffs.reduce((sum, diff) => sum + diff, 0) / squared_diffs.length;
    }
    
    // Calculate percentiles
    percentile(samples, p) {
        const sample_array = Array.isArray(samples) ? samples : samples.samples;
        const sorted = [...sample_array].sort((a, b) => a - b);
        const index = Math.floor(p * sorted.length);
        return sorted[Math.min(index, sorted.length - 1)];
    }

    /**
     * Utility functions for cognitive modeling
     */
    
    // Transform linear logic to probabilistic
    linearToProbabilistic(linearFunction, uncertaintyLevel = 0.1) {
        return (input) => {
            const deterministicResult = linearFunction(input);
            
            // Add uncertainty based on input complexity
            const uncertainty = this.gaussian(0, uncertaintyLevel);
            
            // Ensure result stays in reasonable bounds
            return Math.max(0, Math.min(1, deterministicResult + uncertainty));
        };
    }
    
    // Cognitive noise modeling
    cognitiveNoise(baseValue, noiseLevel = 0.1, noiseType = 'gaussian') {
        switch (noiseType) {
            case 'gaussian':
                return baseValue + this.gaussian(0, noiseLevel);
            case 'uniform':
                return baseValue + this.uniform(-noiseLevel, noiseLevel);
            case 'exponential':
                return baseValue + this.exponential(1 / noiseLevel) - (1 / noiseLevel);
            default:
                return baseValue + this.gaussian(0, noiseLevel);
        }
    }
    
    // Emotional bias modeling
    emotionalBias(neutralValue, emotionalState, biasStrength = 0.3) {
        const valence = emotionalState.valence || 0; // -1 to 1
        const intensity = emotionalState.intensity || 0.5; // 0 to 1
        
        const bias = valence * intensity * biasStrength;
        return neutralValue + bias + this.gaussian(0, intensity * 0.1);
    }
    
    // Memory reconstruction with uncertainty
    memoryReconstruction(originalMemory, currentMood, timeSinceEncoding) {
        const decayFactor = Math.exp(-timeSinceEncoding * 0.01); // Exponential decay
        const emotionalDistortion = this.emotionalBias(0, currentMood, 0.2);
        const reconstructionNoise = this.gaussian(0, 0.1 * (1 - decayFactor));
        
        return {
            content: originalMemory.content,
            confidence: originalMemory.confidence * decayFactor,
            emotional_coloring: originalMemory.emotional_tone + emotionalDistortion,
            reconstruction_variation: reconstructionNoise,
            certainty: decayFactor * (1 - Math.abs(reconstructionNoise))
        };
    }
    
    // Decision uncertainty quantification
    decisionUncertainty(options, contextualFactors = {}) {
        const optionUncertainties = options.map(option => {
            const baseUncertainty = 1 - (option.information_completeness || 0.5);
            const contextualNoise = this.gaussian(0, contextualFactors.complexity || 0.1);
            const timePressurefactor = contextualFactors.time_pressure || 0;
            
            return {
                option: option,
                uncertainty: Math.max(0, baseUncertainty + contextualNoise + timePressurefactor * 0.2),
                confidence: 1 - (baseUncertainty + Math.abs(contextualNoise))
            };
        });
        
        return optionUncertainties;
    }

    /**
     * Distribution analysis and manipulation
     */
    
    create_distribution_from_samples(samples) {
        if (samples.length === 0) {
            return { samples: [], mean: 0, variance: 0, support: [] };
        }
        
        // Calculate statistics
        const mean = this.expectation(samples);
        const variance = this.variance(samples);
        const support = this.calculate_support(samples);
        
        return {
            samples: samples,
            mean: mean,
            variance: variance,
            std: Math.sqrt(variance),
            support: support,
            size: samples.length,
            
            // Utility methods
            sample: () => samples[Math.floor(this.random() * samples.length)],
            probability: (value) => this.calculate_probability(samples, value),
            cdf: (value) => this.calculate_cdf(samples, value),
            percentile: (p) => this.percentile(samples, p)
        };
    }
    
    create_weighted_distribution(weighted_samples) {
        // Normalize weights
        const totalWeight = weighted_samples.reduce((sum, ws) => sum + ws.weight, 0);
        const normalized = weighted_samples.map(ws => ({
            value: ws.value,
            weight: ws.weight / totalWeight
        }));
        
        // Resample according to weights
        const resampled = [];
        const num_samples = weighted_samples.length;
        
        for (let i = 0; i < num_samples; i++) {
            const rand = this.random();
            let cumulative = 0;
            
            for (const ws of normalized) {
                cumulative += ws.weight;
                if (rand < cumulative) {
                    resampled.push(ws.value);
                    break;
                }
            }
        }
        
        return this.create_distribution_from_samples(resampled);
    }
    
    calculate_support(samples) {
        if (samples.length === 0) return [];
        
        // For continuous values, create histogram
        if (typeof samples[0] === 'number') {
            const min = Math.min(...samples);
            const max = Math.max(...samples);
            const range = max - min;
            const binSize = range / 20; // 20 bins
            
            const bins = new Map();
            for (const sample of samples) {
                const bin = Math.floor((sample - min) / binSize);
                bins.set(bin, (bins.get(bin) || 0) + 1);
            }
            
            return Array.from(bins.entries()).map(([bin, count]) => ({
                value: min + bin * binSize,
                probability: count / samples.length
            }));
        }
        
        // For discrete values, count frequencies
        const frequencies = new Map();
        for (const sample of samples) {
            const key = JSON.stringify(sample);
            frequencies.set(key, (frequencies.get(key) || 0) + 1);
        }
        
        return Array.from(frequencies.entries()).map(([key, count]) => ({
            value: JSON.parse(key),
            probability: count / samples.length
        }));
    }
    
    calculate_probability(samples, value, tolerance = 0.01) {
        if (typeof value === 'number') {
            // Continuous value - count within tolerance
            const matches = samples.filter(sample => Math.abs(sample - value) <= tolerance);
            return matches.length / samples.length;
        } else {
            // Discrete value - exact match
            const matches = samples.filter(sample => JSON.stringify(sample) === JSON.stringify(value));
            return matches.length / samples.length;
        }
    }
    
    calculate_cdf(samples, value) {
        if (typeof value !== 'number') return 0;
        
        const below = samples.filter(sample => sample <= value);
        return below.length / samples.length;
    }
    
    calculate_likelihood(distribution, data) {
        // Simplified likelihood calculation
        if (typeof distribution === 'function') {
            return distribution(data);
        } else if (distribution.probability) {
            return distribution.probability(data);
        } else {
            return 0.5; // Default likelihood
        }
    }

    /**
     * MCMC helper functions
     */
    
    initialize_mcmc_state(program) {
        try {
            return program();
        } catch (error) {
            return {}; // Default state
        }
    }
    
    mcmc_proposal(current_state, options) {
        const proposal_variance = options.proposal_variance || 0.1;
        
        if (typeof current_state === 'number') {
            return current_state + this.gaussian(0, proposal_variance);
        } else if (typeof current_state === 'object') {
            const proposal = { ...current_state };
            for (const [key, value] of Object.entries(proposal)) {
                if (typeof value === 'number') {
                    proposal[key] = value + this.gaussian(0, proposal_variance);
                }
            }
            return proposal;
        }
        
        return current_state;
    }
    
    mcmc_acceptance_ratio(current_state, proposal, program) {
        try {
            // Simplified acceptance ratio - would be more sophisticated in practice
            const current_likelihood = this.evaluate_likelihood(current_state, program);
            const proposal_likelihood = this.evaluate_likelihood(proposal, program);
            
            return Math.min(1, proposal_likelihood / current_likelihood);
        } catch (error) {
            return 0; // Reject proposal if it causes errors
        }
    }
    
    evaluate_likelihood(state, program) {
        try {
            program(); // Execute program with state
            return 1.0; // If no error, assume likelihood of 1
        } catch (error) {
            return 0.01; // Low likelihood for problematic states
        }
    }

    /**
     * Random number generation with seeding
     */
    
    random() {
        // Simple LCG for reproducible randomness
        this.rng_state.counter++;
        const a = 1664525;
        const c = 1013904223;
        const m = Math.pow(2, 32);
        
        this.rng_state.seed = (a * this.rng_state.seed + c) % m;
        return this.rng_state.seed / m;
    }
    
    setSeed(seed) {
        this.rng_state.seed = seed;
        this.rng_state.counter = 0;
        // مسح القيمة الاحتياطية حتى تكون النتائج قابلة للتكرار فعلاً بعد إعادة البذر
        this.spare_gaussian = undefined;
    }

    /**
     * Error handling and fallbacks
     */
    
    handle_inference_error(error, program, options) {
        console.warn('Inference error:', error.message);

        // Return fallback distribution with the full distribution API
        // حتى لا ينهار المستهلكون الذين يستدعون sample()/percentile()
        const fallback = this.create_distribution_from_samples([0.5]);
        fallback.error = error.message;
        fallback.fallback = true;
        return fallback;
    }

    /**
     * Memoization for performance
     */
    
    memoize(key, computation) {
        if (this.memo_cache.has(key)) {
            return this.memo_cache.get(key);
        }
        
        const result = computation();
        
        // Manage cache size
        if (this.memo_cache.size >= this.cache_size_limit) {
            const firstKey = this.memo_cache.keys().next().value;
            this.memo_cache.delete(firstKey);
        }
        
        this.memo_cache.set(key, result);
        return result;
    }
    
    clearMemoCache() {
        this.memo_cache.clear();
    }

    /**
     * Advanced cognitive modeling utilities
     */
    
    // Model attention as probabilistic resource allocation
    attentionAllocation(tasks, totalAttention = 1.0, priorities = null) {
        if (!priorities) {
            priorities = new Array(tasks.length).fill(1.0);
        }
        
        // Use Dirichlet distribution for allocation
        const concentrations = priorities.map(p => p * 5); // Scale for reasonable concentration
        const allocation = this.dirichlet(concentrations);
        
        return tasks.map((task, i) => ({
            task: task,
            attention_allocated: allocation[i] * totalAttention,
            priority: priorities[i]
        }));
    }
    
    // Model learning as probabilistic belief update
    beliefUpdate(priorBelief, evidence, evidenceReliability = 0.8) {
        // Bayesian update
        const likelihood = evidenceReliability * evidence + (1 - evidenceReliability) * (1 - evidence);
        const posterior = (likelihood * priorBelief) / 
                         (likelihood * priorBelief + (1 - likelihood) * (1 - priorBelief));
        
        // Add uncertainty from evidence reliability
        const uncertainty = this.gaussian(0, (1 - evidenceReliability) * 0.1);
        
        return Math.max(0, Math.min(1, posterior + uncertainty));
    }
    
    // Model forgetting as exponential decay with noise
    forgettingCurve(initialStrength, timeElapsed, decayRate = 0.1, consolidation = 0.5) {
        const decayedStrength = initialStrength * Math.exp(-decayRate * timeElapsed * (1 - consolidation));
        const forgettingNoise = this.gaussian(0, 0.05 * timeElapsed);
        
        return Math.max(0, decayedStrength + forgettingNoise);
    }
    
    // Model social influence as weighted opinion aggregation
    socialInfluence(personalOpinion, socialOpinions, influenceWeights = null, conformityTendency = 0.5) {
        if (!influenceWeights) {
            influenceWeights = new Array(socialOpinions.length).fill(1.0);
        }
        
        // Weighted average of social opinions
        const totalWeight = influenceWeights.reduce((sum, w) => sum + w, 0);
        const weightedSocialOpinion = socialOpinions.reduce((sum, opinion, i) => 
            sum + opinion * influenceWeights[i], 0) / totalWeight;
        
        // Blend personal and social opinions
        const influenced = personalOpinion * (1 - conformityTendency) + 
                          weightedSocialOpinion * conformityTendency;
        
        // Add social uncertainty
        const socialUncertainty = this.gaussian(0, conformityTendency * 0.1);
        
        return Math.max(0, Math.min(1, influenced + socialUncertainty));
    }

    /**
     * Export functionality for integration
     */
    
    // Create a WebPPL-like interface for easier integration
    createWebPPLInterface() {
        return {
            infer: this.infer.bind(this),
            uniform: this.uniform.bind(this),
            gaussian: this.gaussian.bind(this),
            beta: this.beta.bind(this),
            exponential: this.exponential.bind(this),
            categorical: this.categorical.bind(this),
            dirichlet: this.dirichlet.bind(this),
            condition: this.condition.bind(this),
            factor: this.factor.bind(this),
            observe: this.observe.bind(this),
            expectation: this.expectation.bind(this),
            variance: this.variance.bind(this),
            
            // Cognitive modeling utilities
            cognitiveNoise: this.cognitiveNoise.bind(this),
            emotionalBias: this.emotionalBias.bind(this),
            memoryReconstruction: this.memoryReconstruction.bind(this),
            attentionAllocation: this.attentionAllocation.bind(this),
            beliefUpdate: this.beliefUpdate.bind(this),
            forgettingCurve: this.forgettingCurve.bind(this),
            socialInfluence: this.socialInfluence.bind(this)
        };
    }
}

module.exports = ProbabilityCore;
