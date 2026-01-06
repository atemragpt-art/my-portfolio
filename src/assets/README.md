# Assets Directory

Эта папка содержит оптимизированные медиа-файлы для импорта через `astro:assets`.

## Структура

- `images/` - изображения (jpg, png, webp, svg)
- `fonts/` - шрифты (woff2, woff) - если будут локальные шрифты

## Использование

### Импорт изображения

```astro
---
import heroImage from '@/assets/images/hero.jpg';
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

## Важно

- Всегда указывай `width` и `height` для предотвращения CLS
- Используй `<Image />` из `astro:assets`, а не `<img>` тег
- Изображения из `public/` не оптимизируются - используй `src/assets/`
