'use client';

import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';

export function SpotlightCard({
  href,
  external = false,
  className = '',
  children,
}: {
  href?: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const base = `card-interactive group/card relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/60 ${className}`;

  if (!href) {
    return (
      <div onMouseMove={handleMouseMove} className={base}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand via-accent to-brand opacity-0 transition-opacity duration-200 group-hover/card:opacity-100"
        />
        {children}
      </div>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        className={base}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand via-accent to-brand opacity-0 transition-opacity duration-200 group-hover/card:opacity-100"
        />
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onMouseMove={handleMouseMove} className={base}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand via-accent to-brand opacity-0 transition-opacity duration-200 group-hover/card:opacity-100"
      />
      {children}
    </Link>
  );
}
