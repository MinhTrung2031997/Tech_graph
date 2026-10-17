import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { Root } from 'fumadocs-core/page-tree';
import { baseOptions } from '@/lib/layout.shared';
import { notes } from '@/lib/source';

function withInterviewLinks(tree: Root): Root {
  return {
    ...tree,
    children: [
      ...tree.children,
      { type: 'separator', name: 'Interview Prep' },
      { type: 'page', name: 'Self-Introduction', url: '/interview/self-introduction' },
      { type: 'page', name: 'STAR Stories', url: '/interview/star' },
      { type: 'page', name: 'Answers', url: '/interview/answers' },
      { type: 'page', name: 'Study Checklists', url: '/interview/checklists' },
    ],
  };
}

export default function Layout({ children }: LayoutProps<'/notes'>) {
  const options = baseOptions();
  return (
    <DocsLayout tree={withInterviewLinks(notes.getPageTree())} {...options} nav={{ ...options.nav, mode: 'top' }}>
      {children}
    </DocsLayout>
  );
}
