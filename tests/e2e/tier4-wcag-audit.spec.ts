import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { MAILHOST_CATEGORIES } from './helpers/matrices';
import { ALL_ROUTES, CORE_ROUTES } from './helpers/routes';

function formatViolations(
  violations: Array<{ id: string; impact?: string | null; help: string; nodes: Array<{ target: unknown }> }>
): string {
  return violations
    .map(
      (v) =>
        `[${v.impact || 'unknown'}] ${v.id}: ${v.help} (${v.nodes
          .map((n) => JSON.stringify(n.target))
          .join(', ')})`
    )
    .join('\n');
}

test.describe('Tier 4 — WCAG 2.1 AA Accessibility & Keyboard Audits', () => {
  test('T4-A11Y-01: zero WCAG 2.1 AA violations across all 12 routes in Light Mode', async ({
    page,
  }) => {
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(
        results.violations,
        `WCAG 2.1 AA violations in Light Mode on ${route}:\n${formatViolations(results.violations)}`
      ).toEqual([]);
    }
  });

  test('T4-A11Y-03: zero WCAG 2.1 AA violations in interactive expanded states (Mailhost, FAQ, Mobile Drawer)', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');
    for (const cat of MAILHOST_CATEGORIES) {
      const btn = page.getByRole('button', { name: new RegExp(cat.title, 'i') }).first();
      if ((await btn.getAttribute('aria-expanded')) === 'false') {
        await btn.click();
      }
    }
    const mailhostRes = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      mailhostRes.violations,
      `Mailhost expanded violations:\n${formatViolations(mailhostRes.violations)}`
    ).toEqual([]);

    await page.goto('/faq');
    const faqButtons = page.locator('main button[aria-expanded]');
    if ((await faqButtons.count()) > 0) {
      await faqButtons.first().click();
    }
    const faqRes = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(faqRes.violations, `FAQ expanded violations:\n${formatViolations(faqRes.violations)}`).toEqual([]);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const menuBtn = page
      .getByRole('banner')
      .getByRole('button', { name: /menu|navegação|abrir/i })
      .first();
    await menuBtn.click();
    const drawerRes = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      drawerRes.violations,
      `Mobile drawer violations:\n${formatViolations(drawerRes.violations)}`
    ).toEqual([]);
  });

  test('T4-A11Y-04: semantic lang="pt-BR", non-skipping heading hierarchy, and keyboard Tab traversal without traps', async ({
    page,
  }) => {
    for (const route of CORE_ROUTES) {
      await page.goto(route);

      const structure = await page.evaluate(() => {
        const lang = document.documentElement.getAttribute('lang') || '';
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) =>
          Number(h.tagName.slice(1))
        );
        const h1Count = headings.filter((lvl) => lvl === 1).length;
        const skippedLevels: string[] = [];
        for (let i = 1; i < headings.length; i++) {
          if (headings[i] - headings[i - 1] > 1) {
            skippedLevels.push(`h${headings[i - 1]} -> h${headings[i]}`);
          }
        }
        return { lang, h1Count, skippedLevels };
      });

      expect(structure.lang.toLowerCase()).toBe('pt-br');
      expect(structure.h1Count, `Expected exactly 1 <h1> on ${route}`).toBe(1);
      expect(
        structure.skippedLevels,
        `Skipped heading levels on ${route}: ${structure.skippedLevels.join(', ')}`
      ).toEqual([]);
    }

    await page.goto('/');
    const visitedTags = new Set<string>();
    for (let step = 0; step < 12; step++) {
      await page.keyboard.press('Tab');
      const activeInfo = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return null;
        return {
          tag: el.tagName,
          text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40),
        };
      });
      if (activeInfo) {
        visitedTags.add(`${activeInfo.tag}:${activeInfo.text}`);
      }
    }
    expect(visitedTags.size).toBeGreaterThanOrEqual(4);
  });
});
