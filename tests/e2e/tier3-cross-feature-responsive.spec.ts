import { expect, test } from '@playwright/test';
import {
  attachErrorWatchers,
  captureAuditScreenshot,
  expectAllImagesValid,
  expectNoHorizontalOverflow,
  getContrastRatio,
  isDarkThemeActive,
  scrollToPercentAndSettle,
} from './helpers/assertions';
import { MAILHOST_CATEGORIES } from './helpers/matrices';
import { CORE_ROUTES, FORBIDDEN_SEO_DOMAIN, WHATSAPP_PHONE, getExpectedSiteOrigin } from './helpers/routes';

test.describe('Tier 3 — Pairwise Cross-Feature, Responsive & Visual Audit Suite', () => {
  test('T3-01: Light Mode x Mobile 375x812 x Mobile Nav Drawer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    expect(await isDarkThemeActive(page)).toBe(false);

    const menuBtn = page
      .getByRole('banner')
      .getByRole('button', { name: /menu|navegação|abrir/i })
      .first();
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

    await expect(page.getByRole('banner').getByRole('link', { name: /Área do Cliente/i })).toHaveCount(0);
    await expect(page.getByRole('banner').getByRole('link', { name: /Agendar consultoria/i }).last()).toBeVisible();
    await expectNoHorizontalOverflow(page, 'T3-01 mobile light drawer open');

    await page.keyboard.press('Escape');
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('T3-02: Light Mode x Mobile 375x812 x Mailhost PricingTable (contained scroll, zero page overflow)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/produtos/mailhost');
    expect(await isDarkThemeActive(page)).toBe(false);

    const table = page.getByRole('table').first();
    await expect(table).toBeVisible();
    await expectNoHorizontalOverflow(page, 'T3-02 mobile light mailhost');

    const wrapperScrollable = await table.evaluate((el) => {
      let node: HTMLElement | null = el.parentElement;
      while (node && node !== document.body) {
        const cs = getComputedStyle(node);
        if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') {
          return node.scrollWidth >= node.clientWidth;
        }
        node = node.parentElement;
      }
      return el.scrollWidth <= document.documentElement.clientWidth;
    });
    expect(wrapperScrollable).toBe(true);
  });

  test('T3-03: Light Mode x Desktop 1440x900 x Mailhost Sticky thead', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/produtos/mailhost');
    expect(await isDarkThemeActive(page)).toBe(false);

    for (const cat of MAILHOST_CATEGORIES) {
      const btn = page.getByRole('button', { name: new RegExp(cat.title, 'i') }).first();
      if ((await btn.getAttribute('aria-expanded')) === 'false') {
        await btn.click();
      }
    }

    const table = page.getByRole('table').first();
    const bounds = await table.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    });

    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior }),
      bounds.top + Math.round(bounds.height * 0.45)
    );

    await expect
      .poll(async () =>
        table.evaluate((el) => {
          const thead = el.querySelector('thead');
          const rect = thead?.getBoundingClientRect();
          return rect ? rect.top : -1;
        })
      )
      .toBeGreaterThanOrEqual(40);

    const theadPos = await table.evaluate((el) => getComputedStyle(el.querySelector('thead')!).position);
    expect(theadPos).toBe('sticky');
    await expectNoHorizontalOverflow(page, 'T3-03 desktop light sticky mailhost');
  });

  test('T3-04: Light Mode x Desktop 1440x900 x Samba4 AD Sticky thead + 3-State Legend', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/produtos/samba_ad');
    expect(await isDarkThemeActive(page)).toBe(false);

    await expect(page.getByText(/Incluso|Incluído/i).first()).toBeVisible();
    await expect(page.getByText(/Opcional/i).first()).toBeVisible();
    await expect(page.getByText(/Não incluso|Não incluído/i).first()).toBeVisible();

    const table = page.getByRole('table').first();
    const bounds = await table.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    });
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior }),
      bounds.top + 280
    );

    await expect
      .poll(async () =>
        table.evaluate((el) => {
          const thead = el.querySelector('thead');
          return thead ? thead.getBoundingClientRect().top : -1;
        })
      )
      .toBeGreaterThanOrEqual(0);
    await expectNoHorizontalOverflow(page, 'T3-04 desktop light samba_ad');
  });

  test('T3-05: Reduced Motion x Home Scroll Counters x Reveal Sections', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await scrollToPercentAndSettle(page, 50);
    await scrollToPercentAndSettle(page, 100);

    await expect(page.getByText('Desde 2007').first()).toBeVisible();
    await expect(page.getByText(/2\s+estados atendidos/i).first()).toBeVisible();
    await expect(page.getByText(/100%\s+open source/i).first()).toBeVisible();
  });

  test('T3-06: Reduced Motion x Mailhost Collapsible Categories Keyboard Toggle', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/produtos/mailhost');

    const catBtn = page.getByRole('button', { name: /Acesso & Groupware/i }).first();
    await catBtn.focus();
    const initial = await catBtn.getAttribute('aria-expanded');

    await page.keyboard.press('Enter');
    await expect(catBtn).toHaveAttribute('aria-expanded', initial === 'true' ? 'false' : 'true');

    await page.keyboard.press('Space');
    await expect(catBtn).toHaveAttribute('aria-expanded', initial!);
  });

  test('T3-07: Multi-Route Navigation x Light Mode Consistency x Dynamic Footer & Zero Errors', async ({
    page,
  }) => {
    const collector = attachErrorWatchers(page);
    await page.goto('/');
    expect(await isDarkThemeActive(page)).toBe(false);

    for (const route of ['/empresa', '/servicos/preventivas', '/produtos/proxy']) {
      await page.goto(route);
      await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
      await expect(page.getByRole('contentinfo')).toContainText(
        new RegExp(`©\\s*2007\\s*[–-]\\s*${new Date().getFullYear()}\\s*CPU House`, 'i')
      );
    }

    collector.assertZeroErrors();
  });

  test('T3-08: Tablet 768x1024 x Light Mode x Home Grids & TeamCards', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    expect(await isDarkThemeActive(page)).toBe(false);

    await scrollToPercentAndSettle(page, 50);
    await scrollToPercentAndSettle(page, 100);

    await expect(page.getByRole('heading', { name: 'Conectividade' })).toBeVisible();
    await expect(page.getByText('Cristiano Furtado').first()).toBeVisible();
    await expectAllImagesValid(page);
    await expectNoHorizontalOverflow(page, 'T3-08 tablet light home');
  });

  test('T3-09: Tablet 768x1024 x Light Mode x Preventivas Gallery & 8 Benefits', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/servicos/preventivas');
    expect(await isDarkThemeActive(page)).toBe(false);

    await scrollToPercentAndSettle(page, 50);
    await scrollToPercentAndSettle(page, 100);

    await expect(page.getByText(/Hardwares utilizados e disponíveis/i).first()).toBeVisible();
    await expect(page.getByText(/Telas do sistema de Inventário/i).first()).toBeVisible();
    await expectNoHorizontalOverflow(page, 'T3-09 tablet light preventivas');
  });

  test('T3-10: Desktop 1440x900 x Light Mode x Hero 3D Parallax & LCP H1', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    expect(await isDarkThemeActive(page)).toBe(false);

    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    const h1BoxBefore = await h1.boundingBox();
    expect(h1BoxBefore).not.toBeNull();
    expect(h1BoxBefore!.y + h1BoxBefore!.height).toBeLessThanOrEqual(900);

    await page.mouse.move(1200, 300);
    await page.mouse.move(900, 480);

    const h1BoxAfter = await h1.boundingBox();
    expect(Math.abs(h1BoxAfter!.y - h1BoxBefore!.y)).toBeLessThanOrEqual(4);
    await expectNoHorizontalOverflow(page, 'T3-10 hero parallax');
  });

  test('T3-11: Mobile 375x812 x Reduced Motion x Floating WhatsApp Non-Occlusion', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const heroCta = page.getByRole('link', { name: /Agendar consultoria/i }).first();
    await expect(heroCta).toBeVisible();
    const heroBox = await heroCta.boundingBox();

    const waBox = await page.evaluate((phone) => {
      const links = Array.from(document.querySelectorAll(`a[href*="${phone}"]`));
      const fixed = links.find((el) => getComputedStyle(el).position === 'fixed');
      return fixed ? fixed.getBoundingClientRect() : null;
    }, WHATSAPP_PHONE);

    expect(heroBox).not.toBeNull();
    expect(waBox).not.toBeNull();
    const overlapsHeroCta =
      heroBox!.x < waBox!.x + waBox!.width &&
      heroBox!.x + heroBox!.width > waBox!.x &&
      heroBox!.y < waBox!.y + waBox!.height &&
      heroBox!.y + heroBox!.height > waBox!.y;
    expect(overlapsHeroCta).toBe(false);
    await expectNoHorizontalOverflow(page, 'T3-11 mobile wa float');
  });

  test('T3-12: Env Config NEXT_PUBLIC_SITE_URL x All 6 Core Routes x Canonical & OG', async ({
    page,
  }, testInfo) => {
    const expectedOrigin = getExpectedSiteOrigin(testInfo.project.use.baseURL);

    for (const route of CORE_ROUTES) {
      await page.goto(route);
      const canonical = await page.locator('link[rel="canonical"]').first().getAttribute('href');
      const ogUrl = await page.locator('meta[property="og:url"]').first().getAttribute('content');
      expect(canonical?.startsWith(expectedOrigin)).toBe(true);
      expect(canonical).not.toContain(FORBIDDEN_SEO_DOMAIN);
      expect(ogUrl?.startsWith(expectedOrigin)).toBe(true);
      expect(ogUrl).not.toContain(FORBIDDEN_SEO_DOMAIN);
    }
  });

  test('T3-13: Keyboard-Only Navigation x Light Mode x FAQ Accordion -> LGPD Privacidade', async ({
    page,
  }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const navCta = page.getByRole('banner').getByRole('link', { name: /Agendar consultoria/i });
    await navCta.focus();
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);

    await page.goto('/faq');
    const faqSummary = page.locator('main summary').first();
    await faqSummary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('main details').first()).toHaveAttribute('open', '');

    const privacyLink = page.getByRole('contentinfo').locator('a[href="/privacidade"]').first();
    await privacyLink.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL('**/privacidade');
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });

  test('T3-14: Desktop 1440x900 Visual Audit (Top 0% / Mid 50% / Bottom 100% x Light)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const auditRoutes = [
      { route: '/', slug: 'home' },
      { route: '/empresa', slug: 'empresa' },
      { route: '/servicos/preventivas', slug: 'preventivas' },
      { route: '/produtos/mailhost', slug: 'mailhost' },
    ];

    for (const item of auditRoutes) {
      await page.goto(item.route);
      expect(await isDarkThemeActive(page)).toBe(false);

      for (const pct of [0, 50, 100] as const) {
        await scrollToPercentAndSettle(page, pct);
        await expectNoHorizontalOverflow(page, `desktop-${item.slug}-light-${pct}`);
        await expectAllImagesValid(page);
        await captureAuditScreenshot(page, `desktop-${item.slug}-light-${pct}`);
      }
    }

    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const bodyFg = await page.evaluate(() => getComputedStyle(document.body).color);
    expect(getContrastRatio(bodyFg, bodyBg)).toBeGreaterThanOrEqual(4.5);
  });

  test('T3-15: Mobile 375x812 Visual Audit (Top 0% / Mid 50% / Bottom 100% x Light)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const auditRoutes = [
      { route: '/', slug: 'home' },
      { route: '/empresa', slug: 'empresa' },
      { route: '/servicos/preventivas', slug: 'preventivas' },
      { route: '/produtos/mailhost', slug: 'mailhost' },
    ];

    for (const item of auditRoutes) {
      await page.goto(item.route);
      expect(await isDarkThemeActive(page)).toBe(false);

      for (const pct of [0, 50, 100] as const) {
        await scrollToPercentAndSettle(page, pct);
        await expectNoHorizontalOverflow(page, `mobile-${item.slug}-light-${pct}`);
        await expectAllImagesValid(page);
        await captureAuditScreenshot(page, `mobile-${item.slug}-light-${pct}`);
      }
    }
  });

  test('T3-16: Fixed Navbar x Secondary Anchor CTA (Conhecer soluções)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const secondaryCta = page.getByRole('link', { name: /Conhecer soluções/i }).first();
    const href = (await secondaryCta.getAttribute('href')) || '';
    expect(href.startsWith('#')).toBe(true);

    await secondaryCta.click();
    const targetId = href.slice(1);
    const targetHeading = page.locator(`#${targetId}`).first();
    await expect(targetHeading).toBeVisible();

    await expect
      .poll(async () => targetHeading.evaluate((el) => el.getBoundingClientRect().top))
      .toBeLessThan(900);
  });
});
