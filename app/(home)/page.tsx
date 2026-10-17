import Link from 'next/link';
import { DomainGrid } from '@/components/domain-grid';
import { HeroSearch } from '@/components/hero-search';
import { NoteList } from '@/components/note-list';
import { Badge } from '@/components/badges';
import { contentStats, formatShortDate, interviewPriorityNotes, recentlyUpdated, shortDomain } from '@/lib/content';
import { authorName, githubRepoUrl } from '@/lib/shared';

export default function HomePage() {
  const stats = contentStats();
  const review = interviewPriorityNotes().slice(0, 5);
  const recent = recentlyUpdated(5);

  return (
    <div>
      <section className="bg-fd-background px-6 pb-9 pt-14 text-center dark:bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,#1b1f3d_0%,#0b0d12_70%)]">
        <h1 className="text-4xl font-extrabold tracking-tight text-fd-foreground sm:text-[38px]">
          Backend engineering notes <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">by {authorName}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-fd-muted-foreground">
          Node.js · NestJS · Databases · Messaging · Distributed systems — written for real work and interviews.
        </p>
        <HeroSearch />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[13px] text-[#7d8496]">
          <span>
            <b className="text-[#e6e8ee]">{stats.notes}</b> notes
          </span>
          <span>
            <b className="text-[#e6e8ee]">{stats.domains}</b> domains
          </span>
          <span>
            <b className="text-[#e6e8ee]">{stats.priorities}</b> interview priorities
          </span>
          <span>
            Seeded <b className="text-[#e6e8ee]">Oct 16, 2026</b>
          </span>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1180px] px-6 pb-16">
        <h2 className="mb-3 mt-7 flex items-center gap-2 text-[15px] font-bold">
          Browse by domain <span className="text-[13px] font-normal text-fd-muted-foreground">· {stats.domains} domains</span>
        </h2>
        <DomainGrid />
        <p className="mt-2 text-xs text-[#6b7285]">The bar is the share of notes in that domain marked Reviewed.</p>

        <div className="mt-2 grid gap-4 lg:grid-cols-3">
          <section>
            <h2 className="mb-3 mt-7 flex items-center gap-2 text-[15px] font-bold">
              Quick review <span className="text-[13px] font-normal text-fd-muted-foreground">· interview priority</span>
            </h2>
            <NoteList pages={review} trailing={(page) => shortDomain(page.slugs[0])} />
            <Link href="/review" className="mt-2 inline-block text-sm text-indigo-300 hover:text-white">
              Open all {stats.priorities} priority notes
            </Link>
          </section>

          <section>
            <h2 className="mb-3 mt-7 text-[15px] font-bold">Recently updated</h2>
            <NoteList pages={recent} trailing={(page) => formatShortDate(page.data.lastReviewed)} />
          </section>

          <section>
            <h2 className="mb-3 mt-7 text-[15px] font-bold">About</h2>
            <div className="flex gap-3.5 rounded-xl border border-fd-border bg-fd-card p-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-extrabold text-white">
                T
              </div>
              <div>
                <p className="font-semibold">{authorName}</p>
                <p className="mt-1 text-[13px] text-fd-muted-foreground">
                  Backend engineer since 2018. I keep these notes to learn in public and prepare for interviews.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {['TypeScript', 'NestJS', 'PostgreSQL', 'Kafka', 'Next.js', 'Terraform'].map((chip) => (
                    <Badge key={chip}>{chip}</Badge>
                  ))}
                </div>
                <Link href="/about" className="mt-3 inline-block text-sm text-indigo-300 hover:text-white">
                  More about this site
                </Link>
              </div>
            </div>
          </section>
        </div>

        <p className="mt-10 text-center text-xs text-[#6b7285]">
          {authorName} · <a href={githubRepoUrl()}>{githubRepoUrl().replace('https://', '')}</a>
        </p>
      </main>
    </div>
  );
}
