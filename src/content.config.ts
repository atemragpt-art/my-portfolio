// src/content.config.ts
// Content Layer API (новый API для Astro 5+)
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro:schema';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.enum(['ru', 'en', 'de', 'es', 'fr', 'pt', 'it', 'tr', 'ar', 'zh']).default('ru'),
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    client: z.string().optional(),
    industry: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    role: z.string().optional(), // Роль в проекте
    keyResults: z.array(z.string()).default([]), // Ключевые результаты
    lang: z.enum(['ru', 'en', 'de', 'es', 'fr', 'pt', 'it', 'tr', 'ar', 'zh']).default('ru'),
  }),
});

const expertise = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/expertise' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    relatedServices: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    lang: z.enum(['ru', 'en', 'de', 'es', 'fr', 'pt', 'it', 'tr', 'ar', 'zh']).default('ru'),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['nc-programming', 'postprocessors', 'simulation', 'other']).default('other'),
    expertise: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),
    pricing: z.string().optional(),
    heroImage: z.string().optional(),
    lang: z.enum(['ru', 'en', 'de', 'es', 'fr', 'pt', 'it', 'tr', 'ar', 'zh']).default('ru'),
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/industries' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    services: z.array(z.string()).default([]),
    cases: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    lang: z.enum(['ru', 'en', 'de', 'es', 'fr', 'pt', 'it', 'tr', 'ar', 'zh']).default('ru'),
  }),
});

export const collections = {
  blog,
  cases,
  expertise,
  services,
  industries,
};
