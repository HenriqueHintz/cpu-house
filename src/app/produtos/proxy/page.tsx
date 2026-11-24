import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import { ButtonLink, Card, CtaBlock, PageHero, Section } from '@/components/ui/primitives';
import { PROXY_ADVANTAGES, WHATSAPP } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'Servidor Proxy',
  description:
    'Solução completa para controle de acesso à web: aceleração, monitoramento e filtragem de malware, sites maliciosos e conteúdo impróprio.',
  alternates: { canonical: '/produtos/proxy' },
};

const ARCH = [
  { n: '01', title: 'Objetos de rede', text: 'Equipamentos, usuários e redes que acessam a Internet.' },
  { n: '02', title: 'Perfis de acesso', text: 'Agrupam as regras de acordo com a necessidade de cada uso.' },
  { n: '03', title: 'Regras de filtro de conteúdo', text: 'Definem o que pode ou não ser acessado.' },
];

function ProxyFlowDiagram() {
  return (
    <div
      aria-hidden="true"
      className="mb-8 hidden overflow-hidden rounded-2xl border border-border bg-background p-6 lg:block"
    >
      <svg viewBox="0 0 960 120" className="h-auto w-full" focusable="false">
        <defs>
          <linearGradient id="proxy-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B4F6C" />
            <stop offset="50%" stopColor="#22B8CF" />
            <stop offset="100%" stopColor="#0B4F6C" />
          </linearGradient>
        </defs>

        {/* Base Conduit */}
        <line x1="160" y1="60" x2="800" y2="60" stroke="#CBD5E1" strokeWidth="2" />
        <line
          x1="160"
          y1="60"
          x2="800"
          y2="60"
          stroke="url(#proxy-line)"
          strokeWidth="3"
          className="iso-packet"
        />

        {/* Stage Nodes */}
        {[
          { cx: 160, label: 'LAN · ESTAÇÕES' },
          { cx: 480, label: 'SQUID · PERFIS ACL' },
          { cx: 800, label: 'FILTRO · WEB SEGURA' },
        ].map((node, idx) => (
          <g key={node.label}>
            <circle cx={node.cx} cy={60} r={26} fill="#FFFFFF" stroke="#0B4F6C" strokeWidth="2" />
            <circle
              cx={node.cx}
              cy={60}
              r={8}
              fill={idx === 1 ? '#22B8CF' : '#0B4F6C'}
              className="iso-led"
              style={{ ['--d' as string]: `${idx * 0.5}s` }}
            />
            <text
              x={node.cx}
              y={106}
              textAnchor="middle"
              fill="#475569"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="600"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function ProxyPage() {
  return (
    <>
      <PageHero
        eyebrow="Produtos · Proxy"
        title="Servidor Proxy"
        subtitle="Solução completa para controle de acesso à web."
      >
        <ButtonLink href={WHATSAPP} external>
          Solicitar avaliação técnica
        </ButtonLink>
      </PageHero>

      <Section eyebrow="O problema" title="Como a Internet gera valor, sem desperdício?">
        <Reveal className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            A rápida evolução das redes e da Internet criou inúmeras vantagens para os negócios. Mas a
            popularização da rede e a diversidade de conteúdo trouxeram um problema: como otimizar o
            uso, garantindo que as informações acessadas sejam proveitosas ao negócio?
          </p>
          <p>
            Como garantir que não haverá desperdício de recursos (largura de banda, memória, uso de
            disco) e, ao mesmo tempo, a qualidade e a confiabilidade da informação acessada?
          </p>
        </Reveal>
      </Section>

      <Section
        tone="alt"
        eyebrow="O que o proxy entrega"
        title="Um ativo de rede que cria essas garantias"
        intro="Um proxy é composto de serviços que criam o ambiente ideal para o melhor aproveitamento dos recursos computacionais e de rede, de forma rápida, otimizada e econômica."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Aceleração', 'Potencialização da velocidade de acesso à informação.'],
            ['Controle e monitoramento', 'Controle e monitoramento do acesso à informação.'],
            ['Filtragem', 'Bloqueio de malware, sites maliciosos, vírus e conteúdo impróprio.'],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.06}>
              <Card>
                <h3 className="text-lg font-bold text-foreground">{t}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{d}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Vantagens" title="Quais as vantagens?">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROXY_ADVANTAGES.map((a, i) => (
            <Reveal key={a.title} delay={(i % 3) * 0.06}>
              <Card>
                <h3 className="text-lg font-bold text-foreground">{a.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{a.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        tone="alt"
        eyebrow="Arquitetura da solução"
        title="Três estruturas distintas e relacionadas"
        intro="Definem-se regras de filtro de conteúdo conforme a necessidade de cada uso; elas são agrupadas em perfis de acesso, e os perfis são atribuídos aos objetos de rede."
      >
        <Reveal>
          <ProxyFlowDiagram />
          <ol className="grid gap-5 lg:grid-cols-3">
            {ARCH.map((step) => (
              <li
                key={step.n}
                className="rounded-2xl border border-border bg-surface p-6 shadow-2xs transition-colors hover:border-brand/40"
              >
                <span className="inline-flex rounded-md bg-surface-tint px-2.5 py-1 font-mono text-xs font-semibold text-brand-ink tabular-nums">
                  {step.n}
                </span>
                <h3 className="mt-3 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <CtaBlock
        title="Solicite uma avaliação técnica."
        text="Analisamos seu ambiente e apresentamos a proposta com o melhor custo-benefício para sua TI."
        label="Solicitar avaliação técnica"
        href={WHATSAPP}
      />
    </>
  );
}
