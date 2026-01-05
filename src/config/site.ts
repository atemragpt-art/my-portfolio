/**
 * Конфигурация сайта
 * Централизованное место для констант сайта
 */

export const SITE_CONFIG = {
  name: 'Expert Team',
  description: 'Эксперты в области NC программирования, постпроцессоров и симуляции ЧПУ',
  defaultAuthor: {
    name: 'Expert Team',
    // URL будет формироваться динамически на основе Astro.site
  },
} as const;
