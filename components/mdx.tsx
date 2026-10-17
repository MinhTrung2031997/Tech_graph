import defaultMdxComponents from 'fumadocs-ui/mdx';
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

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Tldr,
    Answer,
    Pitfall,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
