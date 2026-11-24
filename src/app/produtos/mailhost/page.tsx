import type { Metadata } from 'next';
import { PricingTable } from '@/components/ui/PricingTable';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, Chip, CtaBlock, PageHero, Section } from '@/components/ui/primitives';
import { WHATSAPP } from '@/lib/data/content';
import { MAILHOST_CATEGORIES, MAILHOST_INTEGRATION_CHIPS } from '@/lib/data/plans';

export const metadata: Metadata = {
  title: 'Servidor de E-mails',
  description:
    'Solução completa e segura de e-mail institucional com anti-spam, antivírus, criptografia e integração com Active Directory, LDAP e Samba.',
  alternates: { canonical: '/produtos/mailhost' },
};

const COLUMNS = [
  { key: 'starter', label: 'Starter' },
  { key: 'standard', label: 'Standard' },
  { key: 'advanced', label: 'Advanced' },
  { key: 'hosted', label: 'Hosted' },
];

export default function MailhostPage() {
  return (
    <>
      <PageHero
        eyebrow="Produtos · Mailhost"
        title="Servidor de E-mails"
        subtitle="Solução completa e segura de e-mail institucional."
      >
        <ButtonLink href={WHATSAPP} external>
          Agendar consultoria
        </ButtonLink>
      </PageHero>

      <Section eyebrow="Segurança" title="E-mail institucional protegido do servidor à ponta">
        <Reveal className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Segurança em primeiro lugar: anti-spam, antivírus, proteção contra engenharia social e
            criptografia no servidor e ponta a ponta.
          </p>
          <p>
            Construído sobre software livre, o sistema é modular, escalável e tem baixo footprint.
          </p>
        </Reveal>
      </Section>

      <Section tone="alt" eyebrow="Integrações" title="Conversa com o que você já usa">
        <Reveal className="flex flex-wrap gap-3">
          {MAILHOST_INTEGRATION_CHIPS.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </Reveal>
      </Section>

      <Section
        eyebrow="Planos"
        title="Compare os planos"
        intro="Valores sob consulta. Cada categoria pode ser recolhida para facilitar a leitura."
      >
        <Reveal>
          <PricingTable
            caption="Comparativo de recursos dos planos Starter, Standard, Advanced e Hosted do servidor de e-mails"
            columns={COLUMNS}
            categories={MAILHOST_CATEGORIES}
            collapsible
          />
        </Reveal>
        <p className="mt-6 max-w-3xl text-muted-foreground">
          <span className="font-mono text-xs uppercase tracking-wider text-brand-ink">{'// Escalabilidade — '}</span>
          o sistema pode rodar em um único servidor ou em vários servidores trabalhando juntos.
        </p>
      </Section>

      <CtaBlock
        title="Fale com nossos consultores."
        text="Analisamos seu ambiente e apresentamos a proposta com o melhor custo-benefício para sua TI."
        href={WHATSAPP}
      />
    </>
  );
}
