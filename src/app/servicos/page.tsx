import type { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import {
  ButtonLink,
  Card,
  CtaBlock,
  Eyebrow,
  IconBadge,
  PageHero,
  Section,
} from '@/components/ui/primitives';
import { SERVICES, WHATSAPP } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'Serviços',
  description:
    'Conectividade, segurança, servidores, suporte pró-ativo, treinamento e estratégia de backup: serviços de TI prestados com excelência.',
  alternates: { canonical: '/servicos' },
};

export default function ServicosPage() {
  return (
    <>
      <PageHero
        eyebrow="Serviços"
        title="Serviços de TI prestados com excelência"
        subtitle="Conheça alguns dentre os vários serviços que prestamos na área de tecnologia da informação."
      />

      <Section tone="alt" className="border-b border-border !py-12 md:!py-16">
        <Reveal>
          <div className="grid items-center gap-8 rounded-3xl border border-border bg-surface p-6 shadow-xs sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            <div>
              <Eyebrow>Padrão Corporativo</Eyebrow>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Infraestrutura organizada, documentada e monitorada
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Atuamos desde o cabeamento estruturado e homologação de servidores GNU/Linux até
                rotinas de backup em nuvem e manutenção preventiva contínua.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm font-medium text-foreground">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden="true" />
                  <span>Servidores e redes padronizados para alta disponibilidade</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden="true" />
                  <span>Redução de paradas não planejadas e custos com licenças</span>
                </li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-[#F4F7FB] p-2.5">
              <Image
                src="/images/servicos-datacenter.webp"
                alt="Racks de servidores corporativos com cabeamento estruturado azul em ambiente técnico climatizado"
                width={1280}
                height={714}
                priority
                sizes="(max-width: 1024px) 92vw, 560px"
                className="h-auto w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 0.06}>
              <div id={s.id} className="scroll-mt-24">
                <Card>
                  <IconBadge>
                    <s.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </IconBadge>
                  <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{s.long}</p>
                  {s.href.startsWith('/servicos#') ? (
                    <ButtonLink href={WHATSAPP} external variant="link" className="mt-5">
                      Falar com um consultor
                    </ButtonLink>
                  ) : (
                    <ButtonLink href={s.href} variant="link" arrow className="mt-5">
                      Saiba mais
                    </ButtonLink>
                  )}
                </Card>
              </div>
            </Reveal>
          ))}
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
