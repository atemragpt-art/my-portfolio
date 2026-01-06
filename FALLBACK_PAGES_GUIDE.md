# 📋 Инструкция: Создание страниц-заглушек для языков с fallback

> **✅ ВСЁ УЖЕ СОЗДАНО!** Все страницы-заглушки созданы автоматически. Тебе не нужно ничего делать вручную. Просто перезапусти dev-сервер и всё будет работать.

## 🎯 Цель

Создать страницы-заглушки для всех языков с fallback (de, es, fr, pt, it, tr, ar, zh), которые будут автоматически перенаправлять на английскую версию (fallback язык).

**Статус:** ✅ **ВЫПОЛНЕНО** — все 136 файлов созданы автоматически.

## ✅ Текущий статус

- ✅ **ВСЕ страницы-заглушки созданы автоматически!**
- ✅ `/de/expertise/` — работает (307 редирект)
- ✅ `/pt/solutions/` — работает (307 редирект)
- ✅ `/es/solutions/` — работает (307 редирект)
- ✅ Все языки с fallback (de, es, fr, pt, it, tr, ar, zh) имеют страницы-заглушки
- ✅ Всего создано: **136 файлов** (8 языков × 17 файлов)

## ✅ Всё готово!

**Все страницы-заглушки уже созданы автоматически!** Тебе не нужно ничего делать вручную.

### Что было создано:

- ✅ **8 языков** с fallback: de, es, fr, pt, it, tr, ar, zh
- ✅ **6 статических страниц** для каждого языка: about, contact, faq, hr, privacy, terms
- ✅ **5 страниц со списками** для каждого языка: blog, cases, expertise, industries, solutions
- ✅ **Динамические маршруты** `[...slug].astro` для всех списков
- ✅ **Главные страницы** `index.astro` для каждого языка
- ✅ **Всего: 136 файлов**

### Шаг 1: Перезапустить dev-сервер (если ещё не перезапускал)

**ВАЖНО:** После изменений в `astro.config.mjs` нужно перезапустить dev-сервер:

```bash
# Останови текущий процесс (Ctrl+C)
# Затем запусти снова:
npm run dev
```

### Шаг 2: Проверить работу

Теперь все языки с fallback должны работать автоматически:

Для каждого языка с fallback (de, es, fr, pt, it, tr, ar, zh) нужно создать страницы-заглушки для всех путей, которые есть в `/en/`.

#### Список путей для создания:

1. **Статические страницы (index.astro):**
   - `about/index.astro`
   - `contact/index.astro`
   - `faq/index.astro`
   - `hr/index.astro`
   - `privacy/index.astro`
   - `terms/index.astro`
   - `index.astro` (главная)

2. **Страницы со списками (index.astro):**
   - `blog/index.astro`
   - `cases/index.astro`
   - `expertise/index.astro` ✅ (уже создано для de)
   - `industries/index.astro`
   - `solutions/index.astro`

3. **Динамические маршруты ([...slug].astro):**
   - `blog/[...slug].astro`
   - `cases/[...slug].astro`
   - `expertise/[...slug].astro` ✅ (уже создано для de)
   - `industries/[...slug].astro`
   - `solutions/[...slug].astro`

### Шаг 3: Шаблон для статических страниц (index.astro)

Создай файл по пути: `src/pages/{lang}/{path}/index.astro`

**Пример для `/de/about/index.astro`:**

```astro
---
/**
 * Страница-заглушка для {lang} языка
 * Перенаправляет на английскую версию (fallback)
 */
import { getLocalizedPath } from '@/i18n/utils';

// Перенаправляем на английскую версию
return Astro.redirect(getLocalizedPath('/about/', 'en'), 307);
---
```

### Шаг 4: Шаблон для динамических маршрутов ([...slug].astro)

Создай файл по пути: `src/pages/{lang}/{path}/[...slug].astro`

**Пример для `/de/expertise/[...slug].astro` (уже создан):**

```astro
---
/**
 * Страница-заглушка для динамических маршрутов {lang} языка
 * Перенаправляет на английскую версию (fallback)
 */
import { getLocalizedPath } from '@/i18n/utils';

// Получаем slug из параметров
const slug = Astro.params.slug || '';

// Перенаправляем на английскую версию
return Astro.redirect(getLocalizedPath(`/expertise/${slug}`, 'en'), 307);
---
```

### Шаг 5: Шаблон для главной страницы (index.astro)

Создай файл по пути: `src/pages/{lang}/index.astro`

**Пример для `/de/index.astro`:**

```astro
---
/**
 * Главная страница-заглушка для {lang} языка
 * Перенаправляет на английскую версию (fallback)
 */
import { getLocalizedPath } from '@/i18n/utils';

// Перенаправляем на английскую версию
return Astro.redirect(getLocalizedPath('/', 'en'), 307);
---
```

## 🚀 Быстрый способ (автоматический скрипт)

**Рекомендуется:** Используй готовый скрипт для автоматического создания всех страниц-заглушек:

```bash
# Запусти скрипт:
bash scripts/create-fallback-pages.sh
```

Скрипт автоматически:
- ✅ Создаст все необходимые директории
- ✅ Создаст все страницы-заглушки для всех языков с fallback
- ✅ Пропустит уже существующие файлы (не перезапишет)
- ✅ Покажет прогресс создания

**Альтернатива:** Можно использовать этот bash-скрипт вручную (если нужно кастомизировать):

```bash
#!/bin/bash

# Языки с fallback
LANGS=("de" "es" "fr" "pt" "it" "tr" "ar" "zh")

# Статические страницы
STATIC_PAGES=("about" "contact" "faq" "hr" "privacy" "terms")

# Страницы со списками
LIST_PAGES=("blog" "cases" "expertise" "industries" "solutions")

# Создаём статические страницы
for lang in "${LANGS[@]}"; do
  for page in "${STATIC_PAGES[@]}"; do
    mkdir -p "src/pages/$lang/$page"
    cat > "src/pages/$lang/$page/index.astro" << EOF
---
/**
 * Страница-заглушка для $lang языка
 * Перенаправляет на английскую версию (fallback)
 */
import { getLocalizedPath } from '@/i18n/utils';

return Astro.redirect(getLocalizedPath('/$page/', 'en'), 307);
---
EOF
  done
done

# Создаём страницы со списками (index + динамический маршрут)
for lang in "${LANGS[@]}"; do
  for page in "${LIST_PAGES[@]}"; do
    mkdir -p "src/pages/$lang/$page"
    
    # index.astro
    cat > "src/pages/$lang/$page/index.astro" << EOF
---
/**
 * Страница-заглушка для $lang языка
 * Перенаправляет на английскую версию (fallback)
 */
import { getLocalizedPath } from '@/i18n/utils';

return Astro.redirect(getLocalizedPath('/$page/', 'en'), 307);
---
EOF
    
    # [...slug].astro
    cat > "src/pages/$lang/$page/[...slug].astro" << EOF
---
/**
 * Страница-заглушка для динамических маршрутов $lang языка
 * Перенаправляет на английскую версию (fallback)
 */
import { getLocalizedPath } from '@/i18n/utils';

const slug = Astro.params.slug || '';
return Astro.redirect(getLocalizedPath(\`/$page/\${slug}\`, 'en'), 307);
---
EOF
  done
done

# Создаём главные страницы
for lang in "${LANGS[@]}"; do
  cat > "src/pages/$lang/index.astro" << EOF
---
/**
 * Главная страница-заглушка для $lang языка
 * Перенаправляет на английскую версию (fallback)
 */
import { getLocalizedPath } from '@/i18n/utils';

return Astro.redirect(getLocalizedPath('/', 'en'), 307);
---
EOF
done

echo "✅ Все страницы-заглушки созданы!"
```

## 📋 Ручной способ (пошагово)

Если предпочитаешь создавать вручную, вот порядок действий:

### Пример: Создание `/pt/solutions/`

1. **Создай директорию:**
   ```bash
   mkdir -p src/pages/pt/solutions
   ```

2. **Создай `index.astro`:**
   ```bash
   cat > src/pages/pt/solutions/index.astro << 'EOF'
   ---
   /**
    * Страница-заглушка для португальского языка
    * Перенаправляет на английскую версию (fallback)
    */
   import { getLocalizedPath } from '@/i18n/utils';
   
   return Astro.redirect(getLocalizedPath('/solutions/', 'en'), 307);
   ---
   EOF
   ```

3. **Создай `[...slug].astro`:**
   ```bash
   cat > src/pages/pt/solutions/[...slug].astro << 'EOF'
   ---
   /**
    * Страница-заглушка для динамических маршрутов португальского языка
    * Перенаправляет на английскую версию (fallback)
    */
   import { getLocalizedPath } from '@/i18n/utils';
   
   const slug = Astro.params.slug || '';
   return Astro.redirect(getLocalizedPath(`/solutions/${slug}`, 'en'), 307);
   ---
   EOF
   ```

4. **Проверь:**
   - Открой `/pt/solutions/` в браузере
   - Должен быть редирект (307) на `/en/solutions/`

## ✅ Проверка работы

После создания всех страниц-заглушек проверь:

```bash
# Проверь несколько путей:
curl -I http://localhost:4321/de/expertise/
curl -I http://localhost:4321/pt/solutions/
curl -I http://localhost:4321/es/industries/
curl -I http://localhost:4321/fr/blog/
```

Все должны возвращать `307 Temporary Redirect` и заголовок `Location` с английской версией.

## 🎯 Итоговый результат

После выполнения всех шагов:

- ✅ Все языки с fallback (de, es, fr, pt, it, tr, ar, zh) будут иметь страницы-заглушки
- ✅ Все пути из `/en/` будут доступны через fallback языки
- ✅ При переходе на `/de/about` → редирект на `/en/about`
- ✅ При переходе на `/pt/solutions/nc-programming` → редирект на `/en/solutions/nc-programming`
- ✅ Нет больше 404 ошибок для языков с fallback

## 📝 Примечания

1. **Временное решение:** Страницы-заглушки — это временное решение. Когда будут созданы реальные страницы для конкретного языка, удали заглушку и создай полноценную страницу.

2. **SEO:** Редиректы 307 (Temporary Redirect) не передают SEO-вес, что правильно для временных заглушек.

3. **Производительность:** Редиректы добавляют один дополнительный запрос, но это приемлемо для временного решения.

## 🔄 Когда создавать реальные страницы

Когда будешь готов создать реальные страницы для языка:

1. Удали страницу-заглушку
2. Создай полноценную страницу с контентом
3. Убери язык из `fallback` в `astro.config.mjs`

---

**Дата создания:** 2026-01-06  
**Статус:** В работе
