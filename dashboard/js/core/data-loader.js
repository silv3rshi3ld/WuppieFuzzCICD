/**
<<<<<<< Updated upstream
 * Data loader class for handling fuzzing results data loading
=======
 * Enhanced data loader for handling progressive loading of fuzzer data
 * with proper validation, transformation, and error handling
>>>>>>> Stashed changes
 */
class DataLoader {
    constructor(fuzzerName) {
        this.fuzzerName = fuzzerName;
<<<<<<< Updated upstream
        this.dataPath = `../data/${fuzzerName.toLowerCase()}`;
    }

    async loadCoverage() {
        try {
            const response = await fetch(`${this.dataPath}/coverage.js`);
            const text = await response.text();
            eval(text); // This sets window[`${this.fuzzerName}Coverage`]
            return window[`${this.fuzzerName}Coverage`];
        } catch (error) {
            console.error('Error loading coverage data:', error);
            return null;
        }
    }

    async loadMetadata() {
        try {
            const response = await fetch(`${this.dataPath}/metadata.js`);
            const text = await response.text();
            eval(text); // This sets window[`${this.fuzzerName}Metadata`]
            return window[`${this.fuzzerName}Metadata`];
        } catch (error) {
            console.error('Error loading metadata:', error);
            return null;
        }
    }

    async loadData() {
        try {
            const response = await fetch(`${this.dataPath}/data.js`);
            const text = await response.text();
            eval(text); // This sets window[`${this.fuzzerName}Data`]
            return window[`${this.fuzzerName}Data`];
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    async loadEndpointsMeta() {
        try {
            const response = await fetch(`${this.dataPath}/endpoints_meta.js`);
            const text = await response.text();
            eval(text); // This sets window[`${this.fuzzerName}EndpointsMeta`]
            return window[`${this.fuzzerName}EndpointsMeta`];
        } catch (error) {
            console.error('Error loading endpoints meta:', error);
            return null;
        }
    }

    async loadEndpointsChunk(chunkIndex) {
        try {
            const response = await fetch(`${this.dataPath}/endpoints_${chunkIndex}.js`);
            const text = await response.text();
            eval(text); // This sets window[`${this.fuzzerName}Endpoints_${chunkIndex}`]
            return window[`${this.fuzzerName}Endpoints_${chunkIndex}`];
        } catch (error) {
            console.error(`Error loading endpoints chunk ${chunkIndex}:`, error);
=======
        this.baseUrl = `data/${fuzzerName.toLowerCase()}`;
        this.cache = new Map();
        this.initialized = false;
    }

    async initialize() {
        try {
            if (this.initialized) return;

            // Load and validate initial data
            const data = await this.loadInitialData();
            if (!this.validateInitialData(data)) {
                throw new Error('Invalid initial data structure');
            }

            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Initialization failed:', error);
            throw new Error('Failed to initialize data loader');
        }
    }

    async loadInitialData() {
        const dashboardKey = `${this.fuzzerName.toLowerCase()}_dashboard`;
        const reportKey = `${this.fuzzerName.toLowerCase()}_report`;
        
        const dashboardData = window[dashboardKey];
        const reportData = window[reportKey];

        if (!dashboardData || !reportData) {
            console.error('Missing data files:', {
                dashboard: !!dashboardData,
                report: !!reportData
            });
            throw new Error('Required data files not found');
        }

        // Merge dashboard and report data
        return {
            ...dashboardData,
            ...reportData,
            endpoints: reportData.endpoints || dashboardData.endpoints || []
        };
    }

    validateInitialData(data) {
        if (!data || typeof data !== 'object') {
            console.error('Data is not an object:', data);
            return false;
        }

        if (!Array.isArray(data.endpoints)) {
            console.error('Endpoints is not an array:', data.endpoints);
            return false;
        }

        return true;
    }

    getCached(key) {
        return this.cache.get(key);
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    async loadMetadata() {
        try {
            const cached = this.getCached('metadata');
            if (cached) return cached.data;

            const data = await this.loadInitialData();
            const stats = this.calculateStats(data.endpoints);
            const metadata = {
                name: data.name || this.fuzzerName,
                version: data.version || '1.0.0',
                timestamp: data.timestamp || Date.now(),
                summary: {
                    total_requests: stats.totalRequests,
                    success_rate: stats.successRate,
                    error_count: stats.errorCount,
                    unique_endpoints: stats.uniqueEndpoints
                }
            };

            this.setCache('metadata', metadata);
            return metadata;
        } catch (error) {
            console.error('Error loading metadata:', error);
            throw error;
        }
    }

    async loadCoverage() {
        try {
            const cached = this.getCached('coverage');
            if (cached) return cached.data;

            const data = await this.loadInitialData();
            const coverage = this.calculateCoverage(data.endpoints);
            this.setCache('coverage', coverage);
            return coverage;
        } catch (error) {
            console.error('Error loading coverage:', error);
            throw error;
        }
    }

    async loadEndpoints() {
        try {
            const data = await this.loadInitialData();
            if (!data || !data.endpoints) {
                throw new Error('No endpoint data available');
            }

            const processedEndpoints = this.transformEndpoints(data.endpoints);
            const stats = this.calculateStats(data.endpoints);
            
            return {
                items: processedEndpoints,
                hasMore: false,
                stats
            };
        } catch (error) {
            console.error('Error loading endpoints:', error);
            throw error;
        }
    }

    async loadBugs() {
        try {
            const data = await this.loadInitialData();
            if (!data || !data.endpoints) {
                return [];
            }

            return this.transformBugs(data.endpoints);
        } catch (error) {
            console.error('Error loading bugs:', error);
            throw error;
        }
    }

    calculateStats(endpoints) {
        let stats = {
            totalRequests: 0,
            successfulRequests: 0,
            errorCount: 0,
            uniqueEndpoints: new Set(),
            methodCounts: {},
            statusCounts: {
                '2xx': 0,
                '4xx': 0,
                '5xx': 0
            }
        };

        endpoints.forEach(endpoint => {
            // Count total requests
            const requests = endpoint.total_requests || 1;
            stats.totalRequests += requests;

            // Track unique endpoints
            stats.uniqueEndpoints.add(endpoint.path);

            // Count by status code
            const status = endpoint.status_code || 0;
            if (status >= 500) {
                stats.statusCounts['5xx']++;
                stats.errorCount++;
            } else if (status >= 400) {
                stats.statusCounts['4xx']++;
                stats.errorCount++;
            } else if (status >= 200 && status < 300) {
                stats.statusCounts['2xx']++;
                stats.successfulRequests++;
            }

            // Count by method
            const method = endpoint.http_method?.toLowerCase() || 'get';
            stats.methodCounts[method] = (stats.methodCounts[method] || 0) + requests;
        });

        return {
            totalRequests: stats.totalRequests,
            successRate: stats.totalRequests > 0 ? 
                (stats.successfulRequests / stats.totalRequests * 100).toFixed(2) : 0,
            errorCount: stats.errorCount,
            uniqueEndpoints: stats.uniqueEndpoints.size,
            methodCounts: stats.methodCounts,
            statusCounts: stats.statusCounts
        };
    }

    calculateCoverage(endpoints) {
        let coverage = {
            successful: 0,
            failed: 0,
            methodCounts: {
                get: 0,
                post: 0,
                put: 0,
                delete: 0,
                patch: 0
            }
        };

        endpoints.forEach(endpoint => {
            const requests = endpoint.total_requests || 1;
            const status = endpoint.status_code || 0;

            // Count successful vs failed requests
            if (status >= 200 && status < 300) {
                coverage.successful += requests;
            } else {
                coverage.failed += requests;
            }

            // Count method coverage
            const method = endpoint.http_method?.toLowerCase() || 'get';
            if (coverage.methodCounts[method] !== undefined) {
                coverage.methodCounts[method] += requests;
            }
        });

        const total = coverage.successful + coverage.failed;

        return {
            hits: coverage.successful,
            misses: coverage.failed,
            methods: coverage.methodCounts,
            coverage_rate: total > 0 ? (coverage.successful / total * 100).toFixed(2) : 0
        };
    }

    transformEndpoints(endpoints) {
        return endpoints.map(endpoint => ({
            path: endpoint.path || '',
            http_method: endpoint.http_method || 'GET',
            status_code: endpoint.status_code || 200,
            request_details: this.sanitizeData(endpoint.request_details),
            response_data: this.sanitizeData(endpoint.response_data),
            total_requests: endpoint.total_requests || 1,
            success_rate: endpoint.success_rate || 0,
            average_response_time: endpoint.average_response_time || 0
        }));
    }

    transformBugs(endpoints) {
        return endpoints
            .filter(endpoint => {
                const statusCode = endpoint.status_code || 0;
                return statusCode >= 400;
            })
            .map(endpoint => ({
                path: endpoint.path || '',
                method: endpoint.http_method || 'GET',
                status_code: endpoint.status_code || 0,
                error_details: endpoint.error_details || null,
                request_details: this.sanitizeData(endpoint.request_details),
                response_data: this.sanitizeData(endpoint.response_data),
                severity: this.calculateSeverity(endpoint.status_code),
                timestamp: endpoint.timestamp || Date.now()
            }));
    }

    calculateSeverity(statusCode) {
        if (!statusCode) return 'unknown';
        if (statusCode === 404) return 'low';
        if (statusCode >= 500) return 'critical';
        if (statusCode >= 400) return 'medium';
        return 'info';
    }

    sanitizeData(data) {
        if (!data) return null;
        try {
            return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (error) {
            console.warn('Error parsing data:', error);
>>>>>>> Stashed changes
            return null;
        }
    }
}

// Export for use in other modules
window.DataLoader = DataLoader;
