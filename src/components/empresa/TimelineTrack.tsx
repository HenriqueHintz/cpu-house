'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export interface TimelineEntry {
  year: string;
  text: string | null;
}

export function TimelineTrack({ items }: { items: readonly TimelineEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !progressRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(progressRef.current, { scaleY: 1 });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0.08 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 55%',
            scrub: 0.5,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative max-w-3xl pl-8 sm:pl-10">
      {/* Static Rail */}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-border"
      />
      {/* Scroll-Scrubbed Active Beam */}
      <span
        ref={progressRef}
        aria-hidden="true"
        className="absolute bottom-2 left-[7px] top-2 w-[2px] origin-top bg-gradient-to-b from-brand via-accent to-brand"
      />

      <ol className="space-y-10">
        {items.map((item) => (
          <li
            key={item.year}
            className="relative rounded-2xl border border-border bg-surface p-6 shadow-2xs transition-colors hover:border-brand/40"
          >
            <span
              aria-hidden="true"
              className="absolute -left-[31px] top-7 h-3.5 w-3.5 rounded-full border-2 border-brand bg-surface ring-4 ring-background sm:-left-[39px]"
            />
            <span className="inline-flex items-center rounded-md bg-surface-tint px-2.5 py-1 font-mono text-xs font-semibold text-brand-ink">
              {item.year}
            </span>
            {item.text ? (
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{item.text}</p>
            ) : (
              <p className="mt-3 text-lg italic text-muted-foreground">
                Evolução contínua em infraestrutura corporativa, segurança da informação e serviços
                gerenciados em nuvem.
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
