/// <reference types="astro/client" />

import type { Lang } from '@/i18n/utils';

declare namespace App {
  interface Locals {
    lang: Lang;
  }
}

// ПРИМЕЧАНИЕ: Типизация env-переменных теперь через astro:env в astro.config.mjs
// Этот интерфейс оставлен для обратной совместимости, если где-то ещё используется import.meta.env
// Рекомендуется использовать импорты из 'astro:env/server' или 'astro:env/client'
interface ImportMetaEnv {
  readonly TELEGRAM_BOT_TOKEN?: string;
  readonly TELEGRAM_CHAT_ID?: string;
  readonly SMTP_HOST?: string;
  readonly SMTP_PORT?: string;
  readonly SMTP_SECURE?: string;
  readonly SMTP_USER?: string;
  readonly SMTP_PASS?: string;
  readonly SMTP_FROM?: string;
  readonly SMTP_TO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
