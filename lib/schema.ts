import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

export const noteTypes = ['concept', 'comparison', 'cheatsheet', 'pattern', 'how-to', 'domain'] as const;
export const noteStatuses = ['draft', 'reviewed', 'needs-update'] as const;

export const notePageSchema = pageSchema.extend({
  domain: z.string().optional(),
  type: z.enum(noteTypes).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(noteStatuses).optional(),
  appliesTo: z.string().optional(),
  lastReviewed: z.string().optional(),
  interviewPriority: z.boolean().optional(),
  related: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional(),
  number: z.string().optional(),
  placeholder: z.boolean().optional(),
  article: z.enum(['stack']).optional(),
  // Blog page that sits next to a concept but is not a deep dive, e.g. the answers to its check questions.
  companion: z.enum(['answers']).optional(),
});

// Blog folders list posts that are planned but not written, so the curriculum shows the whole section.
export const blogMetaSchema = metaSchema.extend({
  planned: z.array(z.string()).optional(),
});
