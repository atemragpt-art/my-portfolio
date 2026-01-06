# AUDIT DRAFT — Проверка соответствия правилам projectrule.mdc

> **Дата:** 2026-01-05  
> **Версия Astro:** 5.0.0  
> **Версия Tailwind:** 4.0.0

---

## 1. Config & Env

### ✅ Соответствует

- `output: 'server'` — корректно для SSR/Docker
- `adapter: node({ mode: 'standalone' })` — правильная конфигурация
- Alias `@/` настроен в `vite.resolve.alias`
- i18n настроен с `prefixDefaultLocale: false`

### ❌ НЕ соответствует

| Файл | Проблема | Правило |
|------|----------|---------|
| `astro.config.mjs` | **Не используется `astro:env`** для типизации env-переменных. Вместо этого env-переменные определены вручную в `src/env.d.ts` через `ImportMetaEnv` | Использовать `astro:env` с `envField` в `astro.config.mjs` |
| `astro.config.mjs` | **Нет `validateSecrets: true`** — секреты не валидируются при старте | Добавить `validateSecrets: true` в конфиг `env:` |
| `postcss.config.mjs` | **Tailwind через PostCSS** (`@tailwindcss/postcss`), а не через рекомендованный `@tailwindcss/vite` плагин | Для Tailwind 4+ предпочтительно использовать `@tailwindcss/vite` напрямую в `vite.plugins` |
| `src/styles/global.css` | **Нет `font-display: swap`** в `@font-face` (используются Google Fonts) | Добавить preload для критичных шрифтов в `<head>` Layout |

**Пример исправления для `astro:env`:**
```javascript
// astro.config.mjs
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  env: {
    validateSecrets: true,
    schema: {
      TELEGRAM_BOT_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      TELEGRAM_CHAT_ID: envField.string({ context: 'server', access: 'secret' }),
      SMTP_HOST: envField.string({ context: 'server', access: 'secret', optional: true }),
      // ... остальные переменные
    },
  },
});
```

---

## 2. Structure

### ✅ Соответствует

- Все импорты используют `@/` alias (нет относительных `../../`)
- Структура папок соответствует: `components/ui`, `components/sections`, `components/layout`, `layouts/`, `pages/`, `utils/`, `i18n/`, `config/`
- Все страницы обёрнуты в `<Layout />`
- Один `<main>` на страницу (в `LayoutMain.astro`)

### ❌ НЕ соответствует

| Файл/Папка | Проблема | Правило |
|------------|----------|---------|
| `src/assets/` | **Папка не существует** — изображения не оптимизируются через `astro:assets` | Создать `src/assets/` для изображений, импортировать через `<Image />` |
| `src/actions/contact-form.ts` | **Неверный путь для Actions** — должен быть `src/actions/index.ts` с экспортом `server` | Переименовать в `src/actions/index.ts` и использовать `defineAction` из `astro:actions` |
| `src/middleware.ts` | **Файл не существует** — для `output: 'server'` нужен middleware | Создать middleware для i18n context, auth checks |

---

## 3. Routing

### ✅ Соответствует

- `data-astro-prefetch` присутствует на всех навигационных ссылках (Header, Footer, Navigation, Button)
- Active state проверяется корректно с учётом exact match и prefix

### ❌ НЕ соответствует

| Файл | Проблема | Правило |
|------|----------|---------|
| `src/layouts/LayoutMain.astro:2` | **Неправильный импорт ClientRouter**: `import ClientRouter from 'astro/components/ClientRouter.astro'` | Импортировать из `astro:transitions`: `import { ClientRouter } from 'astro:transitions'` |
| `src/layouts/LayoutMain.astro:92` | **ClientRouter внутри `<body>`** | Разместить `<ClientRouter />` в секции `<head>` |
| `src/components/layout/Header.astro` | **Использует только `astro:after-swap`** для mobile menu | Для тяжёлой инициализации использовать `astro:page-load`, для синхронной — `astro:after-swap` |
| `src/pages/contact/index.astro` | **Скрипт не использует `astro:page-load`** — не переинициализируется при View Transitions | Обернуть логику формы в `astro:page-load` event |

**Пример исправления:**
```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
  <!-- rest of head -->
</head>
```

---

## 4. Safety & Logic

### ✅ Соответствует

- `escapeHtml()` функция реализована в `src/actions/contact-form.ts`
- XSS экранирование применяется к пользовательскому вводу в Telegram/Email
- Zod схема валидации присутствует (`contactFormSchema`)
- Props типизированы через `interface Props` во всех компонентах
- Guard clauses (`if (!post)`) в dynamic routes

### ❌ НЕ соответствует

| Файл | Проблема | Правило |
|------|----------|---------|
| `src/actions/contact-form.ts` | **Не использует `astro:actions`** — обычная функция вместо `defineAction` | Переписать с использованием `defineAction` из `astro:actions` |
| `src/pages/api/contact.ts` | **API route вместо Actions** — устаревший подход | Удалить API route, использовать Actions |
| `src/actions/contact-form.ts` | **Zod импортируется из `zod`**, а не из `astro:schema` | Использовать `import { z } from 'astro:schema'` |
| Множество файлов | **`'ru' as const` вместо типа `Lang`** | Использовать `const lang: Lang = 'ru'` с импортом типа |
| `src/pages/contact/index.astro` | **Нет проверки `isInputError`** для ошибок валидации | Добавить обработку через `isInputError` из `astro:actions` |

**Пример исправления для Actions:**
```typescript
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  submitContactForm: defineAction({
    input: z.object({
      name: z.string().min(2),
      contact: z.string().min(3),
      message: z.string().min(10),
    }),
    handler: async (input) => {
      // логика отправки
      return { success: true, message: 'Отправлено' };
    },
  }),
};
```

---

## 5. Performance

### ✅ Соответствует

- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Один `<h1>` на страницу
- Schema.org JSON-LD разметка
- `preconnect` для Google Fonts
- Dark mode поддерживается

### ❌ НЕ соответствует

| Файл | Проблема | Правило |
|------|----------|---------|
| Весь проект | **`<Image />` не используется** — нет импортов из `astro:assets` | Использовать `<Image />` для всех изображений с `width` и `height` |
| Весь проект | **Server Islands не используются** — нет `server:defer` | Использовать `server:defer` для динамических компонентов (avatar, cart, personalized content) |
| `src/layouts/LayoutMain.astro` | **Нет preload для критичных шрифтов** (только preconnect) | Добавить `<link rel="preload" href="..." as="font">` для основных шрифтов |
| `src/styles/global.css` | **Нет локальных `@font-face` с `font-display: swap`** | Если будут локальные шрифты — обязательно добавить `font-display: swap` |

---

## 6. Deprecations & v6 Readiness

### Текущие deprecations в Astro 5.x

| Файл | Deprecation | Замена |
|------|-------------|--------|
| `src/content/config.ts` | **Legacy Content Collections** с `type: 'content'` | Мигрировать на Content Layer API (`src/content.config.ts` с `loader: glob()`) |
| `src/content/config.ts` | **Путь `src/content/config.ts`** устарел | Использовать `src/content.config.ts` (в корне src) |
| `src/utils/content.ts` | **Использует `slug`** вместо `id` | В новом API использовать `id` для ссылок на entries |

### Что может сломаться при миграции на Astro 6

> Источник: [v6.docs.astro.build/en/guides/upgrade-to/v6/](https://v6.docs.astro.build/en/guides/upgrade-to/v6/)

| Потенциальная проблема | Статус проекта | Рекомендация |
|------------------------|----------------|--------------|
| **Legacy Content Collections** | ❌ Используется | Мигрировать на Content Layer API до обновления |
| **`slug` вместо `id`** | ❌ Используется | Заменить все `post.slug` на `post.id` |
| **ClientRouter import path** | ❌ Неправильный путь | Исправить импорт до обновления |
| **`Astro.glob()` deprecation** | ✅ Не используется | — |
| **TypeScript strict mode** | ✅ Включен | — |
| **Node adapter standalone** | ✅ Корректен | — |

### Рекомендации перед миграцией на v6

1. **Мигрировать Content Collections:**
   ```typescript
   // src/content.config.ts (новый путь!)
   import { defineCollection } from 'astro:content';
   import { glob } from 'astro/loaders';
   import { z } from 'astro:schema';

   const blog = defineCollection({
     loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
     schema: z.object({ /* ... */ }),
   });

   export const collections = { blog };
   ```

2. **Заменить `slug` на `id`** во всех dynamic routes и ссылках

3. **Исправить импорт ClientRouter** на `astro:transitions`

4. **Добавить middleware.ts** для SSR

5. **Перейти на `astro:env`** для env-переменных

6. **Перейти на `astro:actions`** для форм

---

## Сводная таблица

| Категория | Соответствует | Не соответствует | Критичность |
|-----------|---------------|------------------|-------------|
| Config & Env | 4 | 4 | 🟡 Medium |
| Structure | 4 | 3 | 🟡 Medium |
| Routing | 2 | 4 | 🔴 High |
| Safety & Logic | 5 | 5 | 🟡 Medium |
| Performance | 5 | 4 | 🟡 Medium |
| Deprecations | 3 | 3 | 🔴 High |

---

## Приоритет исправлений

### 🔴 Критично (исправить до продакшена)

1. Исправить импорт `ClientRouter` из `astro:transitions`
2. Переместить `<ClientRouter />` в `<head>`
3. Мигрировать на Content Layer API (блокирует Astro 6)
4. Создать `src/middleware.ts` для SSR

### 🟡 Важно (рекомендуется)

1. Перейти на `astro:env` с `validateSecrets: true`
2. Перейти на `astro:actions` для форм
3. Использовать `<Image />` из `astro:assets`
4. Добавить `astro:page-load` для скриптов с View Transitions

### 🟢 Улучшения (опционально)

1. Добавить Server Islands для динамического контента
2. Перейти на `@tailwindcss/vite` вместо PostCSS
3. Добавить preload для критичных шрифтов
4. Создать `src/assets/` для оптимизированных изображений
