import { BlogCurriculum } from '@/components/blog-curriculum';
import { getMDXComponents } from '@/components/mdx';
import { blogCurriculum, deepDiveContext, type DeepDiveContext } from '@/lib/blogs';
import { NoteMeta } from '@/components/note-meta';
import { SourceLinks } from '@/components/related-notes';
import { githubFileUrl } from '@/lib/shared';
import { blogs } from '@/lib/source';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { Heading } from 'fumadocs-ui/components/heading';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { ArrowLeft, BookOpen, CircleCheck, Microscope } from 'lucide-react';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/** Blog section headings get an icon so they stand apart from the body text. */
function SectionHeading({ children, ...props }: ComponentProps<'h2'>) {
  return (
    <Heading as="h2" {...props}>
      <BookOpen className="mr-2 inline size-[0.9em] -translate-y-px align-middle text-indigo-400" aria-hidden />
      {children}
    </Heading>
  );
}

/** Tells the reader of a deep dive or answers page (opened in its own tab) which concept it belongs to. */
function DeepDiveBanner({ context }: { context: DeepDiveContext }) {
  const answers = context.kind === 'answers';
  return (
    <div
      className={`not-prose mb-4 rounded-[10px] border px-3.5 py-3 ${answers ? 'border-[#1f4d40] bg-[#0e1f1b]' : 'border-[#2a2f6b] bg-[#12142a]'}`}
    >
      <p className={`flex items-center gap-1.5 text-xs font-bold tracking-wide ${answers ? 'text-teal-300' : 'text-[#a5b4fc]'}`}>
        {answers ? <CircleCheck className="size-3.5" aria-hidden /> : <Microscope className="size-3.5" aria-hidden />}
        {answers ? 'ANSWERS' : 'DEEP DIVE'}
      </p>
      <p className="mt-1 text-xs text-[#7d8496]">{context.trail.join(' › ')}</p>
      <Link href={context.concept.url} className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-fd-foreground hover:text-indigo-300">
        <ArrowLeft className="size-4 shrink-0" aria-hidden />
        {context.concept.title}
      </Link>
    </div>
  );
}

export default async function Page(props: PageProps<'/blogs/[[...slug]]'>) {
  const params = await props.params;
  const page = blogs.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const neighbours = findNeighbour(blogs.getPageTree(), page.url);
  const post = page.slugs.length > 0;
  const deepDive = deepDiveContext(page);

  return (
    <DocsPage
      toc={page.data.toc}
      footer={{ items: neighbours }}
      tableOfContent={{
        footer: post ? <SourceLinks sources={page.data.sources} githubUrl={githubFileUrl('blogs', page.path)} /> : null,
      }}
    >
      {deepDive ? <DeepDiveBanner context={deepDive} /> : null}
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {post ? <NoteMeta type={page.data.type} status={page.data.status} lastReviewed={page.data.lastReviewed} tags={page.data.tags} /> : null}
      {post ? null : <BlogCurriculum sections={await blogCurriculum()} />}
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(blogs, page), h2: SectionHeading })} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return blogs.generateParams();
}

export async function generateMetadata(props: PageProps<'/blogs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = blogs.getPage(params.slug);
  if (!page) notFound();
  return { title: page.data.title, description: page.data.description };
}
