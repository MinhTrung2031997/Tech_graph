import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { Root } from 'fumadocs-core/page-tree';
import { sidebarCardComponents } from '@/components/sidebar-cards';
import { SidebarExpansionProvider, SidebarFolderControls } from '@/components/sidebar-expansion';
import { baseOptions } from '@/lib/layout.shared';
import { interview } from '@/lib/source';

function withNotesLink(tree: Root): Root {
  return {
    ...tree,
    children: [{ type: 'page', name: 'All notes', url: '/notes' }, { type: 'separator', name: 'Interview Prep' }, ...tree.children],
  };
}

export default function Layout({ children }: LayoutProps<'/interview'>) {
  const options = baseOptions();
  return (
    <SidebarExpansionProvider>
      <DocsLayout
        tree={withNotesLink(interview.getPageTree())}
        {...options}
        nav={{ ...options.nav, mode: 'top' }}
        sidebar={{ banner: SidebarFolderControls, components: sidebarCardComponents }}
      >
        {children}
      </DocsLayout>
    </SidebarExpansionProvider>
  );
}
