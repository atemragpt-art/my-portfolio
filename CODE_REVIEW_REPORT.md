# Отчет о Code Review и Техническом Долге

**Дата:** 2025-01-05  
**Проект:** Portfolio Site (Astro 5 + Tailwind v4)

---

## 🔴 Critical (Критично - нужно исправить срочно)

### 1. Неиспользуемые функции в `src/utils/seo.ts`
**Проблема:** Функции `getFullTitle()` и `formatDescription()` объявлены, но нигде не используются.

**Файлы:**
- `src/utils/seo.ts` - функции экспортированы, но не импортируются
- `src/layouts/LayoutMain.astro` - не использует эти функции

**Решение:** 
- Либо удалить неиспользуемые функции
- Либо использовать их в `LayoutMain` для генерации title и description

**Приоритет:** Высокий (мертвый код)

---

### 2. `autoprefixer` установлен, но не используется
**Проблема:** В `package.json` есть `autoprefixer@^10.4.23`, но он не добавлен в `postcss.config.mjs`.

**Файлы:**
- `package.json` - зависимость есть
- `postcss.config.mjs` - только `@tailwindcss/postcss`

**Решение:**
- Либо добавить `autoprefixer` в `postcss.config.mjs`
- Либо удалить из `package.json` (Tailwind v4 может включать autoprefixer автоматически)

**Приоритет:** Средний (не критично, но избыточно)

---

### 3. Конфликт `.container` класса
**Проблема:** В `src/styles/global.css` определен кастомный `.container`, но везде используется Tailwind `container mx-auto`.

**Файлы:**
- `src/styles/global.css` - строки 46-57 (кастомный `.container`)
- Используется только в `src/components/layout/Header.astro` и `src/components/layout/Footer.astro` через Tailwind `container`

**Решение:**
- Удалить кастомный `.container` из `global.css`
- Использовать только Tailwind `container` класс

**Приоритет:** Средний (может вызвать конфликты стилей)

---

### 4. Placeholder URLs в production коде
**Проблема:** В коде остались `https://example.com` вместо реального домена.

**Файлы:**
- `src/pages/index.astro` - `url: Astro.site?.href || 'https://example.com'`
- `src/layouts/LayoutMain.astro` - `const siteUrl = Astro.site?.href || 'https://example.com'`
- `public/robots.txt` - `Sitemap: https://example.com/sitemap-index.xml`
- `astro.config.mjs` - закомментирован `site`

**Решение:**
- Настроить `site` в `astro.config.mjs` перед деплоем
- Убрать fallback на `example.com` или сделать его более явным

**Приоритет:** Высокий (SEO проблема)

---

## 🟡 Warning (Предупреждения - неиспользуемые файлы и мусор)

### 5. `.gitkeep` файлы в Content Collections
**Проблема:** 5 файлов `.gitkeep` в папках Content Collections - не нужны, если есть реальный контент.

**Файлы:**
- `src/content/blog/.gitkeep`
- `src/content/cases/.gitkeep`
- `src/content/expertise/.gitkeep`
- `src/content/services/.gitkeep`
- `src/content/industries/.gitkeep`

**Решение:**
- Удалить `.gitkeep` файлы (Astro автоматически создаст папки при необходимости)
- Или оставить только в пустых коллекциях

**Приоритет:** Низкий (косметика)

---

### 6. Неиспользуемый интерфейс `SEOProps`
**Проблема:** В `src/utils/seo.ts` определен интерфейс `SEOProps`, но он не используется.

**Файлы:**
- `src/utils/seo.ts` - строки 5-16

**Решение:**
- Удалить интерфейс или использовать его в `LayoutMain`

**Приоритет:** Низкий (мертвый код)

---

### 7. Дублирование логики сортировки
**Проблема:** Одинаковая логика сортировки повторяется в 4 файлах.

**Файлы:**
- `src/pages/blog/index.astro` - сортировка по дате
- `src/pages/cases/index.astro` - сортировка по featured
- `src/pages/expertise/index.astro` - сортировка по featured
- `src/pages/solutions/index.astro` - сортировка по category

**Решение:**
- Вынести в утилиту `src/utils/sorting.ts`

**Приоритет:** Средний (DRY violation)

---

### 8. Дублирование пустых состояний
**Проблема:** Одинаковый паттерн "Пока нет опубликованных..." повторяется в 5 файлах.

**Файлы:**
- `src/pages/blog/index.astro`
- `src/pages/cases/index.astro`
- `src/pages/expertise/index.astro`
- `src/pages/solutions/index.astro`
- `src/pages/industries/index.astro`

**Решение:**
- Создать компонент `EmptyState.astro`

**Приоритет:** Средний (DRY violation)

---

## 🟢 Optimization (Оптимизация - что можно улучшить)

### 9. Дублирование карточек в Hub страницах
**Проблема:** Одинаковая структура карточек повторяется в 5 hub страницах.

**Повторяющийся код:**
```astro
<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
  <h2>...</h2>
  <p>...</p>
  <Button>...</Button>
</div>
```

**Файлы:**
- `src/pages/blog/index.astro`
- `src/pages/cases/index.astro`
- `src/pages/expertise/index.astro`
- `src/pages/solutions/index.astro`
- `src/pages/industries/index.astro`

**Решение:**
- Создать компонент `Card.astro` или `ContentCard.astro`

**Приоритет:** Средний (DRY violation, но работает)

---

### 10. Дублирование Badge/Tag компонентов
**Проблема:** Код для тегов/бейджей повторяется в разных формах.

**Повторяющийся код:**
```astro
<span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
  {tag}
</span>
```

**Файлы:**
- `src/pages/blog/index.astro`
- `src/pages/blog/[...slug].astro`
- `src/pages/cases/index.astro`
- `src/pages/expertise/index.astro`
- `src/pages/solutions/[...slug].astro`
- И другие...

**Решение:**
- Создать компонент `Badge.astro` или `Tag.astro`

**Приоритет:** Низкий (работает, но можно улучшить)

---

### 11. Дублирование структуры article страниц
**Проблема:** Одинаковая структура `prose dark:prose-invert max-w-4xl mx-auto` повторяется.

**Файлы:**
- `src/pages/blog/[...slug].astro`
- `src/pages/cases/[...slug].astro`
- `src/pages/expertise/[...slug].astro`
- `src/pages/solutions/[...slug].astro`
- `src/pages/industries/[...slug].astro`

**Решение:**
- Вынести в компонент `ArticleContent.astro` или обновить `LayoutPost`

**Приоритет:** Низкий (работает)

---

### 12. Дублирование grid layout
**Проблема:** Одинаковый grid `grid gap-6 md:grid-cols-2 lg:grid-cols-3` повторяется.

**Файлы:**
- Все hub страницы используют одинаковый grid

**Решение:**
- Создать компонент `Grid.astro` или использовать в `Section`

**Приоритет:** Низкий (работает)

---

### 13. Неиспользуемый prop `error` в Input.astro
**Проблема:** В `Input.astro` есть prop `error`, но он не используется в форме контактов.

**Файлы:**
- `src/components/ui/Input.astro` - prop определен
- `src/pages/contact/index.astro` - не передается `error`

**Решение:**
- Либо использовать для валидации формы
- Либо удалить prop

**Приоритет:** Низкий (функционал есть, но не используется)

---

### 14. Tailwind `prose` класс без плагина
**Проблема:** Используется `prose` класс, но не установлен `@tailwindcss/typography`.

**Файлы:**
- Множество страниц используют `prose dark:prose-invert`
- Проверено: `@tailwindcss/typography` не установлен

**Решение:**
- Либо установить `@tailwindcss/typography`
- Либо удалить `prose` классы и стилизовать вручную

**Приоритет:** Средний (может не работать без плагина)

---

### 19. Несоответствие parse_mode в Telegram
**Проблема:** В `contact-form.ts` указан `parse_mode: 'HTML'`, но текст отправляется как plain text без HTML тегов.

**Файлы:**
- `src/actions/contact-form.ts` - строка 30

**Решение:**
- Либо убрать `parse_mode: 'HTML'`
- Либо форматировать текст с HTML тегами (`<b>`, `<i>`, etc.)

**Приоритет:** Низкий (работает, но несоответствие)

---

### 15. Хардкод текста "Expert Team"
**Проблема:** Название команды захардкожено в нескольких местах.

**Файлы:**
- `src/pages/index.astro` - `name: 'Expert Team'`
- `src/pages/about/index.astro` - `name: 'Expert Team'`
- `src/pages/blog/[...slug].astro` - `name: 'Expert Team'`
- `src/pages/solutions/[...slug].astro` - `name: 'Expert Team'`

**Решение:**
- Вынести в константу или конфиг

**Приоритет:** Низкий (работает, но не масштабируется)

---

### 16. Дублирование логики Schema.org
**Проблема:** Повторяющаяся логика генерации URL для Schema.org.

**Файлы:**
- Все страницы с Schema.org имеют похожую логику `Astro.site?.href`

**Решение:**
- Вынести в утилиту `getSiteUrl()`

**Приоритет:** Низкий (работает)

---

### 17. Неиспользуемый `pubDate` в LayoutPost
**Проблема:** `pubDate` передается в `LayoutPost`, но отображается только в самом компоненте, не в layout.

**Файлы:**
- `src/layouts/LayoutPost.astro` - получает `pubDate`, но не использует в meta тегах

**Решение:**
- Использовать `pubDate` для `article:published_time` в meta тегах

**Приоритет:** Низкий (SEO улучшение)

---

### 18. Дублирование стилей textarea в contact форме
**Проблема:** Textarea стилизован инлайн, хотя есть компонент `Input.astro`.

**Файлы:**
- `src/pages/contact/index.astro` - textarea с инлайн стилями

**Решение:**
- Создать компонент `Textarea.astro` или расширить `Input.astro`

**Приоритет:** Низкий (работает)

---

## 📊 Статистика

### Файлы:
- **Всего файлов:** 35
- **Astro компонентов:** 28
- **TypeScript файлов:** 4
- **CSS файлов:** 1

### Дублирование:
- **Карточки:** 5 повторений
- **Сортировка:** 4 повторения
- **Пустые состояния:** 5 повторений
- **Badge/Tag:** 6+ повторений
- **Article структура:** 5 повторений

### Неиспользуемый код:
- **Функции:** 2 (`getFullTitle`, `formatDescription`)
- **Интерфейсы:** 1 (`SEOProps`)
- **Зависимости:** 1 (`autoprefixer` - частично)

---

## 🎯 Рекомендации по приоритетам

### Срочно (до деплоя):
1. ✅ Исправить placeholder URLs (Critical #4)
2. ✅ Удалить неиспользуемые функции (Critical #1)
3. ✅ Исправить конфликт `.container` (Critical #3)

### Важно (рефакторинг):
4. ⚠️ Вынести карточки в компонент (Optimization #9)
5. ⚠️ Вынести Badge в компонент (Optimization #10)
6. ⚠️ Вынести пустые состояния (Warning #8)
7. ⚠️ Установить или удалить `prose` плагин (Optimization #14)

### Можно позже:
8. 📝 Вынести сортировку в утилиту (Warning #7)
9. 📝 Вынести article структуру (Optimization #11)
10. 📝 Создать Textarea компонент (Optimization #18)

---

## ✅ Что хорошо

1. ✅ Все файлы используются (нет zombie files)
2. ✅ Content Collections правильно настроены
3. ✅ Schema.org разметка добавлена
4. ✅ Навигация работает
5. ✅ Нет старых `@apply` директив
6. ✅ Tailwind v4 правильно настроен
7. ✅ Все UI компоненты (Button, Input, Section) активно используются
8. ✅ Layouts правильно структурированы
9. ✅ Нет битых импортов

---

**Итог:** Проект в хорошем состоянии. Основные проблемы - дублирование кода (DRY violations) и несколько неиспользуемых функций. Критичных ошибок нет, но есть места для оптимизации.
