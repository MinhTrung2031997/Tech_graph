'use client';

import {
  CONTENT_FONT_SIZES,
  CONTENT_FONT_STORAGE_KEY,
  DEFAULT_CONTENT_FONT_SIZE,
  isContentFontSize,
  type ContentFontSize,
} from '@/lib/content-font';
import { cn } from '@/lib/cn';
import {
  FullSearchTrigger,
  SearchTrigger,
  type FullSearchTriggerProps,
  type SearchTriggerProps,
} from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { useEffect, useState } from 'react';

const listeners = new Set<(size: ContentFontSize) => void>();

function readContentFontSize(): ContentFontSize {
  try {
    const stored = localStorage.getItem(CONTENT_FONT_STORAGE_KEY);
    if (isContentFontSize(stored)) return Number(stored) as ContentFontSize;
  } catch {
    // localStorage can throw in private browsing.
  }
  return DEFAULT_CONTENT_FONT_SIZE;
}

function applyContentFontSize(size: ContentFontSize) {
  document.documentElement.style.setProperty('--content-size', String(size));
}

function selectContentFontSize(size: ContentFontSize) {
  try {
    localStorage.setItem(CONTENT_FONT_STORAGE_KEY, String(size));
  } catch {
    // The page still follows the choice for this visit.
  }
  applyContentFontSize(size);
  listeners.forEach((listener) => listener(size));
}

function useContentFontSize() {
  const [size, setSize] = useState<ContentFontSize>(DEFAULT_CONTENT_FONT_SIZE);

  useEffect(() => {
    setSize(readContentFontSize());
    listeners.add(setSize);
    function onStorage(event: StorageEvent) {
      if (event.key !== CONTENT_FONT_STORAGE_KEY) return;
      setSize(readContentFontSize());
    }
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(setSize);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return size;
}

export function FontSizeControl({ className }: { className?: string }) {
  const size = useContentFontSize();

  return (
    <div role="radiogroup" aria-label="Content font size" className={cn('font-size-control', className)}>
      {CONTENT_FONT_SIZES.map((choice) => {
        const selected = choice === size;
        return (
          <button
            key={choice}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${choice} pixel body text`}
            className={selected ? 'is-selected' : undefined}
            onClick={() => selectContentFontSize(choice)}
          >
            {choice}
          </button>
        );
      })}
    </div>
  );
}

/** Desktop search field, with the size control on its right. */
export function ContentSearch({ className, ...props }: FullSearchTriggerProps) {
  return (
    <>
      <FullSearchTrigger className={className} {...props} />
      <FontSizeControl className="my-auto max-md:hidden shrink-0" />
    </>
  );
}

/** Mobile search icon, with the size control beside it. */
export function ContentSearchIcon(props: SearchTriggerProps) {
  return (
    <>
      <FontSizeControl className="my-auto shrink-0" />
      <SearchTrigger {...props} />
    </>
  );
}
