'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { Folder, Item, Node, Separator } from 'fumadocs-core/page-tree';
import { useControlledFolder } from '@/components/sidebar-expansion';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
  useFolderDepth,
} from 'fumadocs-ui/components/sidebar/base';

function normalize(path: string) {
  const bare = path.split(/[?#]/)[0] ?? path;
  if (bare.length > 1 && bare.endsWith('/')) return bare.slice(0, -1);
  return bare;
}

function samePath(href: string, pathname: string) {
  return normalize(href) === normalize(pathname);
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

export function CardSeparator({ item }: { item: Separator }) {
  return (
    <SidebarSeparator className="sidebar-card-label mt-5 mb-2 px-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#6d7589]">
      {item.icon}
      {item.name}
    </SidebarSeparator>
  );
}

export function CardItem({ item }: { item: Item }) {
  const pathname = usePathname();
  const depth = useFolderDepth();
  const active = samePath(item.url, pathname);

  if (depth === 0) {
    return (
      <SidebarItem href={item.url} active={active} icon={item.icon} className="sidebar-card sidebar-card-row">
        <span>{item.name}</span>
      </SidebarItem>
    );
  }

  return (
    <SidebarItem href={item.url} active={active} icon={item.icon} className="sidebar-card-child">
      {item.name}
    </SidebarItem>
  );
}

export function CardFolder({ item, children }: { item: Folder; children: ReactNode }) {
  const pathname = usePathname();
  const depth = useFolderDepth();
  const nested = depth > 0;
  const active =
    (item.index ? samePath(item.index.url, pathname) : false) || containsPath(item.children, pathname);
  const folder = useControlledFolder(active, item.defaultOpen);

  return (
    <SidebarFolder
      key={folder.key}
      collapsible={item.collapsible !== false}
      active={folder.active}
      defaultOpen={folder.defaultOpen}
      className={nested ? 'sidebar-card-nested' : 'sidebar-card'}
    >
      {item.index ? (
        <SidebarFolderLink
          href={item.index.url}
          active={samePath(item.index.url, pathname)}
          className={nested ? 'sidebar-card-nested-row' : 'sidebar-card-row'}
        >
          {item.icon}
          <span>{item.name}</span>
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger className={nested ? 'sidebar-card-nested-row' : 'sidebar-card-row'}>
          {item.icon}
          <span>{item.name}</span>
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent className="sidebar-card-children">{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}

export const sidebarCardComponents = {
  Item: CardItem,
  Folder: CardFolder,
  Separator: CardSeparator,
};
