import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://failms.org';

const staticPages = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/chi-siamo', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/contatti', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/settori', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/news', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/servizi', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/servizi/caf', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/servizi/patronato', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/servizi/legale', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/servizi/inquilinato', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/servizi/consumatori', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/servizi/vertenze', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/servizi/istituto-studi', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/contrattazione', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/contrattazione/nazionale', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contrattazione/secondo-livello', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contrattazione/aziendale', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/cookie', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/termini', priority: 0.3, changeFrequency: 'yearly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const page of staticPages) {
    entries.push({
      url: `${BASE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  try {
    // Dynamic news pages
    const news = await prisma.news.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    });

    for (const item of news) {
      entries.push({
        url: `${BASE_URL}/news/${item.slug}`,
        lastModified: item.updatedAt || item.publishedAt || now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return entries;
}
