import { findNeighbour } from 'fumadocs-core/page-tree';
import { domainBySlug, domains } from './domains';
import { interview, notes, type NotePage } from './source';

export function formatReviewed(iso?: string) {
  if (!iso) return undefined;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatShortDate(iso?: string) {
  if (!iso) return undefined;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function daysSince(iso?: string, now = Date.now()) {
  if (!iso) return undefined;
  const time = new Date(`${iso}T00:00:00Z`).getTime();
  if (Number.isNaN(time)) return undefined;
  return Math.floor((now - time) / 86_400_000);
}

/** Oldest `lastReviewed` first; notes without one sort before all dated notes. */
export function byLastReviewed(a: NotePage, b: NotePage) {
  return (a.data.lastReviewed ?? '').localeCompare(b.data.lastReviewed ?? '');
}

export function isNotePage(page: NotePage) {
  return page.slugs.length > 1 && page.data.type !== 'domain';
}

export function allNotes() {
  return notes.getPages().filter(isNotePage);
}

export function notesInDomain(slug: string) {
  return allNotes()
    .filter((page) => page.slugs[0] === slug)
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function orderedNotesInDomain(slug: string) {
  const folder = notes.getPageTree().children.find((node) => {
    return node.type === 'folder' && (node.index?.url === `/notes/${slug}` || node.$id?.includes(slug));
  });

  if (!folder || folder.type !== 'folder') return notesInDomain(slug);

  const byUrl = new Map(allNotes().map((page) => [page.url, page]));
  const ordered: NotePage[] = [];

  const walk = (nodes: typeof folder.children) => {
    for (const node of nodes) {
      if (node.type === 'page') {
        const page = byUrl.get(node.url);
        if (page) ordered.push(page);
      } else if (node.type === 'folder') {
        if (node.index) {
          const page = byUrl.get(node.index.url);
          if (page) ordered.push(page);
        }
        walk(node.children);
      }
    }
  };

  walk(folder.children);
  return ordered.length > 0 ? ordered : notesInDomain(slug);
}

export function domainStats() {
  return domains.map((domain) => {
    const pages = allNotes().filter((page) => page.slugs[0] === domain.slug);
    const reviewed = pages.filter((page) => page.data.status === 'reviewed').length;
    const percent = pages.length === 0 ? 0 : Math.round((reviewed / pages.length) * 100);
    return { ...domain, noteCount: pages.length, reviewed, percent };
  });
}

export function interviewPriorityNotes() {
  return allNotes()
    .filter((page) => page.data.interviewPriority)
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function recentlyUpdated(limit = 5) {
  return allNotes()
    .filter((page) => page.data.lastReviewed)
    .sort((a, b) => (b.data.lastReviewed ?? '').localeCompare(a.data.lastReviewed ?? ''))
    .slice(0, limit);
}

export function allTags() {
  const counts = new Map<string, number>();
  for (const page of allNotes()) {
    for (const tag of page.data.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function notesForTag(tag: string) {
  return allNotes()
    .filter((page) => (page.data.tags ?? []).includes(tag))
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function relatedNotes(page: NotePage) {
  return (page.data.related ?? []).flatMap((slug) => {
    const match = notes.getPage(slug.split('/').filter(Boolean));
    return match ? [match] : [];
  });
}

export function noteNeighbours(url: string) {
  return findNeighbour(notes.getPageTree(), url);
}

export function domainLabel(slug?: string) {
  if (!slug) return undefined;
  const domain = domainBySlug(slug);
  if (!domain) return slug;
  return `${domain.number} · ${domain.title}`;
}

export function shortDomain(slug?: string) {
  return slug ? domainBySlug(slug)?.title : undefined;
}

export function contentStats() {
  const pages = allNotes();
  const priorities = pages.filter((page) => page.data.interviewPriority).length;
  const reviewedDates = pages.map((page) => page.data.lastReviewed).filter((value): value is string => Boolean(value));
  const latest = reviewedDates.sort().at(-1);
  return {
    notes: pages.length,
    domains: domains.length,
    priorities,
    latest,
  };
}

export function interviewPages() {
  return interview.getPages();
}

export interface GraphNode {
  url: string;
  title: string;
  domain: string;
  placeholder: boolean;
}

export interface GraphEdge {
  source: number;
  target: number;
  kind: 'related' | 'tag';
  weight: number;
}

/** Notes as nodes; explicit `related` links plus weaker edges for shared tags. */
export function noteGraph() {
  const pages = allNotes().sort((a, b) => (a.slugs[0] ?? '').localeCompare(b.slugs[0] ?? '') || a.url.localeCompare(b.url));
  const indexByUrl = new Map(pages.map((page, index) => [page.url, index]));
  const edges = new Map<string, GraphEdge>();
  const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

  pages.forEach((page, source) => {
    for (const match of relatedNotes(page)) {
      const target = indexByUrl.get(match.url);
      if (target === undefined || target === source) continue;
      edges.set(key(source, target), { source, target, kind: 'related', weight: 1 });
    }
  });

  pages.forEach((page, source) => {
    const tags = new Set(page.data.tags ?? []);
    for (let target = source + 1; target < pages.length; target++) {
      const shared = (pages[target]?.data.tags ?? []).filter((tag) => tags.has(tag)).length;
      if (shared === 0 || edges.has(key(source, target))) continue;
      edges.set(key(source, target), { source, target, kind: 'tag', weight: Math.min(shared, 3) * 0.25 });
    }
  });

  const nodes: GraphNode[] = pages.map((page) => ({
    url: page.url,
    title: page.data.title,
    domain: page.slugs[0] ?? '',
    placeholder: Boolean(page.data.placeholder),
  }));

  return { nodes, edges: [...edges.values()] };
}
