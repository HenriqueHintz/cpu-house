import type { Metadata } from 'next';
import { PricingTable } from '@/components/ui/PricingTable';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, CtaBlock, PageHero, Section } from '@/components/ui/primitives';
import { WHATSAPP } from '@/lib/data/content';
import { SAMBA_AD_ROWS } from '@/lib/data/plans';

export const metadata: Metadata = {
  title: 'Samba4 AD Small Business',
  description:
    'Gerência completa de usuários e serviços de rede com Samba4 Active Directory, sem custo de licenças. Compare os planos Starter, Standard e Advanced.',
  alternates: { canonical: '/produtos/samba_ad' },
};

const COLUMNS = [
  { key: 'starter', label: 'Starter' },
  { key: 'standard', label: 'Standard' },
  { key: 'advanced', label: 'Advanced' },
];

const CATEGORIES = [
  {
    title: 'Recursos por plano',
    rows: SAMBA_AD_ROWS.map(({ feature, values }) => ({ feature, values })),
  },
];

export default function SambaAdPage() {
  return (
    <>
      <PageHero
        eyebrow="Produtos · Samba4 AD"
        title="Samba4 AD Small Business"
        subtitle="Gerência completa de usuários e serviços de rede, sem custo de licenças."
      >
        <ButtonLink href={WHATSAPP} external>
          Agendar consultoria
        </ButtonLink>
      </PageHero>

      <Section eyebrow="O primeiro servidor" title="Quando a sua empresa precisa de um servidor de diretório">
        <Reveal className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Quando a empresa cresce, chega o momento de instalar o primeiro servidor. Um servidor de
            diretório centraliza usuários, computadores e permissões em um só lugar.
          </p>
          <p>
            Na prática: uma única senha para acessar todos os recursos da rede, ou seja, autenticação
            única — Single Sign-On (SSO).
          </p>
        </Reveal>
      </Section>

      <Section tone="alt" eyebrow="Planos" title="Compare os planos" intro="Valores sob consulta.">
        <Reveal>
          <PricingTable
            caption="Comparativo de recursos dos planos Starter, Standard e Advanced do Samba4 AD"
            columns={COLUMNS}
            categories={CATEGORIES}
          />
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            *** A administração avançada através das ferramentas RSAT requer licença do Windows na estação administradora.
          </p>
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
