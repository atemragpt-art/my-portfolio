# UI Components

Компоненты UI библиотеки, использующие дизайн-токены из `@/config/tokens`.

## Button

Кнопка с поддержкой различных вариантов, размеров и иконок.

### Props

- `href?: string` - Если указан, рендерится как `<a>`, иначе `<button>`
- `variant?: 'primary' | 'secondary' | 'outline'` - Вариант стиля (по умолчанию: `primary`)
- `type?: 'button' | 'submit' | 'reset'` - Тип кнопки (по умолчанию: `button`)
- `size?: 'sm' | 'md' | 'lg'` - Размер (по умолчанию: `md`, 48px - Touch Target)
- `icon?: boolean` - Показывать ли слот для иконки
- `iconPosition?: 'left' | 'right'` - Позиция иконки (по умолчанию: `left`)
- `disabled?: boolean` - Отключена ли кнопка
- `ariaLabel?: string` - ARIA метка для доступности
- `class?: string` - Дополнительные CSS классы

### Примеры

```astro
---
import Button from '@/components/ui/Button.astro';
---

<!-- Основная кнопка -->
<Button>Нажми меня</Button>

<!-- Кнопка-ссылка -->
<Button href="/about">О нас</Button>

<!-- Кнопка с иконкой -->
<Button icon iconPosition="right">
  Отправить
  <svg slot="icon" width="20" height="20">...</svg>
</Button>

<!-- Вторичная кнопка -->
<Button variant="secondary">Отмена</Button>

<!-- Кнопка outline -->
<Button variant="outline">Подробнее</Button>

<!-- Маленькая кнопка -->
<Button size="sm">Маленькая</Button>

<!-- Отключенная кнопка -->
<Button disabled>Недоступна</Button>
```

## Input

Поле ввода с поддержкой label, ошибок и доступности.

### Props

- `id: string` - Уникальный ID (обязательно)
- `name: string` - Имя поля (обязательно)
- `label?: string` - Текст метки
- `type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'` - Тип поля
- `placeholder?: string` - Плейсхолдер
- `required?: boolean` - Обязательное поле
- `error?: string` - Текст ошибки
- `value?: string` - Значение поля
- `disabled?: boolean` - Отключено ли поле
- `autocomplete?: string` - Автозаполнение
- `ariaDescribedBy?: string` - ARIA описание
- `class?: string` - Дополнительные CSS классы

### Примеры

```astro
---
import Input from '@/components/ui/Input.astro';
---

<!-- Базовое поле -->
<Input id="name" name="name" label="Имя" />

<!-- Поле с ошибкой -->
<Input
  id="email"
  name="email"
  type="email"
  label="Email"
  required
  error="Введите корректный email"
/>

<!-- Поле с плейсхолдером -->
<Input
  id="phone"
  name="phone"
  type="tel"
  placeholder="+7 (999) 123-45-67"
  label="Телефон"
/>

<!-- Отключенное поле -->
<Input
  id="readonly"
  name="readonly"
  label="Только чтение"
  value="Нельзя изменить"
  disabled
/>
```

## Tag

Тег/чип для категорий, меток и фильтров.

### Props

- `variant?: 'default' | 'primary' | 'outline'` - Вариант стиля (по умолчанию: `default`)
- `size?: 'sm' | 'md'` - Размер (по умолчанию: `md`, 32px)
- `href?: string` - Если указан, рендерится как `<a>`
- `removable?: boolean` - Показывать ли кнопку удаления
- `onRemove?: () => void` - Обработчик удаления (для client-side)
- `ariaLabel?: string` - ARIA метка
- `class?: string` - Дополнительные CSS классы

### Примеры

```astro
---
import Tag from '@/components/ui/Tag.astro';
---

<!-- Базовый тег -->
<Tag>Металлообработка</Tag>

<!-- Тег-ссылка -->
<Tag href="/categories/metal">Металлообработка</Tag>

<!-- Primary тег -->
<Tag variant="primary">Новое</Tag>

<!-- Тег с удалением (требует client-side логику) -->
<Tag removable>Фильтр</Tag>

<!-- Маленький тег -->
<Tag size="sm">Тег</Tag>
```

## Использование дизайн-токенов

Все компоненты используют CSS переменные из `@/config/tokens`:

- `--bg-primary` - Фон основной кнопки
- `--bg-primary-hover` - Фон при наведении
- `--text-primary` - Основной цвет текста
- `--text-secondary` - Вторичный цвет текста
- `--text-on-action` - Текст на кнопке
- `--border-ui` - Цвет границ
- `--border-error` - Цвет ошибок
- `--spacing-*` - Отступы
- `--spacing-radius-*` - Радиусы скругления

## Доступность (A11y)

Все компоненты соответствуют WCAG 2.1 AA:

- ✅ Минимальный размер Touch Target: 48px
- ✅ Правильные ARIA атрибуты
- ✅ Focus states с видимым outline
- ✅ Семантический HTML
- ✅ Поддержка клавиатурной навигации
- ✅ Правильные роли и состояния

## Типографика

Используй систему типографики из `@/config/typography`:

```astro
---
import { getTypographyStyles } from '@/config/typography';
---

<h1 style={getTypographyStyles('heading-xl')}>
  Заголовок XL
</h1>

<p style={getTypographyStyles('body-base')}>
  Основной текст
</p>
```
