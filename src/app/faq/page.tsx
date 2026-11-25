import type { Metadata } from 'next';
import { FaqAccordion } from '@/components/faq/FaqAccordion';
import { PageHero, Section } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Perguntas frequentes',
  description:
    'Respostas rápidas sobre preventivas corporativas, backup, Área do Cliente e atendimento da CPU House.',
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
    a: 'Nossa sede fica em Lauro de Freitas (BA), com atendimento presencial na região e suporte remoto para todo o Brasil.',
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Perguntas frequentes" />
      <Section>
        <FaqAccordion items={FAQ} />
      </Section>
    </>
  );
}
