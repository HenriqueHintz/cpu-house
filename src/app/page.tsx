import type { Metadata } from 'next';
import Image from 'next/image';
import { Activity, CheckCircle2 } from 'lucide-react';
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

        <Reveal className="mt-12">
          <div className="grid items-stretch overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_20px_50px_-28px_rgba(15,23,42,0.16)] lg:grid-cols-[1.06fr_0.94fr]">
            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/20 bg-surface-tint px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider text-brand-ink">
                <Activity className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                Preventiva Corporativa
              </div>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Seu parque de computadores está lento ou parando sem aviso?
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Prolongue a vida útil de servidores e estações com inventário online, checklists
                agendados e atuação preventiva antes que falhas gerem perda de dados e prejuízo.
              </p>
              <ul className="mt-5 grid gap-2.5 text-sm text-foreground sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden="true" />
                  <span>Inventário online de ativos e licenças</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden="true" />
                  <span>Checklists periódicos em servidores</span>
                </li>
              </ul>
              <div className="mt-7">
                <ButtonLink href="/servicos/preventivas" variant="primary" arrow>
                  Conhecer a preventiva
                </ButtonLink>
              </div>
            </div>

            <div className="min-h-[260px] overflow-hidden border-t border-border bg-slate-100 sm:min-h-[320px] lg:min-h-full lg:border-t-0 lg:border-l">
              <Image
                src="/images/preventiva-diagnostico.webp"
                alt="Especialista realizando manutenção preventiva e diagnóstico técnico em hardware de servidor corporativo"
                width={1200}
                height={670}
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 560px"
                className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </Reveal>
      </Section>

      <SolutionsShowcase />

      <Section id="numeros" className="border-y border-border bg-white !py-12 md:!py-16">
        <div className="grid gap-8 rounded-2xl border border-border bg-background p-8 sm:grid-cols-3 sm:divide-x sm:divide-border sm:gap-0 sm:p-10">
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
