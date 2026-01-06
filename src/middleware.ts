// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { getLangFromUrl, getFallbackLang, getLocalizedPath, defaultLang, type Lang } from '@/i18n/utils';

/**
 * Middleware для SSR режима
 * - Устанавливает i18n context из URL
 * - Обрабатывает fallback для языков без страниц (через Astro i18n fallback)
 * - Обрабатывает базовые ошибки
 */
export const onRequest = defineMiddleware(async (context, next) => {
  try {
    // Определяем язык из URL
    const lang: Lang = getLangFromUrl(context.url);
    
    // Устанавливаем язык в locals для использования в компонентах
    context.locals.lang = lang;
    
    // Продолжаем обработку запроса
    // Astro автоматически обработает fallback согласно конфигурации в astro.config.mjs
    // с fallbackType: 'redirect'
    return await next();
  } catch (error) {
    // Логируем ошибку, но не прерываем запрос
    console.error('Middleware error:', error);
    
    // Устанавливаем дефолтный язык при ошибке
    context.locals.lang = defaultLang;
    
    // Продолжаем обработку с дефолтным языком
    return await next();
  }
});
