import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    client: z.string().optional(),
    industry: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
  }),
});

const expertise = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    relatedServices: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['nc-programming', 'postprocessors', 'simulation', 'other']).default('other'),
    expertise: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),
    pricing: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

const industries = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    services: z.array(z.string()).default([]),
    cases: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  blog,
  cases,
  expertise,
  services,
  industries,
};
