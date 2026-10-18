'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

const STORAGE_KEY = 'docs-sidebar-width';
const DEFAULT_WIDTH = 268;
const MIN_WIDTH = 220;
const MAX_WIDTH = 480;
const STRIP_WIDTH = 12;
const SCROLL_SLOP = 4;

function clampWidth(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_WIDTH;
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(value)));
}

function readStoredWidth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    const width = clampWidth(parsed);
    if (String(width) !== raw) localStorage.setItem(STORAGE_KEY, String(width));
    return width;
  } catch {
    return null;
  }
}

function applyStoredWidth(width: number | null) {
  const root = document.documentElement;
  if (width == null) root.style.removeProperty('--docs-sidebar-width');
  else root.style.setProperty('--docs-sidebar-width', `${width}px`);
}

function writeStoredWidth(width: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(width));
  } catch {
    // Ignore private-mode and quota errors. The width still applies for this visit.
  }
}

function dragDirection() {
  return document.documentElement.dir === 'rtl' ? -1 : 1;
}

const WIDTH_SCRIPT = `(function(){try{var r=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});var n=Number(r);if(!r||!isFinite(n))return;n=Math.round(n);if(n<${MIN_WIDTH})n=${MIN_WIDTH};if(n>${MAX_WIDTH})n=${MAX_WIDTH};document.documentElement.style.setProperty('--docs-sidebar-width',n+'px')}catch(e){}})()`;

type Zone = 'card' | 'scrollbar';

type Gesture = {
  pointerId: number;
  startX: number;
  startY: number;
  startWidth: number;
  direction: number;
  zone: Zone;
  resizing: boolean;
};

function hitZone(sidebar: HTMLElement, x: number, y: number, target: EventTarget | null): Zone | null {
  if (target instanceof Element) {
    const scrollbar = target.closest('[data-orientation="vertical"]');
    if (scrollbar && sidebar.contains(scrollbar)) return 'scrollbar';
  }
  for (const card of sidebar.querySelectorAll<HTMLElement>('.sidebar-card')) {
    const rect = card.getBoundingClientRect();
    const onEdge = y >= rect.top && y <= rect.bottom && x >= rect.right - STRIP_WIDTH / 2 && x <= rect.right + STRIP_WIDTH / 2;
    if (onEdge) return 'card';
  }
  return null;
}

export function SidebarResize() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: WIDTH_SCRIPT }} />
      <span data-sidebar-resize="" hidden />
      <SidebarResizeGesture />
    </>
  );
}

function SidebarResizeGesture() {
  const widthRef = useRef(DEFAULT_WIDTH);

  useLayoutEffect(() => {
    const stored = readStoredWidth();
    widthRef.current = stored ?? DEFAULT_WIDTH;
    const layout = document.getElementById('nd-notebook-layout');
    layout?.setAttribute('data-sidebar-resizing', '');
    applyStoredWidth(stored);
    const frame = requestAnimationFrame(() => {
      layout?.removeAttribute('data-sidebar-resizing');
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const sidebar = document.getElementById('nd-sidebar');
    if (!sidebar) return;

    let gesture: Gesture | null = null;

    function layout() {
      return document.getElementById('nd-notebook-layout');
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return;
      const zone = hitZone(sidebar!, event.clientX, event.clientY, event.target);
      if (!zone) return;
      if (zone === 'card') {
        event.preventDefault();
        event.stopPropagation();
      }
      gesture = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: widthRef.current,
        direction: dragDirection(),
        zone,
        resizing: false,
      };
    }

    function onPointerMove(event: PointerEvent) {
      if (!gesture || event.pointerId !== gesture.pointerId || event.buttons % 2 === 0) return;
      const dx = (event.clientX - gesture.startX) * gesture.direction;
      const dy = event.clientY - gesture.startY;
      if (!gesture.resizing) {
        if (gesture.zone === 'scrollbar') {
          if (Math.abs(dy) >= SCROLL_SLOP && Math.abs(dy) >= Math.abs(dx)) {
            gesture = null;
            return;
          }
          if (Math.abs(dx) < SCROLL_SLOP || Math.abs(dx) < Math.abs(dy)) return;
        } else if (dx === 0) {
          return;
        }
        gesture.resizing = true;
        layout()?.setAttribute('data-sidebar-resizing', '');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      }
      const next = clampWidth(gesture.startWidth + dx);
      widthRef.current = next;
      applyStoredWidth(next);
    }

    function endGesture(event: PointerEvent) {
      if (!gesture || event.pointerId !== gesture.pointerId) return;
      const resized = gesture.resizing;
      gesture = null;
      layout()?.removeAttribute('data-sidebar-resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (resized) writeStoredWidth(widthRef.current);
    }

    sidebar.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointermove', onPointerMove, true);
    document.addEventListener('pointerup', endGesture, true);
    document.addEventListener('pointercancel', endGesture, true);
    return () => {
      sidebar.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('pointermove', onPointerMove, true);
      document.removeEventListener('pointerup', endGesture, true);
      document.removeEventListener('pointercancel', endGesture, true);
    };
  }, []);

  return null;
}
