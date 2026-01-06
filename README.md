# Portfolio/Corporate Site

Сайт на Astro 5 с Tailwind CSS v4, TypeScript и Content Collections.

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Деплой

Проект поддерживает dual-deploy из одного репозитория:
- **РФ (VPS/Timeweb):** Node.js адаптер в standalone-режиме
- **Мир (Vercel):** Vercel адаптер в serverless-режиме

Подробные инструкции см. в [DEPLOY.md](./DEPLOY.md).

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения для Telegram Bot и SMTP.

**Важно:** Проект использует `astro:env` с типобезопасными схемами. Переменные должны быть настроены в `astro.config.mjs` и доступны в окружении деплоя.
