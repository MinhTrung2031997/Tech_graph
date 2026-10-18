import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NoteList } from '@/components/note-list';
import { allTags, notesForTag, shortDomain } from '@/lib/content';

export function generateStaticParams() {
  return allTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata(props: PageProps<'/tags/[tag]'>): Promise<Metadata> {
  const { tag } = await props.params;
  return { title: `#${tag}`, description: `Notes tagged ${tag}.` };
}

export default async function TagPage(props: PageProps<'/tags/[tag]'>) {
  const { tag } = await props.params;
  const pages = notesForTag(tag);
  if (pages.length === 0) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-xs text-fd-muted-foreground">Tags</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">#{tag}</h1>
      <p className="mt-3 mb-6 text-fd-muted-foreground">
        {pages.length} {pages.length === 1 ? 'note' : 'notes'}
      </p>
      <NoteList pages={pages} trailing={(page) => shortDomain(page.slugs[0])} />
    </main>
  );
}
