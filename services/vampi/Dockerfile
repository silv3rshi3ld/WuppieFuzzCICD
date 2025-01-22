# Single multi-stage build for all variants
FROM python:3.11-alpine as builder

RUN apk --update add bash nano g++
WORKDIR /vampi
COPY ./requirements.txt .
RUN pip install -r requirements.txt

FROM python:3.11-alpine
WORKDIR /vampi
COPY --from=builder /usr/local/lib /usr/local/lib
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . .

RUN apk --update add wget curl
EXPOSE 5000
CMD ["python", "app.py"]