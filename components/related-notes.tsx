import Link from 'next/link';
import type { NotePage } from '@/lib/source';

export function RelatedNotes({ pages }: { pages: NotePage[] }) {
  if (pages.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="mb-2 text-xs font-bold text-fd-foreground">Related</p>
      <ul className="space-y-1 text-sm">
        {pages.map((page) => (
          <li key={page.url}>
            <Link href={page.url} className="text-fd-muted-foreground hover:text-fd-foreground">
              → {page.data.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SourceLinks({
  sources,
  githubUrl,
}: {
  sources?: string[];
  githubUrl: string;
}) {
  return (
    <div className="mt-5 flex flex-col gap-1.5 text-[12.5px]">
      {(sources ?? []).map((href) => (
        <a key={href} href={href} target="_blank" rel="noreferrer" className="text-fd-muted-foreground hover:text-fd-foreground">
          ↗ {labelForUrl(href)}
        </a>
      ))}
      <a href={githubUrl} target="_blank" rel="noreferrer" className="text-fd-muted-foreground hover:text-fd-foreground">
        View source on GitHub
      </a>
    </div>
  );
}

function labelForUrl(href: string) {
  try {
    const url = new URL(href);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}
