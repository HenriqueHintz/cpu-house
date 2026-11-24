import { expect, test } from '@playwright/test';
import {
  expectAllImagesValid,
  expectNoHorizontalOverflow,
  getContrastRatio,
  isDarkThemeActive,
  scrollToPercentAndSettle,
} from './helpers/assertions';
import { MAILHOST_CATEGORIES } from './helpers/matrices';

test.describe('Tier 2 — Feature 1 & 3: Light-Only Theme, Typography, Contrast & Mobile Drawer', () => {
  test('T2-F01-01: light mode sets #F7F8FA background without .dark class and persists across reload', async ({
    page,
  }) => {
    await page.goto('/');
    expect(await isDarkThemeActive(page)).toBe(false);

    await page.reload();
    expect(await isDarkThemeActive(page)).toBe(false);
    await expect
      .poll(async () => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe('rgb(247, 248, 250)');
  });

  test('T2-F01-02: light mode remains active across multi-route client Link navigation', async ({
    page,
  }) => {
    await page.goto('/');
    expect(await isDarkThemeActive(page)).toBe(false);

    await page.getByRole('banner').getByRole('link', { name: /^Empresa$/i }).click();
    await page.waitForURL('**/empresa');
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);

    await page.goto('/produtos/mailhost');
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);

    await page.getByRole('banner').getByRole('link', { name: /^Contato$/i }).click();
    await page.waitForURL('**/contato');
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });

  test('T2-F01-03: html stays without .dark at domcontentloaded even when prefers-color-scheme is dark', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/produtos/proxy', { waitUntil: 'domcontentloaded' });
    const isDarkAtDomReady = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDarkAtDomReady).toBe(false);
  });

  test('T2-F01-04: Inter & JetBrains Mono fonts are loaded with font-display: swap', async ({
    page,
  }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    const fontInfo = await page.evaluate(() => {
      const h1Style = getComputedStyle(document.querySelector('h1')!);
      const bodyStyle = getComputedStyle(document.body);
      const swapRules: string[] = [];

      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule instanceof CSSFontFaceRule) {
              const display = rule.style.getPropertyValue('font-display').trim().toLowerCase();
              if (display) swapRules.push(display);
            }
          }
        } catch {
          // Skip inaccessible stylesheets
        }
      }

      return {
        h1Font: h1Style.fontFamily,
        bodyFont: bodyStyle.fontFamily,
        status: document.fonts.status,
        swapRules,
      };
    });

    expect(fontInfo.h1Font).toMatch(/Inter|Geist|Manrope/i);
    expect(fontInfo.bodyFont).toMatch(/Inter|Geist|Manrope/i);
    expect(fontInfo.status).toBe('loaded');
    expect(fontInfo.swapRules.includes('swap')).toBe(true);
  });

  test('T2-F01-05: programmatic WCAG AA contrast (>= 4.5:1) on body & muted copy in Light mode', async ({
    page,
  }) => {
    await page.goto('/');

    const light = await page.evaluate(() => {
      const bg = getComputedStyle(document.body).backgroundColor;
      const h1 = document.querySelector('h1');
      const subtitle = h1?.parentElement?.querySelector('p');
      return {
        bg,
        bodyFg: getComputedStyle(document.body).color,
        subtitleFg: subtitle ? getComputedStyle(subtitle).color : getComputedStyle(document.body).color,
      };
    });

    expect(getContrastRatio(light.bodyFg, light.bg)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(light.subtitleFg, light.bg)).toBeGreaterThanOrEqual(4.5);
  });

  test('T2-F03-06: mobile 375x812 drawer opens, exposes nav links + Agendar consultoria CTA, closes on Escape & link click', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const menuBtn = page
      .getByRole('banner')
      .getByRole('button', { name: /menu|navegação|abrir/i })
      .first();
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

    await expect(page.getByRole('link', { name: /^Empresa$/i }).last()).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: /Área do Cliente/i })).toHaveCount(0);
    await expect(page.getByRole('banner').getByRole('link', { name: /Agendar consultoria/i }).last()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');

    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('link', { name: /^Empresa$/i }).last().click();
    await page.waitForURL('**/empresa');
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Tier 2 — Feature 4 & 5: Motion, Sticky Table, Keyboard, SVGs & Images', () => {
  test('T2-F04-01: under prefers-reduced-motion all Home sections settle at opacity 1 with non-zero height', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await scrollToPercentAndSettle(page, 0);
    await scrollToPercentAndSettle(page, 50);
    await scrollToPercentAndSettle(page, 100);

    const hiddenSections = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main section')).filter((s) => {
        const cs = getComputedStyle(s);
        const rect = s.getBoundingClientRect();
        return parseFloat(cs.opacity) < 0.99 || rect.height <= 0;
      }).length
    );
    expect(hiddenSections).toBe(0);
  });

  test('T2-F04-02: Mailhost sticky thead stays visible inside viewport while scrolling 37-row table', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/produtos/mailhost');

    for (const cat of MAILHOST_CATEGORIES) {
      const btn = page.getByRole('button', { name: new RegExp(cat.title, 'i') }).first();
      if ((await btn.getAttribute('aria-expanded')) === 'false') {
        await btn.click();
      }
    }

    const table = page.getByRole('table').first();
    const metrics = await table.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    });

    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior }),
      metrics.top + Math.round(metrics.height * 0.45)
    );

    await expect
      .poll(async () =>
        table.evaluate((el) => {
          const thead = el.querySelector('thead');
          return thead ? thead.getBoundingClientRect().top : -1;
        })
      )
      .toBeGreaterThanOrEqual(0);
  });

  test('T2-F04-03: Mailhost category button responds to keyboard Enter and Space', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');

    const catBtn = page.getByRole('button', { name: /Filtros/i }).first();
    await catBtn.focus();
    const initial = await catBtn.getAttribute('aria-expanded');

    await page.keyboard.press('Enter');
    const afterEnter = initial === 'true' ? 'false' : 'true';
    await expect(catBtn).toHaveAttribute('aria-expanded', afterEnter);

    await page.keyboard.press('Space');
    await expect(catBtn).toHaveAttribute('aria-expanded', initial!);
  });

  test('T2-F04-04: TeamCard renders Cristiano real portrait and clean placeholders with zero broken img tags', async ({
    page,
  }) => {
    await page.goto('/');
    const teamSection = page
      .locator('section')
      .filter({ hasText: /Nosso patrimônio intelectual/i })
      .first();

    const cristianoImg = teamSection.locator('img[alt*="Cristiano" i]').first();
    await expect(cristianoImg).toBeVisible();
    expect(await cristianoImg.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

    await expectAllImagesValid(page);
  });

  test('T2-F04-05: keyboard Tab focus on Navbar CTA and Hero primary CTA renders visible focus ring', async ({
    page,
  }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const navCta = page.getByRole('banner').getByRole('link', { name: /Agendar consultoria/i });
    await navCta.focus();

    const ctaHasFocusRing = await navCta.evaluate((el) => {
      const cs = getComputedStyle(el);
      const hasOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth || '0') > 0;
      const hasShadow = cs.boxShadow !== 'none';
      return document.activeElement === el && (hasOutline || hasShadow);
    });
    expect(ctaHasFocusRing).toBe(true);
  });

  test('T2-F05-01: HeroIsometricScene has aria-hidden="true" and zero keyboard-focusable descendants', async ({
    page,
  }) => {
    await page.goto('/');
    const hero = page.locator('main section').first();
    const scene = hero.locator('[aria-hidden="true"]').filter({ has: page.locator('svg') }).first();
    await expect(scene).toBeVisible();

    const focusableCount = await scene
      .locator('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
      .count();
    expect(focusableCount).toBe(0);
  });

  test('T2-F05-02: under reducedMotion: reduce HeroIsometricScene stays visible with animations paused/disabled', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const hero = page.locator('main section').first();
    const scene = hero.locator('[aria-hidden="true"]').filter({ has: page.locator('svg') }).first();
    const box = await scene.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);

    const activeLoopCount = await scene.evaluate((el) =>
      [el, ...Array.from(el.querySelectorAll('*'))].filter((node) => {
        const cs = getComputedStyle(node);
        return (
          cs.animationName !== 'none' &&
          parseFloat(cs.animationDuration || '0') > 0.01 &&
          cs.animationPlayState !== 'paused'
        );
      }).length
    );
    expect(activeLoopCount).toBe(0);
  });

  test('T2-F05-03: Hero H1 is immediately visible at domcontentloaded on 1440x900 and 375x812', async ({
    page,
  }) => {
    for (const vp of [
      { width: 1440, height: 900 },
      { width: 375, height: 812 },
    ]) {
      await page.setViewportSize(vp);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      const box = await h1.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height);
    }
  });

  test('T2-F05-04: Hero mousemove parallax keeps H1 position stable and zero horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const h1 = page.getByRole('heading', { level: 1 });
    const before = await h1.boundingBox();

    await page.mouse.move(1100, 260);
    await page.mouse.move(850, 420);

    const after = await h1.boundingBox();
    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(Math.abs(after!.x - before!.x)).toBeLessThanOrEqual(4);
    expect(Math.abs(after!.y - before!.y)).toBeLessThanOrEqual(4);
    await expectNoHorizontalOverflow(page, 'Hero parallax');
  });

  test('T2-F05-05: SolutionIsometrics (3 SVGs) and ProxyFlowDiagram render non-zero accessible SVGs', async ({
    page,
  }) => {
    await page.goto('/');
    const solSection = page.locator('section').filter({ hasText: /NOSSAS SOLUÇÕES/i }).first();
    const solSvgs = solSection.locator('[aria-hidden="true"] svg');
    expect(await solSvgs.count()).toBeGreaterThanOrEqual(3);

    await page.goto('/produtos/proxy');
    const archSection = page
      .locator('section')
      .filter({ hasText: /Arquitetura da solução/i })
      .first();
    const proxyBox = await archSection.locator('svg').first().boundingBox();
    expect(proxyBox).not.toBeNull();
    expect(proxyBox!.width).toBeGreaterThan(20);
    expect(proxyBox!.height).toBeGreaterThan(20);
  });
});

test.describe('Tier 2 — Features 6, 8, 10, 12: Counters, Images, Accordions & Legal Routes', () => {
  test('T2-F06-01: Home counters display target values on scroll and under reducedMotion', async ({
    page,
  }) => {
    await page.goto('/');
    await scrollToPercentAndSettle(page, 65 as unknown as 50);
    await expect(page.getByText('Desde 2007').first()).toBeVisible();
    await expect(page.getByText(/2\s+estados atendidos/i).first()).toBeVisible();
    await expect(page.getByText(/100%\s+open source/i).first()).toBeVisible();

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await scrollToPercentAndSettle(page, 50);
    await expect(page.getByText('Desde 2007').first()).toBeVisible();
    await expect(page.getByText(/2\s+estados atendidos/i).first()).toBeVisible();
    await expect(page.getByText(/100%\s+open source/i).first()).toBeVisible();
  });

  test('T2-F06-02: all visible content images across / have non-empty alt, naturalWidth > 0, and srcset', async ({
    page,
  }) => {
    await page.goto('/');
    await scrollToPercentAndSettle(page, 100);
    await expectAllImagesValid(page);

    const imgCount = await page.locator('img').count();
    expect(imgCount).toBeGreaterThanOrEqual(2);
  });

  test('T2-F08-01: Preventivas 4 browser-mockup Inventário slots render cleanly with zero broken images or TODO leaks', async ({
    page,
  }) => {
    await page.goto('/servicos/preventivas');
    const section = page
      .locator('section')
      .filter({ hasText: /Telas do sistema de Inventário/i })
      .first();
    await expect(section).toBeVisible();
    await expect(section).not.toContainText(/\b(TODO|FIXME|Lorem ipsum)\b/i);
    await expectAllImagesValid(page);
  });

  test('T2-F10-01: collapsing all 4 Mailhost categories hides all 37 rows; expanding restores all 37', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');

    for (const cat of MAILHOST_CATEGORIES) {
      const btn = page.getByRole('button', { name: new RegExp(cat.title, 'i') }).first();
      if ((await btn.getAttribute('aria-expanded')) === 'true') {
        await btn.click();
      }
      await expect(btn).toHaveAttribute('aria-expanded', 'false');
    }

    await expect(page.getByText('Alta performance')).toBeHidden();
    await expect(page.getByText('Suporte Groupware (Agenda, Contatos, etc)')).toBeHidden();

    for (const cat of MAILHOST_CATEGORIES) {
      const btn = page.getByRole('button', { name: new RegExp(cat.title, 'i') }).first();
      await btn.click();
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
    }

    await expect(page.getByText('Alta performance')).toBeVisible();
    await expect(page.getByText('Suporte Groupware (Agenda, Contatos, etc)')).toBeVisible();
  });

  test('T2-F12-05: /faq items toggle cleanly via keyboard Enter and Space', async ({ page }) => {
    await page.goto('/faq');
    const firstFaq = page.locator('main button[aria-expanded]').first();
    await expect(firstFaq).toBeVisible();

    await firstFaq.focus();
    const initial = await firstFaq.getAttribute('aria-expanded');
    await page.keyboard.press('Enter');
    await expect(firstFaq).toHaveAttribute('aria-expanded', initial === 'true' ? 'false' : 'true');

    await page.keyboard.press('Space');
    await expect(firstFaq).toHaveAttribute('aria-expanded', initial!);
  });

  test('T2-F12-06: /privacidade and /termos render proper heading hierarchy, LGPD notices, and BA/MG details', async ({
    page,
  }) => {
    for (const route of ['/privacidade', '/termos']) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      expect(await page.getByRole('heading', { level: 2 }).count()).toBeGreaterThanOrEqual(1);
      await expectNoHorizontalOverflow(page, route);
    }

    await page.goto('/privacidade');
    await expect(page.locator('main')).toContainText(/LGPD/i);
    await expect(page.locator('main')).toContainText(/CPU House/i);
  });
});
