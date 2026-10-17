import type { ReactNode } from 'react';

const tones = {
  neutral: 'border-[#2a3040] text-[#aeb5c5]',
  green: 'border-[#1f4d33] bg-[#0f2219] text-[#4ade80]',
  indigo: 'border-[#33366b] bg-[#15172e] text-[#a5b4fc]',
  amber: 'border-[#53401a] bg-[#221a0b] text-[#fbbf24]',
};

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11.5px] leading-5 ${tones[tone]}`}>
      {children}
    </span>
  );
}

const typeLabels: Record<string, string> = {
  concept: 'Concept',
  comparison: 'Comparison',
  cheatsheet: 'Cheatsheet',
  pattern: 'Pattern',
  'how-to': 'How-to',
  domain: 'Domain',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  reviewed: 'Reviewed',
  'needs-update': 'Needs update',
};

export function typeLabel(type?: string) {
  if (!type) return undefined;
  return typeLabels[type] ?? type;
}

export function statusLabel(status?: string) {
  if (!status) return undefined;
  return statusLabels[status] ?? status;
}

export function statusTone(status?: string): keyof typeof tones {
  if (status === 'reviewed') return 'green';
  if (status === 'draft' || status === 'needs-update') return 'amber';
  return 'neutral';
}
