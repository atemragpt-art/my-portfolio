# REFACTORING_PLAN.md — План рефакторинга проекта

> **Дата:** 2026-01-05  
> **Цель:** Привести проект в соответствие с правилами `projectrule.mdc` и подготовить к миграции на Astro 6

---

## Критическая оценка AUDIT_DRAFT.md

### Пропущенные проблемы

1. **API route без `prerender = false`** — `src/pages/api/contact.ts` должен иметь `export const prerender = false` для SSR
2. **`.render()` без try/catch** — 10 файлов вызывают `.render()` без обработки ошибок (может упасть при проблемах с контентом)
3. **Draft фильтрация не везде использует PROD** — только `blog/index.astro` фильтрует по `!data.draft`, остальные коллекции не проверяют draft в production
4. **Lang тип вместо 'as const'** — 34 места используют `'ru' as const` вместо `const lang: Lang = 'ru'` (плохая типизация)
5. **getStaticPaths без try/catch** — все dynamic routes могут упасть при ошибках загрузки коллекций
6. **CSRF protection** — не проверена настройка `security.checkOrigin` в конфиге
7. **Remote images** — не проверена настройка `image.remotePatterns` (если будут использоваться)

---

## Приоритизация

### 🔴 Критично (Security, Typing, SSR Stability)

**Блокирует продакшен:**
- ClientRouter импорт и размещение
- Middleware для SSR
- API route prerender
- try/catch для `.render()` и `getStaticPaths`
- Draft фильтрация в production

**Блокирует Astro 6:**
- Content Layer API миграция
- Замена `slug` на `id`

### 🟡 Важно (Performance, i18n, Actions)

**Рекомендуется до продакшена:**
- astro:env с validateSecrets
- astro:actions для форм
- Lang тип вместо 'as const'
- astro:page-load для скриптов

### 🟢 Улучшения (Optional)

**Можно отложить:**
- Server Islands
- @tailwindcss/vite
- Image оптимизация
- Font preload

---

## План выполнения (атомарные шаги)

### Step 1: Исправить ClientRouter (Routing) 🔴

**Файлы:**
- `src/layouts/LayoutMain.astro`

**Изменения:**
1. Заменить импорт: `import ClientRouter from 'astro/components/ClientRouter.astro'` → `import { ClientRouter } from 'astro:transitions'`
2. Переместить `<ClientRouter />` из `<body>` в `<head>` (перед `</head>`)

**Проверка:**
- View Transitions работают
- Нет ошибок в консоли

**Зависимости:** Нет

---

### Step 2: Создать middleware.ts (SSR Stability) 🔴

**Файлы:**
- `src/middleware.ts` (новый)

**Изменения:**
1. Создать middleware с `defineMiddleware`
2. Установить i18n context из URL
3. Добавить базовую обработку ошибок

**Проверка:**
- Middleware выполняется на каждом запросе
- Язык определяется корректно

**Зависимости:** Нет

---

### Step 3: Добавить prerender = false в API route 🔴

**Файлы:**
- `src/pages/api/contact.ts`

**Изменения:**
1. Добавить `export const prerender = false;` в начале файла

**Проверка:**
- API route работает в SSR режиме

**Зависимости:** Нет

---

### Step 4: Добавить try/catch для .render() (Error Handling) 🔴

**Файлы (10 файлов):**
- `src/pages/blog/[...slug].astro`
- `src/pages/en/blog/[...slug].astro`
- `src/pages/solutions/[...slug].astro`
- `src/pages/en/solutions/[...slug].astro`
- `src/pages/industries/[...slug].astro`
- `src/pages/en/industries/[...slug].astro`
- `src/pages/expertise/[...slug].astro`
- `src/pages/en/expertise/[...slug].astro`
- `src/pages/cases/[...slug].astro`
- `src/pages/en/cases/[...slug].astro`

**Изменения:**
1. Обернуть `await item.render()` в try/catch
2. При ошибке — редирект на 404 или показ fallback UI

**Проверка:**
- При битом контенте страница не падает, показывается 404

**Зависимости:** Нет

---

### Step 5: Добавить try/catch для getStaticPaths (Error Handling) 🔴

**Файлы (те же 10 файлов + index страницы):**
- Все `[...slug].astro` файлы
- Все `index.astro` страницы с `getCollection`

**Изменения:**
1. Обернуть `getCollection()` и `filterByLang()` в try/catch
2. При ошибке — возвращать пустой массив или fallback

**Проверка:**
- При проблемах с коллекциями страница не падает

**Зависимости:** Нет

---

### Step 6: Исправить draft фильтрацию в production 🔴

**Файлы:**
- `src/pages/blog/index.astro` (уже есть, проверить)
- `src/pages/en/blog/index.astro`
- Все остальные index страницы с коллекциями (если нужна фильтрация draft)

**Изменения:**
1. Использовать `({ data }) => import.meta.env.PROD ? !data.draft : true` для фильтрации
2. В dev показывать все, в production — только не-draft

**Проверка:**
- Draft посты скрыты в production, видны в dev

**Зависимости:** Нет

---

### Step 7: Мигрировать на Content Layer API (Astro 6 Ready) 🔴

**Файлы:**
- `src/content.config.ts` (новый, в корне src/)
- `src/content/config.ts` (удалить после миграции)
- Все файлы, использующие `getCollection` (заменить `slug` на `id`)

**Изменения:**
1. Создать `src/content.config.ts` с `loader: glob()` для всех коллекций
2. Заменить `type: 'content'` на `loader: glob({ pattern: '**/*.md', base: './src/content/...' })`
3. Заменить все `post.slug` на `post.id` в dynamic routes и ссылках
4. Обновить `src/utils/content.ts` для работы с `id`
5. Удалить старый `src/content/config.ts`
6. Запустить `npx astro sync`

**Проверка:**
- Все страницы работают
- Ссылки используют `id` вместо `slug`
- Типы генерируются корректно

**Зависимости:** Step 4, Step 5 (нужно исправить ошибки перед миграцией)

---

### Step 8: Перейти на astro:env (Config & Security) 🟡

**Файлы:**
- `astro.config.mjs`
- `src/env.d.ts` (можно оставить для обратной совместимости)
- `src/actions/contact-form.ts` (обновить импорты env)

**Изменения:**
1. Добавить `env: { validateSecrets: true, schema: { ... } }` в `astro.config.mjs`
2. Определить все env-переменные через `envField`
3. Заменить `import.meta.env.*` на импорты из `astro:env/server`
4. Обновить `src/actions/contact-form.ts` для использования `astro:env/server`

**Проверка:**
- Приложение не стартует, если секреты не заданы
- Типы env-переменных работают

**Зависимости:** Нет

---

### Step 9: Перейти на astro:actions (Forms) 🟡

**Файлы:**
- `src/actions/index.ts` (новый, переименовать из `contact-form.ts`)
- `src/pages/contact/index.astro`
- `src/pages/en/contact/index.astro`
- `src/pages/api/contact.ts` (удалить)

**Изменения:**
1. Переименовать `src/actions/contact-form.ts` → `src/actions/index.ts`
2. Переписать на `defineAction` из `astro:actions`
3. Использовать `z` из `astro:schema` вместо `zod`
4. Обновить формы для использования `actions.submitContactForm()`
5. Добавить проверку `isInputError` для валидационных ошибок
6. Удалить `src/pages/api/contact.ts`

**Проверка:**
- Форма отправляется через Actions
- Валидация работает
- Ошибки обрабатываются через `isInputError`

**Зависимости:** Step 8 (env переменные)

---

### Step 10: Заменить 'as const' на Lang тип (i18n Typing) 🟡

**Файлы (34 места):**
- Все страницы в `src/pages/` и `src/pages/en/`
- `src/i18n/ui.ts` (можно оставить `as const` для `defaultLang`)

**Изменения:**
1. Заменить `const lang = 'ru' as const;` на `const lang: Lang = 'ru';`
2. Добавить импорт `import type { Lang } from '@/i18n/utils';` где нужно
3. В `getStaticPaths` использовать `const lang: Lang = 'ru';`

**Проверка:**
- Типы корректны
- Нет ошибок TypeScript

**Зависимости:** Нет

---

### Step 11: Добавить astro:page-load для скриптов (View Transitions) 🟡

**Файлы:**
- `src/pages/contact/index.astro`
- `src/pages/en/contact/index.astro`
- `src/components/layout/Header.astro` (проверить, возможно уже корректно)

**Изменения:**
1. Обернуть логику формы в `window.addEventListener('astro:page-load', ...)`
2. Проверить Header — использовать `astro:after-swap` для синхронной инициализации, `astro:page-load` для тяжёлой

**Проверка:**
- Скрипты переинициализируются при навигации
- Нет дублирования обработчиков

**Зависимости:** Step 1 (ClientRouter должен работать)

---

### Step 12: Создать src/assets/ и использовать Image (Performance) 🟢

**Файлы:**
- `src/assets/` (создать папку)
- Все места, где используются изображения (если есть)

**Изменения:**
1. Создать `src/assets/`
2. При появлении изображений — импортировать через `import image from '@/assets/...'`
3. Использовать `<Image src={image} width={...} height={...} />`

**Проверка:**
- Изображения оптимизируются
- Нет CLS

**Зависимости:** Нет (можно отложить до появления изображений)

---

### Step 13: Добавить Server Islands (Performance) 🟢

**Файлы:**
- Компоненты с динамическим контентом (если появятся)

**Изменения:**
1. Добавить `server:defer` к компонентам, которые не требуют клиентской интерактивности
2. Добавить `<div slot="fallback">Loading...</div>`

**Проверка:**
- TTFB улучшен
- Статический shell отдаётся быстро

**Зависимости:** Нет (можно отложить)

---

### Step 14: Перейти на @tailwindcss/vite (Optional) 🟢

**Файлы:**
- `astro.config.mjs`
- `postcss.config.mjs` (можно удалить)

**Изменения:**
1. Установить `@tailwindcss/vite`
2. Добавить в `vite.plugins: [tailwind()]`
3. Удалить `@tailwindcss/postcss` из `postcss.config.mjs`
4. Удалить `postcss.config.mjs` (опционально)

**Проверка:**
- Tailwind работает
- Стили применяются

**Зависимости:** Нет

---

### Step 15: Добавить font preload (Performance) 🟢

**Файлы:**
- `src/layouts/LayoutMain.astro`

**Изменения:**
1. Добавить `<link rel="preload" href="..." as="font" type="font/woff2" crossorigin />` для критичных шрифтов

**Проверка:**
- Шрифты загружаются быстрее
- Нет FOIT

**Зависимости:** Нет

---

## Порядок выполнения (рекомендуемый)

### Фаза 1: Критичные исправления (до продакшена)

```
Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6
```

**Время:** ~2-3 часа  
**Результат:** Проект стабилен, SSR работает, ошибки обрабатываются

### Фаза 2: Миграция на новые API (подготовка к Astro 6)

```
Step 7
```

**Время:** ~1-2 часа  
**Результат:** Готов к миграции на Astro 6

### Фаза 3: Улучшения безопасности и типизации

```
Step 8 → Step 9 → Step 10 → Step 11
```

**Время:** ~2-3 часа  
**Результат:** Типобезопасность, Actions, правильная обработка форм

### Фаза 4: Опциональные улучшения (можно отложить)

```
Step 12 → Step 13 → Step 14 → Step 15
```

**Время:** ~1-2 часа  
**Результат:** Оптимизация производительности

---

## Комбинирование шагов

### Можно объединить:

- **Step 4 + Step 5:** Оба исправляют error handling в одних и тех же файлах — можно сделать за один проход
- **Step 8 + Step 9:** Env переменные нужны для Actions — логично делать вместе
- **Step 10 + Step 11:** Оба касаются страниц — можно объединить

### Нельзя объединять:

- **Step 7** должен быть отдельным (большая миграция)
- **Step 1** должен быть первым (блокирует View Transitions)

---

## Чеклист перед выполнением

- [ ] Создать ветку для рефакторинга
- [ ] Зафиксировать текущее состояние (commit)
- [ ] Запустить тесты (если есть)
- [ ] Проверить, что проект собирается: `npm run build`
- [ ] Проверить, что dev сервер запускается: `npm run dev`

---

## Чеклист после каждого шага

- [ ] Код компилируется без ошибок
- [ ] Dev сервер запускается
- [ ] Build проходит успешно
- [ ] Нет ошибок в консоли браузера
- [ ] Функциональность работает (вручную проверить)

---

## Откат (если что-то пошло не так)

Каждый шаг атомарный, можно откатить через git:

```bash
git checkout HEAD -- <изменённые_файлы>
```

Или откатить весь коммит:

```bash
git reset --hard HEAD~1
```

---

## Примечания

1. **Step 7 (Content Layer API)** — самый рискованный, требует тестирования всех страниц
2. **Step 9 (Actions)** — нужно протестировать форму отправки
3. **Step 10 (Lang тип)** — механическая замена, но много файлов
4. Все шаги можно выполнять по одному и коммитить отдельно для лёгкого отката
