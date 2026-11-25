import { expect, test } from '@playwright/test';
import {
  attachErrorWatchers,
  expectAllImagesValid,
  expectNoHorizontalOverflow,
  isDarkThemeActive,
  readPricingCellState,
} from './helpers/assertions';
import { MAILHOST_CATEGORIES, MAILHOST_INTEGRATION_CHIPS } from './helpers/matrices';
import { EXPECTED_OFFICES, SUPORTE_URL, WHATSAPP_CONSULTA_REGEX, WHATSAPP_PHONE } from './helpers/routes';

test.describe('Tier 4 — Real-World Corporate Buyer Journeys', () => {
  test('T4-J01: IT Manager discovers Preventivas Corporativas and Inventory system', async ({
    page,
  }) => {
    const collector = attachErrorWatchers(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Infraestrutura de TI blindada para sua empresa nunca parar.'
    );

    await page.locator('a[href="/servicos/preventivas"]').first().click();
    await page.waitForURL('**/servicos/preventivas');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Preventivas Corporativas/i);
    await expect(page.locator('main')).toContainText('Hardwares utilizados e disponíveis');
    await expect(page.locator('main')).toContainText('Controle primário da atribuição e reservas de escopos IP');
    await expect(page.locator('main')).toContainText(/Telas do sistema de Inventário/i);

    await expect(page.locator(`main a[href*="${WHATSAPP_PHONE}"]`).first()).toBeVisible();
    await expect(page.locator(`a[href*="${SUPORTE_URL}"]`).first()).toBeVisible();

    await expectAllImagesValid(page);
    collector.assertZeroErrors();
  });

  test('T4-J02: CTO compares Enterprise Mailhost tiers, integrations, and collapsible categories', async ({
    page,
  }) => {
    const collector = attachErrorWatchers(page);
    await page.goto('/produtos/mailhost');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Servidor de E-Mails/i);
    for (const chip of MAILHOST_INTEGRATION_CHIPS) {
      await expect(page.locator('main')).toContainText(chip);
    }

    for (const cat of MAILHOST_CATEGORIES) {
      const btn = page.getByRole('button', { name: new RegExp(cat.title, 'i') }).first();
      if ((await btn.getAttribute('aria-expanded')) === 'false') {
        await btn.click();
      }
    }

    const table = page.getByRole('table').first();
    await expect(table).toContainText(/Sob consulta/i);

    const radiusRow = table.getByRole('row').filter({ hasText: 'Autenticação em Radius' }).first();
    const radiusCells = radiusRow.locator('td');
    expect(await readPricingCellState(radiusCells.nth(0))).toBe('excluded');
    expect(await readPricingCellState(radiusCells.nth(1))).toBe('excluded');
    expect(await readPricingCellState(radiusCells.nth(2))).toBe('included');
    expect(await readPricingCellState(radiusCells.nth(3))).toBe('excluded');

    await expect(page.locator('main')).toContainText(/modular/i);
    await expect(
      page.locator('main').getByRole('link', { name: /Solicit(ar|e uma) proposta/i }).first()
    ).toBeVisible();

    collector.assertZeroErrors();
  });

  test('T4-J03: Small Business Admin compares Samba4 AD tiers, 3-state legend, and FAQ', async ({
    page,
  }) => {
    const collector = attachErrorWatchers(page);
    await page.goto('/produtos/samba_ad');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Samba4 AD Small Business/i);
    await expect(page.locator('main')).toContainText(/primeiro servidor/i);
    await expect(page.locator('main')).toContainText(/Single Sign-On \(SSO\)|apenas uma senha/i);
    await expect(page.locator('body')).not.toContainText('Windows Server 2012');
    await expect(page.locator('body')).not.toContainText('2.671,65');

    const table = page.getByRole('table').first();
    const rsatRow = table
      .getByRole('row')
      .filter({ hasText: /Administração Avançada através das ferramentas RSAT/i })
      .first();
    const rsatCells = rsatRow.locator('td');
    expect(await readPricingCellState(rsatCells.nth(0))).toBe('excluded');
    expect(await readPricingCellState(rsatCells.nth(1))).toBe('optional');
    expect(await readPricingCellState(rsatCells.nth(2))).toBe('optional');

    await expect(page.locator('main')).toContainText(/\*\*\*.*RSAT requer licença do Windows/i);

    await page.getByRole('contentinfo').getByRole('link', { name: /^FAQ$/i }).click();
    await page.waitForURL('**/faq');
    const faqBtn = page.locator('main button[aria-expanded]').first();
    const before = await faqBtn.getAttribute('aria-expanded');
    await faqBtn.focus();
    await page.keyboard.press('Enter');
    await expect(faqBtn).toHaveAttribute('aria-expanded', before === 'true' ? 'false' : 'true');

    collector.assertZeroErrors();
  });

  test('T4-J04: Security Buyer inspects Servidor Proxy flow diagram, advantages & evaluation CTA', async ({
    page,
  }) => {
    const collector = attachErrorWatchers(page);
    await page.goto('/');

    await page.locator('a[href="/produtos/proxy"]').first().click();
    await page.waitForURL('**/produtos/proxy');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Servidor Proxy/i);
    await expect(page.locator('main')).toContainText(/Economia de banda/i);
    await expect(page.locator('main')).toContainText(/Objetos de rede/i);
    await expect(page.locator('main')).toContainText(/Perfis de acesso/i);
    await expect(page.locator('main')).toContainText(/Regras de filtro de conteúdo/i);

    const cta = page
      .locator('main')
      .getByRole('link', { name: /Solicit(ar|e uma) avaliação técnica/i })
      .first();
    await expect(cta).toBeVisible();
    const href = (await cta.getAttribute('href')) || '';
    expect(href).not.toContain('facebook.com');

    collector.assertZeroErrors();
  });

  test('T4-J05: Procurement & Compliance Officer completes corporate, LGPD & contact due diligence', async ({
    page,
  }) => {
    const collector = attachErrorWatchers(page);
    await page.goto('/empresa');

    await expect(page.locator('main')).toContainText('Open Invention Network');
    await expect(page.locator('main')).toContainText('2007');
    await expect(page.locator('main')).toContainText('Hoje');
    await expect(page.locator('main a[href*="raulhc.cc"]').first()).toBeVisible();

    await page.getByRole('contentinfo').locator('a[href="/privacidade"]').first().click();
    await page.waitForURL('**/privacidade');
    await expect(page.locator('main')).toContainText(/LGPD/i);

    await page.getByRole('contentinfo').locator('a[href="/termos"]').first().click();
    await page.waitForURL('**/termos');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.getByRole('banner').getByRole('link', { name: /^Contato$/i }).click();
    await page.waitForURL('**/contato');
    await expect(page.locator('main')).toContainText(EXPECTED_OFFICES.ba.street);
    await expect(page.locator('main')).toContainText(EXPECTED_OFFICES.mg.street);
    await expect(page.locator('form:has(input[type="password"])')).toHaveCount(0);

    collector.assertZeroErrors();
  });

  test('T4-J06: Accessibility-First Keyboard & Light-Only Multi-Page Journey', async ({ page }) => {
    const collector = attachErrorWatchers(page);
    await page.goto('/');
    expect(await isDarkThemeActive(page)).toBe(false);

    await page.goto('/produtos/mailhost');
    expect(await isDarkThemeActive(page)).toBe(false);
    const catBtn = page.getByRole('button', { name: /Filtros/i }).first();
    await catBtn.focus();
    const initial = await catBtn.getAttribute('aria-expanded');
    await page.keyboard.press('Space');
    await expect(catBtn).toHaveAttribute('aria-expanded', initial === 'true' ? 'false' : 'true');

    await page.goto('/contato');
    expect(await isDarkThemeActive(page)).toBe(false);
    await expect(page.getByRole('banner').getByRole('link', { name: /Área do Cliente/i })).toHaveCount(0);
    await expect(page.getByRole('banner').getByRole('link', { name: /Agendar consultoria/i })).toHaveAttribute(
      'href',
      WHATSAPP_CONSULTA_REGEX
    );
    await expect(page.locator(`a[href*="${WHATSAPP_PHONE}"]`).first()).toHaveAttribute(
      'href',
      WHATSAPP_CONSULTA_REGEX
    );

    await expectNoHorizontalOverflow(page, 'T4-J06 light contact');
    collector.assertZeroErrors();
  });
});
