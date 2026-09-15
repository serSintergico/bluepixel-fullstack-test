FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV PORT=3001
EXPOSE 3001

# Ejecuta el seed desde el código compilado JS y luego inicia NestJS
CMD ["sh", "-c", "npm run seed:prod && node dist/main"]