'use client';

import { SidebarFolder, SidebarFolderContent, SidebarFolderLink, SidebarItem, useFolderDepth } from 'fumadocs-ui/components/sidebar/base';
import { CardSeparator } from '@/components/sidebar-cards';
import type { Folder, Item, Node } from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';

function normalize(path: string) {
  const bare = path.split(/[?#]/)[0] ?? path;
  if (bare.length > 1 && bare.endsWith('/')) return bare.slice(0, -1);
  return bare;
}

function samePath(href: string, pathname: string) {
  return normalize(href) === normalize(pathname);
}

function splitHref(href: string) {
  const [path, hash = ''] = href.split('#');
  return { path: path ?? href, hash };
}

function containsPath(nodes: Node[], pathname: string): boolean {
  for (const node of nodes) {
    if (node.type === 'page' && samePath(node.url, pathname)) return true;
    if (node.type === 'folder') {
      if (node.index && samePath(node.index.url, pathname)) return true;
      if (containsPath(node.children, pathname)) return true;
    }
  }
  return false;
}

function useHash() {
  const pathname = usePathname();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const read = () => setHash(decodeURIComponent(window.location.hash.replace(/^#/, '')));
    read();
    window.addEventListener('hashchange', read);
    window.addEventListener('popstate', read);
    return () => {
      window.removeEventListener('hashchange', read);
      window.removeEventListener('popstate', read);
    };
  }, [pathname]);

  return hash;
}

function scrollToHash(id: string) {
  if (!id) return;
  document.getElementById(id)?.scrollIntoView({ block: 'start' });
}

export function EnglishHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const scroll = () => scrollToHash(decodeURIComponent(window.location.hash.replace(/^#/, '')));
    scroll();
    const timer = window.setTimeout(scroll, 0);
    window.addEventListener('hashchange', scroll);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', scroll);
    };
  }, [pathname]);

  return null;
}

export function EnglishCardItem({ item }: { item: Item }) {
  const pathname = usePathname();
  const hash = useHash();
  const depth = useFolderDepth();
  const { path, hash: anchor } = splitHref(item.url);
  const onPage = samePath(path, pathname);
  const active = anchor ? onPage && hash === anchor : onPage && depth === 0;

  function openQuestion(event: MouseEvent<HTMLAnchorElement>) {
    if (!anchor || !onPage) return;
    event.preventDefault();
    const next = `${normalize(path)}#${anchor}`;
    if (`${window.location.pathname}${window.location.hash}` !== next) {
      window.history.pushState(null, '', next);
    }
    scrollToHash(anchor);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  if (depth > 0) {
    return (
      <SidebarItem href={item.url} active={active} onClick={openQuestion} className="sidebar-card-child english-question">
        {item.name}
      </SidebarItem>
    );
  }

  return (
    <div className="sidebar-card">
      <SidebarItem href={item.url} active={active} className="sidebar-card-row english-note-card">
        <span>{item.name}</span>
      </SidebarItem>
    </div>
  );
}

export function EnglishCardFolder({ item, children }: { item: Folder; children: ReactNode }) {
  const pathname = usePathname();
  const hash = useHash();
  const depth = useFolderDepth();
  const nested = depth > 0;
  const onSection = item.index ? samePath(item.index.url, pathname) : false;
  const active = onSection || containsPath(item.children, pathname);

  return (
    <SidebarFolder collapsible={item.collapsible !== false} active={active} defaultOpen={item.defaultOpen} className={nested ? 'sidebar-card-nested' : 'sidebar-card'}>
      {item.index ? (
        <SidebarFolderLink href={item.index.url} active={onSection && !hash} className={nested ? 'sidebar-card-nested-row' : 'sidebar-card-row'}>
          {item.icon}
          <span>{item.name}</span>
        </SidebarFolderLink>
      ) : null}
      <SidebarFolderContent className="sidebar-card-children">{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}

export const englishSidebarComponents = {
  Item: EnglishCardItem,
  Folder: EnglishCardFolder,
  Separator: CardSeparator,
};
