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

**Последнее обновление:** 2026-01-05
