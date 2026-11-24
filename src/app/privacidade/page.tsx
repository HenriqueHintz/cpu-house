import type { Metadata } from 'next';
import { PageHero, Section } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Política de Privacidade (LGPD)',
  description: 'Política de privacidade do site da CPU House, em conformidade com a LGPD.',
  alternates: { canonical: '/privacidade' },
};

export default function PrivacidadePage() {
  return (
    <>
      <PageHero eyebrow="Legal · LGPD" title="Política de Privacidade" />
      <Section>
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted-foreground">
          <p>
            Este site não possui formulários de cadastro nem área de login. O contato é feito por
            canais externos, como o WhatsApp, e o acesso à Área do Cliente acontece em um ambiente
            separado, em suporte.cpuhouse.com.br.
          </p>
          <p>
            O texto completo da política de privacidade, conforme a LGPD, será publicado pela CPU
            House.
          </p>
        </div>
      </Section>
    </>
  );
}
