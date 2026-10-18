import type { Root } from 'fumadocs-core/page-tree';

export interface EnglishPage {
  title: string;
  href: string;
}

export interface EnglishSet {
  id: string;
  title: string;
  hint: string;
  prefix: string;
  href: string;
  pages: EnglishPage[];
}

export const englishSets: EnglishSet[] = [
  {
    id: 'interview',
    title: 'English Interview',
    hint: 'answers, self-introduction, interview phrases',
    prefix: '/english/interview',
    href: '/english/interview/self-introduction',
    pages: [
      { title: 'Self introduction', href: '/english/interview/self-introduction' },
      { title: 'Behavioral answers', href: '/english/interview/behavioral-answers' },
      { title: 'Technical answers', href: '/english/interview/technical-answers' },
    ],
  },
  {
    id: 'daily',
    title: 'English Daily',
    hint: 'everyday speaking and small talk',
    prefix: '/english/daily',
    href: '/english/daily',
    pages: [{ title: 'English Daily', href: '/english/daily' }],
  },
  {
    id: 'workplace',
    title: 'Workplace',
    hint: 'standups, meetings, and Slack',
    prefix: '/english/workplace',
    href: '/english/workplace',
    pages: [{ title: 'Workplace', href: '/english/workplace' }],
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    hint: 'words and phrases worth keeping',
    prefix: '/english/vocabulary',
    href: '/english/vocabulary',
    pages: [{ title: 'Vocabulary', href: '/english/vocabulary' }],
  },
];

export function englishSetForPath(pathname: string) {
  const path = pathname.split(/[?#]/)[0] ?? pathname;
  return englishSets.find((set) => path === set.prefix || path.startsWith(`${set.prefix}/`));
}

export function englishTitleForSlug(slug: string[]) {
  const path = `/english/${slug.join('/')}`;
  for (const set of englishSets) {
    const page = set.pages.find((item) => item.href === path);
    if (page) return page.title;
  }
  return undefined;
}

export function englishPaths() {
  return englishSets.flatMap((set) => set.pages.map((page) => page.href));
}

export function englishTree(set: EnglishSet): Root {
  return {
    name: set.title,
    children: [
      { type: 'separator', name: set.title },
      ...set.pages.map((page) => ({
        type: 'page' as const,
        name: page.title,
        url: page.href,
      })),
    ],
  };
}
