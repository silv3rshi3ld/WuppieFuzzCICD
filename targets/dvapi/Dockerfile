FROM python:3.11-alpine as builder
RUN apk --update add bash nano g++
COPY ./requirements.txt /dvapi/requirements.txt
WORKDIR /dvapi
RUN pip install -r requirements.txt

# Build a fresh container, copying across files & compiled parts
FROM python:3.11-alpine
RUN apk --update add curl
COPY . /dvapi
WORKDIR /dvapi
COPY --from=builder /usr/local/lib /usr/local/lib
COPY --from=builder /usr/local/bin /usr/local/bin
ENV vulnerable=1
ENV tokentimetolive=60

# Make entrypoint script executable
RUN chmod +x /dvapi/config/entrypoint.sh

ENTRYPOINT ["/dvapi/config/entrypoint.sh"]
