# --- STAGE 1: Build & Install Dependencies ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./


RUN npm ci

COPY . .

RUN npm run build

# --- STAGE 2: Production Runtime ---
FROM node:20-alpine AS production

WORKDIR /usr/src/app


COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main" ]