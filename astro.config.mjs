import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
// В Astro 5 hybrid mode реализуется через prerender на уровне страниц
// Используем output: 'static' по умолчанию, отдельные страницы могут быть server-side
export default defineConfig({
  output: 'static',
  // TODO: Раскомментируй и укажи реальный домен перед деплоем
  // site: 'https://yourdomain.com',
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
  // Автоматическая генерация sitemap
  // Astro автоматически создаст sitemap.xml при сборке
});
