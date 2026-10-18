'use client';

import { englishSetForPath, englishSets } from '@/lib/english';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

function tabClass(active: boolean) {
  return [
    'inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-sm font-medium',
    active ? 'bg-[#33366b] text-[#eeeefe]' : 'text-[#9aa1b2] hover:text-[#e7e9f0]',
  ].join(' ');
}

export function NotesSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const onEnglish = pathname.startsWith('/english');
  const current = englishSetForPath(pathname);
  const techActive = !onEnglish && !open;
  const englishActive = onEnglish || open;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
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
      <Link href="/notes" className={tabClass(techActive)} aria-current={techActive ? 'page' : undefined}>
        Tech Notes
      </Link>
      <div className="relative">
        <button
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
        {open ? (
          <div
            id={menuId}
            role="menu"
            className="fixed start-2 top-[calc(3.5rem+8px)] z-50 w-max max-w-[calc(100vw-1rem)] rounded-xl border border-[#2a3142] bg-[#141820] p-1.5 shadow-lg sm:absolute sm:start-0 sm:top-[calc(100%+8px)] sm:max-w-none"
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
          </div>
        ) : null}
      </div>
    </div>
  );
}
