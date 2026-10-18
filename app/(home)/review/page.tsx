import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, typeLabel } from '@/components/badges';
import { formatReviewed, interviewPriorityNotes, shortDomain } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Quick Review',
  description: 'Interview-priority notes, TL;DR only.',
};

export default function ReviewPage() {
  const pages = interviewPriorityNotes();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-xs text-fd-muted-foreground">Quick review</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Interview priority</h1>
      <p className="mt-3 text-fd-muted-foreground">
        {pages.length} notes marked for a last pass before an interview. Each card is the TL;DR. Open the note for the full page.
      </p>
      <div className="mt-6 space-y-3">
        {pages.map((page) => (
          <Link key={page.url} href={page.url} className="block rounded-xl border border-fd-border bg-fd-card p-4 hover:border-indigo-500/70">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold">{page.data.title}</h2>
              {page.data.type ? <Badge tone="neutral">{typeLabel(page.data.type)}</Badge> : null}
            </div>
            <p className="mt-2 text-sm text-fd-muted-foreground">{page.data.description}</p>
            <p className="mt-2 text-xs text-[#6b7285]">
              {shortDomain(page.slugs[0])}
              {page.data.lastReviewed ? ` · reviewed ${formatReviewed(page.data.lastReviewed)}` : ''}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
