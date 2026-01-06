/**
 * i18n утилиты для работы с локализацией
 */

import { ui, defaultLang, languages, isRtl, type Lang, type TranslationKey } from './ui';

// Список всех языков с переводами (включая подготовленные для будущего)
export const locales = Object.keys(languages) as Lang[];

/**
 * ВАЖНО: Список языков с настроенным роутингом в astro.config.mjs
 * Синхронизировано с i18n.locales в astro.config.mjs
 * 
 * Все языки добавлены в роутинг с fallback на 'en' для языков без существующих страниц.
 * Это предотвращает 404 при переходе на /de/about и других языковых версиях.
 */
export const routingLocales: Lang[] = ['ru', 'en', 'de', 'es', 'fr', 'pt', 'it', 'tr', 'ar', 'zh'];

/**
 * Маппинг fallback языков (синхронизировано с astro.config.mjs i18n.routing.fallback)
 * Если для языка нет страницы, используется fallback язык
 */
const fallbackMap: Record<Lang, Lang> = {
  ru: 'ru', // Нет fallback (дефолтный язык)
  en: 'en', // Нет fallback
  de: 'en',
  es: 'en',
  fr: 'en',
  pt: 'en',
  it: 'en',
  tr: 'en',
  ar: 'en',
  zh: 'en',
};

/**
 * Получить fallback язык для указанного языка
 */
export function getFallbackLang(lang: Lang): Lang {
  return fallbackMap[lang] || defaultLang;
}

/**
 * Получить язык из URL
 * Проверяет только языки с настроенным роутингом (routingLocales)
 */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  // Проверяем только языки с настроенным роутингом
  if (lang && routingLocales.includes(lang as Lang)) {
    return lang as Lang;
  }
  return defaultLang;
}

/**
 * Перевод строки с поддержкой плейсхолдеров
 * @example t('ru', 'footer.copyright', { year: 2026 })
 */
export function t(
  lang: Lang,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  // Получаем перевод или fallback на дефолтный язык
  let text = ui[lang]?.[key] ?? ui[defaultLang][key] ?? key;
  
  // Заменяем плейсхолдеры {key} на значения
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  
  return text;
}

/**
 * Создать функцию перевода для конкретного языка
 * @example const t = useTranslations('ru'); t('nav.home')
 */
export function useTranslations(lang: Lang) {
  return function translate(
    key: TranslationKey,
    params?: Record<string, string | number>
  ): string {
    return t(lang, key, params);
  };
}

/**
 * Генерация URL для переключения языка
 * Использует только языки с настроенным роутингом (routingLocales)
 */
export function getLocalizedPath(currentPath: string, targetLang: Lang): string {
  // Проверяем, что язык поддерживается в роутинге
  if (!routingLocales.includes(targetLang)) {
    // Если язык не поддерживается, возвращаем дефолтный
    targetLang = defaultLang;
  }
  
  // Удаляем текущий язык из пути (если есть)
  const pathWithoutLang = currentPath.replace(
    new RegExp(`^/(${routingLocales.join('|')})`),
    ''
  ) || '/';
  
  // Для дефолтного языка — без префикса
  if (targetLang === defaultLang) {
    return pathWithoutLang;
  }
  
  return `/${targetLang}${pathWithoutLang}`;
}

/**
 * Получить все локализованные версии текущей страницы (для hreflang)
 * Использует только языки с настроенным роутингом (routingLocales)
 */
export function getAlternateLinks(currentPath: string, siteUrl: string) {
  // Убираем trailing slash из siteUrl
  const baseUrl = siteUrl.replace(/\/$/, '');
  
  // Очищаем путь от языкового префикса (только из routingLocales)
  const cleanPath = currentPath.replace(
    new RegExp(`^/(${routingLocales.join('|')})`),
    ''
  ) || '/';
  
  // Генерируем ссылки только для языков с настроенным роутингом
  return routingLocales.map((lang) => ({
    lang,
    hreflang: lang === 'zh' ? 'zh-Hans' : lang, // Упрощённый китайский
    href: `${baseUrl}${lang === defaultLang ? '' : `/${lang}`}${cleanPath}`,
  }));
}

/**
 * Получить направление текста для языка
 */
export function getDirection(lang: Lang): 'ltr' | 'rtl' {
  return isRtl(lang) ? 'rtl' : 'ltr';
}

/**
 * Получить locale для форматирования дат
 */
export function getDateLocale(lang: Lang): string {
  const localeMap: Record<Lang, string> = {
    ru: 'ru-RU',
    en: 'en-US',
    de: 'de-DE',
    es: 'es-ES',
    fr: 'fr-FR',
    pt: 'pt-BR',
    it: 'it-IT',
    tr: 'tr-TR',
    ar: 'ar-SA',
    zh: 'zh-CN',
  };
  return localeMap[lang];
}

/**
 * Форматирование даты с учётом локали
 */
export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(getDateLocale(lang), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Re-export для удобства
export { defaultLang, languages, isRtl, type Lang, type TranslationKey };
