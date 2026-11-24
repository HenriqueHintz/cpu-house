import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import { PageHero, Section } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Perguntas frequentes',
  description: 'Respostas rápidas sobre preventivas corporativas, backup, Área do Cliente e atendimento da CPU House.',
  alternates: { canonical: '/faq' },
};

const FAQ = [
  {
    q: 'O que é a Preventiva Corporativa?',
    a: 'Também conhecida como suporte pró-ativo, é um serviço em que as falhas são previstas e corrigidas antes que se manifestem e causem perda de dados e prejuízos. Nossos técnicos levantam os dados do seu parque computacional e os comparam com uma base de fatores de risco.',
  },
  {
    q: 'Como acesso o inventário e abro chamados?',
    a: 'Pela Área do Cliente, em suporte.cpuhouse.com.br. Lá você também acompanha as preventivas agendadas e avalia cada atendimento.',
  },
  {
    q: 'O backup em nuvem está de acordo com a LGPD?',
    a: 'Sim. O backup em nuvem da CPU House usa criptografia e é prestado de acordo com a legislação da LGPD.',
  },
  {
    q: 'Quais tecnologias vocês usam?',
    a: 'Tecnologias open source consagradas, como Squid, SquidGuard, DansGuardian e Samba4.',
  },
  {
    q: 'Onde a CPU House atende?',
    a: 'Temos escritórios em Lauro de Freitas (BA) e Sete Lagoas (MG).',
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Perguntas frequentes" />
      <Section>
        <div className="max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface">
          {FAQ.map((item) => (
            <details key={item.q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-foreground">
                {item.q}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
