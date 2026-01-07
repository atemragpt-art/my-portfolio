import { defineConfig, envField } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Определяем окружение для dual-deploy
// Vercel автоматически устанавливает VERCEL=1 при сборке
const isVercel = process.env.VERCEL === '1';

// https://astro.build/config
export default defineConfig({
  // Server mode для Docker (SSR)
  // В Astro 5.0 'hybrid' удален, используем 'server' для SSR
  output: 'server',
  
  // Динамический выбор адаптера для dual-deploy
  // VPS (РФ): @astrojs/node в standalone-режиме
  // Vercel (Мир): @astrojs/vercel/serverless для serverless функций
  // Для edge функций используй: import vercel from '@astrojs/vercel/edge'
  adapter: isVercel 
    ? vercel() // Vercel: serverless (или vercel из '@astrojs/vercel/edge' для edge functions)
    : node({ mode: 'standalone' }),  // VPS: standalone
  
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
      // Sitemap для всех языков (fallback настроен в i18n.routing.fallback)
      i18n: {
        defaultLocale: 'ru',
        locales: {
          ru: 'ru',
          en: 'en',
          de: 'de',
          es: 'es',
          fr: 'fr',
          pt: 'pt',
          it: 'it',
          tr: 'tr',
          ar: 'ar',
          zh: 'zh-Hans', // Упрощённый китайский для sitemap
        },
      },
    }),
  ],
  
  // i18n конфигурация
  // Все языки добавлены в роутинг с fallback на 'en' для языков без страниц
  // Это предотвращает 404 при переходе на /de/about и других языковых версиях
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en', 'de', 'es', 'fr', 'pt', 'it', 'tr', 'ar', 'zh'],
    routing: {
      prefixDefaultLocale: false, // ru: /about, остальные: /en/about
      // Fallback на 'en' для языков без существующих страниц
      // Когда будут созданы страницы для конкретного языка, можно убрать его из fallback
      fallback: {
        de: 'en',
        es: 'en',
        fr: 'en',
        pt: 'en',
        it: 'en',
        tr: 'en',
        ar: 'en',
        zh: 'en',
      },
      // Тип fallback: 'redirect' перенаправляет на fallback язык, 'rewrite' показывает контент без изменения URL
      fallbackType: 'redirect',
    },
  },
  
  // Настройки оптимизации изображений
  image: {
    // ВАЖНО: Все изображения должны находиться в src/assets/images/ во время разработки
    // Remote images - настрой паттерны только если действительно нужны внешние изображения
    // Поддерживает wildcards: *.example.com для поддоменов, **.example.com для всех уровней
    remotePatterns: [
      // Примеры (раскомментируй и добавь свои домены только при необходимости):
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
