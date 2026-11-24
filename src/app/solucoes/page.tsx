import type { Metadata } from 'next';
import { IsoIllustration } from '@/components/iso/IsoIllustration';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, Chip, CtaBlock, Eyebrow, PageHero, Section } from '@/components/ui/primitives';
import { SOLUTIONS, WHATSAPP } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'Soluções',
  description:
    'Soluções seguras e modernas baseadas em tecnologias open source: controle de acesso à web, backup em nuvem e e-Cidade.',
  alternates: { canonical: '/solucoes' },
};

export default function SolucoesPage() {
  return (
    <>
      <PageHero
        eyebrow="Soluções"
        title="Soluções seguras e modernas"
        subtitle="Baseadas nas mais conceituadas e consagradas tecnologias Open Source."
      />
      <Section>
        <div className="space-y-20 md:space-y-28">
          {SOLUTIONS.map((sol, i) => (
            <div key={sol.id} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <Reveal className={i % 2 === 1 ? 'md:order-2' : ''}>
                <Eyebrow>{sol.tag}</Eyebrow>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {sol.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{sol.text}</p>
                {sol.tech && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {sol.tech.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                )}
                <div className="mt-8">
                  <ButtonLink href={sol.href} variant="link" arrow external={sol.external}>
                    Saiba mais
                  </ButtonLink>
                </div>
              </Reveal>
              <Reveal className={`mx-auto w-full max-w-[460px] ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                <IsoIllustration kind={sol.kind} />
              </Reveal>
            </div>
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
