/**
 * Data loader for loading fuzzer data from embedded JavaScript files
 */
class DataLoader {
    constructor(fuzzerName) {
        this.fuzzerName = fuzzerName; // Keep original case
        this.fuzzerDir = fuzzerName.toLowerCase(); // Use lowercase for directory
    }

    loadMetadata() {
        const variableName = `${this.fuzzerName}Metadata`;
        try {
            if (!(variableName in window)) {
                console.error(`Metadata not found: window.${variableName} is undefined`);
                return {};
            }
            const metadata = window[variableName];
            console.log(`Successfully loaded metadata from window.${variableName}:`, metadata);
            return metadata;
        } catch (error) {
            console.error(`Error loading metadata from window.${variableName}:`, error);
            return {};
        }
    }

    loadCoverage() {
        const variableName = `${this.fuzzerName}Coverage`;
        try {
            if (!(variableName in window)) {
                console.error(`Coverage data not found: window.${variableName} is undefined`);
                return {};
            }
            const coverage = window[variableName];
            console.log(`Successfully loaded coverage from window.${variableName}:`, coverage);
            return coverage;
        } catch (error) {
            console.error(`Error loading coverage from window.${variableName}:`, error);
            return {};
        }
    }

    loadEndpointChunk(chunkIndex) {
        const variableName = `${this.fuzzerName}Endpoints${chunkIndex}`;
        try {
            if (!(variableName in window)) {
                console.error(`Endpoint chunk not found: window.${variableName} is undefined`);
                return [];
            }
            const endpoints = window[variableName];
            if (!Array.isArray(endpoints)) {
                console.error(`Invalid endpoint data: window.${variableName} is not an array`);
                return [];
            }
            console.log(`Successfully loaded ${endpoints.length} endpoints from window.${variableName}:`, endpoints);
            return endpoints;
        } catch (error) {
            console.error(`Error loading endpoint chunk from window.${variableName}:`, error);
            return [];
        }
    }

    validateEndpoint(endpoint) {
        return (
            endpoint &&
            typeof endpoint === 'object' &&
            typeof endpoint.path === 'string' &&
            typeof endpoint.method === 'string' &&
            typeof endpoint.total_requests === 'number' &&
            typeof endpoint.success_rate === 'number' &&
            typeof endpoint.type === 'string'
        );
    }
}

// Export for use in other modules
window.DataLoader = DataLoader;
