'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { domains } from '@/lib/domains';
import type { GraphEdge, GraphNode } from '@/lib/content';

const SIZE = 1000;
const PADDING = 60;
const ITERATIONS = 300;
const MIN_GAP = 40;

function domainColor(slug: string) {
  const index = domains.findIndex((domain) => domain.slug === slug);
  if (index < 0) return '#9aa1b2';
  return `hsl(${Math.round((index * 360) / domains.length)} 70% 62%)`;
}

// Fruchterman-Reingold: all pairs repel, edges pull by weight, a weak pull to
// the centre keeps unlinked notes on screen.
function layout(count: number, edges: GraphEdge[]) {
  const k = Math.sqrt((SIZE * SIZE) / Math.max(count, 1)) * 0.8;
  const pos = Array.from({ length: count }, (_, i) => {
    const angle = (i / Math.max(count, 1)) * Math.PI * 2;
    return { x: Math.cos(angle) * SIZE * 0.35, y: Math.sin(angle) * SIZE * 0.35 };
  });
  let temperature = SIZE / 10;

  for (let iteration = 0; iteration < ITERATIONS; iteration++) {
    const disp = pos.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const distance = Math.max(Math.hypot(dx, dy), 0.01);
        const force = (k * k) / distance;
        disp[i].x += (dx / distance) * force;
        disp[i].y += (dy / distance) * force;
        disp[j].x -= (dx / distance) * force;
        disp[j].y -= (dy / distance) * force;
      }
    }
    for (const edge of edges) {
      const dx = pos[edge.source].x - pos[edge.target].x;
      const dy = pos[edge.source].y - pos[edge.target].y;
      const distance = Math.max(Math.hypot(dx, dy), 0.01);
      const force = ((distance * distance) / k) * edge.weight;
      disp[edge.source].x -= (dx / distance) * force;
      disp[edge.source].y -= (dy / distance) * force;
      disp[edge.target].x += (dx / distance) * force;
      disp[edge.target].y += (dy / distance) * force;
    }
    for (let i = 0; i < count; i++) {
      disp[i].x -= pos[i].x * 0.05;
      disp[i].y -= pos[i].y * 0.05;
      const length = Math.max(Math.hypot(disp[i].x, disp[i].y), 0.01);
      const step = Math.min(length, temperature);
      pos[i].x += (disp[i].x / length) * step;
      pos[i].y += (disp[i].y / length) * step;
    }
    temperature *= 0.98;
  }

  const xs = pos.map((p) => p.x);
  const ys = pos.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const span = Math.max(Math.max(...xs) - minX, Math.max(...ys) - minY, 1);
  const scale = (SIZE - PADDING * 2) / span;
  const fitted = pos.map((p) => ({ x: PADDING + (p.x - minX) * scale, y: PADDING + (p.y - minY) * scale }));

  // Dense tag cliques can still overlap after fitting, so push close pairs apart.
  for (let pass = 0; pass < 20; pass++) {
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = fitted[i].x - fitted[j].x;
        const dy = fitted[i].y - fitted[j].y;
        const distance = Math.max(Math.hypot(dx, dy), 0.01);
        if (distance >= MIN_GAP) continue;
        const push = (MIN_GAP - distance) / 2;
        fitted[i].x += (dx / distance) * push;
        fitted[i].y += (dy / distance) * push;
        fitted[j].x -= (dx / distance) * push;
        fitted[j].y -= (dy / distance) * push;
      }
    }
  }
  const clamp = (value: number) => Math.min(Math.max(value, PADDING), SIZE - PADDING);
  return fitted.map((p) => ({ x: clamp(p.x), y: clamp(p.y) }));
}

const subscribeNothing = () => () => {};

export function NoteGraph({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const router = useRouter();
  // Float math can differ between server and browser, so lay out on the client only.
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const [active, setActive] = useState<number | null>(null);
  const positions = useMemo(() => (mounted ? layout(nodes.length, edges) : []), [mounted, nodes.length, edges]);
  const neighbours = useMemo(() => {
    const map = nodes.map(() => new Set<number>());
    for (const edge of edges) {
      map[edge.source]?.add(edge.target);
      map[edge.target]?.add(edge.source);
    }
    return map;
  }, [nodes, edges]);
  const usedDomains = domains.filter((domain) => nodes.some((node) => node.domain === domain.slug));

  const dimmed = (index: number) => active !== null && index !== active && !neighbours[active]?.has(index);
  const focus = active !== null ? positions[active] : undefined;
  const focusNode = active !== null ? nodes[active] : undefined;

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
        {positions.length === 0 ? (
          <div className="aspect-square w-full" />
        ) : (
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="block h-auto w-full" role="img" aria-label="Note relationship graph">
            <g>
              {edges.map((edge) => {
                const from = positions[edge.source];
                const to = positions[edge.target];
                const related = edge.kind === 'related';
                const highlighted = active !== null && (edge.source === active || edge.target === active);
                return (
                  <line
                    key={`${edge.source}-${edge.target}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    className={related ? 'stroke-indigo-400' : 'stroke-fd-muted-foreground'}
                    strokeWidth={related ? 2.5 : 1}
                    strokeDasharray={related ? undefined : '4 6'}
                    strokeOpacity={active === null ? (related ? 0.7 : 0.25) : highlighted ? 0.9 : 0.06}
                  />
                );
              })}
            </g>
            <g>
              {nodes.map((node, index) => {
                const { x, y } = positions[index];
                const radius = 9 + Math.min(neighbours[index]?.size ?? 0, 8);
                return (
                  <g
                    key={node.url}
                    transform={`translate(${x} ${y})`}
                    role="link"
                    tabIndex={0}
                    aria-label={node.title}
                    className="cursor-pointer outline-none"
                    opacity={dimmed(index) ? 0.2 : 1}
                    onMouseEnter={() => setActive(index)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(index)}
                    onBlur={() => setActive(null)}
                    onClick={() => router.push(node.url)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') router.push(node.url);
                    }}
                  >
                    <title>{node.title}</title>
                    <circle r={24} fill="transparent" />
                    <circle
                      r={radius}
                      fill={domainColor(node.domain)}
                      fillOpacity={node.placeholder ? 0.4 : 1}
                      className="stroke-fd-background"
                      strokeWidth={active === index ? 0 : 2}
                    />
                    {active === index ? <circle r={radius + 5} fill="none" className="stroke-fd-foreground" strokeWidth={2} /> : null}
                  </g>
                );
              })}
            </g>
            {focus && focusNode ? (
              <text
                x={focus.x}
                y={focus.y - 34}
                textAnchor={focus.x < 200 ? 'start' : focus.x > SIZE - 200 ? 'end' : 'middle'}
                fontSize={30}
                fontWeight={600}
                className="pointer-events-none fill-fd-foreground stroke-fd-background"
                strokeWidth={8}
                paintOrder="stroke"
              >
                {focusNode.title}
              </text>
            ) : null}
          </svg>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-fd-muted-foreground">
        {usedDomains.map((domain) => (
          <span key={domain.slug} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: domainColor(domain.slug) }} />
            {domain.title}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-[#6b7285]">
        Solid lines are explicit related links. Dashed lines join notes that share a tag. Faded dots are placeholders.
      </p>
    </div>
  );
}
