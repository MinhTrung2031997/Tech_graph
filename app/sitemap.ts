import type { MetadataRoute } from 'next';
import { allTags } from '@/lib/content';
import { englishPaths } from '@/lib/english';
import { interview, notes } from '@/lib/source';
import { siteUrl } from '@/lib/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const staticRoutes = ['/about', '/review', '/tags', '/notes', '/interview'];
  const noteRoutes = notes.getPages().map((page) => page.url);
  const interviewRoutes = interview.getPages().map((page) => page.url);
  const tagRoutes = allTags().map(({ tag }) => `/tags/${tag}`);

  return [...staticRoutes, ...noteRoutes, ...interviewRoutes, ...englishPaths(), ...tagRoutes].map((path) => ({
    url: `${base}${path}`,
  }));
}
