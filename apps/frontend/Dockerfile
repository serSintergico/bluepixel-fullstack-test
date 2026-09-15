FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copia package.json y package-lock.json desde el contexto local (./apps/frontend)
COPY package*.json ./

RUN npm install

# 2. Copia todo el código fuente del frontend
COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

# 3. Copia las dependencias y la compilación final de Next.js
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 4000

CMD ["npm", "run", "start"]