import { createSearchAPI } from 'fumadocs-core/search/server';
import type { StructuredData } from 'fumadocs-core/mdx-plugins';
import { blogs, english, interview, notes } from '@/lib/source';

export const { GET } = createSearchAPI('advanced', {
  indexes: async () => {
    const pages = [...notes.getPages(), ...interview.getPages(), ...blogs.getPages(), ...english.getPages()];
    return Promise.all(
      pages.map(async (page) => {
        const raw = page.data.structuredData as StructuredData | (() => Promise<StructuredData>) | undefined;
        const structuredData: StructuredData = typeof raw === 'function' ? await raw() : (raw ?? { headings: [], contents: [] });
        return {
          id: page.url,
          title: page.data.title,
          description: page.data.description,
          url: page.url,
          structuredData,
        };
      }),
    );
  },
});
