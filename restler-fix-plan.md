# RESTler Coverage Fix Plan

## Identified Issues

1. **Docker Build Context Issue**
   - The Dockerfile.restler COPY instruction assumes an incorrect path structure
   - Current: `COPY ./services/restler/config /service/config`
   - This fails because the build context is set to `../..` in docker-compose.yml

2. **Working Directory Inconsistency**
   - Workflow switches directories inconsistently
   - Artifact upload path doesn't match volume mount
   - Log collection commands use inconsistent paths

3. **Volume Mount Verification**
   - Need to ensure OpenAPI spec is properly mounted
   - Need to verify output directory permissions

## Action Plan

### 1. Fix Dockerfile.restler

```dockerfile
# Update the COPY instruction to use correct path
COPY services/restler/config /service/config
```

### 2. Update Workflow File

```yaml
jobs:
  restler:
    runs-on: ubuntu-latest
    env:
      RUN_FUZZ_LEAN: "true"
      RUN_FUZZ: "true"
      BASE_DIR: ${{ github.workspace }}
      NETWORK_SUFFIX: ${{ github.run_id }}
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Prepare Environment
        run: |
          mkdir -p services/restler/output
          chmod -R 777 services/restler/output

      - name: Run RESTler and VAmPI
        working-directory: services/restler
        run: |
          docker compose -f docker-compose.restler.yml up --abort-on-container-exit
          ls -la output || true

      - name: Check Container Logs
        if: always()
        working-directory: services/restler
        run: |
          docker compose -f docker-compose.restler.yml logs vampi || true
          docker compose -f docker-compose.restler.yml logs restler || true
          docker compose -f docker-compose.restler.yml logs init-vampi || true

      - name: Upload Restler Results
        uses: actions/upload-artifact@v4
        with:
          name: restler-results
          path: services/restler/output
```

### 3. Add Debug Logging

Add these debug steps to the entrypoint.sh script:

```bash
# After OpenAPI file check
echo "OpenAPI file contents:"
head -n 5 /workspace/openapi3.yml

# After compilation
echo "Compile directory contents:"
ls -la /workspace/Compile/

# After each phase
echo "Phase results:"
ls -la /workspace/Test/RestlerResults/
ls -la /workspace/FuzzLean/RestlerResults/
ls -la /workspace/Fuzz/RestlerResults/
```

### 4. Implementation Steps

1. **Update Dockerfile**
   - Fix COPY instruction path
   - Rebuild container with corrected paths

2. **Update Workflow**
   - Apply consistent working directory approach
   - Fix artifact upload path
   - Add debug logging

3. **Verify Volume Mounts**
   - Check OpenAPI spec mounting
   - Verify output directory permissions
   - Ensure network connectivity between services

4. **Test Changes**
   - Run workflow locally first
   - Monitor logs for compilation success
   - Verify grammar generation
   - Check results collection

### 5. Success Criteria

1. OpenAPI spec is properly mounted and accessible
2. Grammar file is generated successfully
3. All phases (Test, FuzzLean, Fuzz) complete
4. Results are properly collected and uploaded
5. Logs show proper connectivity between services

### 6. Monitoring Plan

1. Watch for these specific log messages:
   - "OpenAPI file found at /workspace/openapi3.yml"
   - "Grammar file was generated successfully"
   - "Test/FuzzLean/Fuzz phase completed"

2. Monitor these artifacts:
   - /workspace/Compile/grammar.py
   - /workspace/Compile/dict.json
   - /workspace/*/RestlerResults/*

## Next Steps

1. Implement Dockerfile changes
2. Update workflow file
3. Add debug logging
4. Test changes locally
5. Monitor results in CI

Would you like me to proceed with implementing these changes?