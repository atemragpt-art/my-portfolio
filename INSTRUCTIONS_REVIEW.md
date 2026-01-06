# Аудит инструкций для следующего этапа работ

## ✅ Соответствия с projectrule.mdc

1. **Язык и тон** — соответствует (русский, "ты", дружелюбный но строгий)
2. **Стек** — соответствует (Astro 5.x, Tailwind v4, TypeScript strict, Zod, Actions)
3. **Формат ответа** — соответствует (путь к файлу → код → пояснение)
4. **Импорты** — соответствует (алиас `@/` для всех путей)
5. **Astro Actions** — соответствует (`src/actions/` с Zod схемами)
6. **astro:env** — соответствует (типобезопасные схемы)
7. **Изображения** — соответствует (`<Image />` из `astro:assets`)

## ❌ Критические несоответствия

### 1. View Transitions vs ClientRouter

**Проблема в инструкциях:**
```
"Проект использует View Transitions + ClientRouter."
```

**Правило из projectrule.mdc (строка 36):**
```
- **Router:** Use `<ClientRouter />` from `astro:transitions` in Layout `<head>`. 
  NEVER use `<ViewTransitions />`.
```

**Текущее состояние проекта:**
- ✅ Используется только `<ClientRouter />` в `LayoutMain.astro`
- ✅ View Transitions стили в `global.css` (это нормально, это CSS для анимаций)

**Рекомендация:** Убрать упоминание "View Transitions +" из инструкций. Использовать только `<ClientRouter />`.

---

### 2. Content Collections API

**Проблема в инструкциях:**
```
"Все разделы (blog, cases, services, expertise, industries) — строгая схема 
в src/content/config.ts через defineCollection и zod."
```

**Правило из projectrule.mdc (строка 202):**
```
- **Content Layer API (Astro 5.x):** Use `src/content.config.ts` 
  (not `src/content/config.ts`).
```

**Текущее состояние проекта:**
- ✅ Используется `src/content.config.ts` (правильно)
- ✅ Используется `loader: glob()` вместо `type: 'content'` (правильно)

**Рекомендация:** Исправить путь на `src/content.config.ts` в инструкциях.

---

### 3. Dual-Deploy логика отсутствует

**Проблема в инструкциях:**
```
"Логика переключения: динамический выбор адаптера в astro.config.mjs 
по process.env.VERCEL (Vercel автоматически ставит эту переменную)."
```

**Текущее состояние проекта:**
- ❌ В `astro.config.mjs` только `@astrojs/node` адаптер
- ❌ Нет условной логики для Vercel
- ❌ Нет установленного `@astrojs/vercel` адаптера

**Рекомендация:** Добавить конкретный пример реализации dual-deploy в инструкции:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless'; // или '@astrojs/vercel/edge' для edge functions

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  output: 'server',
  adapter: isVercel 
    ? vercel() // Vercel: serverless (вызывается без параметров)
    : node({ mode: 'standalone' }),
  // ... остальная конфигурация
});
```

---

## ⚠️ Отсутствующие важные правила

### 4. Server Islands (server:defer)

**Отсутствует в инструкциях, но есть в projectrule.mdc (строка 58):**
```
- **Server Islands:** Use `server:defer` for dynamic components without client 
  interactivity (improves TTFB).
```

**Рекомендация:** Добавить в раздел "Оптимизация и SEO":
```markdown
- **Server Islands:** Используй `server:defer` для динамических компонентов 
  без клиентской интерактивности (улучшает TTFB):
  ```astro
  <Avatar server:defer>
    <div slot="fallback">Loading...</div>
  </Avatar>
  ```
```

---

### 5. Безопасность (escapeHtml)

**Отсутствует в инструкциях, но критично важно (projectrule.mdc, строка 148):**
```
- **XSS Protection:** ALWAYS escape user input before inserting into HTML.
```

**Текущее состояние проекта:**
- ✅ `escapeHtml` уже используется в `src/actions/index.ts` (правильно)

**Рекомендация:** Добавить в раздел "Формы и Backend":
```markdown
- **XSS Protection:** Всегда экранируй пользовательский ввод через `escapeHtml()` 
  перед вставкой в HTML (особенно в email и Telegram сообщениях).
```

---

### 6. Обработка ошибок Actions (isInputError)

**Отсутствует в инструкциях, но есть в projectrule.mdc (строка 136):**
```
- **Client Handling:** Check errors with `isInputError`:
```

**Рекомендация:** Добавить пример клиентской обработки:
```markdown
- **Клиентская обработка:** Проверяй ошибки валидации через `isInputError`:
  ```typescript
  import { actions, isInputError } from 'astro:actions';
  const { data, error } = await actions.submitContactForm(formData);
  if (isInputError(error)) {
    console.error('Validation errors:', error.fields);
  }
  ```
```

---

### 7. Tailwind v4 конфигурация

**Инструкции говорят:**
```
"Tailwind v4: Предпочтительно без tailwind.config.js — все настройки темы 
(цвета из Figma, шрифты, кастомные значения) только в src/styles/global.css 
через блок @theme."
```

**Текущее состояние проекта:**
- ✅ Используется `@import "tailwindcss"` в `global.css` (правильно для v4)
- ❌ Нет блока `@theme` (но это не обязательно, если используются дефолтные значения)

**Рекомендация:** Уточнить, что `@theme` опционален. Если нужны кастомные значения — использовать `@theme`, иначе дефолтные значения Tailwind работают из коробки.

---

### 8. Скрипты и навигация

**Инструкции говорят:**
```
"Запрещено: document.addEventListener('DOMContentLoaded', ...).
Все клиентские скрипты: только document.addEventListener('astro:page-load', ...) 
или 'astro:after-swap'."
```

**Соответствует projectrule.mdc (строка 37)** ✅

**Рекомендация:** Добавить пример использования `data-astro-rerun` для inline скриптов:
```markdown
- **Inline скрипты:** Если inline `<script>` должен выполняться при каждой навигации, 
  добавь `data-astro-rerun` + `is:inline`:
  ```astro
  <script is:inline data-astro-rerun>
    // Этот скрипт выполнится при каждой навигации
  </script>
  ```
```

---

## 📋 Исправленная версия инструкций

### Исправления для раздела "Скрипты и навигация (View Transitions)"

**Было:**
```
"Проект использует View Transitions + ClientRouter."
```

**Должно быть:**
```
"Проект использует ClientRouter из astro:transitions. 
View Transitions стили настраиваются в src/styles/global.css через CSS-селекторы 
::view-transition-old(root) и ::view-transition-new(root)."
```

---

### Исправления для раздела "Работа с контентом"

**Было:**
```
"Все разделы (blog, cases, services, expertise, industries) — строгая схема 
в src/content/config.ts"
```

**Должно быть:**
```
"Все разделы (blog, cases, services, expertise, industries) — строгая схема 
в src/content.config.ts (Content Layer API для Astro 5.x) через defineCollection 
и zod. Используется loader: glob() вместо устаревшего type: 'content'."
```

---

### Добавить новый раздел "Безопасность"

```markdown
## 6. Безопасность

- **XSS Protection:** Всегда экранируй пользовательский ввод через `escapeHtml()` 
  перед вставкой в HTML (особенно в email и Telegram сообщениях).
- **Environment Variables:** Только `astro:env` с типобезопасными схемами (env.d.ts).
- **CSRF:** Включен по умолчанию (`security.checkOrigin: true`).
```

---

### Добавить в раздел "Оптимизация и SEO"

```markdown
- **Server Islands:** Используй `server:defer` для динамических компонентов без 
  клиентской интерактивности (улучшает TTFB):
  ```astro
  <Avatar server:defer>
    <div slot="fallback">Loading...</div>
  </Avatar>
  ```
```

---

### Добавить в раздел "Формы и Backend"

```markdown
- **Клиентская обработка:** Проверяй ошибки валидации через `isInputError`:
  ```typescript
  import { actions, isInputError } from 'astro:actions';
  const { data, error } = await actions.submitContactForm(formData);
  if (isInputError(error)) {
    console.error('Validation errors:', error.fields);
  }
  ```
- **Redirects:** Cookie-redirects удалены в Astro 5. Обрабатывай редиректы вручную 
  после успешной отправки формы.
```

---

### Добавить пример dual-deploy в раздел "Project Architecture"

```markdown
# Project Architecture & Infrastructure

Сайт деплоится из одного репозитория в двух вариантах:
1. РФ (VPS/Timeweb): @astrojs/node в standalone-режиме.
2. Мир (Vercel): @astrojs/vercel (serverless или edge).

**Логика переключения:** Динамический выбор адаптера в astro.config.mjs по 
process.env.VERCEL (Vercel автоматически ставит эту переменную):

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless'; // или '@astrojs/vercel/edge' для edge functions

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  output: 'server',
  adapter: isVercel 
    ? vercel() // Vercel: serverless (вызывается без параметров)
    : node({ mode: 'standalone' }),
  // ... остальная конфигурация
});
```

**Обязательно:** `output: 'server'` для поддержки Astro Actions и серверных фич.
```

---

## 🎯 Итоговые рекомендации

1. ✅ **Исправить:** View Transitions → ClientRouter (убрать упоминание ViewTransitions)
2. ✅ **Исправить:** `src/content/config.ts` → `src/content.config.ts`
3. ✅ **Добавить:** Конкретный пример dual-deploy логики
4. ✅ **Добавить:** Раздел про Server Islands (server:defer)
5. ✅ **Добавить:** Раздел про безопасность (escapeHtml, CSRF)
6. ✅ **Добавить:** Пример обработки ошибок Actions (isInputError)
7. ✅ **Добавить:** Пример data-astro-rerun для inline скриптов
8. ✅ **Уточнить:** Tailwind v4 @theme опционален

---

## 📝 Приоритет исправлений

**Критично (исправить немедленно):**
- View Transitions → ClientRouter
- `src/content/config.ts` → `src/content.config.ts`

**Важно (добавить в инструкции):**
- Dual-deploy пример
- Безопасность (escapeHtml)
- Server Islands

**Желательно (для полноты):**
- isInputError пример
- data-astro-rerun пример
