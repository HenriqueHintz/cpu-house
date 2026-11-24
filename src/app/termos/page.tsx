import type { Metadata } from 'next';
import { PageHero, Section } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Termos de uso',
  description: 'Termos de uso do site da CPU House.',
  alternates: { canonical: '/termos' },
};

export default function TermosPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Termos de uso" />
      <Section>
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted-foreground">
          <p>
            Este site tem finalidade institucional e informativa. Os serviços e produtos descritos
            são contratados mediante proposta comercial.
          </p>
          <p>
            O texto jurídico completo dos termos será publicado pela CPU House. Dúvidas podem ser
            enviadas pelos canais da página de contato.
          </p>
        </div>
      </Section>
    </>
  );
}
