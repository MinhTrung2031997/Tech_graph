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
    href: '/english/interview/microservice-benefits',
    pages: [
      { title: 'Microservice benefits', href: '/english/interview/microservice-benefits' },
      { title: 'About You & Your Background', href: '/english/interview/about-you' },
      { title: 'Teamwork & Collaboration', href: '/english/interview/teamwork' },
      { title: 'Problem Solving & Pressure', href: '/english/interview/problem-solving' },
      { title: 'Company & Culture Alignment', href: '/english/interview/company-culture' },
      { title: 'Growth & Learning', href: '/english/interview/growth' },
      { title: 'Work Style & Process', href: '/english/interview/work-style' },
      { title: 'Ownership & Initiative', href: '/english/interview/ownership' },
      { title: 'Closing', href: '/english/interview/closing' },
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
