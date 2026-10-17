import Link from 'next/link';
import { Badge, statusLabel, statusTone, typeLabel } from './badges';
import { formatReviewed } from '@/lib/content';

export function NoteMeta({
  type,
  status,
  interviewPriority,
  appliesTo,
  lastReviewed,
  tags,
}: {
  type?: string;
  status?: string;
  interviewPriority?: boolean;
  appliesTo?: string;
  lastReviewed?: string;
  tags?: string[];
}) {
  const reviewed = formatReviewed(lastReviewed);

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2 text-[12.5px] text-fd-muted-foreground">
      {type ? <Badge tone="neutral">{typeLabel(type)}</Badge> : null}
      {status ? (
        <Badge tone={statusTone(status)}>
          {status === 'reviewed' ? '● ' : null}
          {statusLabel(status)}
        </Badge>
      ) : null}
      {interviewPriority ? <Badge tone="amber">Interview priority</Badge> : null}
      {appliesTo ? (
        <>
          <span className="text-[#3a4050]">|</span>
          <span>Applies to {appliesTo}</span>
        </>
      ) : null}
      {reviewed ? (
        <>
          <span className="text-[#3a4050]">|</span>
          <span>Last reviewed {reviewed}</span>
        </>
      ) : null}
      {tags && tags.length > 0 ? (
        <>
          <span className="text-[#3a4050]">|</span>
          <span className="flex flex-wrap gap-x-2">
            {tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`} className="text-fd-muted-foreground hover:text-fd-foreground">
                #{tag}
              </Link>
            ))}
          </span>
        </>
      ) : null}
    </div>
  );
}
