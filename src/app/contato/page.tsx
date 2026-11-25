import type { Metadata } from 'next';
import { ExternalLink, MapPin, Phone } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, Card, PageHero, Section } from '@/components/ui/primitives';
import { OFFICES } from '@/lib/data/company';
import { WHATSAPP } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com a CPU House em Lauro de Freitas (BA). Agende uma consultoria pelo WhatsApp.',
  alternates: { canonical: '/contato' },
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Fale com nossos consultores"
        subtitle="Entre em contato agora mesmo. Eles estão preparados para analisar e apresentar a melhor proposta, com o melhor custo-benefício para o funcionamento otimizado dos seus recursos de TI."
      >
        <ButtonLink href={WHATSAPP} external>
          Agendar consultoria
        </ButtonLink>
      </PageHero>
      <Section>
        <div className="grid max-w-2xl gap-6">
          {OFFICES.map((o, i) => (
            <Reveal key={o.id} delay={i * 0.06}>
              <Card className="justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-md bg-surface-tint px-2.5 py-1 font-mono text-xs font-semibold uppercase text-brand-ink">
                      {o.id === 'ba' ? 'Unidade Bahia · Matriz' : 'Unidade Minas Gerais'}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {o.state} · {o.country}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-foreground">{o.name}</h2>

                  <p className="mt-4 flex items-start gap-3 text-muted-foreground">
                    <MapPin
                      className="mt-1 h-4 w-4 shrink-0 text-brand-ink"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span>
                      {o.streetAddress}
                      <br />
                      {o.city}, {o.state} · CEP {o.postalCode}
                    </span>
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {o.phones.map((p) => (
                      <li key={p.tel}>
                        <a
                          href={p.tel}
                          className="inline-flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-surface-tint"
                        >
                          <Phone
                            className="h-4 w-4 shrink-0 text-brand-ink"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <span className="tabular-nums">{p.display}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <a
                    href={o.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink hover:underline"
                  >
                    Abrir rota no mapa
                    <ExternalLink className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
