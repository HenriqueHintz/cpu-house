import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { WordReveal } from '@/components/ui/WordReveal';

type ButtonVariant = 'primary' | 'secondary' | 'link' | 'onDark';

const BUTTON_BASE =
  'inline-flex cursor-pointer items-center justify-center gap-2 font-medium transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'h-12 rounded-xl bg-brand px-6 text-base text-brand-foreground shadow-[0_1px_2px_rgba(11,79,108,0.18),0_8px_20px_-8px_rgba(11,79,108,0.45)] hover:bg-brand-hover hover:-translate-y-0.5',
  secondary:
    'h-12 rounded-xl border border-border bg-surface px-6 text-base text-foreground shadow-2xs hover:bg-muted hover:border-border-strong',
  link: 'group text-base font-medium text-brand-ink hover:underline underline-offset-4',
  onDark:
    'h-12 rounded-xl bg-accent px-6 text-base font-semibold text-accent-foreground shadow-[0_8px_24px_-8px_rgba(34,184,207,0.5)] hover:brightness-95 hover:-translate-y-0.5',
};

export function ButtonLink({
  href,
  variant = 'primary',
  external = false,
  arrow = false,
  children,
  className = '',
}: {
  href: string;
  variant?: ButtonVariant;
  external?: boolean;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const classes = `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`;
  const icon = arrow ? (
    <ArrowRight
      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1"
      strokeWidth={1.5}
      aria-hidden="true"
    />
  ) : external ? (
    <ExternalLink className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
  ) : null;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {icon}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      {icon}
    </Link>
  );
}

export function Card({
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
  return (
    <SpotlightCard href={href} external={external} className={className}>
      {children}
    </SpotlightCard>
  );
}

export function CardLinkLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-ink">
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-150 group-hover/card:translate-x-1"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-brand-ink">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </p>
  );
}

export function Section({
  id,
  tone = 'default',
  eyebrow,
  title,
  intro,
  children,
  className = '',
}: {
  id?: string;
  tone?: 'default' | 'alt' | 'tint';
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const toneClass =
    tone === 'alt'
      ? 'bg-surface'
      : tone === 'tint'
        ? 'bg-surface-tint'
        : 'bg-background';

  return (
    <section id={id} className={`py-20 md:py-28 lg:py-32 ${toneClass} ${className}`}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || intro) && (
          <div className="mb-12 max-w-3xl md:mb-16">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <WordReveal
                as="h2"
                text={title}
                className="mt-3 text-3xl font-bold tracking-[-0.025em] text-foreground sm:text-4xl"
              />
            )}
            {intro && (
              <Reveal delay={0.05}>
                <div className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</div>
              </Reveal>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-border bg-background bg-tech-grid">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-surface to-transparent"
      />
      <div className="relative mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <WordReveal
          as="h1"
          immediate
          text={title}
          className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl"
        />
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
        )}
        {children && <div className="mt-8 flex flex-wrap items-center gap-4">{children}</div>}
      </div>
    </header>
  );
}

export function CtaBlock({
  title,
  text,
  label = 'Agendar consultoria',
  href,
}: {
  title: string;
  text: string;
  label?: string;
  href: string;
}) {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 px-6 py-14 text-center text-white shadow-[0_24px_60px_-24px_rgba(11,79,108,0.45)] sm:px-12 md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 0%, rgba(34, 184, 207, 0.28), transparent 60%), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 36px 36px, 36px 36px',
            }}
          />
          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-[-0.025em] sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">{text}</p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href={href} variant="onDark" external>
                {label}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-medium text-foreground shadow-2xs">
      {children}
    </span>
  );
}

export function IconBadge({ children }: { children: ReactNode }) {
  return (
    <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand/15 bg-surface-tint text-brand-ink transition-colors duration-200 group-hover/card:bg-brand group-hover/card:text-brand-foreground">
      {children}
    </span>
  );
}

export function TeamCard({
  name,
  role,
  photo,
  linkedin,
}: {
  name: string;
  role: string;
  photo?: string;
  linkedin: string;
}) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  return (
    <Card className="items-center text-center">
      <div className="group/photo relative h-28 w-28 overflow-hidden rounded-full border-2 border-border bg-muted p-0.5 transition-colors duration-200 group-hover/card:border-brand/50">
        <div className="h-full w-full overflow-hidden rounded-full bg-muted">
          {photo ? (
            <Image
              src={photo}
              alt={`Foto de ${name}, ${role} da CPU House`}
              width={112}
              height={112}
              className="h-full w-full object-cover object-top grayscale transition-[filter,transform] duration-300 group-hover/card:scale-[1.03] group-hover/card:grayscale-0"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center bg-surface-tint font-mono text-2xl font-semibold text-brand-ink"
            >
              {initials}
            </span>
          )}
        </div>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{role}</p>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`LinkedIn de ${name}`}
        className="mt-4 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium text-brand-ink transition-colors hover:bg-surface-tint hover:underline"
      >
        LinkedIn
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
      </a>
    </Card>
  );
}

export function BrowserMockup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_20px_50px_-22px_rgba(15,23,42,0.2)]">
      <div className="flex items-center gap-2 border-b border-border bg-muted/80 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" aria-hidden="true" />
        <span className="ml-3 truncate rounded bg-surface px-2.5 py-0.5 font-mono text-xs text-muted-foreground border border-border/70">
          {title}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </figure>
  );
}
