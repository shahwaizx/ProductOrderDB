# 1. Build stage: install deps
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# 2. Runtime stage
FROM node:18-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

ENV PORT=8080
EXPOSE 8080

# <-- use node directly, since npm start isn't configured
CMD ["node", "app.js"]
