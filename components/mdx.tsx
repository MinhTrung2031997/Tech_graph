import { ArticleStack, Divided, SplitCol, SplitLead, SplitPair } from '@/components/article-stack';
import { Flow } from '@/components/flow';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ExternalLink } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

export function Tldr({ children }: { children: ReactNode }) {
  return (
    <div id="tldr" className="not-prose my-4 rounded-[10px] border border-[#2a2f6b] bg-[#12142a] px-3.5 py-3">
      <p className="mb-1 text-xs font-bold tracking-wide text-[#a5b4fc]">TL;DR</p>
      <div className="text-sm leading-relaxed text-fd-foreground">{children}</div>
    </div>
  );
}

export function Answer({ children }: { children: ReactNode }) {
  return (
    <div id="answer" className="not-prose my-4 rounded-[10px] border border-[#1f4d40] bg-[#0e1f1b] px-3.5 py-3">
      <p className="mb-1 text-xs font-bold tracking-wide text-teal-300">30-SECOND ANSWER</p>
      <div className="text-sm leading-relaxed text-fd-foreground">{children}</div>
    </div>
  );
}

export function Pitfall({ children }: { children: ReactNode }) {
  return (
    <div id="pitfalls" className="not-prose my-4 rounded-[10px] border border-[#5a2a2a] bg-[#1e1212] px-3.5 py-3">
      <p className="mb-1 text-xs font-bold tracking-wide text-red-400">PITFALL</p>
      <div className="text-sm leading-relaxed text-fd-foreground">{children}</div>
    </div>
  );
}

/** Link to a deep-dive or answers page; opens in a new tab so the overview stays where the reader left it. */
export function DeepDive({ href, label = 'DEEP DIVE', children }: { href: string; label?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="not-prose my-4 flex items-center gap-3 rounded-[10px] border border-[#2a2f6b] bg-[#12142a] px-3.5 py-2.5 hover:border-indigo-400"
    >
      <span className="shrink-0 text-xs font-bold tracking-wide text-[#a5b4fc]">{label}</span>
      <span className="flex-1 text-sm font-medium text-fd-foreground">{children}</span>
      <ExternalLink className="size-4 shrink-0 text-[#a5b4fc]" aria-hidden />
    </a>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Tldr,
    Answer,
    Pitfall,
    DeepDive,
    Flow,
    ArticleStack,
    SplitPair,
    SplitLead,
    SplitCol,
    Divided,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
