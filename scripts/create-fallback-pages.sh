#!/bin/bash

# Скрипт для создания страниц-заглушек для языков с fallback
# Использование: bash scripts/create-fallback-pages.sh

set -e

echo "🚀 Создание страниц-заглушек для языков с fallback..."

# Языки с fallback
LANGS=("de" "es" "fr" "pt" "it" "tr" "ar" "zh")

# Статические страницы
STATIC_PAGES=("about" "contact" "faq" "hr" "privacy" "terms")

# Страницы со списками (нужны index + динамический маршрут)
LIST_PAGES=("blog" "cases" "expertise" "industries" "solutions")

# Создаём статические страницы
echo "📄 Создание статических страниц..."
for lang in "${LANGS[@]}"; do
  for page in "${STATIC_PAGES[@]}"; do
    mkdir -p "src/pages/$lang/$page"
    
    # Пропускаем, если файл уже существует
    if [ -f "src/pages/$lang/$page/index.astro" ]; then
      echo "  ⏭️  Пропущено: src/pages/$lang/$page/index.astro (уже существует)"
      continue
    fi
    
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
    echo "  ✅ Создано: src/pages/$lang/$page/index.astro"
  done
done

# Создаём страницы со списками (index + динамический маршрут)
echo "📚 Создание страниц со списками..."
for lang in "${LANGS[@]}"; do
  for page in "${LIST_PAGES[@]}"; do
    mkdir -p "src/pages/$lang/$page"
    
    # index.astro
    if [ ! -f "src/pages/$lang/$page/index.astro" ]; then
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
      echo "  ✅ Создано: src/pages/$lang/$page/index.astro"
    else
      echo "  ⏭️  Пропущено: src/pages/$lang/$page/index.astro (уже существует)"
    fi
    
    # [...slug].astro
    if [ ! -f "src/pages/$lang/$page/[...slug].astro" ]; then
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
      echo "  ✅ Создано: src/pages/$lang/$page/[...slug].astro"
    else
      echo "  ⏭️  Пропущено: src/pages/$lang/$page/[...slug].astro (уже существует)"
    fi
  done
done

# Создаём главные страницы
echo "🏠 Создание главных страниц..."
for lang in "${LANGS[@]}"; do
  if [ ! -f "src/pages/$lang/index.astro" ]; then
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
    echo "  ✅ Создано: src/pages/$lang/index.astro"
  else
    echo "  ⏭️  Пропущено: src/pages/$lang/index.astro (уже существует)"
  fi
done

echo ""
echo "✅ Все страницы-заглушки созданы!"
echo ""
echo "📋 Следующие шаги:"
echo "  1. Перезапусти dev-сервер: npm run dev"
echo "  2. Проверь работу: открой /pt/solutions/ в браузере"
echo "  3. Должен быть редирект (307) на /en/solutions/"
echo ""
