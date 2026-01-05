# 📋 Отчет о конфликтах слияния

## Как посмотреть все конфликты

### Вариант 1: Через Cursor UI
1. В диалоге "Merge Conflicts Detected" нажми **"Merge manually"**
2. Cursor откроет все файлы с конфликтами в редакторе
3. Каждый конфликт будет подсвечен с маркерами:
   - `<<<<<<< Current (Your changes)` - твои локальные изменения
   - `=======` - разделитель
   - `>>>>>>> Incoming (Background Agent changes)` - изменения от агента

### Вариант 2: Через терминал
Запусти скрипт:
```bash
chmod +x find-conflicts.sh
./find-conflicts.sh
```

### Вариант 3: Вручную через grep
```bash
# Найти все файлы с конфликтами
grep -r "^<<<<<<< " src/ --include="*.ts" --include="*.astro" --include="*.js"

# Показать номера строк с конфликтами
grep -rn "^<<<<<<< " src/
```

## Типичные файлы с конфликтами

Судя по изменениям, конфликты могут быть в:

1. **src/content/config.ts** - конфигурация контент-коллекций
2. **src/actions/contact-form.ts** - форма контактов
3. **src/components/layout/Header.astro** - шапка сайта
4. **src/components/layout/Footer.astro** - подвал сайта
5. **src/components/layout/Navigation.astro** - навигация
6. **src/layouts/LayoutMain.astro** - основной лейаут
7. **src/pages/blog/[...slug].astro** - страница блога
8. **src/styles/global.css** - глобальные стили
9. **astro.config.mjs** - конфигурация Astro
10. **package.json** - зависимости

## Как разрешить конфликты

### Для каждого файла:

1. **Открой файл** в редакторе
2. **Найди маркеры конфликтов** (`<<<<<<<`, `=======`, `>>>>>>>`)
3. **Выбери нужную версию:**
   - Оставь свои изменения (между `<<<<<<<` и `=======`)
   - Или прими изменения агента (между `=======` и `>>>>>>>`)
   - Или объедини оба варианта вручную
4. **Удали все маркеры** (`<<<<<<<`, `=======`, `>>>>>>>`)
5. **Сохрани файл**

### Пример разрешения конфликта:

**Было:**
```typescript
<<<<<<< Current (Your changes)
const oldCode = "something";
=======
const newCode = "something else";
>>>>>>> Incoming (Background Agent changes)
```

**Стало (выбрали версию агента):**
```typescript
const newCode = "something else";
```

## Быстрое разрешение всех конфликтов

Если хочешь принять все изменения агента:
```bash
# ВНИМАНИЕ: Это перезапишет твои локальные изменения!
git checkout --theirs src/content/config.ts
git checkout --theirs src/actions/contact-form.ts
# ... и так для каждого файла
```

Если хочешь оставить свои изменения:
```bash
git checkout --ours src/content/config.ts
# ... и так для каждого файла
```

## Проверка после разрешения

После разрешения всех конфликтов проверь:
```bash
# Убедись, что маркеров конфликтов больше нет
grep -r "^<<<<<<< " src/ || echo "✅ Все конфликты разрешены!"

# Проверь линтер
npm run build  # или npm run dev
```
