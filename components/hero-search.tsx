'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Search } from 'lucide-react';

export function HeroSearch() {
  const { setOpenSearch, hotKey } = useSearchContext();

  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className="mx-auto mt-6 flex h-[50px] w-full max-w-[560px] items-center gap-3 rounded-xl border border-[#2b3142] bg-[#11141b] px-4 text-left text-[15px] text-[#7d8496] shadow-[0_10px_40px_rgba(99,102,241,0.12)]"
    >
      <Search className="size-4 shrink-0" />
      <span className="truncate">Search “isolation levels”, “event loop”, “saga”…</span>
      <span className="ms-auto flex gap-1">
        {hotKey.map((key, index) => (
          <kbd key={index} className="rounded-md border border-[#2d3341] px-1.5 text-xs">
            {key.display}
          </kbd>
        ))}
      </span>
    </button>
  );
}
