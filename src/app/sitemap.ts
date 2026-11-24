import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site-config';

const ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/empresa', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/servicos', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/servicos/preventivas', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/solucoes', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/produtos/proxy', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/produtos/mailhost', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/produtos/samba_ad', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contato', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/termos', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/privacidade', changeFrequency: 'yearly', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
