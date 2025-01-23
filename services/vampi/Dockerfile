# Stage 1: Builder
FROM python:3.11-alpine as builder
ARG OPENAPI_SPEC=api.yml  # Default path for unified spec
RUN apk add --no-cache g++ libffi-dev
COPY . /vampi
WORKDIR /vampi
COPY services/vampi/openapi_specs/${OPENAPI_SPEC} /vampi/openapi_specs/api.yml
RUN pip install --user -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-alpine
RUN apk add --no-cache curl mongodb-tools
COPY --from=builder /root/.local /root/.local
COPY --from=builder /vampi /vampi
WORKDIR /vampi
ENV PATH=/root/.local/bin:$PATH \
    vulnerable=1 \
    tokentimetolive=60 \
    OPENAPI_SPEC=/vampi/openapi_specs/api.yml

ENTRYPOINT ["python", "app.py"]