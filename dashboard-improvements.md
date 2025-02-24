# Dashboard Improvements Plan

## Current State
- The parsers already collect request and response data
- The endpoint tree component has basic support for showing response data
- Status code visualization needs fixing
- Request details are not being displayed

## Required Changes

### 1. Endpoint Tree Component (endpoint-tree.js)

#### Add Request Details Display
```javascript
// Add to generateMethodHtml function
${endpoint.request_details ? this.generateRequestDataHtml(endpoint.request_details) : ''}
${endpoint.response_data ? this.generateResponseDataHtml(endpoint.response_data) : ''}

// New function to add
generateRequestDataHtml(requestData) {
    try {
        const formattedData = typeof requestData === 'string' ? 
            requestData : JSON.stringify(requestData, null, 2);
        
        return `
            <div class="mt-3">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Request Data</h4>
                <pre class="text-xs bg-gray-50 p-3 rounded overflow-x-auto">${this.escapeHtml(formattedData)}</pre>
            </div>
        `;
    } catch (error) {
        console.error('Error formatting request data:', error);
        return '';
    }
}
```

#### Improve Data Display
- Add collapsible sections for request/response data
- Add syntax highlighting for JSON data
- Add copy button for request/response data
- Show HTTP headers if available

```javascript
// Enhanced data display template
<div class="method-details hidden">
    <div class="space-y-4">
        ${this.generateStatusCodesHtml(statusCodes)}
        <div class="border rounded-lg overflow-hidden">
            <div class="bg-gray-50 p-2 flex justify-between items-center">
                <h4 class="text-sm font-medium text-gray-700">Request Details</h4>
                <button class="copy-button">Copy</button>
            </div>
            <div class="p-3">
                ${this.generateRequestDataHtml(endpoint.request_details)}
            </div>
        </div>
        <div class="border rounded-lg overflow-hidden">
            <div class="bg-gray-50 p-2 flex justify-between items-center">
                <h4 class="text-sm font-medium text-gray-700">Response Details</h4>
                <button class="copy-button">Copy</button>
            </div>
            <div class="p-3">
                ${this.generateResponseDataHtml(endpoint.response_data)}
            </div>
        </div>
    </div>
</div>
```

### 2. Charts Component (charts.js)

#### Fix Status Code Distribution
- Update chart configuration to properly handle status code data
- Add tooltips showing exact counts
- Group similar status codes (2xx, 3xx, etc.)
- Add legend with status code meanings

```javascript
// Status code chart configuration
const statusConfig = {
    type: 'bar',
    data: {
        labels: Object.keys(statusCodes),
        datasets: [{
            data: Object.values(statusCodes),
            backgroundColor: this.getStatusCodeColors()
        }]
    },
    options: {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => `Count: ${context.raw}`
                }
            },
            legend: {
                display: true,
                position: 'bottom'
            }
        }
    }
};
```

### 3. CSS Updates (styles.css)

```css
/* Add styles for request/response display */
.data-container {
    @apply border rounded-lg overflow-hidden;
}

.data-header {
    @apply bg-gray-50 p-2 flex justify-between items-center;
}

.data-content {
    @apply p-3;
}

.copy-button {
    @apply text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded;
}

/* Add styles for JSON syntax highlighting */
.json-key { color: #24292e; }
.json-string { color: #22863a; }
.json-number { color: #005cc5; }
.json-boolean { color: #e36209; }
.json-null { color: #6f42c1; }
```

## Implementation Steps

1. Switch to Code mode
2. Update endpoint-tree.js with new request/response display
3. Fix status code visualization in charts.js
4. Add CSS styles for improved data display
5. Test with different types of request/response data
6. Verify status code chart functionality

## Success Criteria
- Request and response data clearly visible in endpoint tree
- Data properly formatted and syntax highlighted
- Status code chart showing correct distribution
- Copy functionality working for request/response data
- All changes maintain existing performance and progressive loading