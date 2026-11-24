import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, Card, CtaBlock, IconBadge, PageHero, Section } from '@/components/ui/primitives';
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
