import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, githubRepoUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2.5 font-bold tracking-tight">
          <span className="inline-block size-[22px] rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400" />
          {appName}
        </span>
      ),
      url: '/',
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
