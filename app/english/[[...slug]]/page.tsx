import { stackHeadingComponents } from '@/components/article-stack';
import { getMDXComponents } from '@/components/mdx';
import { englishPaths, englishSets, englishTitleForSlug } from '@/lib/english';
import { english } from '@/lib/source';
import { DocsBody, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { Text } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

function EmptyOnThisPage() {
  return (
    <div
      id="nd-toc"
      className="sticky top-(--fd-docs-row-3) [grid-area:toc] flex h-[calc(var(--fd-docs-height)-var(--fd-docs-row-3))] w-(--fd-toc-width) flex-col pt-12 pe-4 pb-2 max-xl:hidden xl:layout:[--fd-toc-width:268px]"
    >
      <h3 id="toc-title" className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
        <Text className="size-4" aria-hidden />
        On this page
      </h3>
    </div>
  );
}

export default async function Page(props: PageProps<'/english/[[...slug]]'>) {
  const params = await props.params;
  const slug = params.slug ?? [];
  const interview = englishSets.find((set) => set.id === 'interview');

  if (slug.length === 0 || (slug.length === 1 && slug[0] === 'interview')) {
    redirect(interview?.href ?? '/english/interview/microservice-benefits');
  }

  if (slug.length === 1 && slug[0] === 'daily') {
    const daily = englishSets.find((set) => set.id === 'daily');
    redirect(daily?.href ?? '/english/daily/a-day-of-new-friendship');
  }

  const title = englishTitleForSlug(slug);
  if (!title) notFound();

  const doc = english.getPage(slug);
  if (doc) {
    const MDX = doc.data.body;
    return (
      <DocsPage toc={doc.data.toc} breadcrumb={{ enabled: false }} footer={{ enabled: false }}>
        <DocsTitle>{doc.data.title}</DocsTitle>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              ...(doc.data.article === 'stack' ? stackHeadingComponents : {}),
            })}
          />
        </DocsBody>
      </DocsPage>
    );
  }

  return (
    <DocsPage toc={[]} breadcrumb={{ enabled: false }} footer={{ enabled: false }} tableOfContent={{ component: <EmptyOnThisPage /> }}>
      <DocsTitle>{title}</DocsTitle>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return englishPaths().map((href) => ({
    slug: href.replace(/^\/english\//, '').split('/'),
  }));
}

export async function generateMetadata(props: PageProps<'/english/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];
  const doc = english.getPage(slug);
  if (doc) {
    return { title: doc.data.title, description: doc.data.description };
  }
  const title = englishTitleForSlug(slug);
  if (!title) return {};
  return { title };
}
