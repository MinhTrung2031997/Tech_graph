import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { sidebarCardComponents } from '@/components/sidebar-cards';
import { SidebarExpansionProvider, SidebarFolderControls } from '@/components/sidebar-expansion';
import { SidebarResize } from '@/components/sidebar-resize';
import { baseOptions } from '@/lib/layout.shared';
import { blogs } from '@/lib/source';

export default function Layout({ children }: LayoutProps<'/blogs'>) {
  const options = baseOptions();
  return (
    <SidebarExpansionProvider>
      <DocsLayout
        tree={blogs.getPageTree()}
        {...options}
        nav={{ ...options.nav, mode: 'top' }}
        sidebar={{ banner: SidebarFolderControls, components: sidebarCardComponents }}
      >
        <SidebarResize />
        {children}
      </DocsLayout>
    </SidebarExpansionProvider>
  );
}
