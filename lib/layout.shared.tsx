import { NotesSwitcher } from '@/components/notes-switcher';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, githubRepoUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2.5 whitespace-nowrap font-bold tracking-tight">
          <span className="inline-block size-[22px] shrink-0 rounded-md bg-[#818cf8]" />
          <span className="max-sm:sr-only">{appName}</span>
        </span>
      ),
      url: '/',
      children: <NotesSwitcher />,
    },
    githubUrl: githubRepoUrl(),
    links: [
      { text: 'Notes', url: '/notes', active: 'nested-url' },
      { text: 'Interview Prep', url: '/interview', active: 'nested-url' },
      { text: 'Quick Review', url: '/review' },
      { text: 'Tags', url: '/tags', active: 'nested-url' },
      { text: 'About', url: '/about' },
    ],
  };
}
