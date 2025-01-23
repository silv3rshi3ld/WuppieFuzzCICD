# Stage 1: Builder
FROM python:3.11-alpine AS builder
ARG OPENAPI_SPEC=openapi3.yml  # Match actual filename

RUN apk add --no-cache g++ libffi-dev

WORKDIR /vampi

# Copy and install requirements first for better layer caching
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Copy the rest of the application
COPY . .

# Copy OpenAPI spec
COPY ${OPENAPI_SPEC} ./openapi_specs/

# Stage 2: Runtime
FROM python:3.11-alpine
RUN apk add --no-cache curl mongodb-tools
COPY --from=builder /root/.local /root/.local
COPY --from=builder /vampi /vampi
WORKDIR /vampi
ENV PATH=/root/.local/bin:$PATH \
    vulnerable=1 \
    tokentimetolive=60 \
    OPENAPI_SPEC=/vampi/openapi_specs/openapi3.yml

ENTRYPOINT ["python", "app.py"]
