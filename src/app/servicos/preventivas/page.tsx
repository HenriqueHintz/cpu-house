import type { Metadata } from 'next';
import { Check, HardDrive, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { BrowserMockup, Card, CtaBlock, PageHero, Section } from '@/components/ui/primitives';
import { INVENTARIO_BENEFITS, PREVENTIVA_ASSETS, WHATSAPP } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'Preventivas Corporativas',
  description:
    'Suporte pró-ativo: levantamento do parque computacional e inventário online para corrigir falhas antes que causem perda de dados e prejuízo.',
  alternates: { canonical: '/servicos/preventivas' },
};

function InventoryOverviewMockup() {
  const rows = [
    { host: 'SRV-AD01', role: 'Samba4 AD · Domínio', state: 'Íntegro' },
    { host: 'SRV-PRX01', role: 'Squid Proxy · Filtro Web', state: 'Ativo' },
    { host: 'SRV-BKP02', role: 'Backup Nuvem · LGPD', state: 'Sincronizado' },
    { host: 'EST-FIN04', role: 'Estação Corporativa', state: 'Checklist OK' },
  ];

  return (
    <div aria-hidden="true" className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="font-mono text-[10px] uppercase text-muted-foreground">Ativos</p>
          <p className="mt-1 font-mono text-lg font-bold text-foreground tabular-nums">48</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="font-mono text-[10px] uppercase text-muted-foreground">Preventivas</p>
          <p className="mt-1 font-mono text-lg font-bold text-brand-ink tabular-nums">100%</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="font-mono text-[10px] uppercase text-muted-foreground">Riscos</p>
          <p className="mt-1 font-mono text-lg font-bold text-foreground tabular-nums">0</p>
        </div>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-background">
        {rows.map((r) => (
          <div key={r.host} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-ink" strokeWidth={1.75} />
              <span className="font-mono font-semibold text-foreground">{r.host}</span>
              <span className="hidden text-muted-foreground sm:inline">{r.role}</span>
            </div>
            <span className="rounded-full bg-surface-tint px-2.5 py-0.5 font-mono text-[11px] font-medium text-brand-ink">
              {r.state}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryDevicesMockup() {
  const devices = [
    { ip: '10.10.0.10', os: 'GNU/Linux Debian', license: 'Software Livre', status: 'Em uso' },
    { ip: '10.10.0.14', os: 'Mailhost Enterprise', license: 'Modular', status: 'Em uso' },
    { ip: '10.10.1.22', os: 'Estação Setor Fiscal', license: 'Auditada', status: 'Check-in' },
    { ip: '10.10.1.35', os: 'Notebook Diretoria', license: 'Auditada', status: 'Reservado' },
  ];

  return (
    <div aria-hidden="true" className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-surface-tint px-3.5 py-2.5 text-xs">
        <span className="inline-flex items-center gap-2 font-mono font-medium text-brand-ink">
          <HardDrive className="h-3.5 w-3.5" strokeWidth={1.75} />
          ESCOPO IP · 10.10.0.0/23
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">Licenças verificadas</span>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-background">
        {devices.map((d) => (
          <div key={d.ip} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs">
            <div>
              <p className="font-mono font-semibold text-foreground">{d.ip}</p>
              <p className="text-[11px] text-muted-foreground">{d.os}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[11px] font-medium text-brand-ink">{d.status}</p>
              <p className="text-[11px] text-muted-foreground">{d.license}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PreventivasPage() {
  return (
    <>
      <PageHero
        eyebrow="Serviços · Suporte pró-ativo"
        title="Preventivas Corporativas"
        subtitle="Suporte pró-ativo: as falhas são previstas e corrigidas antes de causarem perda de dados e prejuízo."
      />

      <Section
        eyebrow="Levantamento"
        title="Checklist dos ativos da sua rede"
        intro="A Preventiva Corporativa levanta os dados do parque computacional e compara os resultados com uma base de fatores de risco. Nossos técnicos criam um checklist detalhado sobre:"
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {PREVENTIVA_ASSETS.map((item, i) => (
            <Reveal
              key={item}
              as="li"
              delay={(i % 2) * 0.05}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-2xs transition-colors hover:border-brand/40"
            >
              <Check
                className="mt-0.5 h-5 w-5 shrink-0 text-brand-ink"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span className="text-foreground">{item}</span>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        tone="alt"
        eyebrow="Inventário"
        title="Inventário dos ativos da rede"
        intro="O inventário é feito por software apropriado pelos técnicos da CPU House, ou de forma automática a partir de um servidor de domínio. Os dados de cada estação e dispositivo ficam em um banco de dados protegido e hospedado pela CPU House."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INVENTARIO_BENEFITS.map((b, i) => (
            <Reveal key={b} delay={(i % 4) * 0.05}>
              <Card>
                <span className="font-mono text-xs font-semibold text-brand-ink tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 leading-relaxed text-foreground">{b}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Sistema" title="Telas do sistema de inventário">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <BrowserMockup title="inventario · painel de conformidade">
              <InventoryOverviewMockup />
            </BrowserMockup>
          </Reveal>
          <Reveal delay={0.08}>
            <BrowserMockup title="inventario · dispositivos e escopos IP">
              <InventoryDevicesMockup />
            </BrowserMockup>
          </Reveal>
        </div>
      </Section>

      <CtaBlock
        title="Fale com nossos consultores."
        text="Eles estão preparados para analisar e apresentar a melhor proposta, com o melhor custo-benefício para o funcionamento otimizado dos seus recursos de TI."
        href={WHATSAPP}
      />
    </>
  );
}
