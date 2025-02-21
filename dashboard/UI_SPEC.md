# Dashboard UI Specification

## Page Structure

```
/index.html                  # Overview page with fuzzer cards
/pages/wuppiefuzz.html      # WuppieFuzz detailed results
/pages/restler.html         # Restler detailed results
/pages/evomaster.html       # Evomaster detailed results
```

## Overview Page Layout

```
+------------------------------------------+
|                 Header                    |
|  Logo    Dashboard Title     Global Stats |
+------------------------------------------+
|                                          |
|            Fuzzer Cards                  |
| +---------------+ +------------------+    |
| |  WuppieFuzz  | |     Restler     |    |
| | Stats        | | Stats            |    |
| | Quick Charts | | Quick Charts     |    |
| +---------------+ +------------------+    |
| +---------------+                        |
| |  Evomaster   |                        |
| | Stats        |                        |
| | Quick Charts |                        |
| +---------------+                        |
|                                          |
+------------------------------------------+
```

## Individual Fuzzer Page Layout

```
+------------------------------------------+
|                 Header                    |
|  Back    Fuzzer Name          Duration   |
+------------------------------------------+
|                                          |
|            Overview Stats                 |
| +--------+ +--------+ +--------+ +-----+ |
| | Total  | |Critical| |Unique  | |Code | |
| |Requests| | Issues | |Endpoint| |Cover| |
| +--------+ +--------+ +--------+ +-----+ |
|                                          |
+------------------------------------------+
|                                          |
|           Coverage Analysis              |
| +---------------+ +-------------------+   |
| | Coverage      | | Method Coverage   |   |
| | Distribution  | | Bar Chart         |   |
| +---------------+ +-------------------+   |
| +---------------+ +-------------------+   |
| | Status Code   | | Coverage          |   |
| | Distribution  | | Progress          |   |
| +---------------+ +-------------------+   |
|                                          |
+------------------------------------------+
|                                          |
|           Endpoint Analysis              |
| +------------------------------------+   |
| | Endpoint Tree                      |   |
| | - GET /api/v1/users               |   |
| |   Success: 80% (800/1000)         |   |
| |   Status: 200, 404, 500           |   |
| | - POST /api/v1/users              |   |
| |   Success: 75% (150/200)          |   |
| |   Status: 201, 400, 500           |   |
| +------------------------------------+   |
|                                          |
+------------------------------------------+
|                                          |
|           Crashes and Issues             |
| +------------------------------------+   |
| | Severity | Type | Location | Time  |   |
| |------------------------------------|   |
| | Critical | NPE  | module.c | 12:00 |   |
| |  [Expandable Details Section]      |   |
| +------------------------------------+   |
|                                          |
+------------------------------------------+
```

## Component Details

### 1. Fuzzer Card (Overview Page)
- Fuzzer name and icon
- Key statistics:
  - Total requests
  - Critical issues
  - Success rate
  - Duration
- Quick status charts:
  - Coverage distribution
  - Status code breakdown
- Link to detailed page

### 2. Individual Fuzzer Page Components

#### Header
- Back button to overview
- Fuzzer name and icon
- Duration of fuzzing session
- Last update timestamp

#### Overview Stats
1. Total Requests
   - Number of requests made
   - Requests per second
   - Total duration

2. Critical Issues
   - Number of critical bugs
   - Severity breakdown
   - Time since last critical

3. Unique Endpoints
   - Total endpoints tested
   - Coverage percentage
   - New endpoints found

4. Code Coverage
   - Overall coverage rate
   - Line/branch/function stats
   - Coverage trend

#### Coverage Analysis
1. Coverage Distribution (Donut Chart)
   - Lines covered
   - Functions covered
   - Branches covered

2. Method Coverage (Bar Chart)
   - GET/POST/PUT/DELETE methods
   - Success vs failure rates
   - Response time distribution

3. Status Code Distribution (Bar Chart)
   - 2xx/3xx/4xx/5xx breakdown
   - Error clustering
   - Trend analysis

4. Coverage Progress (Line Chart)
   - Coverage over time
   - Major milestones
   - Regression points

#### Endpoint Analysis
- Tree view of all endpoints
- For each endpoint:
  - HTTP method
  - Path
  - Success rate
  - Status code distribution
  - Average response time
  - Number of crashes
- Filtering and search
- Expandable details

#### Crashes and Issues
- Sortable table
- Severity levels
- Stack traces
- Reproduction steps
- Status tracking
- Filter by:
  - Severity
  - Status
  - Endpoint
  - Time period

## Interactive Features

### 1. Navigation
- Breadcrumb navigation
- Quick fuzzer switcher
- Back to overview button

### 2. Filtering
- Global filters per page
- Save filter preferences
- Quick presets

### 3. Data Updates
- Auto-refresh option
- Manual refresh button
- Update notifications

### 4. Export Options
- Download raw data
- Export charts as images
- Generate PDF reports

## Responsive Design

### Desktop (>1200px)
- Full layout with all charts
- Side-by-side comparisons
- Detailed data tables

### Tablet (768px-1200px)
- Stacked layout
- Scrollable tables
- Collapsible sections

### Mobile (<768px)
- Single column
- Important stats first
- Simplified charts

## Theme and Styling

### Colors
- Success: #22c55e
- Warning: #f59e0b
- Error: #dc2626
- Info: #3b82f6
- Neutral: #6b7280

### Typography
- Headers: Inter
- Body: system-ui
- Monospace: JetBrains Mono

## Performance

### Data Loading
- Load data in chunks
- Cache results
- Progressive loading
- Background updates

### Optimizations
- Lazy load components
- Virtual scrolling
- Image optimization
- Compressed data transfer