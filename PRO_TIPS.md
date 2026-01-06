# 💡 Pro-Tips & Важные Рекомендации

Этот файл содержит важные рекомендации, советы и best practices для проекта.

---

## 🚀 Astro 5.0 - Важные изменения

### Output Modes (Режимы вывода)

**❌ Устарело в Astro 5.0:**
```javascript
output: 'hybrid'  // Удалено в Astro 5.0
```

**✅ Правильно для Astro 5.0:**

#### Для SSR (Docker, серверные приложения):
```javascript
output: 'server',
adapter: node({ mode: 'standalone' })
```

#### Для смешанного режима (статичные страницы + SSR где нужно):
```javascript
output: 'static',  // По умолчанию, все страницы статичные
```

Затем в frontmatter страниц, которым нужен SSR:
```astro
---
export const prerender = false;  // Эта страница будет SSR
---
```

**Пример для API routes:**
```typescript
// src/pages/api/contact.ts
export const prerender = false;  // API всегда должен быть SSR

export const POST: APIRoute = async ({ request }) => {
  // ...
};
```

**Pro-Tip:** В Astro 5.0 для смешанного режима используй `output: 'static'` и добавляй `export const prerender = false` в frontmatter страниц, которым нужен SSR (например, API routes).

---

## 🔐 Безопасность

### XSS Защита

**❌ Опасно:**
```typescript
html: `<p>${userInput}</p>`  // XSS уязвимость!
```

**✅ Безопасно:**
```typescript
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

html: `<p>${escapeHtml(userInput)}</p>`
```

**Pro-Tip:** Всегда экранируй пользовательские данные перед вставкой в HTML, особенно в email и Telegram сообщениях.

---

## 🌐 i18n (Многоязычность)

### Фильтрация контента по языку

**✅ Правильно:**
```typescript
import { filterByLang } from '@/utils/content';

const lang = 'en' as const;
const allPosts = await getCollection('blog');
const enPosts = filterByLang(allPosts, lang);
```

**Pro-Tip:** Всегда фильтруй контент-коллекции по языку на страницах с префиксом языка (например, `/en/blog/`). **Важно:** Не забывай фильтровать и на дефолтном языке (`ru`) — даже если он без префикса, фильтрация нужна для корректной работы мультиязычности.

### Локализованные ссылки

**✅ Правильно:**
```typescript
import { getLocalizedPath } from '@/i18n/utils';

const lang = 'en' as const;
const href = getLocalizedPath('/about/', lang);  // → /en/about/
```

**Pro-Tip:** Используй `getLocalizedPath()` для всех внутренних ссылок, чтобы они автоматически адаптировались под текущий язык.

---

## 🎨 Astro Components

### ClientRouter vs ViewTransitions

**❌ Нарушает правила проекта:**
```astro
import { ViewTransitions } from 'astro:transitions';
---
<ViewTransitions />  // В <head>
```

**✅ Правильно (по projectrule.mdc):**
```astro
import ClientRouter from 'astro/components/ClientRouter.astro';
---
<body>
  <ClientRouter />  // В <body>, не в <head>
  <Header />
</body>
```

**Pro-Tip:** По правилам проекта используй `<ClientRouter />` вместо `<ViewTransitions />`, и размещай его в `<body>`, а не в `<head>`.

---

## 📦 Docker & Deployment

### Multi-stage Dockerfile

**✅ Production-ready структура:**
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER astro  # Non-root user
CMD ["node", "./dist/server/entry.mjs"]
```

**Pro-Tip:** Всегда используй multi-stage build для уменьшения размера финального образа и non-root пользователя для безопасности.

---

## 🔍 SEO

### hreflang теги

**✅ Правильно:**
```astro
---
const alternateLinks = getAlternateLinks(Astro.url.pathname, siteUrl);
---

{alternateLinks.map(({ hreflang, href }) => (
  <link rel="alternate" hreflang={hreflang} href={href} />
))}
<link rel="alternate" hreflang="x-default" href={`${siteUrl}/`} />
```

**Pro-Tip:** Всегда добавляй hreflang теги для всех языковых версий страницы — это критично для SEO мультиязычных сайтов.

### x-default hreflang

**❌ Плохо (всегда указывает на главную):**
```astro
<link rel="alternate" hreflang="x-default" href={`${siteUrl}/`} />
```

**✅ Правильно (указывает на текущую страницу на дефолтном языке):**
```astro
---
import { getLocalizedPath, defaultLang } from '@/i18n/utils';
---

<link rel="alternate" hreflang="x-default" href={`${siteUrl}${getLocalizedPath(Astro.url.pathname, defaultLang)}`} />
```

**Pro-Tip:** `x-default` hreflang должен указывать на текущую страницу на дефолтном языке, а не всегда на главную. Например, если пользователь на `/en/about/`, то `x-default` должен указывать на `/about/` (ru версия), а не на `/`.

### Абсолютные URLs в SEO мета-тегах

**❌ Плохо (относительные URLs):**
```typescript
const siteUrl = Astro.site?.href?.replace(/\/$/, '') ?? '';
const fullUrl = `${siteUrl}${canonicalPath}`;  // Может быть "/about" если siteUrl пустой
```

**✅ Правильно (всегда абсолютные):**
```typescript
// Используем Astro.site если настроен, иначе fallback на текущий origin (для dev)
const siteUrl = Astro.site?.href?.replace(/\/$/, '') || Astro.url.origin;
const fullUrl = `${siteUrl}${canonicalPath}`;  // Всегда абсолютный URL
```

**Pro-Tip:** Всегда используй абсолютные URLs для OG тегов, canonical и hreflang. Используй `Astro.url.origin` как fallback, если `Astro.site` не настроен — это критично для SEO, так как относительные URLs не работают в социальных сетях.

---

## 🎯 Performance

### Prefetching

**✅ Правильно:**
```astro
<a href="/about" data-astro-prefetch>О нас</a>
```

**Pro-Tip:** Добавляй `data-astro-prefetch` ко всем основным навигационным ссылкам (header, footer) для ускорения переходов.

### Navigation Active State

**❌ Плохо (ложные срабатывания):**
```typescript
function isActive(href: string): boolean {
  return currentPath.startsWith(href.replace(/\/$/, ''));  // /about активен для /about-us
}
```

**✅ Правильно (точное совпадение):**
```typescript
function isActive(href: string): boolean {
  const normalizedHref = href.replace(/\/$/, '') || '/';
  const normalizedPath = currentPath.replace(/\/$/, '') || '/';
  
  if (normalizedHref === '/' || normalizedHref === `/${lang}`) {
    return normalizedPath === '/' || normalizedPath === `/${lang}`;
  }
  
  // Точное совпадение или путь начинается с href + '/'
  return (
    normalizedPath === normalizedHref ||
    normalizedPath.startsWith(`${normalizedHref}/`)
  );
}
```

**Pro-Tip:** Используй точное сравнение путей для active state в навигации. `startsWith` может давать ложные срабатывания (например, `/about` будет активным для `/about-us`). Проверяй либо точное совпадение, либо что путь начинается с `href + '/'`.

---

## 🏗️ HTML5 Semantic Structure

### Вложенные `<main>` элементы

**❌ Нарушает HTML5 семантику:**
```astro
<!-- LayoutMain.astro -->
<main>
  <slot />
</main>

<!-- LayoutPost.astro -->
<LayoutMain>
  <main>  <!-- ❌ Вложенный main! -->
    <article>...</article>
  </main>
</LayoutMain>
```

**✅ Правильно:**
```astro
<!-- LayoutMain.astro -->
<main>
  <slot />
</main>

<!-- LayoutPost.astro -->
<LayoutMain>
  <article>...</article>  <!-- ✅ Только article, main уже в LayoutMain -->
</LayoutMain>
```

**Pro-Tip:** В HTML5 может быть только один `<main>` элемент на странице. Если базовый Layout уже содержит `<main>`, дочерние Layouts не должны добавлять свой `<main>` — это нарушает семантическую структуру и accessibility.

### Images

**❌ Плохо:**
```astro
<img src="/image.jpg" alt="..." />
```

**✅ Правильно:**
```astro
---
import { Image } from 'astro:assets';
import imageSrc from '../assets/image.jpg';
---

<Image src={imageSrc} width={800} height={600} alt="..." />
```

**Pro-Tip:** Всегда используй `<Image />` из `astro:assets` с явными `width` и `height` для избежания CLS (Cumulative Layout Shift).

### Remote images в Astro 5.x

**❌ Неправильно (getImage() не поддерживает remote images):**
```astro
---
import { Image, getImage } from 'astro:assets';

// getImage() НЕ поддерживает remote images в Astro 5.x!
const optimizedImage = await getImage({ src: 'https://example.com/image.jpg', width: 800, height: 600 });
---
<Image src={optimizedImage} />  // Ошибка: getImage() не работает с remote images
```

**❌ Неправильно (ненужная проверка типа):**
```astro
---
import { Image, type ImageMetadata } from 'astro:assets';

interface Props {
  src?: string | ImageMetadata;
  alt: string;
}
---

{typeof src === 'string' ? (
  // ❌ Неоправданно используем <img> для remote images
  <img src={src} alt={alt} width={800} height={600} />
) : (
  <Image src={src} width={800} height={600} alt={alt} />
)}
```

**✅ Правильно (используй <Image /> для всех типов):**
```astro
---
import { Image, type ImageMetadata } from 'astro:assets';

interface Props {
  src?: string | ImageMetadata;
  alt: string;
  width?: number;
  height?: number;
}
---

{/* Компонент <Image /> поддерживает как ImageMetadata, так и string URLs */}
{/* Для remote images требуется настройка image.remotePatterns в astro.config.mjs */}
<Image src={src} width={width} height={height} alt={alt} />
```

**Pro-Tip:** В Astro 5.x `getImage()` не поддерживает remote images, но компонент `<Image />` из `astro:assets` **поддерживает** remote images (строковые URL), если они настроены в `image.remotePatterns` в `astro.config.mjs`. Не нужно проверять тип `src` — просто передавай его в `<Image />`, и Astro автоматически определит тип и обработает изображение. Это позволяет использовать единый компонент для всех типов изображений и получать оптимизацию для авторизованных remote источников.

---

## 📝 Content Collections

### Поле lang в схемах

**✅ Правильно:**
```typescript
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    lang: z.enum(['ru', 'en', 'de', 'es', 'fr', 'pt', 'it', 'tr', 'ar', 'zh']).default('ru'),
  }),
});
```

**Pro-Tip:** Всегда добавляй поле `lang` в схемы контент-коллекций для поддержки мультиязычности, даже если сейчас используешь только один язык.

### Фильтрация draft-постов

**❌ Проблема (не работает с кастомными build modes):**
```typescript
const allBlogPosts = await getCollection('blog', ({ data }) => 
  import.meta.env.MODE === 'production' ? !data.draft : true
);
```

**✅ Правильно (надежная проверка):**
```typescript
const allBlogPosts = await getCollection('blog', ({ data }) => 
  import.meta.env.PROD ? !data.draft : true
);
```

**Pro-Tip:** Используй `import.meta.env.PROD` вместо `import.meta.env.MODE === 'production'` для фильтрации draft-постов. `PROD` — это булево значение, которое всегда корректно определяет production-сборку, независимо от кастомных build modes (например, `staging`, `preview`). Это делает фильтрацию более надежной и предсказуемой.

---

## 🐛 Troubleshooting

### Модуль не найден

**Проблема:** `Cannot find module '@astrojs/node'`

**Решение:**
```bash
npm install @astrojs/node @astrojs/sitemap
```

**Pro-Tip:** Если работаешь в worktrees, убедись, что зависимости установлены в основном репозитории, так как worktrees могут использовать общие `node_modules`.

### Ошибка "Cannot read properties of undefined (reading 'render')"

**Проблема:** В SSR режиме (`output: 'server'`) `getStaticPaths` может не найти элемент для несуществующего slug.

**❌ Опасно:**
```typescript
const { item } = Astro.props;
const { Content } = await item.render();  // Ошибка если item === undefined
```

**✅ Безопасно:**
```typescript
interface Props {
  item: Awaited<ReturnType<typeof getCollection>>[number] | undefined;
}

const { item } = Astro.props;

// Проверяем, что элемент найден
if (!item) {
  return Astro.redirect('/404');
}

const { Content } = await item.render();
```

**Pro-Tip:** Всегда добавляй проверку на `undefined` в динамических страницах (`[...slug].astro`) перед вызовом `.render()`, особенно в SSR режиме. Это предотвратит ошибки при обращении к несуществующим страницам.

### Конфликты слияния

**Проблема:** Маркеры конфликтов `<<<<<<<`, `=======`, `>>>>>>>`

**Решение:**
1. Открой файл в редакторе
2. Выбери нужную версию (твою или агента)
3. Удали все маркеры
4. Сохрани файл

**Pro-Tip:** В Cursor используй "Merge manually" в диалоге конфликтов — это покажет все файлы с конфликтами.

---

## 📚 Полезные ссылки

- [Astro 5.0 Migration Guide](https://v6.docs.astro.build/en/guides/upgrade-to/v5/)
- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Image Optimization](https://docs.astro.build/en/guides/images/)

---

---

## 🌐 i18n Routing Configuration

### Настройка языков в astro.config.mjs

**❌ Проблема (misconfigured):**
```javascript
i18n: {
  locales: ['ru', 'en', 'de', 'es', 'fr', 'pt', 'it', 'tr', 'ar', 'zh'], // 10 языков
  // Но страницы созданы только для ru и en!
}
```

**✅ Правильно:**
```javascript
i18n: {
  defaultLocale: 'ru',
  locales: ['ru', 'en'], // Только языки с существующими страницами
  routing: {
    prefixDefaultLocale: false,
  },
  // Fallback можно добавить позже, когда будут созданы страницы
}
```

**Pro-Tip:** В `i18n.locales` указывай только те языки, для которых реально созданы страницы в `src/pages/[lang]/`. Если указать языки без страниц, Astro будет выдавать предупреждения о misconfigured routing. Добавляй новые языки постепенно по мере создания страниц.

### Добавление нового языка

**Шаги:**
1. Создай структуру страниц: `src/pages/[lang]/`
2. Добавь переводы в `src/i18n/ui.ts`
3. Обнови `astro.config.mjs`: добавь язык в `locales`
4. Обнови sitemap конфигурацию
5. Добавь контент с `lang: [lang]` в коллекции

---

---

## 🔧 TypeScript & Типизация

### Remote images vs локальные изображения

**Важно:** В Astro 5.x компонент `<Image />` из `astro:assets` поддерживает **оба** типа:
- `ImageMetadata` (локальные изображения из `src/assets/`)
- `string` (remote images, если настроены в `image.remotePatterns`)

**Pro-Tip:** Не нужно проверять тип `src` — просто передавай его в `<Image />`. Компонент автоматически определит тип и обработает изображение соответственно. Это упрощает код и позволяет получать оптимизацию для авторизованных remote источников. `getImage()` действительно не поддерживает remote images, но `<Image />` — поддерживает.

---

## 🚀 Astro 5.x Content Layer API

### Правильный путь к конфигу контента

**❌ Устарело (legacy API):**
```typescript
// src/content/config.ts - старый путь
import { defineCollection } from 'astro:content';
```

**✅ Правильно (Content Layer API для Astro 5.x):**
```typescript
// src/content.config.ts - новый путь
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro:schema';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['ru', 'en']).default('ru'),
  }),
});
```

**Pro-Tip:** В Astro 5.x используется Content Layer API с путем `src/content.config.ts` (не `src/content/config.ts`). Используй `loader: glob()` вместо устаревшего `type: 'content'`. Это новый стандарт для работы с контентом.

---

## 🔄 Dual-Deploy (VPS + Vercel)

### Динамический выбор адаптера

**✅ Правильно (dual-deploy из одного репозитория):**
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless'; // или '@astrojs/vercel/edge' для edge functions

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  output: 'server',
  adapter: isVercel 
    ? vercel() // Vercel: serverless (или vercel из '@astrojs/vercel/edge' для edge functions)
    : node({ mode: 'standalone' }),
  // ... остальная конфигурация
});
```

**Ограничения Vercel:**
- **Ephemeral FS:** Не храни файлы локально (FS эфемерна), используй внешнее хранилище (S3, Cloudinary)
- **Таймауты:** Serverless функции ограничены ~10-60 сек, добавляй graceful degradation
- **Edge functions:** Ограниченный runtime, не все Node.js API доступны

**Pro-Tip:** Используй условную логику выбора адаптера по `process.env.VERCEL` для деплоя из одного репозитория на VPS (Node) и Vercel. Vercel автоматически устанавливает переменную `VERCEL=1` при сборке. Всегда учитывай ограничения Vercel при написании кода (ephemeral FS, таймауты).

---

## ⚡ Server Islands (server:defer)

### Оптимизация TTFB для динамических компонентов

**❌ Медленно (client:load):**
```astro
<Avatar client:load />  // Гидрирует на клиенте, увеличивает bundle
```

**✅ Быстро (server:defer):**
```astro
<Avatar server:defer>
  <div slot="fallback">Loading...</div>
</Avatar>
```

**Pro-Tip:** Используй `server:defer` для динамических компонентов без клиентской интерактивности (например, аватары пользователей, счетчики, данные из API). Это улучшает TTFB (Time To First Byte) и работает out-of-the-box в `output: 'server'`. Используй вместо `client:load` для компонентов, которые не требуют интерактивности — это уменьшает клиентский bundle и ускоряет загрузку.

---

## 📝 Astro Actions - Клиентская обработка ошибок

### Проверка ошибок валидации через isInputError

**❌ Неправильно (не различает типы ошибок):**
```typescript
import { actions } from 'astro:actions';

const { data, error } = await actions.submitContactForm(formData);
if (error) {
  // Непонятно, это ошибка валидации или сервера?
  console.error(error);
}
```

**✅ Правильно (различает типы ошибок):**
```typescript
import { actions, isInputError } from 'astro:actions';

const { data, error } = await actions.submitContactForm(formData);

if (isInputError(error)) {
  // Ошибки валидации (Zod schema violations)
  console.error('Validation errors:', error.fields);
  // Показать ошибки пользователю рядом с полями
} else if (error) {
  // Другие ошибки (сеть, сервер)
  console.error('Server error:', error);
  // Показать общее сообщение об ошибке
} else {
  // Успех
  window.location.href = '/form-success';
}
```

**Pro-Tip:** Всегда используй `isInputError()` для проверки ошибок валидации в Astro Actions. Это позволяет различать ошибки валидации (Zod schema violations) от других ошибок (сеть, сервер) и правильно обрабатывать их в UI. Cookie-redirects удалены в Astro 5 — обрабатывай редиректы вручную через `window.location.href`.

---

## 🔄 Inline скрипты при навигации

### data-astro-rerun для повторного выполнения скриптов

**❌ Проблема (скрипт выполнится только один раз):**
```astro
<script is:inline>
  // Этот скрипт выполнится только при первой загрузке страницы
  console.log('Page loaded:', window.location.href);
</script>
```

**✅ Правильно (скрипт выполнится при каждой навигации):**
```astro
<script is:inline data-astro-rerun>
  // Этот скрипт выполнится при каждой навигации
  console.log('Page loaded:', window.location.href);
  // Полезно для аналитики, счетчиков и т.д.
</script>
```

**Pro-Tip:** Если inline `<script>` должен выполняться при каждой навигации (например, аналитика, счетчики, инициализация виджетов), добавь `data-astro-rerun` + `is:inline`. Без этих атрибутов inline скрипт выполнится только при первой загрузке страницы, что может привести к проблемам с аналитикой и виджетами при использовании View Transitions.

---

## 🎯 Event Listeners - Предотвращение дублирования

### Дублирование listeners при множественных экземплярах компонента

**❌ Проблема (накопление listeners):**
```typescript
// ThemeToggle используется дважды (desktop + mobile)
// Каждый экземпляр добавляет свои listeners
function initTheme() {
  // ...
  document.addEventListener('astro:after-swap', initTheme); // ❌ Дублируется!
  window.addEventListener('astro:page-load', initTheme);      // ❌ Дублируется!
  
  toggleButton.addEventListener('click', handler); // ❌ Дублируется!
}
```

**Последствие:** При каждом view transition `initTheme()` выполняется несколько раз (по количеству экземпляров компонента), что приводит к ненужным DOM операциям и потенциальным багам.

**✅ Правильно (глобальные флаги + event delegation):**
```typescript
// Глобальные флаги для предотвращения дублирования
if (typeof window !== 'undefined') {
  (window as any).__themeListenersSetup = (window as any).__themeListenersSetup || false;
  (window as any).__themeTransitionListenersSetup = (window as any).__themeTransitionListenersSetup || false;
}

// Setup toggle handlers once globally (using event delegation)
if (typeof window !== 'undefined' && !(window as any).__themeListenersSetup) {
  (window as any).__themeListenersSetup = true;
  
  // Event delegation обрабатывает все кнопки одним listener
  document.addEventListener('click', (e) => {
    const toggleButton = (e.target as Element).closest('#theme-toggle');
    if (toggleButton) {
      // Обработка клика
    }
  });
}

// Setup transition listeners once globally
if (typeof window !== 'undefined' && !(window as any).__themeTransitionListenersSetup) {
  (window as any).__themeTransitionListenersSetup = true;
  
  document.addEventListener('astro:after-swap', initTheme);
  window.addEventListener('astro:page-load', initTheme);
}

// initTheme() можно вызывать многократно (идемпотентная операция)
function initTheme() {
  // Применение темы - безопасно вызывать несколько раз
}
```

**Pro-Tip:** Если компонент рендерится несколько раз (например, desktop и mobile версии), используй глобальные флаги на `window` для предотвращения дублирования event listeners. Event delegation (`closest()`) позволяет обрабатывать все экземпляры элемента одним listener. Transition listeners (`astro:after-swap`, `astro:page-load`) регистрируй один раз глобально, а не в каждом экземпляре компонента. Функции инициализации (например, `initTheme()`) должны быть идемпотентными — безопасно вызывать их несколько раз.

---

## 🎨 Tailwind CSS v4 - @theme блок

### Опциональность @theme блока

**❌ Неправильное понимание:**
```css
/* Думаешь, что @theme обязателен */
@import "tailwindcss";

@theme {
  /* Но на самом деле это опционально! */
}
```

**✅ Правильно (опциональность):**
```css
/* Для дефолтных значений Tailwind достаточно: */
@import "tailwindcss";

/* @theme нужен ТОЛЬКО для кастомизации: */
@theme {
  --color-brand: #3b82f6;
  --font-display: 'Inter', sans-serif;
}
```

**Для сложных случаев:**
```css
/* Если нужны плагины или сложная конфигурация: */
@config "./tailwind.config.js";  /* Используй @config directive */
/* Или создай tailwind.config.js (не рекомендуется для простых проектов) */
```

**Pro-Tip:** Блок `@theme` в Tailwind v4 **опционален**. Если используешь дефолтные значения Tailwind, достаточно `@import "tailwindcss"`. Используй `@theme` только для кастомизации (цвета из Figma, кастомные шрифты, значения). Для сложных случаев (плагины) используй `@config` directive в CSS или создай `tailwind.config.js`, но это не рекомендуется для простых проектов.

---

## 🐛 Server Actions - Promise.allSettled

### Ложноположительный успех при использовании Promise.allSettled

**❌ Опасно (всегда возвращает success):**
```typescript
const results = await Promise.allSettled([
  sendToTelegram(input),
  sendEmail(input),
]);

// Проблема: если обе отправки упадут, всё равно вернется success: true
return { success: true, message: 'Сообщение успешно отправлено' };
```

**✅ Правильно (проверяем хотя бы один успех):**
```typescript
const results = await Promise.allSettled([
  sendToTelegram(input),
  sendEmail(input),
]);

// Проверяем, удалось ли отправить хотя бы куда-то
const anySuccess = results.some(r => r.status === 'fulfilled');

if (!anySuccess) {
  console.error('All dispatch methods failed', results);
  throw new Error('Не удалось отправить сообщение. Свяжитесь с нами по телефону.');
}

return { success: true, message: 'Сообщение успешно отправлено' };
```

**Pro-Tip:** `Promise.allSettled()` никогда не выбрасывает ошибку — он всегда возвращает массив результатов. Всегда проверяй `anySuccess` перед возвратом успеха, иначе пользователь получит ложное сообщение об успехе, даже если все операции провалились. Это критично для корректной обработки ошибок в формах.

---

## 🌐 i18n - Синхронизация конфигурации

### Рассинхрон между ui.ts и astro.config.mjs

**❌ Проблема (рассинхрон):**
```typescript
// src/i18n/ui.ts
export const languages = {
  ru: 'Русский',
  en: 'English',
  de: 'Deutsch', // Перевод есть
  // ... еще 7 языков
};

// astro.config.mjs
i18n: {
  locales: ['ru', 'en'], // Но в роутинге только 2 языка!
}
```

**Последствие:** Если пользователь перейдет на `/de/about`, Astro выдаст 404, так как локаль не зарегистрирована в роутинге, даже если переводы есть в `ui.ts`.

**✅ Правильно (синхронизация):**
```typescript
// Вариант 1: Добавить все языки с fallback (если хочешь поддержку)
i18n: {
  defaultLocale: 'ru',
  locales: ['ru', 'en', 'de', 'es', 'fr', 'pt', 'it', 'tr', 'ar', 'zh'],
  routing: {
    prefixDefaultLocale: false,
    fallback: {
      de: 'en', es: 'en', fr: 'en', pt: 'en', it: 'en', tr: 'en', ar: 'en', zh: 'en'
    },
  },
}

// Вариант 2: Оставить только существующие (рекомендуется)
i18n: {
  locales: ['ru', 'en'], // Только языки с существующими страницами
}
// В ui.ts добавить комментарий, что переводы подготовлены, но роутинг не настроен
```

**Pro-Tip:** Всегда синхронизируй языки между `src/i18n/ui.ts` и `astro.config.mjs`. В `i18n.locales` указывай только те языки, для которых реально созданы страницы. Переводы в `ui.ts` можно подготовить заранее, но добавь комментарий, что роутинг не настроен до создания страниц. 

**Важно:** В `src/i18n/utils.ts` используй `routingLocales` (только языки с роутингом) вместо `locales` (все языки с переводами) для функций роутинга (`getLangFromUrl`, `getLocalizedPath`, `getAlternateLinks`). Это предотвращает 404 ошибки при переходе на несуществующие языковые версии.

---

---

## 🗂️ Управление проектом

### Исторические документы

**✅ Правильно (организация):**
```bash
# Создай папку docs/ для исторических документов
mkdir docs/

# Перемести исторические документы
mv COMMENTS_ANALYSIS.md docs/
mv REVIEW_ANALYSIS.md docs/
mv WORK_PLAN.md docs/

# Добавь в .gitignore
echo "docs/" >> .gitignore
```

**Pro-Tip:** Всегда отправляй исторические документы (анализы, планы работ, инструкции, которые уже не актуальны) в папку `docs/` и исключи её из Git через `.gitignore`. Это сохраняет историю для справки, но не засоряет репозиторий. Актуальную документацию (README.md, DEPLOY.md, PRO_TIPS.md) оставляй в корне проекта.

### Исключение файлов из Git

**✅ Правильно (comprehensive .gitignore):**
```gitignore
# Build output
dist/
.output/
.astro/

# Dependencies
node_modules/

# Environment variables
.env
.env.*
!.env.example
*.local

# IDE
.vscode/
.idea/
.cursor/
*.swp
*.swo
*~

# Cache & temp files
.cache/
.temp/
.tmp/
*.tsbuildinfo
.sass-cache/
.stylelintcache

# Build & deployment
.vercel/
.turbo/
.next/

# Testing
coverage/
.nyc_output/
*.test.js.snap
.vscode-test/

# Security (private keys, certificates)
*.pem
*.key
*.crt
*.cert
*.p12
*.pfx

# Lock files (keep package-lock.json, ignore others)
yarn.lock
bun.lock
pnpm-lock.yaml

# Historical documentation
docs/
```

**Pro-Tip:** Настрой `.gitignore` сразу при создании проекта. Включай стандартные паттерны для кэша, временных файлов, приватных ключей и артефактов сборки. Это предотвращает случайный коммит чувствительных данных и временных файлов, которые могут создаваться инструментами сборки и IDE.

### Удаление неиспользуемых зависимостей и папок

**✅ Правильно (проверка перед удалением):**
```bash
# 1. Проверь, используется ли папка/файл в проекте
grep -r "cursor-talk-to-figma-mcp" . --exclude-dir=node_modules

# 2. Проверь зависимости в package.json
grep "cursor-talk-to-figma-mcp" package.json

# 3. Если не используется - удали
rm -rf cursor-talk-to-figma-mcp/
```

**Pro-Tip:** Перед удалением папок или файлов всегда проверяй, используются ли они в проекте (через `grep` или поиск по коду). Если файлы не используются MCP сервером или основным проектом, удаляй их целиком. Это поддерживает чистоту проекта и уменьшает размер репозитория.

---

**Последнее обновление:** 2026-01-06 (добавлены Pro-Tips: Promise.allSettled проверка, i18n синхронизация конфигурации, управление проектом, предотвращение дублирования event listeners)
