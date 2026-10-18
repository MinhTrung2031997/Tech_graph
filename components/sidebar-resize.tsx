'use client';

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';

const STORAGE_KEY = 'docs-sidebar-width';
const DEFAULT_WIDTH = 268;
const MIN_WIDTH = 220;
const MAX_WIDTH = 480;
const KEYBOARD_STEP = 16;

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

function writeStoredWidth(width: number | null) {
  try {
    if (width == null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, String(width));
  } catch {
    // Ignore private-mode and quota errors. The width still applies for this visit.
  }
}

function dragDirection() {
  return document.documentElement.dir === 'rtl' ? -1 : 1;
}

function readAppliedWidth() {
  if (typeof window === 'undefined') return DEFAULT_WIDTH;
  const stored = readStoredWidth();
  applyStoredWidth(stored);
  return stored ?? DEFAULT_WIDTH;
}

const WIDTH_SCRIPT = `(function(){try{var r=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});var n=Number(r);if(!r||!isFinite(n))return;n=Math.round(n);if(n<${MIN_WIDTH})n=${MIN_WIDTH};if(n>${MAX_WIDTH})n=${MAX_WIDTH};document.documentElement.style.setProperty('--docs-sidebar-width',n+'px')}catch(e){}})()`;

export function SidebarResize() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: WIDTH_SCRIPT }} />
      <span data-sidebar-resize="" hidden />
      <SidebarResizeHandle />
    </>
  );
}

function SidebarResizeHandle() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState(readAppliedWidth);
  const [dragging, setDragging] = useState(false);
  const widthRef = useRef(width);
  const dragRef = useRef<{ startX: number; startWidth: number; direction: number } | null>(null);
  const lastClickAt = useRef(0);

  useEffect(() => {
    if (!dragging) return;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [dragging]);

  useLayoutEffect(() => {
    const layout = document.getElementById('nd-notebook-layout');
    layout?.setAttribute('data-sidebar-resizing', '');
    const stored = readStoredWidth();
    const resolved = stored ?? DEFAULT_WIDTH;
    widthRef.current = resolved;
    setWidth(resolved);
    applyStoredWidth(stored);
    setHost(document.getElementById('nd-sidebar'));
    const frame = requestAnimationFrame(() => {
      if (!dragRef.current) layout?.removeAttribute('data-sidebar-resizing');
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function setWidthTo(next: number | null) {
    const layout = document.getElementById('nd-notebook-layout');
    layout?.setAttribute('data-sidebar-resizing', '');
    const resolved = next == null ? DEFAULT_WIDTH : clampWidth(next);
    widthRef.current = resolved;
    setWidth(resolved);
    applyStoredWidth(next == null ? null : resolved);
    writeStoredWidth(next == null ? null : resolved);
    requestAnimationFrame(() => {
      if (!dragRef.current) layout?.removeAttribute('data-sidebar-resizing');
    });
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startWidth: widthRef.current,
      direction: dragDirection(),
    };
    document.getElementById('nd-notebook-layout')?.setAttribute('data-sidebar-resizing', '');
    setDragging(true);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const next = clampWidth(drag.startWidth + (event.clientX - drag.startX) * drag.direction);
    widthRef.current = next;
    setWidth(next);
    applyStoredWidth(next);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>, allowClick: boolean) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    document.getElementById('nd-notebook-layout')?.removeAttribute('data-sidebar-resizing');
    setDragging(false);

    // Pointer capture swallows the browser's dblclick, so a second click is tracked here.
    const moved = Math.abs(event.clientX - drag.startX) > 4;
    if (!moved) {
      widthRef.current = drag.startWidth;
      setWidth(drag.startWidth);
      applyStoredWidth(readStoredWidth());
      if (allowClick && event.timeStamp - lastClickAt.current < 500) {
        lastClickAt.current = 0;
        setWidthTo(null);
      } else if (allowClick) {
        lastClickAt.current = event.timeStamp;
      }
      return;
    }
    lastClickAt.current = 0;
    writeStoredWidth(widthRef.current);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = (event.key === 'ArrowRight' ? KEYBOARD_STEP : -KEYBOARD_STEP) * dragDirection();
    setWidthTo(widthRef.current + delta);
  }

  if (!host) return null;

  return createPortal(
    <div
      className="sidebar-resize-handle"
      data-dragging={dragging ? '' : undefined}
      role="separator"
      aria-orientation="vertical"
      aria-valuemin={MIN_WIDTH}
      aria-valuemax={MAX_WIDTH}
      aria-valuenow={width}
      aria-label="Resize sidebar"
      title="Drag to resize. Double-click to reset."
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(event) => endDrag(event, true)}
      onPointerCancel={(event) => endDrag(event, false)}
      onDoubleClick={(event) => {
        event.preventDefault();
        setWidthTo(null);
      }}
      onKeyDown={onKeyDown}
    />,
    host,
  );
}
