'use client';

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useId, useState, useSyncExternalStore } from 'react';

export interface FlowNode {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  /** 1-based step from which the node is drawn; before that it is hidden. */
  from?: number;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  /** Two-way link such as sibling pointers between leaf pages. */
  both?: boolean;
  /** Drawn only while a step traverses it; keeps fan-out edges from cluttering the diagram. */
  quiet?: boolean;
}

export interface FlowStep {
  title: string;
  note: string;
  code?: string;
  /** Nodes lit up in this step. */
  active?: string[];
  /** Edges traversed in this step; a dot travels along each one. */
  edges?: string[];
  /** Replaces a node's sub label for this step and every later one. */
  subs?: Record<string, string>;
}

/** One scenario through the same diagram, e.g. a cache hit vs a cache miss. */
export interface FlowCase {
  title: string;
  /** What happens at each component, shown under the title, e.g. "shared_buffers ✗ miss → OS cache ✓ hit". */
  path?: string;
  /** One line shown under the case picker before the case is started. */
  summary?: string;
  /** Sub labels the case starts with, before its first step. */
  subs?: Record<string, string>;
  steps: FlowStep[];
}

const WIDTH = 800;
const NODE_W = 160;
const NODE_H = 52;
const AUTO_MS = 3200;

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}

function box(node: FlowNode) {
  const w = node.w ?? NODE_W;
  const h = node.h ?? NODE_H;
  return { x: node.x, y: node.y, w, h, cx: node.x + w / 2, cy: node.y + h / 2 };
}

/** Straight segment between two boxes, clipped to their borders. */
function segment(a: FlowNode, b: FlowNode) {
  const p = box(a);
  const q = box(b);
  const dx = q.cx - p.cx;
  const dy = q.cy - p.cy;
  const clip = (w: number, h: number) => Math.min(dx === 0 ? Infinity : w / 2 / Math.abs(dx), dy === 0 ? Infinity : h / 2 / Math.abs(dy));
  const gap = 6 / Math.hypot(dx, dy);
  const t1 = clip(p.w, p.h) + gap;
  const t2 = 1 - clip(q.w, q.h) - gap;
  return {
    x1: p.cx + dx * t1,
    y1: p.cy + dy * t1,
    x2: p.cx + dx * t2,
    y2: p.cy + dy * t2,
  };
}

export function Flow({
  title,
  height = 260,
  nodes,
  edges = [],
  steps: singleSteps = [],
  cases,
}: {
  title: string;
  height?: number;
  nodes: FlowNode[];
  edges?: FlowEdge[];
  /** Steps of a single walkthrough; ignored when `cases` is given. */
  steps?: FlowStep[];
  /** Separate walkthroughs over the same diagram; the reader picks one at a time. */
  cases?: FlowCase[];
}) {
  const [caseIndex, setCaseIndex] = useState(0);
  const current = cases?.[caseIndex];
  const steps = current?.steps ?? singleSteps;
  const [index, setIndex] = useState(-1);
  const [auto, setAuto] = useState(false);
  const reducedMotion = useReducedMotion();
  const markerId = `flow-arrow-${useId().replace(/:/gu, '')}`;
  const started = index >= 0;
  const step = started ? steps[index] : undefined;
  const last = index === steps.length - 1;

  useEffect(() => {
    if (!auto) return;
    const timer = window.setTimeout(() => {
      if (index >= steps.length - 1) setAuto(false);
      else setIndex(index + 1);
    }, index < 0 ? 0 : AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [auto, index, steps.length]);

  const go = (next: number) => setIndex(Math.max(-1, Math.min(steps.length - 1, next)));
  const active = new Set(step?.active ?? []);
  const moving = new Set(step?.edges ?? []);
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const subs: Record<string, string> = { ...current?.subs };
  for (const past of steps.slice(0, index + 1)) Object.assign(subs, past.subs);
  const visible = (node: FlowNode) => !node.from || index + 1 >= node.from;
  const firstStep = (id: string) => steps.findIndex((item) => item.active?.includes(id));
  const jumpTo = (id: string) => {
    const target = firstStep(id);
    if (target < 0) return;
    setAuto(false);
    go(target);
  };

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(index - 1);
    }
  }

  return (
    <figure
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`${title}. Use the left and right arrow keys to step through.`}
      className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-fd-border bg-[#141826] px-4 py-2.5">
        <span className="text-sm font-semibold">{title}</span>
        <span className="shrink-0 text-xs text-[#7d8496]">{started ? `Step ${index + 1} / ${steps.length}` : `${steps.length} steps`}</span>
      </figcaption>

      {cases ? (
        <div role="tablist" aria-label="Cases" className="flex flex-wrap gap-1.5 border-b border-fd-border px-3 py-2">
          {cases.map((item, i) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={i === caseIndex}
              onClick={() => {
                setAuto(false);
                setCaseIndex(i);
                setIndex(-1);
              }}
              className={`rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors ${
                i === caseIndex
                  ? 'border-indigo-400 bg-[#33366b] text-[#eeeefe]'
                  : 'border-fd-border text-[#9aa1b2] hover:border-indigo-400/70 hover:text-[#e7e9f0]'
              }`}
            >
              <span className="block font-semibold">
                Case {i + 1} · {item.title}
              </span>
              {item.path ? <span className={`mt-0.5 block ${i === caseIndex ? 'text-[#c7d2fe]' : 'text-[#7d8496]'}`}>{item.path}</span> : null}
            </button>
          ))}
        </div>
      ) : null}

      <div
        className={`min-h-[104px] border-b border-fd-border px-4 py-3 ${step ? 'border-l-4 border-l-indigo-400 bg-[#161a33]' : ''}`}
        aria-live="polite"
      >
        {step ? (
          <>
            <p className="text-sm font-semibold text-[#a5b4fc]">
              Step {index + 1} · {step.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-fd-foreground">{step.note}</p>
            {step.code ? (
              <code className="mt-2 block overflow-x-auto rounded-md bg-[#0b0d12] px-2.5 py-1.5 font-mono text-xs text-[#c7d2fe]">{step.code}</code>
            ) : null}
          </>
        ) : (
          <>
            {current?.summary ? <p className="text-sm text-fd-foreground">{current.summary}</p> : null}
            <p className="mt-1 text-sm text-fd-muted-foreground">Press Start, then Next and Back to walk through it one step at a time.</p>
          </>
        )}
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${height}`} className="block h-auto w-full" role="img" aria-hidden={!started}>
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const a = byId.get(edge.from);
          const b = byId.get(edge.to);
          if (!a || !b || !visible(a) || !visible(b)) return null;
          if (edge.quiet && !moving.has(edge.id)) return null;
          const { x1, y1, x2, y2 } = segment(a, b);
          const hot = moving.has(edge.id);
          const dim = started && !hot;
          return (
            <g key={edge.id} style={{ opacity: dim ? 0.3 : 1, transition: 'opacity 300ms' }}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={hot ? '#818cf8' : '#3a4152'}
                strokeWidth={hot ? 2.5 : 1.5}
                markerEnd={`url(#${markerId})`}
                markerStart={edge.both ? `url(#${markerId})` : undefined}
              />
              {edge.label ? (
                <text
                  x={Math.abs(x2 - x1) >= Math.abs(y2 - y1) ? (x1 + x2) / 2 : (x1 + x2) / 2 + 8}
                  y={Math.abs(x2 - x1) >= Math.abs(y2 - y1) ? (y1 + y2) / 2 - 8 : (y1 + y2) / 2 + 4}
                  textAnchor={Math.abs(x2 - x1) >= Math.abs(y2 - y1) ? 'middle' : 'start'}
                  paintOrder="stroke"
                  stroke="var(--color-fd-card)"
                  strokeWidth={6}
                  strokeLinejoin="round"
                  className="fill-fd-muted-foreground text-[12px]"
                >
                  {edge.label}
                </text>
              ) : null}
              {hot && !reducedMotion ? (
                <circle key={`${edge.id}-${index}`} r="5" fill="#a5b4fc">
                  <animateMotion dur="1.1s" repeatCount="indefinite" path={`M${x1},${y1} L${x2},${y2}`} />
                </circle>
              ) : null}
            </g>
          );
        })}

        {nodes.map((node) => {
          if (!visible(node)) return null;
          const { x, y, w, h, cx } = box(node);
          const lit = active.has(node.id);
          const dim = started && !lit;
          const sub = subs[node.id] ?? node.sub;
          return (
            <g
              key={node.id}
              style={{ opacity: dim ? 0.35 : 1, transition: 'opacity 300ms', cursor: firstStep(node.id) >= 0 ? 'pointer' : undefined }}
              onClick={() => jumpTo(node.id)}
            >
              {firstStep(node.id) >= 0 ? <title>{`Jump to step ${firstStep(node.id) + 1}: ${steps[firstStep(node.id)].title}`}</title> : null}
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="10"
                fill={lit ? '#1f2350' : '#141826'}
                stroke={lit ? '#818cf8' : '#2a3142'}
                strokeWidth={lit ? 2 : 1}
                style={{ transition: 'fill 300ms, stroke 300ms' }}
              />
              <text x={cx} y={sub ? y + h / 2 - 4 : y + h / 2 + 5} textAnchor="middle" className="fill-fd-foreground text-[14px] font-semibold">
                {node.label}
              </text>
              {sub ? (
                <text x={cx} y={y + h / 2 + 14} textAnchor="middle" className="fill-fd-muted-foreground text-[12px]">
                  {sub}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center gap-2 border-t border-fd-border px-3 py-2.5">
        <button
          type="button"
          onClick={() => {
            setAuto(false);
            go(-1);
          }}
          disabled={!started}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[#9aa1b2] hover:text-[#e7e9f0] disabled:opacity-40"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Restart
        </button>
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={!started}
          className="inline-flex items-center gap-1 rounded-lg border border-fd-border px-2.5 py-1 text-sm hover:border-indigo-500/70 disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden /> Back
        </button>

        <div className="mx-auto flex items-center gap-1.5">
          {steps.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Step ${i + 1}: ${item.title}`}
              onClick={() => go(i)}
              className={`size-2.5 rounded-full transition-colors ${i === index ? 'bg-indigo-400' : i < index ? 'bg-indigo-400/40' : 'bg-[#2a3142] hover:bg-[#3a4152]'}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            if (!auto && last) go(-1);
            setAuto(!auto);
          }}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[#9aa1b2] hover:text-[#e7e9f0]"
          aria-pressed={auto}
        >
          {auto ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />} Auto
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={last}
          className="inline-flex items-center gap-1 rounded-lg border border-[#818cf8] bg-[#33366b] px-3 py-1 text-sm font-medium text-[#eeeefe] hover:bg-[#3c3f7a] disabled:opacity-40"
        >
          {started ? 'Next' : 'Start'} <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </figure>
  );
}
