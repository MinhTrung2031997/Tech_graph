import type { Metadata } from 'next';
import Link from 'next/link';
import { allTags } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Notes grouped by tag.',
};

export default function TagsPage() {
  const tags = allTags();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-sm text-fd-muted-foreground">Tags</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Tags</h1>
      <p className="mt-3 text-fd-muted-foreground">
        {tags.length === 0 ? 'No tags yet.' : `${tags.length} tags across the notes.`}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="rounded-full border border-fd-border bg-fd-card px-3 py-1 text-sm hover:border-indigo-500/70"
          >
            #{tag} <span className="text-[#6b7285]">{count}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
