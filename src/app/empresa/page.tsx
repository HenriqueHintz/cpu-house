import type { Metadata } from 'next';
import { ArrowUpRight, Check, Quote } from 'lucide-react';
import { TimelineTrack } from '@/components/empresa/TimelineTrack';
import { Reveal } from '@/components/ui/Reveal';
import { Card, Chip, CtaBlock, PageHero, Section } from '@/components/ui/primitives';
import {
  CRIANCAS_HACKERS,
  OPEN_SOURCE,
  SOCIAL_PROJECTS,
  TIMELINE,
  WHATSAPP,
} from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'Empresa',
  description:
    'Fundada em 2007, a CPU House é uma consultoria de TI com raízes no software livre, membro ativo da ASL e associada à Open Invention Network.',
  alternates: { canonical: '/empresa' },
};

export default function EmpresaPage() {
  return (
    <>
      <PageHero
        eyebrow="Empresa"
        title="Nossa história"
        subtitle="Consultoria e soluções em TI, construídas desde 2007 com tecnologias open source e uma equipe formada por líderes."
      />

      <Section>
        <Reveal>
          <figure className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12">
            <Quote
              className="h-8 w-8 text-brand/25"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <blockquote className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
              “Um líder deve incentivar, motivar e sempre acreditar em seus liderados. Dessa forma
              não teremos um grande líder e sim uma grande equipe formada por líderes.”
            </blockquote>
          </figure>
        </Reveal>
      </Section>

      <Section
        tone="alt"
        eyebrow="Linha do tempo"
        title="De varejo de informática a SaaS em nuvem"
      >
        <TimelineTrack items={TIMELINE} />
      </Section>

      <Section
        eyebrow="Comunidade Open Source"
        title="Presença ativa na comunidade GNU"
        intro="A CPU House esteve presente nos mais importantes eventos de tecnologia, representada por seu CEO Cristiano Furtado, com portfólio extenso em gestão de TI e soluções em Software Livre."
      >
        <Reveal className="flex flex-wrap gap-3">
          {OPEN_SOURCE.map((item) =>
            item === 'Suporte Linux' ? (
              <a
                key={item}
                href="https://www.facebook.com/suportelinux/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-surface-tint px-3.5 py-1.5 font-mono text-xs font-medium text-brand-ink transition-colors hover:bg-brand hover:text-brand-foreground"
              >
                {item}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </a>
            ) : (
              <Chip key={item}>{item}</Chip>
            )
          )}
        </Reveal>
      </Section>

      <Section
        tone="alt"
        eyebrow="Projetos sociais"
        title="Tecnologia também é compromisso social"
        intro="A empresa sempre participou de projetos de cunho social e de atividades de extensão."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <Card className="h-full">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-brand-ink">
                {'// Em destaque'}
              </span>
              <h3 className="mt-3 text-2xl font-bold text-foreground">Crianças Hackers</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Projeto em que crianças desmontam e criam objetos tecnológicos, unindo tecnologia e
                diversão. A CPU House participou da iniciativa.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {CRIANCAS_HACKERS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-brand-ink transition-colors hover:border-brand/40 hover:bg-surface-tint"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="h-full">
              <h3 className="text-lg font-bold text-foreground">Outras iniciativas</h3>
              <ul className="mt-4 space-y-3">
                {['Projeto Casa Brasil', ...SOCIAL_PROJECTS].map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-muted-foreground">
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-brand-ink"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </Section>

      <CtaBlock
        title="Fale com nossos consultores."
        text="Analisamos seu ambiente e apresentamos a proposta com o melhor custo-benefício para sua TI."
        href={WHATSAPP}
      />
    </>
  );
}
