/**
 * Design Tokens для Astro проекта
 * Централизованная система дизайн-токенов на основе Figma Variables
 * 
 * Структура:
 * - Primitives: базовые значения (цвета, spacing, radius)
 * - Tokens: семантические токены, ссылающиеся на Primitives
 * 
 * Примеры использования:
 * 
 * 1. В TypeScript/TSX компонентах:
 *    import { Tokens, Primitives, Spacing } from '@/config/tokens';
 *    <div style={{ backgroundColor: Tokens.Background['bg-page'] }} />
 *    <div style={{ padding: `${Spacing[16]}px` }} />
 * 
 * 2. В Astro компонентах (inline styles):
 *    ---
 *    import { Tokens, Spacing } from '@/config/tokens';
 *    ---
 *    <div style={`background-color: ${Tokens.Background['bg-page']}; padding: ${Spacing[16]}px;`}>
 * 
 * 3. В CSS (через CSS переменные):
 *    .my-component {
 *      background-color: var(--bg-page);
 *      padding: var(--spacing-16);
 *      border: 1px solid var(--border-ui);
 *    }
 * 
 * 4. В Tailwind (через theme в tailwind.config):
 *    Используй CSS переменные напрямую или добавь в theme.extend
 */

// ========================================
// Primitives - Базовые значения
// ========================================

export const Primitives = {
  Brand: {
    300: '#7DD3FC',
    400: '#38BDF8', // Accessible text on dark
    500: '#0EA5E9',
    600: '#0284C7',
  },
  Neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    400: '#9CA3AF',
    500: '#6B7280',
    900: '#111827',
  },
  Status: {
    error: '#EF4444',
  },
  Overlay: {
    scrim: '#00000066', // Black with 40% Alpha
  },
} as const;

export const Spacing = {
  0: 0,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  48: 48,
  64: 64,
  80: 80,
  'radius-md': 8,
  'radius-lg': 12,
  'radius-full': 999,
} as const;

// ========================================
// Tokens - Семантические токены
// ========================================

export const Tokens = {
  Background: {
    'bg-page': Primitives.Neutral[900],
    'bg-surface': Primitives.Neutral[900],
  },
  Action: {
    'bg-primary': Primitives.Brand[500],
    'bg-primary-hover': Primitives.Brand[600],
  },
  Text: {
    'text-primary': Primitives.Neutral[0],
    'text-secondary': Primitives.Neutral[400],
    'text-brand': Primitives.Brand[400],
    'text-on-action': Primitives.Neutral[0],
  },
  Border: {
    'border-ui': Primitives.Neutral[200],
    'border-error': Primitives.Status.error,
  },
} as const;

// ========================================
// CSS Variables для использования в стилях
// ========================================

/**
 * Генерирует CSS переменные из токенов
 * Использование: добавить в global.css или в <style> блок
 */
export function generateCSSVariables(): string {
  const cssVars: string[] = [];

  // Primitives - Brand
  Object.entries(Primitives.Brand).forEach(([key, value]) => {
    cssVars.push(`  --color-brand-${key}: ${value};`);
  });

  // Primitives - Neutral
  Object.entries(Primitives.Neutral).forEach(([key, value]) => {
    cssVars.push(`  --color-neutral-${key}: ${value};`);
  });

  // Primitives - Status
  Object.entries(Primitives.Status).forEach(([key, value]) => {
    cssVars.push(`  --color-status-${key}: ${value};`);
  });

  // Primitives - Overlay
  Object.entries(Primitives.Overlay).forEach(([key, value]) => {
    cssVars.push(`  --color-overlay-${key}: ${value};`);
  });

  // Spacing
  Object.entries(Spacing).forEach(([key, value]) => {
    const cssKey = key.replace(/-/g, '-');
    cssVars.push(`  --spacing-${cssKey}: ${value}px;`);
  });

  // Tokens - Background
  Object.entries(Tokens.Background).forEach(([key, value]) => {
    cssVars.push(`  --${key}: ${value};`);
  });

  // Tokens - Action
  Object.entries(Tokens.Action).forEach(([key, value]) => {
    cssVars.push(`  --${key}: ${value};`);
  });

  // Tokens - Text
  Object.entries(Tokens.Text).forEach(([key, value]) => {
    cssVars.push(`  --${key}: ${value};`);
  });

  // Tokens - Border
  Object.entries(Tokens.Border).forEach(([key, value]) => {
    cssVars.push(`  --${key}: ${value};`);
  });

  return `:root {\n${cssVars.join('\n')}\n}`;
}

// ========================================
// TypeScript типы для типобезопасности
// ========================================

export type BrandColor = keyof typeof Primitives.Brand;
export type NeutralColor = keyof typeof Primitives.Neutral;
export type StatusColor = keyof typeof Primitives.Status;
export type OverlayColor = keyof typeof Primitives.Overlay;
export type SpacingValue = keyof typeof Spacing;
export type BackgroundToken = keyof typeof Tokens.Background;
export type ActionToken = keyof typeof Tokens.Action;
export type TextToken = keyof typeof Tokens.Text;
export type BorderToken = keyof typeof Tokens.Border;

// ========================================
// Утилиты для работы с токенами
// ========================================

/**
 * Получить цвет из примитивов
 */
export function getPrimitiveColor(
  category: 'Brand' | 'Neutral' | 'Status' | 'Overlay',
  key: string
): string {
  const categoryMap = {
    Brand: Primitives.Brand,
    Neutral: Primitives.Neutral,
    Status: Primitives.Status,
    Overlay: Primitives.Overlay,
  };

  return (categoryMap[category] as Record<string, string>)[key] || '';
}

/**
 * Получить spacing значение
 */
export function getSpacing(key: SpacingValue): number {
  return Spacing[key];
}

/**
 * Получить семантический токен
 */
export function getToken(
  category: 'Background' | 'Action' | 'Text' | 'Border',
  key: string
): string {
  const categoryMap = {
    Background: Tokens.Background,
    Action: Tokens.Action,
    Text: Tokens.Text,
    Border: Tokens.Border,
  };

  return (categoryMap[category] as Record<string, string>)[key] || '';
}
