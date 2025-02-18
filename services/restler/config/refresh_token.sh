#!/bin/bash
set -e

# Configuration
API_HOST="http://${TARGET_IP}:${TARGET_PORT}"
USERNAME="restler_fuzzer"
PASSWORD="restler_password"
EMAIL="restler@test.com"

# Try to register user (ignore if already exists)
register_response=$(curl -s -X POST "${API_HOST}/users/v1/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\",\"email\":\"${EMAIL}\"}")

# Login to get token
login_response=$(curl -s -X POST "${API_HOST}/users/v1/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}")

# Extract token from login response
token=$(echo "$login_response" | grep -o '"auth_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$token" ]; then
    echo "Failed to get authentication token" >&2
    exit 1
fi

# Output token (RESTler will capture this)
echo "$token"
