# 🌐 i18n Setup Guide

## Структура английского языка

Все страницы для английского языка находятся в `src/pages/en/`.

### Созданные страницы:

✅ **Основные страницы:**
- `/en/` - Главная
- `/en/about/` - О компании
- `/en/contact/` - Контакты
- `/en/form-success` - Страница успешной отправки формы

✅ **Контентные страницы:**
- `/en/blog/` - Список статей
- `/en/blog/[slug]` - Отдельная статья
- `/en/cases/` - Кейсы
- `/en/cases/[slug]` - Отдельный кейс
- `/en/expertise/` - Экспертиза
- `/en/expertise/[slug]` - Отдельное направление
- `/en/industries/` - Отрасли
- `/en/industries/[slug]` - Отдельная отрасль
- `/en/solutions/` - Услуги/Решения
- `/en/solutions/[slug]` - Отдельная услуга

✅ **Правовые страницы:**
- `/en/privacy/` - Политика конфиденциальности
- `/en/terms/` - Условия использования
- `/en/faq/` - FAQ
- `/en/hr/` - Карьера

## Контент-коллекции

### Добавление английского контента

Все контент-коллекции теперь поддерживают поле `lang`:

```markdown
---
title: NC Programming
description: CNC Programming
category: nc-programming
lang: en  # ← Указываем язык
---
```

### Примеры английского контента:

- `src/content/services/nc-programming-en.md`
- `src/content/expertise/nx-cad-en.md`
- `src/content/industries/aerospace-en.md`

### Как добавить новый английский контент:

1. **Для услуг (services):**
   ```bash
   # Создай файл с суффиксом -en или укажи lang: en
   src/content/services/my-service-en.md
   ```

2. **Для экспертизы (expertise):**
   ```bash
   src/content/expertise/my-expertise-en.md
   ```

3. **Для отраслей (industries):**
   ```bash
   src/content/industries/my-industry-en.md
   ```

4. **Для кейсов (cases):**
   ```bash
   src/content/cases/my-case-en.md
   ```

5. **Для блога (blog):**
   ```bash
   src/content/blog/my-post-en.md
   ```

### Важно:

- Если `lang` не указан, контент считается русским (дефолт)
- Страницы автоматически фильтруют контент по языку
- Если английского контента нет, можно настроить fallback на русский

## Использование в коде

### Получение контента для английского языка:

```typescript
import { getCollection } from 'astro:content';
import { filterByLang } from '@/utils/content';

const lang = 'en' as const;
const allItems = await getCollection('services');
const enItems = filterByLang(allItems, lang);
```

### Переводы UI:

```typescript
import { useTranslations } from '@/i18n/utils';

const lang = 'en' as const;
const t = useTranslations(lang);

// Использование
<h1>{t('nav.home')}</h1>
```

### Локализованные ссылки:

```typescript
import { getLocalizedPath } from '@/i18n/utils';

const lang = 'en' as const;
const href = getLocalizedPath('/about/', lang); // → /en/about/
```

## SEO

Все страницы автоматически получают:
- ✅ `hreflang` теги для всех языков
- ✅ Правильный `lang` атрибут в `<html>`
- ✅ Локализованные canonical URLs
- ✅ Open Graph мета-теги с правильным locale

## Следующие шаги

1. **Добавь английский контент** в контент-коллекции
2. **Переведи существующий контент** на английский
3. **Протестируй все страницы** на `/en/*`
4. **Проверь SEO** через Google Search Console

## Добавление других языков

Для добавления других языков (de, es, fr, pt, it, tr, ar, zh):

1. Создай папку `src/pages/[lang]/`
2. Скопируй структуру из `src/pages/en/`
3. Обнови переводы в `src/i18n/ui.ts`
4. Добавь контент с `lang: [lang]` в коллекции

---

**Готово!** Английская версия сайта полностью настроена. 🎉
