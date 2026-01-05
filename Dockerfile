# ==========================================
# Multi-stage Dockerfile for Astro SSR
# Optimized for production with Node.js adapter
# ==========================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Копируем только файлы зависимостей для кэширования
COPY package*.json ./

# Устанавливаем все зависимости (включая devDependencies для сборки)
RUN npm ci

# ==========================================
# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем зависимости из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные окружения для сборки (не секреты!)
ENV NODE_ENV=production

# Собираем проект
RUN npm run build

# ==========================================
# Stage 3: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Устанавливаем dumb-init для корректной обработки сигналов
RUN apk add --no-cache dumb-init

# Создаём non-root пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 astro

# Копируем только необходимое для запуска
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/package.json ./

# Переключаемся на non-root пользователя
USER astro

# Переменные окружения
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Открываем порт
EXPOSE 4321

# Healthcheck для Docker/Kubernetes
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:4321/ || exit 1

# Запускаем через dumb-init для корректной обработки сигналов
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "./dist/server/entry.mjs"]
