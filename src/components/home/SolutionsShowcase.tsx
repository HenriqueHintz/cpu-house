'use client';

import { useState } from 'react';
import { Cloud, Landmark, ShieldCheck } from 'lucide-react';
import { IsoIllustration } from '@/components/iso/IsoIllustration';
import { WordReveal } from '@/components/ui/WordReveal';
import { ButtonLink, Chip, Eyebrow } from '@/components/ui/primitives';
import { SOLUTIONS } from '@/lib/data/content';

const TAB_ICONS = {
  seguranca: ShieldCheck,
  backup: Cloud,
  ecidade: Landmark,
} as const;

export function SolutionsShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = SOLUTIONS[activeIdx] ?? SOLUTIONS[0];

  return (
    <section id="solucoes" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl md:mb-12">
          <Eyebrow>Nossas soluções</Eyebrow>
          <WordReveal
            as="h2"
            text="Soluções seguras e modernas, baseadas em tecnologias open source consagradas"
            className="mt-3 text-3xl font-bold tracking-[-0.025em] text-foreground sm:text-4xl"
          />
        </div>

        {/* Horizontal 3-Column Selector — zero vertical scroll needed */}
        <div
          role="tablist"
          aria-label="Nossas soluções"
          className="grid gap-3 md:grid-cols-3 md:gap-4"
        >
          {SOLUTIONS.map((sol, idx) => {
            const isSelected = idx === activeIdx;
            const Icon = TAB_ICONS[sol.kind];
            return (
              <button
                key={sol.id}
                id={`tab-${sol.id}`}
                role="tab"
                type="button"
                aria-selected={isSelected}
                aria-controls={`panel-${sol.id}`}
                onClick={() => setActiveIdx(idx)}
                className={`group flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5 ${
                  isSelected
                    ? 'border-brand bg-surface shadow-[0_12px_30px_-16px_rgba(11,79,108,0.28)] ring-1 ring-brand/20'
                    : 'border-border bg-surface/60 hover:border-brand/40 hover:bg-surface'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                    isSelected
                      ? 'border-brand bg-brand text-brand-foreground'
                      : 'border-border bg-surface-tint text-brand-ink group-hover:border-brand/30'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div className="min-w-0">
                  <span className="block font-mono text-[11px] font-medium uppercase tracking-wider text-brand-ink">
                    {sol.tag}
                  </span>
                  <span className="mt-1 block text-base font-bold leading-snug text-foreground">
                    {sol.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Unified Single-Screen Stage */}
        <div
          id={`panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${current.id}`}
          className="mt-6 grid items-center gap-8 rounded-2xl border border-border bg-surface p-6 shadow-[0_20px_50px_-28px_rgba(11,79,108,0.2)] sm:p-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12"
        >
          <div>
            <Eyebrow>{current.tag}</Eyebrow>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {current.title}
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{current.text}</p>

            {current.tech && (
              <div className="mt-6 flex flex-wrap gap-2">
                {current.tech.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <ButtonLink href={current.href} variant="primary" arrow={!current.external} external={current.external}>
                Saiba mais
              </ButtonLink>
              <ButtonLink href="/solucoes" variant="link" arrow>
                Ver todas as soluções
              </ButtonLink>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="grid place-items-center rounded-2xl border border-border/70 bg-background/70 p-4 sm:p-6"
          >
            {SOLUTIONS.map((sol, idx) => (
              <div
                key={sol.id}
                className={`col-start-1 row-start-1 w-full max-w-[390px] transition-all duration-300 ${
                  idx === activeIdx
                    ? 'scale-100 opacity-100'
                    : 'pointer-events-none scale-95 opacity-0'
                }`}
              >
                <IsoIllustration kind={sol.kind} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
