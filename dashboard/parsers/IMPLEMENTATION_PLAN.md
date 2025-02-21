# Dashboard Improvements Implementation Plan

## 1. Fix Endpoint Expansion

### Updates to endpoint-tree.js
- Add click handler to entire endpoint card header
- Implement smooth slide animation for expansion
- Show request/response details in expanded view
- Add syntax highlighting for JSON content
- Add copy-to-clipboard functionality

### Endpoint Details Display
```html
<div class="endpoint-details">
    <div class="details-section">
        <h4>Request Details</h4>
        <pre><code>{request_data}</code></pre>
    </div>
    <div class="details-section">
        <h4>Response Details</h4>
        <pre><code>{response_data}</code></pre>
    </div>
    <div class="details-section">
        <h4>Status Code Distribution</h4>
        <div class="status-distribution"></div>
    </div>
</div>
```

## 2. Enhanced Styling

### Stats Cards
- Add gradient backgrounds
- Implement hover effects with shadow and slight elevation
- Add pulsing animation for critical errors
- Include relevant icons for each metric

### Color Scheme
```css
:root {
    --color-success: #22c55e;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-status-500: #dc2626;
    --color-status-400: #f59e0b;
    --color-status-200: #22c55e;
}
```

### Animation Effects
- Add smooth transitions for all hover states
- Implement pulsing effect for critical errors
- Add loading states and transitions

## 3. Duration Display Fix

### Parser Updates
- Standardize timestamp parsing across all parsers
- Implement duration calculation from start/end times
- Add validation for duration format

### Duration Format
```typescript
interface Duration {
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;  // "HH:MM:SS"
}
```

## 4. Result Normalization

### Parser Standardization
- Review and normalize request counting logic
- Implement consistent status code categorization
- Add validation for parsed data

### WuppyFuzz Finding Deduplication
- Implement crash/finding deduplication logic:
  ```python
  def deduplicate_findings(crashes):
      # Track unique findings by their key attributes
      unique_findings = {}
      for crash in crashes:
          # Create unique key based on error characteristics
          key = (
              crash['endpoint'],
              crash['method'],
              crash['status_code'],
              # Hash the error message/stack trace to group similar errors
              hash(crash.get('error', '')),
              # Consider request structure (ignoring dynamic values)
              hash(normalize_request(crash.get('request', '')))
          )
          
          if key not in unique_findings:
              # Add new finding with occurrence count
              crash['occurrences'] = 1
              unique_findings[key] = crash
          else:
              # Update existing finding
              existing = unique_findings[key]
              existing['occurrences'] += 1
              # Keep track of all timestamps
              if not isinstance(existing['timestamp'], list):
                  existing['timestamp'] = [existing['timestamp']]
              existing['timestamp'].append(crash['timestamp'])
              
      return list(unique_findings.values())

  def normalize_request(request_str):
      """Normalize request by removing dynamic values."""
      # Remove timestamps, UUIDs, random tokens etc.
      normalized = re.sub(r'\b[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\b', 'UUID', request_str)
      normalized = re.sub(r'\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?\b', 'TIMESTAMP', normalized)
      normalized = re.sub(r'\b[a-zA-Z0-9+/]{32,}\b', 'TOKEN', normalized)
      return normalized
  ```

- Add finding grouping and categorization:
  ```python
  def categorize_findings(findings):
      categories = {
          'critical': [],  # 500 errors with clear stack traces
          'high': [],      # 500 errors without clear cause
          'medium': [],    # 400 errors with potential security implications
          'low': []        # Other issues
      }
      
      for finding in findings:
          severity = determine_severity(finding)
          categories[severity].append(finding)
          
      return categories

  def determine_severity(finding):
      """Determine finding severity based on various factors."""
      if finding['status_code'] >= 500:
          if 'stack_trace' in finding.get('error', '').lower():
              return 'critical'
          return 'high'
      elif finding['status_code'] >= 400:
          if any(term in finding.get('error', '').lower() 
                for term in ['sql', 'injection', 'overflow', 'memory']):
              return 'medium'
      return 'low'
  ```

### Data Structure
```typescript
interface FuzzerResults {
    metadata: {
        name: string;
        version: string;
        timestamp: string;
        duration: string;
    };
    stats: {
        total_requests: number;
        critical_issues: number;
        unique_endpoints: number;
        code_coverage: number;
    };
    coverage: {
        lines: Coverage;
        functions: Coverage;
        branches: Coverage;
        statements: Coverage;
    };
    endpoints: Array<{
        path: string;
        method: string;
        total_requests: number;
        success_requests: number;
        success_rate: number;
        status_codes: Record<string, number>;
    }>;
    crashes: Array<{
        timestamp: string | string[];  // Single timestamp or array for duplicates
        endpoint: string;
        method: string;
        status_code: number;
        type: string;
        request: string;
        response: string;
        error: string;
        occurrences: number;  // Count of duplicates
        severity: 'critical' | 'high' | 'medium' | 'low';
    }>;
}

interface Coverage {
    covered: number;
    total: number;
    percentage: number;
}
```

## Implementation Order

1. Finding Deduplication & Categorization
   - Implement WuppyFuzz finding deduplication
   - Add severity categorization
   - Update crash display to show occurrence counts
   - Add filtering by severity

2. UI Components
   - Update endpoint-tree.js with new expansion logic
   - Enhance styling with new animations and effects
   - Add proper error handling and loading states
   - Add severity-based coloring and icons

3. Data Display
   - Implement proper duration formatting
   - Add detailed endpoint information display
   - Enhance error and status code visualization
   - Add finding occurrence statistics

4. Testing & Validation
   - Add validation for parsed data
   - Test with different result sizes
   - Verify consistent behavior across fuzzers
   - Test deduplication with various error patterns