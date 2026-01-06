// PostCSS конфигурация для Tailwind CSS 4
// 
// ПРИМЕЧАНИЕ: Для Tailwind 4+ также можно использовать @tailwindcss/vite плагин
// напрямую в astro.config.mjs (альтернативный подход):
//   import tailwind from '@tailwindcss/vite';
//   vite: { plugins: [tailwind()] }
//
// Текущий подход через PostCSS также корректен и работает стабильно.
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
