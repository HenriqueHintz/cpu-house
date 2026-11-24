const DEFAULT_SITE_URL = 'http://localhost:3000';

/**
 * Returns the normalized public base URL (no trailing slash).
 * Driven exclusively by NEXT_PUBLIC_SITE_URL so cpuhouse.com.br is never hardcoded.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return DEFAULT_SITE_URL;
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const parsed = new URL(withProtocol);
    const pathname = parsed.pathname.replace(/\/+$/, '');
    return `${parsed.origin}${pathname}`;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/**
 * Joins getSiteUrl() with a leading-slash normalized path (no trailing slash except root).
 */
export function absoluteUrl(path = '/'): string {
  const base = getSiteUrl();
  const trimmed = path.trim();
  if (!trimmed || trimmed === '/') {
    return base;
  }
  const normalized = `/${trimmed.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  return `${base}${normalized}`;
}
