import fs from 'node:fs';
import path from 'node:path';
import { expect, type Locator, type Page } from '@playwright/test';

export interface RuntimeErrorCollector {
  consoleErrors: string[];
  pageErrors: string[];
  hydrationErrors: string[];
  assertZeroErrors: () => void;
}

const HYDRATION_PATTERN = /hydration|server-rendered|did not match|text content does not match/i;

export function attachErrorWatchers(page: Page): RuntimeErrorCollector {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const hydrationErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      consoleErrors.push(text);
      if (HYDRATION_PATTERN.test(text)) {
        hydrationErrors.push(text);
      }
    }
  });

  page.on('pageerror', (err) => {
    const message = err.message || String(err);
    pageErrors.push(message);
    if (HYDRATION_PATTERN.test(message)) {
      hydrationErrors.push(message);
    }
  });

  return {
    consoleErrors,
    pageErrors,
    hydrationErrors,
    assertZeroErrors: () => {
      expect(pageErrors, `Uncaught page errors: ${pageErrors.join('\n')}`).toEqual([]);
      expect(hydrationErrors, `Hydration errors: ${hydrationErrors.join('\n')}`).toEqual([]);
      expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
    },
  };
}

export async function expectNoHorizontalOverflow(page: Page, contextLabel?: string): Promise<void> {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    innerWidth: window.innerWidth,
  }));
  expect(
    metrics.scrollWidth,
    `Horizontal overflow detected${contextLabel ? ` (${contextLabel})` : ''}: scrollWidth=${metrics.scrollWidth}, clientWidth=${metrics.clientWidth}`
  ).toBeLessThanOrEqual(metrics.clientWidth);
}

export async function expectAllImagesValid(page: Page): Promise<void> {
  const imageIssues = await page.evaluate(() => {
    const issues: string[] = [];
    const images = Array.from(document.querySelectorAll('img'));
    for (const img of images) {
      const style = window.getComputedStyle(img);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      if (!img.complete || img.naturalWidth === 0) {
        issues.push(`Broken image: src="${img.getAttribute('src') || ''}" alt="${img.alt}"`);
      }
      if (!img.hasAttribute('alt') || img.alt.trim().length === 0) {
        const isDecorative = img.getAttribute('aria-hidden') === 'true';
        if (!isDecorative) {
          issues.push(`Missing alt text on image: src="${img.getAttribute('src') || ''}"`);
        }
      }
    }
    return issues;
  });

  expect(imageIssues, `Image integrity issues:\n${imageIssues.join('\n')}`).toEqual([]);
}

export async function isDarkThemeActive(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const html = document.documentElement;
    return html.classList.contains('dark') || html.getAttribute('data-theme') === 'dark';
  });
}

export async function scrollToPercentAndSettle(page: Page, percent: 0 | 50 | 100): Promise<void> {
  const targetY = await page.evaluate((pct) => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const y = Math.round(maxScroll * (pct / 100));
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = y;
    return y;
  }, percent);

  await expect
    .poll(
      async () =>
        page.evaluate((expected) => {
          const current = window.scrollY || document.documentElement.scrollTop;
          if (Math.abs(current - expected) > 8) {
            window.scrollTo({ top: expected, behavior: 'instant' as ScrollBehavior });
            document.documentElement.scrollTop = expected;
          }
          return Math.abs((window.scrollY || document.documentElement.scrollTop) - expected);
        }, targetY),
      { timeout: 10_000, message: `Expected scrollY to settle near ${targetY} (${percent}%)` }
    )
    .toBeLessThanOrEqual(8);

  await page.evaluate(() => document.fonts.ready);

  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const vh = window.innerHeight;
          const candidates = Array.from(document.querySelectorAll('main h1, main h2, main section'));
          let lowestOpacity = 1;
          for (const el of candidates) {
            const rect = el.getBoundingClientRect();
            const inViewport = rect.bottom > 40 && rect.top < vh - 40 && rect.height > 0;
            if (!inViewport) continue;
            const op = parseFloat(getComputedStyle(el).opacity || '1');
            if (op < lowestOpacity) lowestOpacity = op;
          }
          return lowestOpacity;
        }),
      { timeout: 10_000, message: `Expected in-viewport sections at ${percent}% scroll to settle at opacity >= 0.95` }
    )
    .toBeGreaterThanOrEqual(0.95);
}

export async function captureAuditScreenshot(page: Page, fileName: string): Promise<string> {
  const dir = path.resolve(process.cwd(), 'test-results', 'screenshots');
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${fileName}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  return filePath;
}

export async function crawlInternalLinks(page: Page, sourceRoute: string): Promise<string[]> {
  const { internalPaths, emptyHashLinks } = await page.evaluate(() => {
    const origin = window.location.origin;
    const anchors = Array.from(document.querySelectorAll('a'));
    const paths = new Set<string>();
    const hashes: string[] = [];

    for (const a of anchors) {
      const rawHref = a.getAttribute('href') || '';
      if (rawHref === '#') {
        hashes.push((a.textContent || '').trim() || '<empty>');
        continue;
      }
      if (
        !rawHref ||
        rawHref.startsWith('#') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('javascript:')
      ) {
        continue;
      }
      try {
        const parsed = new URL(rawHref, origin);
        if (parsed.origin === origin) {
          paths.add(parsed.pathname);
        }
      } catch {
        // Ignore non-URL attributes
      }
    }

    return {
      internalPaths: Array.from(paths),
      emptyHashLinks: hashes,
    };
  });

  expect(
    emptyHashLinks,
    `Found dead href="#" links on ${sourceRoute}: ${emptyHashLinks.join(', ')}`
  ).toEqual([]);

  for (const targetPath of internalPaths) {
    const res = await page.request.get(targetPath);
    expect(
      res.status(),
      `Broken internal link "${targetPath}" discovered on "${sourceRoute}" returned HTTP ${res.status()}`
    ).toBeLessThan(400);
  }

  return internalPaths;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function parseRgb(cssColor: string): RgbColor {
  const match = cssColor.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) {
    throw new Error(`Unable to parse RGB color from "${cssColor}"`);
  }
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  };
}

export function getRelativeLuminance({ r, g, b }: RgbColor): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function getContrastRatio(fgCss: string, bgCss: string): number {
  const l1 = getRelativeLuminance(parseRgb(fgCss));
  const l2 = getRelativeLuminance(parseRgb(bgCss));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type CellState = 'included' | 'excluded' | 'optional';

export async function readPricingCellState(cell: Locator): Promise<CellState> {
  const statusText = await cell.evaluate((el) => {
    const parts: string[] = [];
    if (el.textContent) parts.push(el.textContent);
    const aria = el.getAttribute('aria-label');
    if (aria) parts.push(aria);
    const title = el.getAttribute('title');
    if (title) parts.push(title);
    for (const child of Array.from(el.querySelectorAll('[aria-label], [title]'))) {
      const ca = child.getAttribute('aria-label');
      const ct = child.getAttribute('title');
      if (ca) parts.push(ca);
      if (ct) parts.push(ct);
    }
    return parts.join(' ').trim();
  });

  if (/não\s*inclu[sí]|nao\s*inclu[sí]|indispon[ií]vel|excluded/i.test(statusText)) {
    return 'excluded';
  }
  if (/opcional|m[oó]dulo adicional|optional/i.test(statusText)) {
    return 'optional';
  }
  if (/inclu[sí]|included/i.test(statusText)) {
    return 'included';
  }
  throw new Error(`Unable to determine accessible pricing cell state from "${statusText}"`);
}
