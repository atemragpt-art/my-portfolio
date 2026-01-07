# Assets Directory

Эта папка содержит оптимизированные медиа-файлы для импорта через `astro:assets`.

**ВАЖНО:** Все изображения и другие медиа-файлы должны находиться в соответствующих папках `src/assets/` во время разработки.

## Структура

- `images/` - изображения (jpg, png, webp, svg) и видео (mp4, webm)
  - `hero/` - изображения и видео для Hero секций
  - `ui/` - UI элементы, иконки
  - `content/` - изображения для контента (блог, кейсы)
  - `logos/` - логотипы
- `fonts/` - шрифты (woff2, woff) - если будут локальные шрифты

## Использование

### Импорт изображения

```astro
---
// Все изображения должны находиться в src/assets/images/
import heroImage from '@/assets/images/hero/hero-bg.jpg';
import { Image } from 'astro:assets';
---

<Image 
  src={heroImage} 
  alt="Описание изображения"
  width={1200}
  height={600}
/>
```

### В Content Collections

В frontmatter MD файлов используй относительный путь:
```markdown
---
heroImage: '../assets/images/post-hero.jpg'
---
```

Затем в компоненте:
```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/assets/images/post-hero.jpg';
---

{post.data.heroImage && (
  <Image 
    src={heroImage} 
    alt={post.data.title}
    width={800}
    height={400}
  />
)}
```

## Использование видео

```astro
---
// Видео из src/assets/images/ можно импортировать напрямую
import heroVideo from '@/assets/images/hero/video.mp4';
---

<video autoplay loop muted playsinline>
  <source src={heroVideo} type="video/mp4" />
</video>
```

**Pro-Tip:** Видео предпочтительнее GIF для Hero секций:
- Меньший размер файла при лучшем качестве
- Поддержка autoplay, loop, muted
- Лучшая производительность в браузере

## Важно

- **Все изображения и видео должны находиться в `src/assets/images/`** во время разработки
- Всегда указывай `width` и `height` для изображений для предотвращения CLS
- Используй `<Image />` из `astro:assets`, а не `<img>` тег
- Изображения из `public/` не оптимизируются - используй `src/assets/`
- Организуй медиа-файлы по папкам (hero/, ui/, content/, logos/)