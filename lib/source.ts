import { loader, type LoaderPlugin } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema } from 'fumadocs-core/source/schema';
import { blogsRoute, interviewRoute, notesRoute } from './shared';
import { blogMetaSchema, notePageSchema } from './schema';

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

// Tags sidebar items for `placeholder: true` pages so the sidebar can mute them.
const placeholderTreePlugin: LoaderPlugin = {
  name: 'placeholder-tree',
  transformPageTree: {
    file(node, filePath) {
      const file = filePath ? this.storage.read(filePath) : undefined;
      if (file?.format === 'page' && (file.data as { placeholder?: boolean }).placeholder) {
        return Object.assign(node, { placeholder: true });
      }
      return node;
    },
  },
};

export const notes = loader({
  baseUrl: notesRoute,
  source: notesDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), placeholderTreePlugin],
});

export const interview = loader({
  baseUrl: interviewRoute,
  source: interviewDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

const blogsDocs = defineDocs({
  dir: 'content/blogs',
  docs: {
    schema: notePageSchema,
  },
  meta: {
    schema: blogMetaSchema,
  },
});

export const blogs = loader({
  baseUrl: blogsRoute,
  source: blogsDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

const englishDocs = defineDocs({
  dir: 'content/english',
  docs: {
    schema: notePageSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const english = loader({
  baseUrl: '/english',
  source: englishDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export type NotePage = ReturnType<typeof notes.getPages>[number];
