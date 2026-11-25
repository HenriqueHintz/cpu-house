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
    <section
      id="solucoes"
      className="relative overflow-hidden bg-petroleum py-16 md:py-22"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 85% 10%, rgba(34,184,207,0.22), transparent 55%), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl md:mb-10">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[#67E8F9]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            Nossas soluções
          </p>
          <WordReveal
            as="h2"
            text="Soluções seguras e modernas, baseadas em tecnologias open source consagradas"
            className="mt-3 text-3xl font-bold tracking-[-0.025em] text-white sm:text-4xl"
          />
        </div>

        <div role="tablist" aria-label="Nossas soluções" className="grid gap-3 md:grid-cols-3 md:gap-4">
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
                className={`group flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67E8F9] sm:p-5 ${
                  isSelected
                    ? 'border-[#67E8F9] bg-surface shadow-[0_12px_30px_-16px_rgba(0,0,0,0.5)]'
                    : 'border-[#2A6B8C] bg-[#0F4A66] hover:border-[#67E8F9]/60 hover:bg-[#13557A]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                    isSelected
                      ? 'border-brand bg-brand text-brand-foreground'
                      : 'border-[#2A6B8C] bg-[#0B3C54] text-[#67E8F9]'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div className="min-w-0">
                  <span
                    className={`block font-mono text-[11px] font-medium uppercase tracking-wider ${
                      isSelected ? 'text-brand-ink' : 'text-[#9AE6F5]'
                    }`}
                  >
                    {sol.tag}
                  </span>
                  <span
                    className={`mt-1 block text-base font-bold leading-snug ${
                      isSelected ? 'text-foreground' : 'text-white'
                    }`}
                  >
                    {sol.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div
          id={`panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${current.id}`}
          className="mt-5 grid items-center gap-8 rounded-2xl border border-[#2A6B8C] bg-surface p-6 shadow-[0_24px_56px_-28px_rgba(0,0,0,0.55)] sm:p-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12"
        >
          <div>
            <Eyebrow>{current.tag}</Eyebrow>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {current.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{current.text}</p>

            {current.tech && (
              <div className="mt-5 flex flex-wrap gap-2">
                {current.tech.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-6">
              <ButtonLink
                href={current.href}
                variant="primary"
                arrow={!current.external}
                external={current.external}
              >
                Saiba mais
              </ButtonLink>
              <ButtonLink href="/solucoes" variant="link" arrow>
                Ver todas as soluções
              </ButtonLink>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hidden place-items-center rounded-2xl border border-border bg-background/70 p-4 sm:grid sm:p-6"
          >
            {SOLUTIONS.map((sol, idx) => (
              <div
                key={sol.id}
                className={`col-start-1 row-start-1 w-full max-w-[340px] transition-all duration-300 ${
                  idx === activeIdx ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
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
