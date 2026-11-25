import { expect, test } from '@playwright/test';
import { isDarkThemeActive } from './helpers/assertions';
import {
  ALL_ROUTES,
  CORE_ROUTES,
  EXPECTED_OFFICES,
  FORBIDDEN_SEO_DOMAIN,
  WHATSAPP_CONSULTA_REGEX,
  WHATSAPP_PHONE,
  getExpectedSiteOrigin,
} from './helpers/routes';

test.describe('Tier 1 — Feature 1: Visual Theme, Tokens & Typography', () => {
  test('T1-F01-01: light mode palette tokens are active by default on /', async ({ page }) => {
    await page.goto('/');

    const themeInfo = await page.evaluate(() => {
      const html = document.documentElement;
      const bodyStyle = getComputedStyle(document.body);
      const rootStyle = getComputedStyle(html);
      const sections = Array.from(document.querySelectorAll('main section')).map(
        (s) => getComputedStyle(s).backgroundColor
      );

      const brandToken =
        rootStyle.getPropertyValue('--brand').trim() ||
        rootStyle.getPropertyValue('--color-brand').trim();

      return {
        hasDarkClass: html.classList.contains('dark'),
        bodyBg: bodyStyle.backgroundColor,
        bodyColor: bodyStyle.color,
        sections,
        brandToken,
      };
    });

    expect(themeInfo.hasDarkClass).toBe(false);
    expect(['rgb(214, 230, 242)', 'rgb(255, 255, 255)']).toContain(themeInfo.bodyBg);
    expect(themeInfo.bodyColor).toBe('rgb(9, 30, 44)');
    if (themeInfo.brandToken) {
      expect(themeInfo.brandToken.toLowerCase()).toContain('0b4f6c');
    }
  });

  test('T1-F01-02: dark mode is completely absent even under OS dark preference or stored key', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addInitScript(() => {
      localStorage.setItem('cpuhouse-theme', 'dark');
    });
    await page.goto('/');

    expect(await isDarkThemeActive(page)).toBe(false);
    await expect(
      page.getByRole('banner').getByRole('button', { name: /tema|alternar|modo|escuro|claro|dark|light/i })
    ).toHaveCount(0);

    const lightMetrics = await page.evaluate(() => {
      const bodyStyle = getComputedStyle(document.body);
      return {
        bg: bodyStyle.backgroundColor,
        fg: bodyStyle.color,
      };
    });

    expect(['rgb(214, 230, 242)', 'rgb(255, 255, 255)']).toContain(lightMetrics.bg);
    expect(lightMetrics.fg).toBe('rgb(9, 30, 44)');
  });

  test('T1-F01-03: geometric sans body typography and mono technical eyebrow label', async ({
    page,
  }) => {
    await page.goto('/');

    const bodyTypo = await page.evaluate(() => {
      const style = getComputedStyle(document.body);
      return {
        fontFamily: style.fontFamily,
        fontSize: parseFloat(style.fontSize),
      };
    });

    expect(bodyTypo.fontFamily).toMatch(/Inter|Geist|Manrope/i);
    expect(bodyTypo.fontSize).toBeGreaterThanOrEqual(15);
    expect(bodyTypo.fontSize).toBeLessThanOrEqual(19);

    const eyebrow = page.getByText(/CONSULTORIA E SOLUÇÕES EM TI\s*·\s*DESDE 2007/i).first();
    await expect(eyebrow).toBeVisible();
    const eyebrowFont = await eyebrow.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(eyebrowFont).toMatch(/JetBrains|Geist Mono|mono/i);
  });

  test('T1-F01-04: heading weight >= 600, tight tracking, and font-display: swap', async ({
    page,
  }) => {
    for (const route of ['/', '/empresa']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);

      const fontCheck = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        if (!h1) return null;
        const style = getComputedStyle(h1);
        const fontWeight = Number(style.fontWeight);
        const letterSpacing =
          style.letterSpacing === 'normal' ? 0 : parseFloat(style.letterSpacing);

        const fontDisplays: string[] = [];
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from(sheet.cssRules || [])) {
              if (rule instanceof CSSFontFaceRule) {
                const display = rule.style.getPropertyValue('font-display');
                if (display) fontDisplays.push(display.trim().toLowerCase());
              }
            }
          } catch {
            // Skip cross-origin stylesheets
          }
        }

        const loadedFaces = Array.from(document.fonts).map((f) => ({
          family: f.family,
          display: (f as unknown as { display?: string }).display || '',
          status: f.status,
        }));

        return {
          fontWeight,
          letterSpacing,
          fontStatus: document.fonts.status,
          fontDisplays,
          loadedFaces,
        };
      });

      expect(fontCheck).not.toBeNull();
      expect(fontCheck!.fontWeight).toBeGreaterThanOrEqual(600);
      expect(fontCheck!.letterSpacing).toBeLessThanOrEqual(0);
      expect(fontCheck!.fontStatus).toBe('loaded');

      const hasSwap =
        fontCheck!.fontDisplays.includes('swap') ||
        fontCheck!.loadedFaces.some((f) => f.display === 'swap');
      expect(hasSwap).toBe(true);
    }
  });

  test('T1-F01-05: corporate minimalism anti-slop check across all 6 core routes', async ({
    page,
  }) => {
    for (const route of CORE_ROUTES) {
      await page.goto(route);
      const audit = await page.evaluate(() => {
        const rawText = (document.body.innerText || '').replace(/[©®™]/g, '');
        const emojiMatch = rawText.match(/\p{Extended_Pictographic}/u);

        let maxContainerWidth = 0;
        for (const el of Array.from(document.querySelectorAll('main > div, main section > div'))) {
          const cs = getComputedStyle(el);
          if (cs.maxWidth && cs.maxWidth.endsWith('px')) {
            maxContainerWidth = Math.max(maxContainerWidth, parseFloat(cs.maxWidth));
          }
        }

        return {
          emojiFound: emojiMatch ? emojiMatch[0] : null,
          maxContainerWidth,
        };
      });

      expect(audit.emojiFound, `Unexpected emoji on ${route}`).toBeNull();
      if (audit.maxContainerWidth > 0) {
        expect(audit.maxContainerWidth).toBeLessThanOrEqual(1280);
      }
    }
  });
});

test.describe('Tier 1 — Feature 2: Env Config, SEO Plumbing & 301 Redirect', () => {
  test('T1-F02-01: trailing-slash core sub-routes emit exact HTTP 301 redirect', async ({
    request,
  }) => {
    for (const pathWithSlash of ['/empresa/', '/servicos/preventivas/', '/produtos/mailhost/']) {
      const response = await request.get(pathWithSlash, { maxRedirects: 0 });
      expect(response.status(), `Expected HTTP 301 on ${pathWithSlash}`).toBe(301);
      const location = response.headers()['location'] || '';
      const expectedPath = pathWithSlash.slice(0, -1);
      expect(location.endsWith(expectedPath)).toBe(true);
    }
  });

  test('T1-F02-02: all 12 routes return HTTP 200 with unique title and meta description', async ({
    page,
  }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const route of ALL_ROUTES) {
      const response = await page.goto(route);
      expect(response?.status(), `Expected HTTP 200 for ${route}`).toBe(200);

      const title = (await page.title()).trim();
      expect(title.length, `Title missing on ${route}`).toBeGreaterThan(5);
      expect(title).toMatch(/CPU House/i);
      titles.add(title);

      const description = await page
        .locator('meta[name="description"]')
        .first()
        .getAttribute('content');
      expect(description?.trim().length || 0, `Meta description short/missing on ${route}`).toBeGreaterThanOrEqual(30);
      descriptions.add(description!.trim());
    }

    expect(titles.size).toBe(ALL_ROUTES.length);
    expect(descriptions.size).toBe(ALL_ROUTES.length);
  });

  test('T1-F02-03: canonical and Open Graph URLs derive from configured site URL without cpuhouse.com.br', async ({
    page,
  }, testInfo) => {
    const expectedOrigin = getExpectedSiteOrigin(testInfo.project.use.baseURL);

    for (const route of CORE_ROUTES) {
      await page.goto(route);
      const canonical = await page.locator('link[rel="canonical"]').first().getAttribute('href');
      const ogUrl = await page.locator('meta[property="og:url"]').first().getAttribute('content');
      const ogTitle = await page.locator('meta[property="og:title"]').first().getAttribute('content');
      const ogDesc = await page.locator('meta[property="og:description"]').first().getAttribute('content');

      expect(canonical).toBeTruthy();
      expect(canonical!.startsWith(expectedOrigin)).toBe(true);
      expect(canonical!).not.toContain(FORBIDDEN_SEO_DOMAIN);

      expect(ogUrl).toBeTruthy();
      expect(ogUrl!.startsWith(expectedOrigin)).toBe(true);
      expect(ogUrl!).not.toContain(FORBIDDEN_SEO_DOMAIN);

      expect(ogTitle?.trim().length).toBeGreaterThan(5);
      expect(ogDesc?.trim().length).toBeGreaterThan(20);
    }
  });

  test('T1-F02-04: JSON-LD renders Organization and BA/MG LocalBusiness schemas using siteUrl', async ({
    page,
  }, testInfo) => {
    const expectedOrigin = getExpectedSiteOrigin(testInfo.project.use.baseURL);
    await page.goto('/');

    const rawScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(rawScripts.length).toBeGreaterThanOrEqual(1);

    const serialized = rawScripts.join('\n');
    expect(serialized).not.toContain(FORBIDDEN_SEO_DOMAIN);
    expect(serialized).toContain(expectedOrigin);
    expect(serialized).toMatch(/Organization/);
    expect(serialized).toMatch(/LocalBusiness/);
    expect(serialized).toContain('42700-000');
    expect(serialized).toMatch(/Estrada do Coco/i);
    expect(serialized).not.toContain('35700-403');
    expect(serialized).not.toMatch(/Sete Lagoas/i);

    for (const block of rawScripts) {
      expect(() => JSON.parse(block)).not.toThrow();
    }
  });

  test('T1-F02-05: dynamic sitemap.xml lists core routes with configured site URL', async ({
    request,
  }, testInfo) => {
    const expectedOrigin = getExpectedSiteOrigin(testInfo.project.use.baseURL);
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);

    const xml = await response.text();
    expect(xml).toContain('<urlset');
    expect(xml).not.toContain(FORBIDDEN_SEO_DOMAIN);

    for (const route of CORE_ROUTES) {
      const expectedLoc = route === '/' ? expectedOrigin : `${expectedOrigin}${route}`;
      expect(xml).toContain(expectedLoc);
    }
  });

  test('T1-F02-06: dynamic robots.txt references configured sitemap URL without cpuhouse.com.br', async ({
    request,
  }, testInfo) => {
    const expectedOrigin = getExpectedSiteOrigin(testInfo.project.use.baseURL);
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toMatch(/User-agent:/i);
    expect(body).toContain(`Sitemap: ${expectedOrigin}/sitemap.xml`);
    expect(body).not.toContain(FORBIDDEN_SEO_DOMAIN);
  });
});

test.describe('Tier 1 — Feature 3: Global Shell (Navbar, Footer, WhatsAppFloat, Contact CTA)', () => {
  test('T1-F03-01: fixed translucent navbar exposes brand, 4 nav links, WhatsApp CTA, and zero Área do Cliente', async ({
    page,
  }) => {
    await page.goto('/');

    const header = page.getByRole('banner');
    await expect(header).toBeVisible();

    const headerStyles = await header.evaluate((el) => {
      const cs = getComputedStyle(el);
      const nav = el.querySelector('nav');
      const navCs = nav ? getComputedStyle(nav) : null;
      return {
        position: cs.position,
        backdropFilter: cs.backdropFilter || (navCs?.backdropFilter ?? ''),
      };
    });
    expect(['fixed', 'sticky']).toContain(headerStyles.position);
    expect(headerStyles.backdropFilter).toMatch(/blur\(/i);

    await expect(header.getByRole('link', { name: /CPU House|Início|Home/i }).first()).toBeVisible();
    await expect(header.getByRole('link', { name: /^Serviços$/i })).toBeVisible();
    await expect(header.getByRole('link', { name: /^Soluções$/i })).toBeVisible();
    await expect(header.getByRole('link', { name: /^Empresa$/i })).toBeVisible();
    await expect(header.getByRole('link', { name: /^Contato$/i })).toBeVisible();

    await expect(header.getByRole('link', { name: /Área do Cliente/i })).toHaveCount(0);

    const ctaLink = header.getByRole('link', { name: /Agendar consultoria/i });
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toHaveAttribute('href', WHATSAPP_CONSULTA_REGEX);
    await expect(ctaLink).toHaveAttribute('target', '_blank');
    await expect(ctaLink).toHaveAttribute('rel', /noopener/i);
  });

  test('T1-F03-02: zero login or password forms anywhere across all 12 routes', async ({
    page,
  }) => {
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      await expect(page.locator('form:has(input[type="password"])')).toHaveCount(0);
      await expect(page.locator('input[type="password"]')).toHaveCount(0);
      await expect(
        page.locator('a[href*="servicedesk.cpuhouse.com.br"], form[action*="otrs"]')
      ).toHaveCount(0);
      await expect(page.locator('body')).not.toContainText('Informe seu usuário e senha');
    }
  });

  test('T1-F03-03: light mode stays consistent across route navigation and reload', async ({
    page,
  }) => {
    await page.goto('/');
    expect(await isDarkThemeActive(page)).toBe(false);

    await page.getByRole('banner').getByRole('link', { name: /^Empresa$/i }).click();
    await page.waitForURL('**/empresa');
    expect(await isDarkThemeActive(page)).toBe(false);

    await page.reload();
    expect(await isDarkThemeActive(page)).toBe(false);
    await expect
      .poll(async () => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe('rgb(214, 230, 242)');
  });

  test('T1-F03-04: footer renders BA & MG offices, phones, social links, and Einstein quote', async ({
    page,
  }) => {
    for (const route of ['/', '/produtos/mailhost']) {
      await page.goto(route);
      const footer = page.getByRole('contentinfo').first();
      await expect(footer).toBeVisible();

      await expect(footer).toContainText(EXPECTED_OFFICES.ba.street);
      await expect(footer).toContainText(EXPECTED_OFFICES.ba.complement);
      await expect(footer).toContainText(EXPECTED_OFFICES.ba.cep);
      await expect(footer).toContainText(EXPECTED_OFFICES.ba.phonePrimary);
      await expect(footer).toContainText(EXPECTED_OFFICES.ba.phoneSecondary);

      await expect(footer).not.toContainText('Sete Lagoas');
      await expect(footer).not.toContainText('35700-403');

      await expect(
        footer.locator('a[href*="fb.com/cpuhouse"], a[href*="facebook.com/cpuhouse"]').first()
      ).toBeVisible();
      await expect(footer.locator('a[href*="facebook.com/suportelinux"]').first()).toBeVisible();
      await expect(
        footer.locator('a[href="https://raulhc.cc/Projetos/CriancasHacker"]').first()
      ).toBeVisible();

      await expect(footer).toContainText('Criatividade é mais importante que conhecimento');
      await expect(footer).toContainText('Albert Einstein');
    }
  });

  test('T1-F03-05: dynamic copyright year and LGPD privacy link without legacy 2007 - 2018 text', async ({
    page,
  }) => {
    const currentYear = new Date().getFullYear();
    const expectedRegex = new RegExp(`©\\s*2007\\s*[–-]\\s*${currentYear}\\s*CPU House`, 'i');

    for (const route of ['/', '/empresa', '/produtos/samba_ad']) {
      await page.goto(route);
      const footer = page.getByRole('contentinfo');

      await expect(footer).toContainText(expectedRegex);
      await expect(footer.locator('a[href="/privacidade"]').first()).toBeVisible();

      await expect(page.locator('body')).not.toContainText('2007 - 2018');
      await expect(page.locator('body')).not.toContainText('2016 ©');
      await expect(page.locator('body')).not.toContainText('É vedada a cópia');
    }
  });

  test('T1-F03-06: floating WhatsApp button stays pinned bottom-right with accessible label', async ({
    page,
  }) => {
    for (const route of ['/', '/produtos/proxy']) {
      await page.goto(route);
      const waFloat = page
        .locator(`a[href*="${WHATSAPP_PHONE}"]`)
        .filter({ has: page.locator('svg') })
        .last();

      await expect(waFloat).toBeVisible();

      const metrics = await page.evaluate((phone) => {
        const links = Array.from(document.querySelectorAll(`a[href*="${phone}"]`));
        const fixedLink = links.find((a) => getComputedStyle(a).position === 'fixed');
        if (!fixedLink) return null;
        const rect = fixedLink.getBoundingClientRect();
        const accessibleName =
          fixedLink.getAttribute('aria-label') ||
          fixedLink.getAttribute('title') ||
          fixedLink.textContent?.trim() ||
          '';
        return {
          x: rect.x,
          y: rect.y,
          vw: window.innerWidth,
          vh: window.innerHeight,
          accessibleName,
        };
      }, WHATSAPP_PHONE);

      expect(metrics, `Expected fixed floating WhatsApp button on ${route}`).not.toBeNull();
      expect(metrics!.x).toBeGreaterThan(metrics!.vw / 2);
      expect(metrics!.y).toBeGreaterThan(metrics!.vh / 2);
      expect(metrics!.accessibleName.length).toBeGreaterThan(3);
    }
  });
});
