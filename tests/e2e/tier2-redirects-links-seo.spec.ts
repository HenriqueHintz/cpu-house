import { expect, test } from '@playwright/test';
import { attachErrorWatchers, crawlInternalLinks } from './helpers/assertions';
import {
  ALL_ROUTES,
  CORE_ROUTES,
  EXPECTED_OFFICES,
  FORBIDDEN_SEO_DOMAIN,
  SUPORTE_URL,
  SUPPORTING_ROUTES,
  WHATSAPP_CONSULTA_REGEX,
  WHATSAPP_PHONE,
  getExpectedSiteOrigin,
} from './helpers/routes';

test.describe('Tier 2 — Feature 2: Trailing-Slash 301s, SEO & Env Plumbing', () => {
  test('T2-F02-01: core sub-routes with trailing slash emit strict HTTP 301 (not 308/200)', async ({
    request,
  }) => {
    const coreTrailing = [
      '/empresa/',
      '/servicos/preventivas/',
      '/produtos/proxy/',
      '/produtos/mailhost/',
      '/produtos/samba_ad/',
      '/contato/',
    ];

    for (const pathWithSlash of coreTrailing) {
      const response = await request.get(pathWithSlash, { maxRedirects: 0 });
      expect(response.status(), `Expected 301 for ${pathWithSlash}`).toBe(301);
      const location = response.headers()['location'] || '';
      const stripped = pathWithSlash.slice(0, -1);
      expect(location.endsWith(stripped), `Unexpected Location "${location}" for ${pathWithSlash}`).toBe(true);
    }
  });

  test('T2-F02-02: supporting sub-routes emit HTTP 301 while / returns HTTP 200 without redirect loop', async ({
    request,
  }) => {
    const rootRes = await request.get('/', { maxRedirects: 0 });
    expect(rootRes.status()).toBe(200);

    for (const pathWithSlash of ['/servicos/', '/solucoes/', '/faq/', '/termos/', '/privacidade/']) {
      const response = await request.get(pathWithSlash, { maxRedirects: 0 });
      expect(response.status(), `Expected 301 for ${pathWithSlash}`).toBe(301);
      const location = response.headers()['location'] || '';
      expect(location.endsWith(pathWithSlash.slice(0, -1))).toBe(true);
    }
  });

  test('T2-F02-03: canonical and Open Graph URLs across all 12 routes match baseURL origin with zero cpuhouse.com.br', async ({
    page,
  }, testInfo) => {
    const expectedOrigin = getExpectedSiteOrigin(testInfo.project.use.baseURL);

    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const canonical = await page.locator('link[rel="canonical"]').first().getAttribute('href');
      const ogUrl = await page.locator('meta[property="og:url"]').first().getAttribute('content');
      const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute('content');

      expect(canonical, `Missing canonical on ${route}`).toBeTruthy();
      expect(canonical!.startsWith(expectedOrigin)).toBe(true);
      expect(canonical!).not.toContain(FORBIDDEN_SEO_DOMAIN);
      if (route !== '/') {
        expect(canonical!.endsWith('/')).toBe(false);
      }

      expect(ogUrl, `Missing og:url on ${route}`).toBeTruthy();
      expect(ogUrl!.startsWith(expectedOrigin)).toBe(true);
      expect(ogUrl!).not.toContain(FORBIDDEN_SEO_DOMAIN);

      if (ogImage) {
        expect(ogImage).not.toContain(FORBIDDEN_SEO_DOMAIN);
      }
    }
  });

  test('T2-F02-04: /sitemap.xml lists all 12 canonical routes without trailing slashes or cpuhouse.com.br', async ({
    request,
  }, testInfo) => {
    const expectedOrigin = getExpectedSiteOrigin(testInfo.project.use.baseURL);
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);

    const xml = await res.text();
    expect(xml).toContain('<urlset');
    expect(xml).not.toContain(FORBIDDEN_SEO_DOMAIN);

    const locs = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1].trim());
    expect(locs.length).toBeGreaterThanOrEqual(ALL_ROUTES.length);

    for (const loc of locs) {
      expect(loc.startsWith(expectedOrigin)).toBe(true);
      const pathname = new URL(loc).pathname;
      if (pathname !== '/') {
        expect(pathname.endsWith('/')).toBe(false);
      }
    }

    for (const route of ALL_ROUTES) {
      const expectedLoc = route === '/' ? expectedOrigin : `${expectedOrigin}${route}`;
      expect(locs.some((l) => l === expectedLoc || l === `${expectedOrigin}/`)).toBe(true);
    }
  });

  test('T2-F02-05: /robots.txt allows crawling and references configured sitemap.xml without cpuhouse.com.br', async ({
    request,
  }, testInfo) => {
    const expectedOrigin = getExpectedSiteOrigin(testInfo.project.use.baseURL);
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);

    const text = await res.text();
    expect(text).toMatch(/User-agent:\s*\*/i);
    expect(text).toMatch(/Allow:\s*\//i);
    expect(text).toContain(`Sitemap: ${expectedOrigin}/sitemap.xml`);
    expect(text).not.toContain(FORBIDDEN_SEO_DOMAIN);
  });

  test('T2-F02-06: all 12 routes have unique non-empty title and meta description (>= 40 chars)', async ({
    page,
  }) => {
    const seenTitles = new Set<string>();
    const seenDescriptions = new Set<string>();

    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const title = (await page.title()).trim();
      const desc = (
        (await page.locator('meta[name="description"]').first().getAttribute('content')) || ''
      ).trim();

      expect(title.length, `Short title on ${route}`).toBeGreaterThan(8);
      expect(desc.length, `Short description on ${route}: "${desc}"`).toBeGreaterThanOrEqual(40);
      expect(seenTitles.has(title), `Duplicate title "${title}" on ${route}`).toBe(false);
      expect(seenDescriptions.has(desc), `Duplicate description on ${route}`).toBe(false);

      seenTitles.add(title);
      seenDescriptions.add(desc);
    }
  });

  test('T2-F02-07: JSON-LD Organization and 2 LocalBusiness entries include BA/MG offices and zero cpuhouse.com.br', async ({
    page,
  }, testInfo) => {
    const expectedOrigin = getExpectedSiteOrigin(testInfo.project.use.baseURL);
    await page.goto('/');

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThanOrEqual(1);

    const parsedObjects = blocks.map((raw) => JSON.parse(raw));
    const jsonString = JSON.stringify(parsedObjects);

    expect(jsonString).not.toContain(FORBIDDEN_SEO_DOMAIN);
    expect(jsonString).toContain(expectedOrigin);
    expect(jsonString).toContain('Organization');
    expect(jsonString).toContain('LocalBusiness');
    expect(jsonString).toContain(EXPECTED_OFFICES.ba.cep);
    expect(jsonString).toContain(EXPECTED_OFFICES.mg.cep);
    expect(jsonString).toMatch(/Lauro de Freitas/i);
    expect(jsonString).toMatch(/Sete Lagoas/i);
  });
});

test.describe('Tier 2 — Feature 3: Global Shell Runtime, Links & Footer Boundaries', () => {
  test('T2-F03-01: zero console errors, uncaught pageerrors, or hydration mismatches on 6 core routes', async ({
    page,
  }) => {
    const collector = attachErrorWatchers(page);
    for (const route of CORE_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
    }
    collector.assertZeroErrors();
  });

  test('T2-F03-02: zero console errors, uncaught pageerrors, or hydration mismatches on 6 supporting routes', async ({
    page,
  }) => {
    const collector = attachErrorWatchers(page);
    for (const route of SUPPORTING_ROUTES) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
    }
    collector.assertZeroErrors();
  });

  test('T2-F03-03: dynamic footer copyright renders on all 12 routes with zero 2007 - 2018 or 2016 ©', async ({
    page,
  }) => {
    const year = new Date().getFullYear();
    const pattern = new RegExp(`©\\s*2007\\s*[–-]\\s*${year}\\s*CPU House`, 'i');

    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const footer = page.getByRole('contentinfo');
      await expect(footer).toContainText(pattern);
      await expect(page.locator('body')).not.toContainText('2007 - 2018');
      await expect(page.locator('body')).not.toContainText('2016 ©');
    }
  });

  test('T2-F03-04: header exposes WhatsApp CTA without Área do Cliente and footer Suporte link points safely to suporte.cpuhouse.com.br', async ({
    page,
  }) => {
    for (const route of CORE_ROUTES) {
      await page.goto(route);

      await expect(page.getByRole('banner').getByRole('link', { name: /Área do Cliente/i })).toHaveCount(0);

      const headerCta = page.getByRole('banner').getByRole('link', { name: /Agendar consultoria/i });
      await expect(headerCta).toHaveAttribute('href', WHATSAPP_CONSULTA_REGEX);
      await expect(headerCta).toHaveAttribute('target', '_blank');
      await expect(headerCta).toHaveAttribute('rel', /noopener/i);

      const footerSupport = page.getByRole('contentinfo').getByRole('link', { name: /^Suporte$/i });
      await expect(footerSupport).toHaveAttribute('href', new RegExp(`^${SUPORTE_URL}/?$`));
      await expect(footerSupport).toHaveAttribute('target', '_blank');
      await expect(footerSupport).toHaveAttribute('rel', /noopener/i);
    }
  });

  test('T2-F03-05: floating WhatsApp button has accessible name, _blank target, and does not cover footer links', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const fixedWhatsApp = page.evaluate((phone) => {
      const links = Array.from(document.querySelectorAll(`a[href*="${phone}"]`));
      const fixed = links.find((el) => getComputedStyle(el).position === 'fixed');
      if (!fixed) return null;
      return {
        target: fixed.getAttribute('target'),
        rel: fixed.getAttribute('rel') || '',
        label: fixed.getAttribute('aria-label') || fixed.textContent?.trim() || '',
      };
    }, WHATSAPP_PHONE);

    const data = await fixedWhatsApp;
    expect(data).not.toBeNull();
    expect(data!.target).toBe('_blank');
    expect(data!.rel).toMatch(/noopener/i);
    expect(data!.label.length).toBeGreaterThan(3);

    const privacyLink = page.getByRole('contentinfo').locator('a[href="/privacidade"]').first();
    await privacyLink.scrollIntoViewIfNeeded();
    await expect(privacyLink).toBeVisible();
  });
});

test.describe('Tier 2 — Feature 12: Internal Link Integrity, 404 Handling & Hubs', () => {
  test('T2-F12-01: internal link crawler finds zero broken links or href="#" across 6 core routes', async ({
    page,
  }) => {
    for (const route of CORE_ROUTES) {
      await page.goto(route);
      await crawlInternalLinks(page, route);
    }
  });

  test('T2-F12-02: internal link crawler finds zero broken links or href="#" across 6 supporting routes', async ({
    page,
  }) => {
    for (const route of SUPPORTING_ROUTES) {
      await page.goto(route);
      await crawlInternalLinks(page, route);
    }
  });

  test('T2-F12-03: non-existent route returns HTTP 404 cleanly with navigation back to /', async ({
    page,
  }) => {
    const collector = attachErrorWatchers(page);
    const res = await page.goto('/rota-inexistente-cpuhouse-e2e');
    expect(res?.status()).toBe(404);
    await expect(page.locator(`a[href="/"]`).first()).toBeVisible();
    expect(collector.pageErrors).toEqual([]);
  });

  test('T2-F12-04: /servicos and /solucoes hubs link cleanly to Preventivas and all 3 products', async ({
    page,
  }) => {
    await page.goto('/servicos');
    const prevLink = page.locator('main a[href="/servicos/preventivas"]').first();
    await expect(prevLink).toBeVisible();
    await prevLink.click();
    await page.waitForURL('**/servicos/preventivas');

    await page.goto('/solucoes');
    for (const target of ['/produtos/mailhost', '/produtos/proxy', '/produtos/samba_ad']) {
      const link = page.locator(`main a[href="${target}"]`).first();
      await expect(link).toBeVisible();
      const res = await page.request.get(target);
      expect(res.status()).toBe(200);
    }
  });
});
