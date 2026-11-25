'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Cloud, Landmark, ShieldCheck } from 'lucide-react';
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
            'radial-gradient(circle at 85% 10%, rgba(14,165,233,0.22), transparent 55%), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl md:mb-10">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[#7DD3FC]">
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
                className={`group flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7DD3FC] sm:p-5 ${
                  isSelected
                    ? 'border-[#7DD3FC] bg-surface shadow-[0_12px_30px_-16px_rgba(0,0,0,0.5)]'
                    : 'border-[#2A6B8C] bg-[#0F4A66] hover:border-[#7DD3FC]/60 hover:bg-[#13557A]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                    isSelected
                      ? 'border-brand bg-brand text-brand-foreground'
                      : 'border-[#2A6B8C] bg-[#0B3C54] text-[#7DD3FC]'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div className="min-w-0">
                  <span
                    className={`block font-mono text-[11px] font-medium uppercase tracking-wider ${
                      isSelected ? 'text-brand-ink' : 'text-[#BAE6FD]'
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
          className="mt-5 grid items-center gap-8 rounded-2xl border border-[#2A6B8C] bg-surface p-6 shadow-[0_24px_56px_-28px_rgba(0,0,0,0.55)] sm:p-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12"
        >
          <div>
            <Eyebrow>{current.tag}</Eyebrow>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {current.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {current.text}
            </p>

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

          <div className="overflow-hidden rounded-2xl border border-border bg-[#F4F7FB] p-3 shadow-xs sm:p-4">
            <div className="mb-2.5 flex items-center justify-between px-1 font-mono text-[10px] font-medium uppercase tracking-wider text-brand-ink sm:text-[11px]">
              <span>{current.specLabel}</span>
              <span className="text-muted-foreground">ARQUITETURA</span>
            </div>
            <div className="grid place-items-center overflow-hidden rounded-xl border border-border/70 bg-white">
              {SOLUTIONS.map((sol, idx) => (
                <div
                  key={sol.id}
                  aria-hidden={idx !== activeIdx}
                  className={`col-start-1 row-start-1 w-full transition-all duration-300 ${
                    idx === activeIdx
                      ? 'scale-100 opacity-100'
                      : 'pointer-events-none scale-[0.98] opacity-0'
                  }`}
                >
                  <Image
                    src={sol.image}
                    alt={sol.imageAlt}
                    width={1000}
                    height={747}
                    loading="eager"
                    sizes="(max-width: 1024px) 92vw, 480px"
                    className="h-auto w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
