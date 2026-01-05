/**
 * Утилиты для работы с контент-коллекциями с поддержкой i18n
 */

import type { CollectionEntry } from 'astro:content';
import type { Lang } from '@/i18n/utils';

/**
 * Фильтрует контент-коллекцию по языку
 */
export function filterByLang<T extends CollectionEntry<any>>(
  items: T[],
  lang: Lang
): T[] {
  return items.filter((item) => {
    // Если поле lang не указано, считаем что это дефолтный язык (ru)
    const itemLang = item.data.lang || 'ru';
    return itemLang === lang;
  });
}

/**
 * Получает контент для конкретного языка с fallback на дефолтный
 */
export function getContentByLang<T extends CollectionEntry<any>>(
  items: T[],
  lang: Lang,
  fallbackLang: Lang = 'ru'
): T[] {
  const langItems = filterByLang(items, lang);
  
  // Если нет контента для запрошенного языка, возвращаем fallback
  if (langItems.length === 0 && lang !== fallbackLang) {
    return filterByLang(items, fallbackLang);
  }
  
  return langItems;
}

/**
 * Находит контент по slug и языку
 */
export function findContentBySlugAndLang<T extends CollectionEntry<any>>(
  items: T[],
  slug: string,
  lang: Lang,
  fallbackLang: Lang = 'ru'
): T | undefined {
  // Сначала ищем по текущему языку
  const langItem = items.find(
    (item) => item.slug === slug && (item.data.lang || 'ru') === lang
  );
  
  if (langItem) {
    return langItem;
  }
  
  // Если не нашли, ищем fallback
  if (lang !== fallbackLang) {
    return items.find(
      (item) => item.slug === slug && (item.data.lang || 'ru') === fallbackLang
    );
  }
  
  return undefined;
}
