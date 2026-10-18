import Link from 'next/link';
import { domainStats } from '@/lib/content';

export function DomainGrid() {
  const stats = domainStats();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {stats.map((domain) => (
        <Link
          key={domain.slug}
          href={`/notes/${domain.slug}`}
          className="flex min-h-[108px] flex-col rounded-xl border border-fd-border bg-fd-card p-3.5 transition-colors hover:border-indigo-500/70"
        >
          <span className="text-xs text-[#6b7285]">{domain.number}</span>
          <span className="mt-1 text-sm font-semibold leading-snug">{domain.title}</span>
          <span className="mt-auto flex items-center justify-between pt-3 text-xs text-[#7d8496]">
            <span>
              {domain.noteCount} {domain.noteCount === 1 ? 'note' : 'notes'}
            </span>
            <span>{domain.percent}%</span>
          </span>
          <span className="mt-1.5 block h-[3px] overflow-hidden rounded-sm bg-[#1d2230]">
            <span
              className="block h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
              style={{ width: `${Math.max(domain.percent, domain.percent > 0 ? domain.percent : 0)}%` }}
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
