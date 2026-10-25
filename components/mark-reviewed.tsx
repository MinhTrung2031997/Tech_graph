'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'review-marks';
const DAY_MS = 86_400_000;
const listeners = new Set<() => void>();

function readMarks(): Record<string, number> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, number>) : {};
  } catch {
    // localStorage can throw in private browsing, and the value can be malformed.
    return {};
  }
}

function markReviewed(url: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readMarks(), [url]: Date.now() }));
  } catch {
    // Without storage the mark is not kept.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) onChange();
  }
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function startOfDay(time: number) {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function reviewedLabel(time?: number) {
  if (typeof time !== 'number' || !Number.isFinite(time)) return undefined;
  const days = Math.round((startOfDay(Date.now()) - startOfDay(time)) / DAY_MS);
  if (days <= 0) return 'marked reviewed today';
  if (days === 1) return 'marked reviewed yesterday';
  return `marked reviewed ${days} days ago`;
}

export function MarkReviewed({ url }: { url: string }) {
  const label = useSyncExternalStore(
    subscribe,
    () => reviewedLabel(readMarks()[url]),
    () => undefined,
  );

  return (
    <span className="ms-auto inline-flex items-center gap-2">
      {label ? <span className="text-[#a5b4fc]">{label}</span> : null}
      <button
        type="button"
        onClick={() => markReviewed(url)}
        className="rounded-lg border border-fd-border px-2.5 py-1 font-medium text-[#aeb5c5] hover:border-indigo-500/70 hover:text-[#e7e9f0]"
      >
        Mark reviewed
      </button>
    </span>
  );
}
