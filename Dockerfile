# 1. Build stage: install deps
FROM node:18-slim AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# 2. Runtime stage
FROM node:18-slim
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

ENV PORT=5000
EXPOSE 5000

# <-- use node directly, since npm start isn't configured
CMD ["node", "app.js"]
