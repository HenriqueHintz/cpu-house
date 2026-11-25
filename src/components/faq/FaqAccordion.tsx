'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `faq-panel-${idx}`;
        const btnId = `faq-btn-${idx}`;
        return (
          <div key={item.q} className="p-6">
            <h2 className="text-lg font-medium text-foreground">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                className="flex w-full cursor-pointer items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            </h2>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="mt-3 leading-relaxed text-muted-foreground"
            >
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
