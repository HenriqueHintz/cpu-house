'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, Menu, X } from 'lucide-react';
import { COMPANY, NAV_ITEMS } from '@/lib/data/company';

export function Navbar() {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const firstDrawerLinkRef = useRef<HTMLAnchorElement | null>(null);

  const mobileOpen = openPathname === pathname;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const rafId = window.requestAnimationFrame(() => {
      firstDrawerLinkRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPathname(null);
        window.requestAnimationFrame(() => {
          toggleBtnRef.current?.focus();
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const toggleDrawer = () => {
    setOpenPathname((prev) => (prev === pathname ? null : pathname));
  };

  const closeDrawer = () => {
    setOpenPathname(null);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] border-b border-border bg-[#CEE1EF]/90 backdrop-blur-md transition-shadow duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeDrawer}
          className="flex items-center gap-3 rounded-lg py-1 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white shadow-xs">
            <Image
              src={COMPANY.logo.src}
              alt={COMPANY.logo.alt}
              width={40}
              height={40}
              priority
              className="h-full w-full scale-[1.06] object-cover"
            />
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">
            {COMPANY.name}
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex min-h-[40px] items-center rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-brand/10 text-brand-ink'
                    : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <a
            href={COMPANY.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-brand-foreground transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Agendar consultoria
            <ExternalLink className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={toggleDrawer}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 top-[72px] z-40 md:hidden">
          <div
            aria-hidden="true"
            onClick={closeDrawer}
            className="fixed inset-0 top-[72px] bg-foreground/20 backdrop-blur-xs"
          />
          <nav
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="relative z-10 border-b border-border bg-surface px-4 py-6 shadow-lg"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item, idx) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.href}>
                    <Link
                      ref={idx === 0 ? firstDrawerLinkRef : undefined}
                      href={item.href}
                      onClick={closeDrawer}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex min-h-[44px] items-center rounded-lg px-3.5 py-2.5 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-brand/10 text-brand-ink'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 border-t border-border pt-4">
              <a
                href={COMPANY.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeDrawer}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
              >
                Agendar consultoria
                <ExternalLink className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
