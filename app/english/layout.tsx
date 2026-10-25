'use client';

import { EnglishHashScroll, englishSidebarComponents } from '@/components/english-sidebar';
import { SidebarExpansionProvider, SidebarFolderControls } from '@/components/sidebar-expansion';
import { DocsHeaderMeasure } from '@/components/docs-header-measure';
import { SidebarResize } from '@/components/sidebar-resize';
import { englishSetForPath, englishSets, englishTree } from '@/lib/english';
import { baseOptions } from '@/lib/layout.shared';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const set = englishSetForPath(pathname) ?? englishSets[0];
  const tree = useMemo(() => englishTree(set), [set]);
  const options = baseOptions();

  return (
    <SidebarExpansionProvider>
      <DocsLayout
        tree={tree}
        {...options}
        nav={{ ...options.nav, mode: 'top' }}
        sidebar={{ banner: SidebarFolderControls, components: englishSidebarComponents }}
      >
        <SidebarResize />
        <DocsHeaderMeasure />
        <EnglishHashScroll />
        {children}
      </DocsLayout>
    </SidebarExpansionProvider>
  );
}
