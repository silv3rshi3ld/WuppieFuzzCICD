/**
 * Enhanced data loader for loading fuzzer data from embedded JavaScript files
 * with support for progressive loading and caching
 */
class DataLoader {
    constructor(fuzzerName) {
        this.fuzzerName = fuzzerName; // Keep original case
        this.fuzzerDir = fuzzerName.toLowerCase(); // Use lowercase for directory
        this.cache = new Map();
        this.loadingChunks = new Set();
        this.currentChunk = 0;
    }

    /**
     * Load metadata with validation and caching
     */
    async loadMetadata() {
        const variableName = `${this.fuzzerName}Metadata`;
        return this.loadAndValidateData('metadata', variableName, (data) => {
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid metadata format');
            }
            if (!data.fuzzer || !data.summary) {
                throw new Error('Missing required metadata fields');
            }
            return data;
        });
    }

    /**
     * Load coverage data with validation and caching
     */
    async loadCoverage() {
        const variableName = `${this.fuzzerName}Coverage`;
        return this.loadAndValidateData('coverage', variableName, (data) => {
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid coverage format');
            }
            if (!data.statusDistribution || !data.methodCoverage) {
                throw new Error('Missing required coverage fields');
            }
            return data;
        });
    }

    /**
     * Load endpoint chunk with validation and caching
     */
    async loadEndpointChunk(chunkIndex) {
        if (this.loadingChunks.has(chunkIndex)) {
            return null; // Chunk is already being loaded
        }

        const cacheKey = `endpoints_${chunkIndex}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        this.loadingChunks.add(chunkIndex);
        const variableName = `${this.fuzzerName}Endpoints${chunkIndex}`;

        try {
            const endpoints = await this.loadAndValidateData(cacheKey, variableName, (data) => {
                if (!Array.isArray(data)) {
                    throw new Error('Invalid endpoint data format');
                }
                return data.filter(endpoint => this.validateEndpoint(endpoint))
                          .map(endpoint => this.processEndpoint(endpoint));
            });

            // Update current chunk if this load was successful
            if (endpoints && endpoints.length > 0) {
                this.currentChunk = Math.max(this.currentChunk, chunkIndex + 1);
            }

            return endpoints;
        } finally {
            this.loadingChunks.delete(chunkIndex);
        }
    }

    /**
     * Load and validate data with caching
     */
    async loadAndValidateData(cacheKey, variableName, validator) {
        try {
            // Check cache first
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            // Check if variable exists in window
            if (!(variableName in window)) {
                throw new Error(`Data not found: window.${variableName} is undefined`);
            }

            // Get and validate data
            const data = window[variableName];
            const validatedData = validator(data);

            // Cache the validated data
            this.cache.set(cacheKey, validatedData);
            return validatedData;

        } catch (error) {
            console.error(`Error loading ${cacheKey}:`, error);
            throw new Error(`Failed to load ${cacheKey}: ${error.message}`);
        }
    }

    /**
     * Validate individual endpoint data
     */
    validateEndpoint(endpoint) {
        if (!endpoint || typeof endpoint !== 'object') {
            console.error('Invalid endpoint: not an object', endpoint);
            return false;
        }

        // Required fields
        const requiredFields = {
            path: 'string',
            method: 'string'
        };

        for (const [field, type] of Object.entries(requiredFields)) {
            if (!(field in endpoint) || typeof endpoint[field] !== type) {
                console.error(`Invalid endpoint: missing or invalid ${field}`, endpoint);
                return false;
            }
        }

        // Optional fields with type validation
        const optionalFields = {
            total_requests: 'number',
            success_rate: 'number',
            type: 'string',
            status_codes: 'object',
            response_data: ['string', 'object'],
            body: ['string', 'object']
        };

        for (const [field, types] of Object.entries(optionalFields)) {
            if (field in endpoint) {
                const fieldTypes = Array.isArray(types) ? types : [types];
                if (!fieldTypes.some(type => typeof endpoint[field] === type)) {
                    console.error(`Invalid endpoint: invalid type for ${field}`, endpoint);
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Process and normalize endpoint data
     */
    processEndpoint(endpoint) {
        // Ensure all required fields are present with defaults
        const processed = {
            ...endpoint,
            total_requests: endpoint.total_requests || 0,
            success_rate: endpoint.success_rate || 0,
            type: endpoint.type || 'unspecified',
            status_codes: endpoint.status_codes || {},
            response_data: endpoint.response_data || endpoint.body || null
        };

        // Convert any response data to string if it's an object
        if (typeof processed.response_data === 'object' && processed.response_data !== null) {
            try {
                processed.response_data = JSON.stringify(processed.response_data, null, 2);
            } catch (error) {
                console.error('Error stringifying response data:', error);
                processed.response_data = null;
            }
        }

        // Ensure method is uppercase
        processed.method = processed.method.toUpperCase();

        return processed;
    }

    /**
     * Clear cache for a specific key or all cache if no key provided
     */
    clearCache(key = null) {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }

    /**
     * Check if there are more endpoint chunks available
     */
    hasMoreEndpoints() {
        const nextChunkVar = `${this.fuzzerName}Endpoints${this.currentChunk}`;
        return nextChunkVar in window;
    }

    /**
     * Get the current loading state
     */
    getLoadingState() {
        return {
            currentChunk: this.currentChunk,
            loadingChunks: Array.from(this.loadingChunks),
            hasMore: this.hasMoreEndpoints()
        };
    }
}

// Export for use in other modules
window.DataLoader = DataLoader;
