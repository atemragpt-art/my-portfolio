/**
 * Утилиты для сортировки Content Collections
 */

import type { CollectionEntry } from 'astro:content';

/**
 * Сортировка по featured (featured сначала)
 */
export function sortByFeatured<T extends CollectionEntry<any>>(
  items: T[]
): T[] {
  return items.sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return 0;
  });
}

/**
 * Сортировка по дате публикации (новые сначала)
 */
export function sortByDate<T extends CollectionEntry<any> & { data: { pubDate: Date } }>(
  items: T[]
): T[] {
  return items.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/**
 * Сортировка по категории (порядок задан массивом)
 */
export function sortByCategory<T extends CollectionEntry<any> & { data: { category: string } }>(
  items: T[],
  categoryOrder: string[]
): T[] {
  return items.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.data.category);
    const indexB = categoryOrder.indexOf(b.data.category);
    // Если категория не найдена, ставим в конец
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}
