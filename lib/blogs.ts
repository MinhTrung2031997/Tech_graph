import type { StructuredData } from 'fumadocs-core/mdx-plugins';
import type { Folder, Node } from 'fumadocs-core/page-tree';
import { blogs } from './source';

type BlogPage = ReturnType<typeof blogs.getPages>[number];

export interface CurriculumLesson {
  title: string;
  url?: string;
  minutes?: number;
}

export interface CurriculumSection {
  id: string;
  title: string;
  group?: string;
  lessons: CurriculumLesson[];
  minutes: number;
}

const WORDS_PER_MINUTE = 200;

async function readingMinutes(page: BlogPage) {
  const raw = page.data.structuredData as StructuredData | (() => Promise<StructuredData>) | undefined;
  const data = typeof raw === 'function' ? await raw() : raw;
  const words = (data?.contents ?? []).reduce((sum, block) => sum + block.content.split(/\s+/u).filter(Boolean).length, 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function nodeName(name: unknown) {
  return typeof name === 'string' ? name : '';
}

/** Every folder that holds posts (written or planned) becomes one section, in sidebar order. */
export async function blogCurriculum() {
  const sections: CurriculumSection[] = [];

  async function walk(nodes: Node[], group?: string) {
    for (const node of nodes) {
      if (node.type !== 'folder') continue;
      await addSection(node, group);
      await walk(node.children, nodeName(node.name));
    }
  }

  async function addSection(folder: Folder, group?: string) {
    const lessons: CurriculumLesson[] = [];
    for (const child of folder.children) {
      if (child.type !== 'page') continue;
      const page = blogs.getNodePage(child);
      if (!page) continue;
      lessons.push({ title: page.data.title, url: page.url, minutes: await readingMinutes(page) });
    }
    for (const title of blogs.getNodeMeta(folder)?.data.planned ?? []) {
      lessons.push({ title });
    }
    if (lessons.length === 0) return;

    sections.push({
      id: folder.$id ?? nodeName(folder.name),
      title: nodeName(folder.name),
      group,
      lessons,
      minutes: lessons.reduce((sum, lesson) => sum + (lesson.minutes ?? 0), 0),
    });
  }

  await walk(blogs.getPageTree().children);
  return sections;
}

export interface DeepDiveContext {
  /** Answer pages get their own banner; every other companion page is a deep dive. */
  kind: 'deep-dive' | 'answers';
  concept: { title: string; url: string };
  /** Folder names from the top of the tree down to the concept, e.g. Databases › Indexing › Session 1. */
  trail: string[];
}

function folderTrail(nodes: Node[], url: string, trail: string[]): string[] | undefined {
  for (const node of nodes) {
    if (node.type === 'page' && node.url === url) return trail;
    if (node.type !== 'folder') continue;
    if (node.index?.url === url) return trail;
    const found = folderTrail(node.children, url, [...trail, nodeName(node.name)]);
    if (found) return found;
  }
  return undefined;
}

/**
 * A deep dive lives next to a concept's index page and is kept out of the sidebar.
 * Returns the concept it belongs to, or undefined for any other page.
 */
export function deepDiveContext(page: BlogPage): DeepDiveContext | undefined {
  if (page.path.endsWith('index.mdx') || page.slugs.length < 2) return undefined;
  const concept = blogs.getPage(page.slugs.slice(0, -1));
  if (!concept || !concept.path.endsWith('index.mdx')) return undefined;
  return {
    kind: page.data.companion === 'answers' ? 'answers' : 'deep-dive',
    concept: { title: concept.data.title, url: concept.url },
    trail: folderTrail(blogs.getPageTree().children, concept.url, []) ?? [],
  };
}
