import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, MapPin, Phone } from 'lucide-react';
import {
  COMPANY,
  FOOTER_NAV_LINKS,
  FOOTER_SUPPORT_LEGAL_LINKS,
  OFFICES,
  SOCIAL_LINKS,
} from '@/lib/data/company';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#164E6B] bg-petroleum-deep text-[#F2F8FC]">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9] focus-visible:ring-offset-2 focus-visible:ring-offset-petroleum-deep"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#256282] bg-white shadow-xs">
                <Image
                  src={COMPANY.logo.src}
                  alt={COMPANY.logo.alt}
                  width={44}
                  height={44}
                  className="h-full w-full scale-[1.06] object-cover"
                />
              </span>
              <span className="text-base font-semibold tracking-tight text-white">
                {COMPANY.name}
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-[#C4DFEE]">
              {COMPANY.tagline}
            </p>

            <div className="flex flex-wrap gap-4 pt-1">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#67E8F9] hover:underline"
                >
                  {social.label}
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                </a>
              ))}
            </div>

            <blockquote className="border-l-2 border-[#2A6B8C] pl-4 text-sm italic text-[#C4DFEE]">
              <p>“{COMPANY.quote.text}”</p>
              <cite className="mt-1 block not-italic font-medium text-white">
                — {COMPANY.quote.author}
              </cite>
            </blockquote>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-3">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9AC5DC]">
                Navegação
              </h2>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center py-0.5 text-sm text-[#F2F8FC] transition-colors hover:text-[#67E8F9]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9AC5DC]">
                Suporte & Legal
              </h2>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_SUPPORT_LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-0.5 text-sm text-[#F2F8FC] transition-colors hover:text-[#67E8F9]"
                      >
                        {link.label}
                        <ExternalLink
                          className="h-3.5 w-3.5 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="inline-flex items-center py-0.5 text-sm text-[#F2F8FC] transition-colors hover:text-[#67E8F9]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:col-span-2 lg:col-span-5">
            {OFFICES.map((office) => (
              <div key={office.id} className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9AC5DC]">
                  {office.name}
                </h2>
                <address className="not-italic space-y-2 text-sm text-[#C4DFEE]">
                  <p className="flex items-start gap-2">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#67E8F9]"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span>
                      {office.streetAddress}
                      <br />
                      {office.city}, {office.state} — CEP {office.postalCode}
                    </span>
                  </p>
                  <div className="space-y-1.5 pl-6">
                    {office.phones.map((phone) => (
                      <p key={phone.tel}>
                        <a
                          href={phone.tel}
                          className="inline-flex items-center gap-1.5 text-[#F2F8FC] transition-colors hover:text-[#67E8F9]"
                        >
                          <Phone
                            className="h-3.5 w-3.5 shrink-0 text-[#67E8F9]"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <span>{phone.display}</span>
                        </a>
                      </p>
                    ))}
                  </div>
                  <p className="pl-6 pt-0.5">
                    <a
                      href={office.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#67E8F9] hover:underline"
                    >
                      Ver no mapa
                      <ExternalLink
                        className="h-3.5 w-3.5"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </a>
                  </p>
                </address>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#164E6B] pt-8 text-sm text-[#C4DFEE] sm:flex-row sm:items-center sm:justify-between">
          <p>{`© ${COMPANY.foundingYear}–${currentYear} ${COMPANY.name}. Todos os direitos reservados.`}</p>
          <Link href="/privacidade" className="text-[#67E8F9] hover:underline">
            Política de Privacidade (LGPD)
          </Link>
        </div>
      </div>
    </footer>
  );
}
