import { ContentSearch, ContentSearchIcon } from '@/components/font-size-control';
import { NotesSwitcher } from '@/components/notes-switcher';
import fireMark from '@/app/icon.png';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { appName, githubRepoUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2.5 whitespace-nowrap font-bold tracking-tight">
          <Image src={fireMark} alt="" width={22} height={22} className="size-[22px] shrink-0" />
          {appName}
        </span>
      ),
      url: '/notes',
      // The header renders nav children inside a list, so the element needs a key.
      children: <NotesSwitcher key="notes-switcher" />,
    },
    githubUrl: githubRepoUrl(),
    slots: {
      searchTrigger: {
        full: ContentSearch,
        sm: ContentSearchIcon,
      },
    },
    links: [
      { text: 'Tech Blogs', url: '/blogs', active: 'nested-url' },
      { text: 'Health', url: '/health' },
      { text: 'Graph', url: '/graph' },
      { text: 'About', url: '/about' },
    ],
  };
}
