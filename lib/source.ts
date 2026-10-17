import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema } from 'fumadocs-core/source/schema';
import { interviewRoute, notesRoute } from './shared';
import { notePageSchema } from './schema';

const notesDocs = defineDocs({
  dir: 'content/notes',
  docs: {
    schema: notePageSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

const interviewDocs = defineDocs({
  dir: 'content/interview',
  docs: {
    schema: notePageSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const notes = loader({
  baseUrl: notesRoute,
  source: notesDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const interview = loader({
  baseUrl: interviewRoute,
  source: interviewDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export type NotePage = ReturnType<typeof notes.getPages>[number];
