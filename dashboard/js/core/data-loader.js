/**
 * Data loader class for handling fuzzing results data loading
 */
class DataLoader {
    constructor(fuzzerName) {
        this.fuzzerName = fuzzerName;
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
            return null;
        }
    }
}

// Export for use in other modules
window.DataLoader = DataLoader;
