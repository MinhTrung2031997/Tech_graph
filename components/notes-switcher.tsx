'use client';

import { englishSetForPath, englishSets } from '@/lib/english';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function tabClass(active: boolean) {
  return [
    'inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-sm font-medium',
    active ? 'bg-[#33366b] text-[#eeeefe]' : 'text-[#9aa1b2] hover:text-[#e7e9f0]',
  ].join(' ');
}

export function NotesSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<{ top: number; left: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const onEnglish = pathname.startsWith('/english');
  const current = englishSetForPath(pathname);
  const englishActive = onEnglish;
  const [openPath, setOpenPath] = useState(pathname);

  if (openPath !== pathname) {
    setOpenPath(pathname);
    setOpen(false);
  }

  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const button = buttonRef.current;
      const menu = menuRef.current;
      if (!button || !menu) return;
      const rect = button.getBoundingClientRect();
      const margin = 8;
      const width = menu.offsetWidth;
      const maxLeft = window.innerWidth - margin - width;
      const left = Math.min(Math.max(margin, rect.left), Math.max(margin, maxLeft));
      setMenuBox({ top: rect.bottom + 8, left });
    }
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="ms-2 inline-flex shrink-0 items-center gap-1 sm:ms-3">
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          className={tabClass(englishActive)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          English notes
          <ChevronDown className="size-3.5" aria-hidden />
        </button>
        {open
          ? createPortal(
              <div
                ref={menuRef}
                id={menuId}
                role="menu"
                style={{
                  top: menuBox?.top ?? 0,
                  left: menuBox?.left ?? 0,
                  backgroundColor: '#141820',
                  visibility: menuBox ? 'visible' : 'hidden',
                }}
                className="fixed z-50 w-max max-w-[calc(100vw-1rem)] rounded-xl border border-[#2a3142] bg-[#141820] p-1.5 opacity-100 shadow-lg"
              >
                {englishSets.map((set) => {
                  const selected = current?.id === set.id;
                  return (
                    <Link
                      key={set.id}
                      role="menuitem"
                      href={set.href}
                      className={`block rounded-lg px-3 py-2 ${selected ? 'bg-[#33366b]' : 'hover:bg-[#33366b]'}`}
                      onClick={() => setOpen(false)}
                    >
                      <span className="block text-sm font-medium text-[#eeeefe]">{set.title}</span>
                      <span className="block whitespace-nowrap text-xs text-[#9aa1b2]">{set.hint}</span>
                    </Link>
                  );
                })}
              </div>,
              document.body,
            )
          : null}
      </div>
    </div>
  );
}
