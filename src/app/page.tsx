import type { Metadata } from 'next';
import { Activity } from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { SolutionsShowcase } from '@/components/home/SolutionsShowcase';
import { CountUp } from '@/components/ui/CountUp';
import { Reveal } from '@/components/ui/Reveal';
import {
  ButtonLink,
  Card,
  CardLinkLabel,
  CtaBlock,
  IconBadge,
  Section,
  TeamCard,
} from '@/components/ui/primitives';
import { COMPANY } from '@/lib/data/company';
import { SERVICES, STATS, TEAM, WHATSAPP } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'CPU House — Consultoria e Soluções em TI',
  description: COMPANY.shortDescription,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section
        id="servicos"
        tone="alt"
        title="Serviços prestados com excelência em tecnologia da informação"
        intro="Conheça alguns dentre os vários serviços que prestamos na área de TI."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.05}>
              <Card href={s.href}>
                <IconBadge>
                  <s.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </IconBadge>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.short}</p>
                <CardLinkLabel>Saiba mais</CardLinkLabel>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-brand/25 bg-surface-tint p-6 sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground sm:inline-flex"
              >
                <Activity className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-lg font-semibold text-foreground">Seu computador está lento?</p>
                <p className="mt-1 text-muted-foreground">
                  Prolongue a vida útil de seus computadores e trabalhe com maior rapidez. Conheça a
                  preventiva corporativa CPU House.
                </p>
              </div>
            </div>
            <ButtonLink href="/servicos/preventivas" variant="secondary" arrow className="shrink-0">
              Conhecer a preventiva
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <SolutionsShowcase />

      <Section id="numeros" className="border-y border-border/80 bg-background bg-tech-dots !py-16 md:!py-24">
        <div className="grid gap-8 rounded-2xl border border-border bg-surface p-8 shadow-xs sm:grid-cols-3 sm:divide-x sm:divide-border sm:gap-0 sm:p-10">
          {STATS.map((s, idx) => {
            const srSummary =
              s.to === 2007
                ? 'Desde 2007'
                : s.to === 18
                  ? '18+ anos de mercado'
                  : '100% open source';

            return (
              <Reveal
                key={s.label}
                delay={idx * 0.06}
                className={idx > 0 ? 'sm:pl-8 lg:pl-10' : 'sm:pr-6'}
              >
                <div>
                  <p className="font-display text-5xl font-bold tracking-[-0.03em] text-brand-ink tabular-nums sm:text-6xl">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="mt-3 text-base font-semibold text-foreground">{srSummary}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section
        id="equipe"
        tone="alt"
        eyebrow="Equipe"
        title="Nosso patrimônio intelectual"
        intro="O nosso time é formado por profissionais experientes e inteirados das tendências do mercado de tecnologia, com conhecimentos que vão da gestão tecnológica a recursos técnicos avançados."
      >
        <div className="grid gap-6 sm:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <TeamCard {...m} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <ButtonLink href="/empresa" variant="link" arrow>
            Nossa história
          </ButtonLink>
          <ButtonLink href="https://raulhc.cc/Projetos/CriancasHacker" variant="link" external>
            Projeto social: Crianças Hackers
          </ButtonLink>
        </Reveal>
      </Section>

      <CtaBlock
        title="Fale com nossos consultores."
        text="Analisamos seu ambiente e apresentamos a proposta com o melhor custo-benefício para sua TI."
        href={WHATSAPP}
      />
    </>
  );
}
