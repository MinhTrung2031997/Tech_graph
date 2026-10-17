import { DomainGrid } from '@/components/domain-grid';
import { getMDXComponents } from '@/components/mdx';
import { NoteMeta } from '@/components/note-meta';
import { NoteList } from '@/components/note-list';
import { RelatedNotes, SourceLinks } from '@/components/related-notes';
import { typeLabel } from '@/components/badges';
import { domainLabel, noteNeighbours, orderedNotesInDomain, relatedNotes, shortDomain } from '@/lib/content';
import { getPageImageUrl, githubFileUrl } from '@/lib/shared';
import { notes } from '@/lib/source';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const groupOrder = ['concept', 'comparison', 'pattern', 'how-to', 'cheatsheet'] as const;

export default async function Page(props: PageProps<'/notes/[[...slug]]'>) {
  const params = await props.params;
  const page = notes.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const overview = page.slugs.length === 0;
  const domainPage = page.data.type === 'domain';
  const notePage = !overview && !domainPage;
  const neighbours = noteNeighbours(page.url);
  const related = relatedNotes(page);
  const toc = notePage ? [{ title: 'TL;DR', url: '#tldr', depth: 2 as const }, ...page.data.toc] : page.data.toc;
  const domainNotes = domainPage ? orderedNotesInDomain(page.slugs[0] ?? '') : [];

  return (
    <DocsPage
      toc={toc}
      footer={{ items: neighbours }}
      tableOfContent={{
        footer: notePage ? (
          <>
            <RelatedNotes pages={related} />
            <SourceLinks sources={page.data.sources} githubUrl={githubFileUrl('notes', page.path)} />
          </>
        ) : null,
      }}
    >
      {domainPage ? <p className="mb-2 text-xs text-[#6b7285]">{domainLabel(page.slugs[0])}</p> : null}
      <DocsTitle>{page.data.title}</DocsTitle>
      {notePage ? (
        <NoteMeta
          type={page.data.type}
          status={page.data.status}
          interviewPriority={page.data.interviewPriority}
          appliesTo={page.data.appliesTo}
          lastReviewed={page.data.lastReviewed}
          tags={page.data.tags}
        />
      ) : (
        <DocsDescription>{page.data.description}</DocsDescription>
      )}
      {page.data.placeholder ? (
        <p className="not-prose mb-4 rounded-lg border border-[#3a3e78] bg-[#15172e] px-3 py-2 text-sm text-[#e0e4fc]">
          Placeholder. This page keeps the category tree navigable. The full note is not written yet, and it is not copied from Notion.
        </p>
      ) : null}
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(notes, page) })} />
      </DocsBody>
      {overview ? (
        <div className="mt-8">
          <DomainGrid />
        </div>
      ) : null}
      {domainPage ? (
        <div className="mt-8 space-y-6">
          {groupOrder.map((type) => {
            const group = domainNotes.filter((item) => item.data.type === type);
            if (group.length === 0) return null;
            return (
              <section key={type}>
                <h2 className="mb-2 text-sm font-semibold">{typeLabel(type)}</h2>
                <NoteList pages={group} trailing={(item) => shortDomain(item.slugs[0])} />
              </section>
            );
          })}
        </div>
      ) : null}
    </DocsPage>
  );
}

export function generateStaticParams() {
  return notes.generateParams();
}

export async function generateMetadata(props: PageProps<'/notes/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = notes.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
