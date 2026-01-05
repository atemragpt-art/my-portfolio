/**
 * SEO утилиты для генерации meta тегов и структурированных данных
 */

// Интерфейс оставлен для будущего использования при расширении SEO функционала
export interface SEOProps {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}
