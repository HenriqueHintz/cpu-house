import { ShieldCheck } from 'lucide-react';
import { HeroSceneStage } from '@/components/iso/HeroSceneStage';
import { WordReveal } from '@/components/ui/WordReveal';
import { ButtonLink } from '@/components/ui/primitives';
import { WHATSAPP } from '@/lib/data/content';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-background bg-tech-grid">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-surface via-transparent to-transparent"
      />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-8 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 py-1.5 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-ink" strokeWidth={1.75} aria-hidden="true" />
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-brand-ink">
              CONSULTORIA E SOLUÇÕES EM TI · DESDE 2007
            </p>
          </div>

          <WordReveal
            as="h1"
            immediate
            text="Infraestrutura de TI segura, estável e sem surpresas."
            className="mt-6 text-4xl font-bold leading-[1.06] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[56px]"
          />

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Servidores, segurança, backup em nuvem e suporte pró-ativo com tecnologias open source
            consagradas, para sua equipe produzir mais e parar menos.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <ButtonLink href={WHATSAPP} external>
              Agendar consultoria
            </ButtonLink>
            <ButtonLink href="#solucoes" variant="link" arrow>
              Conhecer soluções
            </ButtonLink>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <HeroSceneStage />
        </div>
      </div>
    </section>
  );
}
