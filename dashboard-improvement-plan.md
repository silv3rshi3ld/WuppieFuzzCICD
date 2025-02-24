# Dashboard Generation Workflow Plan

## Current Flow
1. Fuzzers run and generate results
2. Results are zipped and uploaded as artifacts:
   - Evomaster: `evomaster-results.zip`
   - Restler: `restler-fuzz-results.zip`
   - Wuppiefuzz: `fuzzing-report.zip`

## Proposed Workflow Changes

### 1. Download and Extract Artifacts
- Add a new job that runs after all fuzzers complete
- Download all fuzzer artifacts:
  - Evomaster results
  - Restler results
  - Wuppiefuzz results
- Extract the zip files to appropriate directories

### 2. Parse Results
- Run the parsers for each fuzzer:
  - Use `parsers/evomaster_parser.py` for Evomaster results
  - Use `parsers/restler_parser.py` for Restler results
  - Use `parsers/wuppiefuzz_parser.py` for Wuppiefuzz results
- Generate JSON reports for each fuzzer

### 3. Generate Dashboard
- Run `generate_dashboard.py` to create the dashboard
- This will:
  - Process all parser outputs
  - Generate all necessary dashboard files
  - Create a complete, self-contained dashboard

### 4. Package and Upload Dashboard
- Create a zip file containing the complete dashboard
- Upload as a GitHub Actions artifact named "fuzzing-dashboard"
- Make it available for download from the workflow run

## GitHub Actions Implementation

```yaml
# After fuzzer jobs complete
jobs:
  generate-dashboard:
    needs: [run-evomaster, run-restler, run-wuppiefuzz]
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Download Evomaster Results
        uses: actions/download-artifact@v3
        with:
          name: evomaster-results
          path: output-fuzzers/Evomaster

      - name: Download Restler Results
        uses: actions/download-artifact@v3
        with:
          name: restler-results
          path: output-fuzzers/Restler

      - name: Download Wuppiefuzz Results
        uses: actions/download-artifact@v3
        with:
          name: wuppiefuzz-results
          path: output-fuzzers/Wuppiefuzz

      - name: Extract Results
        run: |
          cd output-fuzzers/Evomaster && unzip evomaster-results.zip
          cd ../Restler && unzip restler-fuzz-results.zip
          cd ../Wuppiefuzz && unzip fuzzing-report.zip

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Parse Results and Generate Dashboard
        run: |
          python -m parsers
          python generate_dashboard.py

      - name: Package Dashboard
        run: |
          zip -r fuzzing-dashboard.zip dashboard/

      - name: Upload Dashboard
        uses: actions/upload-artifact@v3
        with:
          name: fuzzing-dashboard
          path: fuzzing-dashboard.zip
          retention-days: 90
```

## Benefits
1. Automated end-to-end workflow
2. Single downloadable artifact containing complete dashboard
3. Easy access to results for all stakeholders
4. Consistent dashboard generation process
5. Long retention period (90 days) for historical comparison

## Technical Considerations
1. Ensure all required Python dependencies are installed
2. Verify parsers can handle potential errors in fuzzer outputs
3. Consider adding error handling and reporting
4. Add logging for debugging workflow issues
5. Consider caching dependencies to speed up workflow

## Next Steps
1. Implement the GitHub Actions workflow changes
2. Test the workflow with sample fuzzer outputs
3. Verify dashboard generation and artifact upload
4. Add documentation for accessing and using the dashboard