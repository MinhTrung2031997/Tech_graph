import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Tech Notes';
export const authorName = 'Trung Nguyen';
export const githubUser = 'MinhTrung2031997';
export const githubRepo = 'Tech_graph';
export const notesRoute = '/notes';
export const interviewRoute = '/interview';
export const notesImageRoute = '/og/notes';

export const gitConfig = {
  user: githubUser,
  repo: githubRepo,
  branch: 'main',
};

export function githubRepoUrl() {
  return `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
}

export function githubFileUrl(collection: 'notes' | 'interview', filePath: string) {
  return `${githubRepoUrl()}/blob/${gitConfig.branch}/content/${collection}/${filePath}`;
}

const getImageUrl = createGetUrl(notesImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: getImageUrl(segments, page.locale) };
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
}
