import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  // Server mode для Docker (SSR)
  // В Astro 5.0 'hybrid' удален, используем 'server' для SSR
  output: 'server',
  
  // Node.js адаптер для Docker
  adapter: node({
    mode: 'standalone',
  }),
  
  // ВАЖНО: Укажи реальный домен перед деплоем (нужен для sitemap и canonical URLs)
  site: 'https://yourdomain.com',
  
  // Интеграции
  integrations: [
    sitemap({
      // Генерируем sitemap только для языков с существующими страницами
      // Остальные языки можно добавить позже, когда будут созданы страницы
      i18n: {
        defaultLocale: 'ru',
        locales: {
          ru: 'ru',
          en: 'en',
          // TODO: Добавить остальные языки когда будут созданы страницы:
          // de: 'de', es: 'es', fr: 'fr', pt: 'pt', it: 'it', tr: 'tr', ar: 'ar', zh: 'zh-Hans'
        },
      },
    }),
  ],
  
  // i18n конфигурация
  // Указываем только те языки, для которых есть страницы
  // Остальные языки можно добавить позже
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'], // Только языки с существующими страницами
    routing: {
      prefixDefaultLocale: false, // ru: /about, остальные: /en/about
    },
    // Fallback для будущих языков (когда будут созданы страницы)
    // fallback: {
    //   en: 'ru',
    //   de: 'en',
    //   es: 'en',
    //   fr: 'en',
    //   pt: 'en',
    //   it: 'en',
    //   tr: 'en',
    //   ar: 'en',
    //   zh: 'en',
    // },
  },
  
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
});
