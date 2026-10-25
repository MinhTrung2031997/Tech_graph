import type { Metadata } from 'next';
import { NoteGraph } from '@/components/note-graph';
import { noteGraph } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Graph',
  description: 'How the notes link to each other through related links and shared tags.',
};

export default function GraphPage() {
  const { nodes, edges } = noteGraph();
  const related = edges.filter((edge) => edge.kind === 'related').length;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
      <p className="text-xs text-fd-muted-foreground">Graph</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Note graph</h1>
      <p className="mt-3 mb-6 text-fd-muted-foreground">
        {nodes.length} notes, {related} related links, {edges.length - related} shared-tag links. Hover a dot for its title, click to open
        it.
      </p>
      <NoteGraph nodes={nodes} edges={edges} />
    </main>
  );
}
