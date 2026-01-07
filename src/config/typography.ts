/**
 * Typography System
 * Система типографики на основе дизайн-токенов
 * Соответствует Figma Text Styles
 */

export const Typography = {
  // Headings - SemiBold (600)
  'heading-xl': {
    fontSize: '64px',
    lineHeight: '110%', // 70.4px
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  'heading-l': {
    fontSize: '48px',
    lineHeight: '120%', // 57.6px
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  'heading-m': {
    fontSize: '32px',
    lineHeight: '125%', // 40px
    fontWeight: 600,
    letterSpacing: '0',
  },
  'heading-s': {
    fontSize: '24px',
    lineHeight: '130%', // 31.2px
    fontWeight: 600,
    letterSpacing: '0',
  },
  // Body - Regular (400)
  'body-large': {
    fontSize: '18px',
    lineHeight: '150%', // 27px
    fontWeight: 400,
    letterSpacing: '0',
  },
  'body-base': {
    fontSize: '16px',
    lineHeight: '150%', // 24px
    fontWeight: 400,
    letterSpacing: '0',
  },
  'body-small': {
    fontSize: '14px',
    lineHeight: '140%', // 19.6px
    fontWeight: 400,
    letterSpacing: '0',
  },
  // UI - Medium (500)
  'ui-button': {
    fontSize: '16px',
    lineHeight: '1.5',
    fontWeight: 500,
    letterSpacing: '0',
    textTransform: 'none' as const,
  },
  'ui-label': {
    fontSize: '14px',
    lineHeight: '1.5',
    fontWeight: 500,
    letterSpacing: '0',
  },
} as const;

export type TypographyVariant = keyof typeof Typography;

/**
 * Получить CSS стили для типографики
 */
export function getTypographyStyles(variant: TypographyVariant): string {
  const styles = Typography[variant];
  return `
    font-size: ${styles.fontSize};
    line-height: ${styles.lineHeight};
    font-weight: ${styles.fontWeight};
    letter-spacing: ${styles.letterSpacing};
    ${styles.textTransform ? `text-transform: ${styles.textTransform};` : ''}
  `;
}

/**
 * Получить Tailwind классы для типографики (если используется Tailwind)
 */
export function getTypographyClasses(variant: TypographyVariant): string {
  const classMap: Record<TypographyVariant, string> = {
    'heading-xl': 'text-[64px] leading-[110%] font-semibold tracking-[-0.02em]',
    'heading-l': 'text-[48px] leading-[120%] font-semibold tracking-[-0.01em]',
    'heading-m': 'text-[32px] leading-[125%] font-semibold',
    'heading-s': 'text-[24px] leading-[130%] font-semibold',
    'body-large': 'text-[18px] leading-[150%] font-normal',
    'body-base': 'text-base leading-[150%] font-normal',
    'body-small': 'text-sm leading-[140%] font-normal',
    'ui-button': 'text-base leading-normal font-medium',
    'ui-label': 'text-sm leading-normal font-medium',
  };
  return classMap[variant];
}
