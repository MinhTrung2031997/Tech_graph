import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { Root } from 'fumadocs-core/page-tree';
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
    <DocsLayout tree={withNotesLink(interview.getPageTree())} {...options} nav={{ ...options.nav, mode: 'top' }}>
      {children}
    </DocsLayout>
  );
}
