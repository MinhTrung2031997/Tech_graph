'use client';

import type { CurriculumSection } from '@/lib/blogs';
import { ChevronDown, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

export function BlogCurriculum({ sections }: { sections: CurriculumSection[] }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(sections.slice(0, 1).map((section) => section.id)));
  const allOpen = sections.length > 0 && open.size === sections.length;
  const posts = sections.reduce((sum, section) => sum + section.lessons.length, 0);
  const minutes = sections.reduce((sum, section) => sum + section.minutes, 0);

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="not-prose mb-10">
      <h2 className="text-xl font-bold tracking-tight">Course content</h2>
      <div className="mt-2 mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-fd-muted-foreground">
        <span>
          {plural(sections.length, 'section')} • {plural(posts, 'post')} • {formatMinutes(minutes)} total reading
        </span>
        <button
          type="button"
          className="font-semibold text-indigo-400 hover:text-indigo-300"
          onClick={() => setOpen(allOpen ? new Set() : new Set(sections.map((section) => section.id)))}
        >
          {allOpen ? 'Collapse all sections' : 'Expand all sections'}
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => {
          const expanded = open.has(section.id);
          const written = section.lessons.filter((lesson) => lesson.url).length;
          return (
            <div key={section.id} className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => toggle(section.id)}
                className="flex w-full items-center gap-3 bg-[#141826] px-4 py-3.5 text-left hover:bg-[#181d2c]"
              >
                <ChevronDown className={`size-4 shrink-0 transition-transform ${expanded ? '' : '-rotate-90'}`} aria-hidden />
                <span className="min-w-0 flex-1">
                  {section.group ? <span className="block text-xs text-[#6b7285]">{section.group}</span> : null}
                  <span className="block font-semibold">
                    {/* Session folders already carry their own number in the title. */}
                    {/^Session \d/u.test(section.title) ? section.title : `Section ${index + 1}: ${section.title}`}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-[#7d8496]">
                  {written}/{plural(section.lessons.length, 'post')}
                  {section.minutes > 0 ? ` • ${formatMinutes(section.minutes)}` : ''}
                </span>
              </button>

              {expanded ? (
                <ul className="border-t border-fd-border">
                  {section.lessons.map((lesson) => (
                    <li key={lesson.url ?? lesson.title} className="border-b border-[#171b24] last:border-b-0">
                      {lesson.url ? (
                        <Link href={lesson.url} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#141826]">
                          <FileText className="size-4 shrink-0 text-indigo-400" aria-hidden />
                          <span className="flex-1 text-fd-foreground">{lesson.title}</span>
                          <span className="shrink-0 text-xs text-[#7d8496]">{lesson.minutes} min</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6b7285]">
                          <Clock className="size-4 shrink-0" aria-hidden />
                          <span className="flex-1">{lesson.title}</span>
                          <span className="shrink-0 text-xs">Coming soon</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
