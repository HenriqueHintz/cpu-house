import { ShieldCheck } from 'lucide-react';
import { HeroSceneStage } from '@/components/iso/HeroSceneStage';
import { WordReveal } from '@/components/ui/WordReveal';
import { ButtonLink } from '@/components/ui/primitives';
import { WHATSAPP } from '@/lib/data/content';

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden border-b border-border bg-white">
      {/* Subtle architectural split: clean white canvas + soft cool-blue aura behind the 3D stage */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(640px circle at 76% 48%, rgba(14, 165, 233, 0.10), rgba(11, 79, 108, 0.04) 48%, transparent 75%), linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        }}
      />
      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-8 lg:py-12">
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background px-3.5 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-ink" strokeWidth={1.75} aria-hidden="true" />
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-brand-ink">
              CONSULTORIA E SOLUÇÕES EM TI · DESDE 2007
            </p>
          </div>

          <WordReveal
            as="h1"
            immediate
            text="Infraestrutura de TI blindada para sua empresa nunca parar."
            className="mt-5 text-[34px] font-bold leading-[1.06] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[54px]"
          />

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Servidores, segurança de rede, backup em nuvem (LGPD) e suporte pró-ativo com
            tecnologias open source consagradas — menos paradas, custo previsível e equipe 100%
            produtiva.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
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
