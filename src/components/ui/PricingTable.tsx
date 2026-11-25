'use client';

import { useState } from 'react';
import { Check, ChevronDown, Minus } from 'lucide-react';

export type CellState = 'included' | 'excluded' | 'optional';

export interface PricingRow {
  feature: string;
  values: Record<string, CellState>;
}

export interface PricingCategory {
  title: string;
  rows: PricingRow[];
}

export function PricingTable({
  caption,
  columns,
  categories,
  priceLabel = 'Sob consulta',
  collapsible = false,
}: {
  caption: string;
  columns: { key: string; label: string }[];
  categories: PricingCategory[];
  priceLabel?: string;
  collapsible?: boolean;
}) {
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const colWidth = `${Math.floor(56 / columns.length)}%`;

  return (
    <div className="space-y-4">
      {/* 3-State Accessible Legend */}
      <div className="flex flex-wrap items-center gap-5 rounded-xl border border-border bg-surface px-4 py-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2 font-medium text-foreground">
          <Check className="h-4 w-4 text-brand-ink" strokeWidth={2} aria-hidden="true" />
          Incluído
        </span>
        <span className="inline-flex items-center gap-2 font-medium text-foreground">
          <span className="rounded bg-surface-tint px-2 py-0.5 font-mono text-[11px] text-brand-ink">
            Opcional
          </span>
          Módulo opcional
        </span>
        <span className="inline-flex items-center gap-2">
          <Minus className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
          Não incluído
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-2xs lg:overflow-visible">
        <table className="min-w-[600px] w-full table-fixed border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <colgroup>
            <col style={{ width: '44%' }} />
            {columns.map((c) => (
              <col key={c.key} style={{ width: colWidth }} />
            ))}
          </colgroup>
          <thead className="sticky top-[72px] z-10">
            <tr>
              <th
                scope="col"
                className="sticky top-[72px] z-10 rounded-tl-2xl border-b border-border bg-surface/95 px-4 py-4 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-xs sm:px-5"
              >
                Recursos
              </th>
              {columns.map((c, idx) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`sticky top-[72px] z-10 border-b border-border bg-surface/95 px-2 py-4 text-center text-xs font-bold text-foreground backdrop-blur-xs sm:px-3 sm:text-sm ${
                    idx === columns.length - 1 ? 'rounded-tr-2xl' : ''
                  }`}
                >
                  {c.label}
                  <span className="mt-1 block font-mono text-[11px] font-normal text-muted-foreground">
                    {priceLabel}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {categories.map((cat) => {
            const isClosed = collapsible && closed[cat.title];
            return (
              <tbody key={cat.title}>
                <tr className="bg-surface-tint/80">
                  <th colSpan={columns.length + 1} scope="colgroup" className="p-0 text-left">
                    {collapsible ? (
                      <button
                        type="button"
                        aria-expanded={!isClosed}
                        onClick={() => setClosed((s) => ({ ...s, [cat.title]: !s[cat.title] }))}
                        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-tint sm:px-5"
                      >
                        {cat.title}
                        <ChevronDown
                          className={`h-4 w-4 text-brand-ink transition-transform duration-200 ${
                            isClosed ? '-rotate-90' : ''
                          }`}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <span className="block px-4 py-3 text-sm font-semibold text-foreground sm:px-5">
                        {cat.title}
                      </span>
                    )}
                  </th>
                </tr>
                {!isClosed &&
                  cat.rows.map((row) => (
                    <tr
                      key={row.feature}
                      className="border-t border-border transition-colors hover:bg-muted/60"
                    >
                      <th scope="row" className="px-4 py-3 text-sm font-normal text-foreground sm:px-5">
                        {row.feature.replace(/\*+/g, '')}
                      </th>
                      {columns.map((c) => {
                        const state = row.values[c.key] ?? 'excluded';
                        return (
                          <td key={c.key} className="px-2 py-3 text-center sm:px-3">
                            {state === 'included' && (
                              <>
                                <Check
                                  className="mx-auto h-4 w-4 text-brand-ink"
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Incluído</span>
                              </>
                            )}
                            {state === 'optional' && (
                              <span className="inline-flex rounded bg-surface-tint px-2 py-0.5 font-mono text-xs font-medium text-brand-ink">
                                Opcional
                              </span>
                            )}
                            {state === 'excluded' && (
                              <>
                                <Minus
                                  className="mx-auto h-4 w-4 text-muted-foreground"
                                  strokeWidth={1.5}
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Não incluído</span>
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}
