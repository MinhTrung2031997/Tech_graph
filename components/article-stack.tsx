import type { ComponentProps, ReactNode } from 'react';

export function ArticleStack({ children }: { children: ReactNode }) {
  return <div className="article-stack not-prose">{children}</div>;
}

export function SplitPair({ children }: { children: ReactNode }) {
  return <div className="article-split">{children}</div>;
}

export function SplitLead({ children }: { children: ReactNode }) {
  return <div className="article-split-lead">{children}</div>;
}

export function SplitCol({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="article-split-col">
      <p className="article-split-title">{title}</p>
      <div className="article-split-body">{children}</div>
    </div>
  );
}

export function Divided({ children }: { children: ReactNode }) {
  return <div className="article-divided">{children}</div>;
}

type HeadingProps = ComponentProps<'h2'> & { node?: unknown };

function createStackHeading(as: 'h2' | 'h3') {
  return function StackHeading({ node, ...props }: HeadingProps) {
    void node;
    const Tag = as;
    return <Tag {...props} className="scroll-m-28" />;
  };
}

export const stackHeadingComponents = {
  h2: createStackHeading('h2'),
  h3: createStackHeading('h3'),
};
