import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge, typeLabel } from '@/components/badges';
import { MarkReviewed } from '@/components/mark-reviewed';
import { byLastReviewed, formatReviewed, interviewPriorityNotes, shortDomain } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Quick Review',
  description: 'Interview-priority notes, TL;DR only.',
};

export default function ReviewPage() {
  const pages = interviewPriorityNotes().sort(byLastReviewed);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-xs text-fd-muted-foreground">Quick review</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Interview priority</h1>
      <p className="mt-3 text-fd-muted-foreground">
        {pages.length} notes marked for a last pass before an interview, least recently reviewed first. Each card is the TL;DR. Open the
        note for the full page.
      </p>
      <div className="mt-6 space-y-3">
        {pages.map((page) => (
          <div key={page.url} className="rounded-xl border border-fd-border bg-fd-card hover:border-indigo-500/70">
            <Link href={page.url} className="block p-4 pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold">{page.data.title}</h2>
                {page.data.type ? <Badge tone="neutral">{typeLabel(page.data.type)}</Badge> : null}
              </div>
              <p className="mt-2 text-sm text-fd-muted-foreground">{page.data.description}</p>
            </Link>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 pb-4 text-xs text-[#6b7285]">
              <span>
                {shortDomain(page.slugs[0])}
                {page.data.lastReviewed ? ` · reviewed ${formatReviewed(page.data.lastReviewed)}` : ''}
              </span>
              <MarkReviewed url={page.url} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
