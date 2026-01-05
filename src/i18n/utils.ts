/**
 * i18n утилиты для работы с локализацией
 */

import { ui, defaultLang, languages, isRtl, type Lang, type TranslationKey } from './ui';

// Список всех поддерживаемых языков
export const locales = Object.keys(languages) as Lang[];

/**
 * Получить язык из URL
 */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) {
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
 */
export function getLocalizedPath(currentPath: string, targetLang: Lang): string {
  // Удаляем текущий язык из пути (если есть)
  const pathWithoutLang = currentPath.replace(
    new RegExp(`^/(${locales.join('|')})`),
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
 */
export function getAlternateLinks(currentPath: string, siteUrl: string) {
  // Убираем trailing slash из siteUrl
  const baseUrl = siteUrl.replace(/\/$/, '');
  
  // Очищаем путь от языкового префикса
  const cleanPath = currentPath.replace(
    new RegExp(`^/(${locales.join('|')})`),
    ''
  ) || '/';
  
  return locales.map((lang) => ({
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
