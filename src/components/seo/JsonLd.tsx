import { COMPANY, OFFICES, SOCIAL_LINKS } from '@/lib/data/company';
import { absoluteUrl, getSiteUrl } from '@/lib/site-config';

export function JsonLd() {
  const siteUrl = getSiteUrl();
  const orgId = absoluteUrl('/#organization');
  const logoUrl = absoluteUrl(COMPANY.logo.src);

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: COMPANY.fullName,
        alternateName: COMPANY.name,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
          width: COMPANY.logo.width,
          height: COMPANY.logo.height,
        },
        foundingDate: COMPANY.foundingDate,
        description: COMPANY.shortDescription,
        sameAs: SOCIAL_LINKS.filter((link) => link.sameAs).map((link) => link.href),
      },
      ...OFFICES.map((office) => ({
        '@type': 'LocalBusiness',
        '@id': absoluteUrl(`/#office-${office.id}`),
        name: `${COMPANY.name} — ${office.name}`,
        parentOrganization: { '@id': orgId },
        url: siteUrl,
        image: logoUrl,
        telephone: office.phones[0]?.e164,
        address: {
          '@type': 'PostalAddress',
          streetAddress: office.streetAddress,
          addressLocality: office.city,
          addressRegion: office.state,
          postalCode: office.postalCode,
          addressCountry: office.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: office.geo.latitude,
          longitude: office.geo.longitude,
        },
        hasMap: office.mapUrl,
      })),
    ],
  };

  const safeJson = JSON.stringify(graph).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
