import { englishPaths, englishTitleForSlug } from '@/lib/english';
import { DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
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

  if (slug.length === 0 || (slug.length === 1 && slug[0] === 'interview')) {
    redirect('/english/interview/self-introduction');
  }

  const title = englishTitleForSlug(slug);
  if (!title) notFound();

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
  const title = englishTitleForSlug(slug);
  if (!title) return {};
  return { title };
}
