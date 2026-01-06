import { defineConfig, envField } from 'astro/config';
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
  
  // Типобезопасные env-переменные с валидацией
  env: {
    validateSecrets: true, // Fail-fast: приложение не стартует, если секреты не заданы
    schema: {
      // Telegram Bot API
      TELEGRAM_BOT_TOKEN: envField.string({ 
        context: 'server', 
        access: 'secret',
        optional: true, // Опционально, так как может использоваться только Email
      }),
      TELEGRAM_CHAT_ID: envField.string({ 
        context: 'server', 
        access: 'secret',
        optional: true,
      }),
      // SMTP настройки
      SMTP_HOST: envField.string({ 
        context: 'server', 
        access: 'secret',
        optional: true,
      }),
      SMTP_PORT: envField.string({ 
        context: 'server', 
        access: 'secret',
        optional: true,
        default: '587',
      }),
      SMTP_SECURE: envField.string({ 
        context: 'server', 
        access: 'secret',
        optional: true,
        default: 'false',
      }),
      SMTP_USER: envField.string({ 
        context: 'server', 
        access: 'secret',
        optional: true,
      }),
      SMTP_PASS: envField.string({ 
        context: 'server', 
        access: 'secret',
        optional: true,
      }),
      SMTP_FROM: envField.string({ 
        context: 'server', 
        access: 'secret',
        optional: true,
      }),
      SMTP_TO: envField.string({ 
        context: 'server', 
        access: 'secret',
        optional: true,
      }),
    },
  },
  
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
  
  // Настройки оптимизации изображений
  image: {
    // Remote images - настрой паттерны для доменов, с которых будут загружаться изображения
    // Поддерживает wildcards: *.example.com для поддоменов, **.example.com для всех уровней
    remotePatterns: [
      // Примеры (раскомментируй и добавь свои домены):
      // { protocol: 'https', hostname: 'example.com' },
      // { protocol: 'https', hostname: '*.example.com' }, // Все поддомены
      // { protocol: 'https', hostname: '**.cdn.example.com' }, // Все уровни поддоменов
    ],
  },
  
  // Безопасность
  security: {
    checkOrigin: true, // CSRF protection включен по умолчанию в Astro 5, но явно указываем для ясности
  },
  
  vite: {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
});
