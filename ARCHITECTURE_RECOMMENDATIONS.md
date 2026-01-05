# Рекомендации по улучшению архитектуры сайта

## 1. Site Structure (Структура сайта)

### Текущее состояние: ✅ Хорошо
- Разделение на expertise, solutions, cases, blog есть
- Есть contact и entry points

### Рекомендации:

**Проблема:** Есть семантическое пересечение:
- `solutions/` и `expertise/` могут дублировать контент
- `engagement/` неясно относится к services или отдельный раздел

**Решение:**
```
/services/          → Услуги (что предлагаем)
  /nc-programming
  /postprocessors
  /vericut-simulation

/expertise/         → Экспертиза (в чем разбираемся)
  /nx-cad
  /nx-cam
  /vericut

/industries/        → Отрасли (для кого)
  /aerospace
  /energy-oil-gas
  /machinery

/cases/             → Кейсы (что сделали)
/blog/              → Статьи (что думаем)
```

**Удалить:** `/engagement/` или переименовать в `/services/engagement/`

---

## 2. URL Strategy (Стратегия URL)

### Текущее состояние: ✅ Хорошо, но есть проблемы

**Проблемы:**
- `/hr-short` — не folder-based, не SEO-friendly
- `/solutions/nc-programming` → `/solutions/nc-programming/index.html` (избыточно)
- Нет консистентности в именовании (kebab-case vs camelCase)

**Рекомендации:**

### Правила именования:
- Всегда kebab-case: `nc-programming`, не `ncProgramming`
- Folder-based: `/hr/` вместо `/hr-short`
- Консистентность: все URL следуют одному паттерну

### Примеры правильных URL:
```
/                              → Главная
/about/                        → О компании
/services/                     → Услуги (hub)
/services/nc-programming/      → NC Programming
/expertise/                    → Экспертиза (hub)
/expertise/nx-cad/             → NX CAD
/industries/                   → Отрасли (hub)
/industries/aerospace/         → Аэрокосмическая отрасль
/cases/                        → Кейсы (hub)
/cases/project-name/           → Конкретный кейс
/blog/                         → Блог (hub)
/blog/article-slug/            → Статья
/contact/                      → Контакты
/hr/                           → HR (переименовать из hr-short)
/faq/                          → FAQ
/privacy/                      → Политика конфиденциальности
/terms/                        → Условия использования
```

---

## 3. Content Models (Модели контента)

### Текущее состояние: ⚠️ Частично

**Есть:**
- ✅ `CaseStudy` (cases collection)
- ✅ `Article` (blog collection)

**Отсутствует:**
- ❌ `ExpertiseArea` — сейчас статические страницы
- ❌ `Service/Solution` — сейчас статические страницы
- ❌ `Industry` — сейчас статические страницы

### Рекомендации: Расширить Content Collections

```typescript
// src/content/config.ts

const expertise = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    relatedServices: z.array(z.string()).default([]), // relations
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['nc-programming', 'postprocessors', 'simulation', 'other']),
    expertise: z.array(z.string()).default([]), // relations to expertise
    industries: z.array(z.string()).default([]), // relations to industries
    pricing: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

const industries = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    services: z.array(z.string()).default([]), // relations
    cases: z.array(z.string()).default([]), // relations
    heroImage: z.string().optional(),
  }),
});
```

**Преимущества:**
- Единая точка управления контентом
- Type-safe доступ
- Легко добавлять новые элементы
- Возможность фильтрации и сортировки

---

## 4. Layout Architecture (Архитектура Layouts)

### Текущее состояние: ✅ Хорошо

**Есть:**
- ✅ `LayoutMain` — основной layout
- ✅ `LayoutService` — для services/expertise/industries
- ✅ `LayoutPost` — для статей и кейсов
- ✅ `LayoutLegal` — для legal страниц

### Рекомендации: Добавить общие компоненты

**Проблема:** Нет Header/Footer, они должны быть в LayoutMain

**Решение:**
```
src/components/
  /layout/
    Header.astro          → Глобальная навигация
    Footer.astro          → Футер с ссылками
    Navigation.astro      → Компонент навигации
  /sections/             → Секции страниц (hero, features, etc.)
  /ui/                    → UI компоненты (уже есть)
```

**Обновить LayoutMain:**
```astro
---
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
---

<LayoutMain>
  <Header />
  <slot />
  <Footer />
</LayoutMain>
```

---

## 5. Navigation Logic (Логика навигации)

### Текущее состояние: ❌ Отсутствует

**Критично:** Нет глобальной навигации!

### Рекомендации:

**Структура навигации:**

**Primary Navigation (Header):**
```
Главная | О компании | Услуги | Экспертиза | Отрасли | Кейсы | Блог | Контакты
```

**Secondary Navigation (Dropdown для Услуги):**
```
Услуги
  ├─ NC Programming
  ├─ Postprocessors
  └─ VERICUT Simulation
```

**Footer Navigation:**
```
Колонка 1: Компания
  - О нас
  - Команда
  - Карьера (HR)

Колонка 2: Ресурсы
  - Блог
  - Кейсы
  - FAQ

Колонка 3: Правовая информация
  - Политика конфиденциальности
  - Условия использования

Колонка 4: Контакты
  - Связаться с нами
  - Форма обратной связи
```

**Mobile-first:**
- Hamburger menu для мобильных
- Accordion для подменю
- Sticky header при скролле

**Файл:** `src/components/layout/Navigation.astro`

---

## 6. SEO & Technical Hooks (SEO и технические хуки)

### Текущее состояние: ❌ Отсутствует

### Рекомендации:

**1. Schema.org разметка:**

Создать утилиты для генерации JSON-LD:
```
src/utils/
  seo.ts              → Функции для meta тегов
  schema.ts           → Генерация Schema.org разметки
```

**Типы схем:**
- `Person` — для about страницы
- `ProfessionalService` — для services
- `Article` — для blog
- `CaseStudy` (использовать `CreativeWork`)

**2. Meta и OpenGraph:**

Расширить LayoutMain:
```typescript
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
}
```

**3. Sitemap и robots.txt:**

Astro автоматически генерирует sitemap, но нужно:
- Настроить `astro.config.mjs` для sitemap
- Создать `public/robots.txt`

**4. Структурированные данные:**

Добавить в каждый layout соответствующие схемы.

---

## 7. Folder Structure (Структура папок)

### Текущее состояние: ✅ Хорошо, но можно улучшить

### Рекомендуемая структура:

```
src/
├── actions/              → Server Actions
│   └── contact-form.ts
├── components/
│   ├── layout/           → Header, Footer, Navigation
│   ├── sections/         → Hero, Features, Testimonials
│   └── ui/               → Button, Input, Section (уже есть)
├── content/              → Content Collections
│   ├── blog/
│   ├── cases/
│   ├── expertise/        → НОВОЕ: Content Collection
│   ├── services/         → НОВОЕ: Content Collection
│   ├── industries/       → НОВОЕ: Content Collection
│   └── config.ts
├── layouts/              → Layout компоненты (уже есть)
│   ├── LayoutMain.astro
│   ├── LayoutService.astro
│   ├── LayoutPost.astro
│   └── LayoutLegal.astro
├── pages/                → Страницы (уже есть)
│   ├── index.astro
│   ├── about/
│   ├── services/
│   ├── expertise/
│   ├── industries/
│   ├── cases/
│   ├── blog/
│   ├── contact/
│   ├── hr/               → ПЕРЕИМЕНОВАТЬ из hr-short
│   ├── faq/
│   ├── privacy/
│   ├── terms/
│   ├── api/
│   ├── 404.astro
│   └── form-success.astro
├── styles/
│   └── global.css
├── utils/                 → НОВОЕ: Утилиты
│   ├── seo.ts
│   └── schema.ts
└── env.d.ts
```

---

## Приоритеты внедрения

### Высокий приоритет (критично):
1. ✅ Создать Header/Footer компоненты
2. ✅ Добавить Navigation в LayoutMain
3. ✅ Расширить SEO meta теги
4. ✅ Переименовать `/hr-short` → `/hr/`

### Средний приоритет (важно):
5. ⚠️ Создать Content Collections для expertise/services/industries
6. ⚠️ Добавить Schema.org разметку
7. ⚠️ Настроить sitemap и robots.txt

### Низкий приоритет (можно позже):
8. 📝 Рефакторинг статических страниц в Content Collections
9. 📝 Добавить утилиты для SEO

---

## Выводы

**Сильные стороны:**
- ✅ Хорошая базовая структура
- ✅ Правильное разделение layouts
- ✅ Content Collections для blog и cases

**Что улучшить:**
- ❌ Добавить навигацию (критично!)
- ❌ Расширить Content Collections
- ❌ Добавить SEO инфраструктуру
- ⚠️ Улучшить консистентность URL

**Рекомендации полезны?** ✅ Да, особенно пункты 5 (Navigation) и 6 (SEO) — их нужно реализовать в первую очередь.
