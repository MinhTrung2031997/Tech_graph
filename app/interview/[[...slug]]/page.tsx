import { getMDXComponents } from '@/components/mdx';
import { NoteMeta } from '@/components/note-meta';
import { SourceLinks } from '@/components/related-notes';
import { githubFileUrl } from '@/lib/shared';
import { interview } from '@/lib/source';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export default async function Page(props: PageProps<'/interview/[[...slug]]'>) {
  const params = await props.params;
  const page = interview.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const neighbours = findNeighbour(interview.getPageTree(), page.url);

  return (
    <DocsPage
      toc={page.data.toc}
      footer={{ items: neighbours }}
      tableOfContent={{
        footer: <SourceLinks sources={page.data.sources} githubUrl={githubFileUrl('interview', page.path)} />,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <NoteMeta type={page.data.type} status={page.data.status} tags={page.data.tags} />
      {page.data.placeholder ? (
        <p className="not-prose mb-4 rounded-lg border border-[#3a3e78] bg-[#15172e] px-3 py-2 text-sm text-[#e0e4fc]">
          Placeholder. Personal interview stories are not published here. The page is only the outline.
        </p>
      ) : null}
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(interview, page) })} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return interview.generateParams();
}

export async function generateMetadata(props: PageProps<'/interview/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = interview.getPage(params.slug);
  if (!page) notFound();
  return { title: page.data.title, description: page.data.description };
}
