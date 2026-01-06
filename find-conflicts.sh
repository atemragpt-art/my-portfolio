#!/bin/bash
# Скрипт для поиска всех файлов с конфликтами слияния

echo "🔍 Поиск файлов с конфликтами слияния..."
echo ""

# Поиск файлов с маркерами конфликтов
conflicts=$(find . -type f \( -name "*.ts" -o -name "*.astro" -o -name "*.js" -o -name "*.mjs" -o -name "*.md" -o -name "*.json" -o -name "*.css" \) -exec grep -l "^<<<<<<< " {} \; 2>/dev/null)

if [ -z "$conflicts" ]; then
    echo "✅ Конфликтов не найдено!"
    exit 0
fi

count=$(echo "$conflicts" | wc -l)
echo "⚠️  Найдено файлов с конфликтами: $count"
echo ""
echo "📋 Список файлов:"
echo "$conflicts"
