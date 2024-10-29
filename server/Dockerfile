FROM node:18.17.1-alpine3.18


RUN apk add --no-cache netcat-openbsd

WORKDIR /app
COPY package*.json ./
RUN npm install --production  # Only install production dependencies


COPY db-check.js ./
COPY . .


RUN chmod +x ./wait-for ./docker-entrypoint.sh

EXPOSE 3001

CMD ["./docker-entrypoint.sh"]