/**
 * Генерация Schema.org разметки (JSON-LD)
 */

export interface PersonSchema {
  name: string;
  jobTitle?: string;
  description?: string;
  url?: string;
  image?: string;
  sameAs?: string[];
}

export interface ProfessionalServiceSchema {
  name: string;
  description: string;
  provider: {
    name: string;
    url?: string;
  };
  areaServed?: string;
  serviceType?: string;
}

export interface ArticleSchema {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
}

export interface CaseStudySchema {
  name: string;
  description: string;
  image?: string;
  datePublished: string;
  client?: string;
  industry?: string;
}

/**
 * Генерирует JSON-LD для Person
 */
export function generatePersonSchema(data: PersonSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    ...(data.jobTitle && { jobTitle: data.jobTitle }),
    ...(data.description && { description: data.description }),
    ...(data.url && { url: data.url }),
    ...(data.image && { image: data.image }),
    ...(data.sameAs && data.sameAs.length > 0 && { sameAs: data.sameAs }),
  };

  return JSON.stringify(schema);
}

/**
 * Генерирует JSON-LD для ProfessionalService
 */
export function generateProfessionalServiceSchema(data: ProfessionalServiceSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: data.name,
    description: data.description,
    provider: {
      '@type': 'Organization',
      name: data.provider.name,
      ...(data.provider.url && { url: data.provider.url }),
    },
    ...(data.areaServed && { areaServed: data.areaServed }),
    ...(data.serviceType && { serviceType: data.serviceType }),
  };

  return JSON.stringify(schema);
}

/**
 * Генерирует JSON-LD для Article
 */
export function generateArticleSchema(data: ArticleSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    ...(data.image && { image: data.image }),
    datePublished: data.datePublished,
    ...(data.dateModified && { dateModified: data.dateModified }),
    author: {
      '@type': 'Person',
      name: data.author.name,
      ...(data.author.url && { url: data.author.url }),
    },
  };

  return JSON.stringify(schema);
}

/**
 * Генерирует JSON-LD для CaseStudy (CreativeWork)
 */
export function generateCaseStudySchema(data: CaseStudySchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.name,
    description: data.description,
    ...(data.image && { image: data.image }),
    datePublished: data.datePublished,
    ...(data.client && { about: { '@type': 'Thing', name: data.client } }),
    ...(data.industry && { genre: data.industry }),
  };

  return JSON.stringify(schema);
}

/**
 * Генерирует JSON-LD для Organization (для главной страницы)
 */
export interface OrganizationSchema {
  name: string;
  description: string;
  url: string;
  logo?: string;
  contactPoint?: {
    telephone?: string;
    contactType: string;
    email?: string;
  };
}

export function generateOrganizationSchema(data: OrganizationSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    description: data.description,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...(data.contactPoint.telephone && { telephone: data.contactPoint.telephone }),
        contactType: data.contactPoint.contactType,
        ...(data.contactPoint.email && { email: data.contactPoint.email }),
      },
    }),
  };

  return JSON.stringify(schema);
}
