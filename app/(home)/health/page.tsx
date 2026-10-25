import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Badge, statusLabel, statusTone } from '@/components/badges';
import { NoteList } from '@/components/note-list';
import { allNotes, byLastReviewed, daysSince, formatReviewed, shortDomain } from '@/lib/content';
import { noteStatuses } from '@/lib/schema';
import type { NotePage } from '@/lib/source';

export const metadata: Metadata = {
  title: 'Content health',
  description: 'Review status, stale notes, and notes without related links.',
};

const STALE_AFTER_DAYS = 90;

function reviewedTrailing(page: NotePage) {
  const domain = shortDomain(page.slugs[0]);
  const age = daysSince(page.data.lastReviewed);
  const reviewed = age === undefined ? 'never reviewed' : `${formatReviewed(page.data.lastReviewed)} · ${age}d ago`;
  return domain ? `${domain} · ${reviewed}` : reviewed;
}

function Section({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 flex items-baseline gap-2 text-lg font-semibold">
        {title} <span className="text-sm font-normal text-[#6b7285]">{count}</span>
      </h2>
      {children}
    </section>
  );
}

export default function HealthPage() {
  const pages = allNotes();
  const statusCounts = [
    ...noteStatuses.map((status) => ({ status, count: pages.filter((page) => page.data.status === status).length })),
    { status: undefined, count: pages.filter((page) => !page.data.status).length },
  ];
  const placeholders = pages.filter((page) => page.data.placeholder).length;
  const stale = pages
    .filter((page) => {
      const age = daysSince(page.data.lastReviewed);
      return age === undefined || age > STALE_AFTER_DAYS;
    })
    .sort(byLastReviewed);
  const unlinked = pages
    .filter((page) => (page.data.related ?? []).length === 0)
    .sort((a, b) => a.data.title.localeCompare(b.data.title));

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-xs text-fd-muted-foreground">Content health</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Content health</h1>
      <p className="mt-3 text-fd-muted-foreground">
        {pages.length} notes. Computed when the site was built, so ages count from the last deploy.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {statusCounts.map(({ status, count }) => (
          <div key={status ?? 'none'} className="rounded-xl border border-fd-border bg-fd-card p-4">
            <p className="text-2xl font-bold">{count}</p>
            <div className="mt-1">
              <Badge tone={statusTone(status)}>{statusLabel(status) ?? 'No status'}</Badge>
            </div>
          </div>
        ))}
        <div className="rounded-xl border border-fd-border bg-fd-card p-4">
          <p className="text-2xl font-bold">{placeholders}</p>
          <div className="mt-1">
            <Badge tone="indigo">Placeholder</Badge>
          </div>
        </div>
      </div>

      <Section title={`Not reviewed in ${STALE_AFTER_DAYS} days`} count={stale.length}>
        <NoteList pages={stale} trailing={reviewedTrailing} />
      </Section>

      <Section title="No related notes" count={unlinked.length}>
        <NoteList pages={unlinked} />
      </Section>
    </main>
  );
}
