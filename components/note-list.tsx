import Link from 'next/link';
import { Badge, statusLabel, statusTone, typeLabel } from './badges';
import { shortDomain } from '@/lib/content';
import type { NotePage } from '@/lib/source';

export function NoteList({
  pages,
  trailing,
}: {
  pages: NotePage[];
  trailing?: (page: NotePage) => string | undefined;
}) {
  if (pages.length === 0) {
    return <p className="text-sm text-fd-muted-foreground">No notes in this list yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      {pages.map((page) => (
        <Link
          key={page.url}
          href={page.url}
          className="flex items-center gap-2.5 border-b border-[#171b24] px-4 py-2.5 text-sm last:border-b-0 hover:bg-[#141826]"
        >
          {page.data.status === 'draft' ? <span className="size-1.5 shrink-0 rounded-full bg-amber-400" /> : null}
          <span className={page.data.status === 'draft' ? 'text-[#8b92a5]' : undefined}>{page.data.title}</span>
          {page.data.type ? <Badge tone="neutral">{typeLabel(page.data.type)}</Badge> : null}
          {page.data.status === 'draft' ? <Badge tone={statusTone(page.data.status)}>{statusLabel(page.data.status)}</Badge> : null}
          <span className="ms-auto shrink-0 text-xs text-[#6b7285]">
            {trailing ? trailing(page) : shortDomain(page.slugs[0])}
          </span>
        </Link>
      ))}
    </div>
  );
}
