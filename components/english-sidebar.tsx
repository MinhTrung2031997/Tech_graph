'use client';

import { CardFolder, CardSeparator } from '@/components/sidebar-cards';
import { SidebarItem } from 'fumadocs-ui/components/sidebar/base';
import type { Item } from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';

function normalize(path: string) {
  const bare = path.split(/[?#]/)[0] ?? path;
  if (bare.length > 1 && bare.endsWith('/')) return bare.slice(0, -1);
  return bare;
}

export function EnglishCardItem({ item }: { item: Item }) {
  const pathname = usePathname();
  const active = normalize(item.url) === normalize(pathname);

  return (
    <div className="sidebar-card">
      <SidebarItem href={item.url} active={active} className="sidebar-card-row english-note-card">
        <span>{item.name}</span>
      </SidebarItem>
    </div>
  );
}

export const englishSidebarComponents = {
  Item: EnglishCardItem,
  Folder: CardFolder,
  Separator: CardSeparator,
};
