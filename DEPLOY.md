# 🚀 Инструкции по деплою

Проект поддерживает dual-deploy из одного репозитория:
- **РФ (VPS/Timeweb):** Node.js адаптер в standalone-режиме
- **Мир (Vercel):** Vercel адаптер в serverless-режиме

Автоматическое определение окружения происходит через переменную `VERCEL` (Vercel автоматически устанавливает `VERCEL=1` при сборке).

---

## 🇷🇺 Деплой на VPS (Node.js)

### Требования
- Node.js 20+ или Docker
- Доступ к серверу (SSH)

### Вариант 1: Docker (рекомендуется)

1. **Сборка образа:**
   ```bash
   docker compose build
   ```

2. **Запуск контейнера:**
   ```bash
   docker compose up -d
   ```

3. **Просмотр логов:**
   ```bash
   docker compose logs -f
   ```

4. **Остановка:**
   ```bash
   docker compose down
   ```

### Вариант 2: Прямой запуск Node.js

1. **Установка зависимостей:**
   ```bash
   npm install
   ```

2. **Сборка проекта:**
   ```bash
   npm run build
   ```

3. **Запуск сервера:**
   ```bash
   node ./dist/server/entry.mjs
   ```

4. **Настройка process manager (PM2):**
   ```bash
   npm install -g pm2
   pm2 start ./dist/server/entry.mjs --name portfolio-site
   pm2 save
   pm2 startup
   ```

### Переменные окружения

Создайте файл `.env` на сервере или установите переменные окружения:

```bash
# Telegram Bot API (опционально)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# SMTP настройки (опционально)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
SMTP_FROM=noreply@example.com
SMTP_TO=admin@example.com
```

### Настройка Nginx (опционально)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🌍 Деплой на Vercel

### Требования
- Аккаунт Vercel
- Репозиторий на GitHub/GitLab/Bitbucket

### Автоматический деплой через Git

1. **Подключите репозиторий к Vercel:**
   - Зайдите на [vercel.com](https://vercel.com)
   - Нажмите "New Project"
   - Выберите ваш репозиторий
   - Vercel автоматически определит Astro проект

2. **Настройки сборки (Vercel определит автоматически):**
   - **Framework Preset:** Astro
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Переменные окружения:**
   
   Добавьте в настройках проекта (Settings → Environment Variables):
   
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_password
   SMTP_FROM=noreply@example.com
   SMTP_TO=admin@example.com
   ```

4. **Деплой:**
   - Vercel автоматически задеплоит при каждом push в main ветку
   - Или нажмите "Deploy" вручную

### Ручной деплой через Vercel CLI

1. **Установка Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Логин:**
   ```bash
   vercel login
   ```

3. **Деплой:**
   ```bash
   vercel
   ```

4. **Production деплой:**
   ```bash
   vercel --prod
   ```

### Ограничения Vercel

⚠️ **Важно учитывать при разработке:**

- **Ephemeral FS:** Файловая система эфемерна — не храни файлы локально. Используй внешнее хранилище (S3, Cloudinary) для uploads.
- **Таймауты:** Serverless функции ограничены ~10-60 сек. Добавляй graceful degradation для долгих операций.
- **Edge functions:** Ограниченный runtime, не все Node.js API доступны. Используй `mode: 'serverless'` для полной совместимости.

### Переключение между режимами

В `astro.config.mjs` можно изменить режим Vercel:

```javascript
// Для serverless (полная совместимость Node.js):
import vercel from '@astrojs/vercel/serverless';

// Для edge functions (быстрее, но ограниченный runtime):
// import vercel from '@astrojs/vercel/edge';

adapter: isVercel 
  ? vercel() // Вызывается без параметров
  : node({ mode: 'standalone' }),
```

---

## 🔄 Тестирование dual-deploy локально

### Тест для VPS (Node.js)

```bash
npm run build
# Соберется с Node.js адаптером
```

### Тест для Vercel

```bash
VERCEL=1 npm run build
# Соберется с Vercel адаптером
```

### Проверка структуры dist/

**После сборки для Node.js:**
```
dist/
  ├── server/
  │   ├── entry.mjs          # Точка входа для Node.js
  │   └── ...
  └── client/
      └── ...
```

**После сборки для Vercel:**
```
dist/
  ├── .vercel/                # Vercel конфигурация
  ├── server/
  │   └── ...                 # Serverless функции
  └── client/
      └── ...
```

---

## 🔐 Безопасность

### Проверка переменных окружения

Проект использует `astro:env` с `validateSecrets: true` — приложение не стартует, если обязательные секреты не заданы.

### CSRF защита

Включена по умолчанию (`security.checkOrigin: true`). Не отключай без крайней необходимости.

---

## 📝 Troubleshooting

### Ошибка "Cannot find module '@astrojs/vercel'"

**Решение:**
```bash
npm install @astrojs/vercel
```

### Ошибка при сборке на Vercel

1. Проверь, что все зависимости указаны в `package.json`
2. Убедись, что Node.js версия совместима (20+)
3. Проверь логи сборки в Vercel Dashboard

### Переменные окружения не работают

1. Убедись, что переменные добавлены в настройках проекта
2. Проверь, что они доступны в нужном окружении (Production, Preview, Development)
3. Пересобери проект после добавления переменных

---

## 📚 Полезные ссылки

- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)
- [Vercel Documentation](https://vercel.com/docs)
- [@astrojs/node Documentation](https://docs.astro.build/en/guides/integrations-guide/node/)
- [@astrojs/vercel Documentation](https://docs.astro.build/en/guides/integrations-guide/vercel/)
