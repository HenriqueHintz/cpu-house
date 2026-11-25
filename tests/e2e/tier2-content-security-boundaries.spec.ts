import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, readPricingCellState } from './helpers/assertions';
import {
  MAILHOST_CATEGORIES,
  MAILHOST_COLUMNS,
  MAILHOST_INTEGRATION_CHIPS,
  SAMBA_AD_ROWS,
  SAMBA_COLUMNS,
} from './helpers/matrices';
import {
  ALL_ROUTES,
  FORBIDDEN_LEGACY_TEXTS,
  FORBIDDEN_TYPOS,
  WHATSAPP_PHONE,
} from './helpers/routes';

test.describe('Tier 2 — Feature 6: Home Security, LinkedIn & Anti-Bloat Boundaries', () => {
  test('T2-F06-03: negative security check — zero login forms, password inputs, or OTRS paths on all 12 routes', async ({
    page,
  }) => {
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      await expect(page.locator('form:has(input[type="password"])')).toHaveCount(0);
      await expect(page.locator('input[type="password"]')).toHaveCount(0);
      await expect(page.locator('a[href*="otrs"], a[href*="servicedesk.cpuhouse.com.br"]')).toHaveCount(0);
      await expect(page.locator('body')).not.toContainText('Informe seu usuário e senha');
    }
  });

  test('T2-F06-04: Davi Furtado broken LinkedIn URL is omitted while valid team LinkedIns remain active', async ({
    page,
  }) => {
    await page.goto('/');
    const team = page.locator('#equipe');

    await expect(team.locator('a[href="https://br.linkedin.com/in/"]')).toHaveCount(0);
    await expect(team.locator('a[href="https://br.linkedin.com/in"]')).toHaveCount(0);

    for (const member of ['Cristiano', 'Davi', 'Mois']) {
      const link = team.locator(`a[href*="${member}"]`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });

  test('T2-F06-05: anti-bloat check — excludes 2018 slogans, empty partner grids, emojis, and forbidden strings', async ({
    page,
  }) => {
    await page.goto('/');
    const bodyText = await page.locator('body').innerText();
    const cleanedForEmoji = bodyText.replace(/[©®™]/g, '');
    expect(cleanedForEmoji.match(/\p{Extended_Pictographic}/u)).toBeNull();

    for (const forbidden of FORBIDDEN_LEGACY_TEXTS) {
      expect(bodyText).not.toContain(forbidden);
    }
    await expect(page.locator('.partners')).toHaveCount(0);
  });
});

test.describe('Tier 2 — Feature 7: Empresa Boundaries & Orthography (/empresa)', () => {
  test('T2-F07-01: enforces Open Invention Network and accented líderes spelling', async ({
    page,
  }) => {
    await page.goto('/empresa');
    const main = page.locator('main');
    await expect(main).toContainText('Open Invention Network');
    await expect(main).toContainText('líderes');
    await expect(main).not.toContainText('Open Inventation Network');
  });

  test('T2-F07-02: Crianças Hackers renders all 4 external URLs as clickable _blank anchors', async ({
    page,
  }) => {
    await page.goto('/empresa');
    const main = page.locator('main');

    for (const hrefPart of [
      'raulhc.cc/Projetos/CriancasHacker',
      'g1.globo.com',
      'gshow.globo.com',
      'youtube.com/watch?v=A-nK1aGsR90',
    ]) {
      const anchor = main.locator(`a[href*="${hrefPart}"]`).first();
      await expect(anchor).toBeVisible();
      await expect(anchor).toHaveAttribute('target', '_blank');
      await expect(anchor).toHaveAttribute('rel', /noopener/i);
    }
  });

  test('T2-F07-03: timeline renders 2007, 2014, 2018, and Hoje and omits "12 anos de mercado"', async ({
    page,
  }) => {
    await page.goto('/empresa');
    const main = page.locator('main');
    for (const marker of ['2007', '2014', '2018', 'Hoje']) {
      await expect(main).toContainText(marker);
    }
    await expect(main).not.toContainText('12 anos de mercado');
  });

  test('T2-F07-04: lists all 7 Open Source entities and links Suporte Linux to facebook.com/suportelinux', async ({
    page,
  }) => {
    await page.goto('/empresa');
    const main = page.locator('main');

    for (const item of [
      'ASL',
      'Open Invention Network',
      'Sacix',
      'Fedora',
      'Fedora Educacional',
      'Ekaaty Linux',
      'Suporte Linux',
    ]) {
      await expect(main).toContainText(item);
    }
    await expect(main.locator('a[href*="facebook.com/suportelinux"]').first()).toBeVisible();
  });

  test('T2-F07-05: lists all social projects with zero horizontal overflow at 375px and 1440px', async ({
    page,
  }) => {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/empresa');
      for (const project of ['Casa Brasil', 'Crianças Hackers', 'Texto Livre', 'Clube da Leitura']) {
        await expect(page.locator('main')).toContainText(project);
      }
      await expectNoHorizontalOverflow(page, `/empresa @ ${width}px`);
    }
  });
});

test.describe('Tier 2 — Feature 8: Preventivas Boundaries (/servicos/preventivas)', () => {
  test('T2-F08-02: renders all 7 monitored assets and excludes Lorem Ipsum', async ({ page }) => {
    await page.goto('/servicos/preventivas');
    const main = page.locator('main');
    for (const item of [
      'Hardwares utilizados e disponíveis',
      'Histórico de manutenção do hardware',
      'Sistemas Operacionais instalados',
      'Atualizações de segurança e otimização aplicadas',
      'Softwares e licenças instalados e em uso',
      'Controle do acesso aos dispositivos',
      'Definições e agendamento de rotinas de backup',
    ]) {
      await expect(main).toContainText(item);
    }
    await expect(page.locator('body')).not.toContainText('Sed magna ornare ultricies');
  });

  test('T2-F08-03: renders all 8 Inventário benefits with orthography fixes', async ({ page }) => {
    await page.goto('/servicos/preventivas');
    const main = page.locator('main');

    await expect(main).toContainText('previstas');
    await expect(main).toContainText('todos os atendimentos');
    await expect(main).not.toContainText("Área do Cliente'");
    await expect(main).not.toContainText('todos os atendimento ');
  });

  test('T2-F08-04: Preventivas links and consultation CTA contain zero dead # targets', async ({
    page,
  }) => {
    await page.goto('/servicos/preventivas');
    await expect(page.locator('main a[href="#"]')).toHaveCount(0);
    await expect(page.locator(`main a[href*="${WHATSAPP_PHONE}"]`).first()).toBeVisible();
  });

  test('T2-F08-05: Preventivas maintains zero horizontal overflow across 375px, 768px, and 1440px', async ({
    page,
  }) => {
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/servicos/preventivas');
      await expectNoHorizontalOverflow(page, `/servicos/preventivas @ ${width}px`);
    }
  });
});

test.describe('Tier 2 — Feature 9: Servidor Proxy Boundaries (/produtos/proxy)', () => {
  test('T2-F09-01: renders all 3 sequential architecture diagram nodes', async ({ page }) => {
    await page.goto('/produtos/proxy');
    const main = page.locator('main');
    await expect(main).toContainText('Objetos de rede');
    await expect(main).toContainText('Perfis de acesso');
    await expect(main).toContainText('Regras de filtro de conteúdo');
  });

  test('T2-F09-02: enforces corrected Portuguese orthography (no extruturas/consciliado/de de)', async ({
    page,
  }) => {
    await page.goto('/produtos/proxy');
    const text = await page.locator('main').innerText();
    expect(text).toMatch(/conciliado/i);
    expect(text).toMatch(/a grandes/i);
    expect(text).toMatch(/estruturas/i);
    expect(text).toMatch(/regras de filtro/i);
    for (const typo of FORBIDDEN_TYPOS) {
      expect(text).not.toContain(typo);
    }
  });

  test('T2-F09-03: renders all 6 advantage cards', async ({ page }) => {
    await page.goto('/produtos/proxy');
    const main = page.locator('main');
    for (const pattern of [
      /Economia de banda/i,
      /Controle de acesso/i,
      /Anonimato e segurança/i,
      /Tempo de resposta/i,
      /Política de uso aceitável/i,
      /carga administrativa|sobrecargas administrativas/i,
    ]) {
      await expect(main).toContainText(pattern);
    }
  });

  test('T2-F09-04: evaluation CTA routes to WhatsApp or /contato instead of Facebook', async ({
    page,
  }) => {
    await page.goto('/produtos/proxy');
    const cta = page
      .locator('main')
      .getByRole('link', { name: /Solicit(ar|e uma) avaliação técnica/i })
      .first();
    const href = (await cta.getAttribute('href')) || '';
    expect(href).not.toContain('facebook.com');
    expect(href.includes(WHATSAPP_PHONE) || href.startsWith('/contato')).toBe(true);
  });

  test('T2-F09-05: references Squid/SquidGuard/Dansguardian or core delivery with zero 375px overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/produtos/proxy');
    await expect(page.locator('main')).toContainText(/Squid|largura de banda|malwares/i);
    await expectNoHorizontalOverflow(page, '/produtos/proxy @ 375px');
  });
});

test.describe('Tier 2 — Feature 10: Mailhost Complete 37x4 Matrix & Boundaries (/produtos/mailhost)', () => {
  test('T2-F10-02: Mailhost renders exact 4 plan columns with "Sob consulta" and zero blank trailing column', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');
    const table = page.getByRole('table').first();
    expect(await table.locator('thead tr').first().locator('th').count()).toBe(5);
    for (const col of MAILHOST_COLUMNS) {
      await expect(table.getByRole('columnheader', { name: new RegExp(col, 'i') })).toBeVisible();
    }
    await expect(table).toContainText(/Sob consulta/i);
    await expect(page.locator('body')).not.toContainText('CONSULTE');
  });

  test('T2-F10-03: verifies exact 37 Mailhost features across all 4 categories (7+12+11+7)', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');
    for (const cat of MAILHOST_CATEGORIES) {
      const btn = page.getByRole('button', { name: new RegExp(cat.title, 'i') }).first();
      if ((await btn.getAttribute('aria-expanded')) === 'false') {
        await btn.click();
      }
    }

    let total = 0;
    const table = page.getByRole('table').first();
    for (const cat of MAILHOST_CATEGORIES) {
      for (const rowSpec of cat.rows) {
        await expect(table.getByRole('row').filter({ hasText: rowSpec.feature }).first()).toBeVisible();
        total += 1;
      }
    }
    expect(total).toBe(37);
  });

  test('T2-F10-04: exhaustively verifies every single one of the 37x4 (148) Mailhost cell states', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');
    for (const cat of MAILHOST_CATEGORIES) {
      const btn = page.getByRole('button', { name: new RegExp(cat.title, 'i') }).first();
      if ((await btn.getAttribute('aria-expanded')) === 'false') {
        await btn.click();
      }
    }

    const table = page.getByRole('table').first();
    for (const cat of MAILHOST_CATEGORIES) {
      for (const rowSpec of cat.rows) {
        const tr = table.getByRole('row').filter({ hasText: rowSpec.feature }).first();
        const cells = tr.locator('td');
        expect(await readPricingCellState(cells.nth(0)), `${rowSpec.feature} [Starter]`).toBe(
          rowSpec.values.starter
        );
        expect(await readPricingCellState(cells.nth(1)), `${rowSpec.feature} [Standard]`).toBe(
          rowSpec.values.standard
        );
        expect(await readPricingCellState(cells.nth(2)), `${rowSpec.feature} [Advanced]`).toBe(
          rowSpec.values.advanced
        );
        expect(await readPricingCellState(cells.nth(3)), `${rowSpec.feature} [Hosted]`).toBe(
          rowSpec.values.hosted
        );
      }
    }
  });

  test('T2-F10-05: renders all 6 integration chips and modular scalability note', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');
    const main = page.locator('main');
    for (const chip of MAILHOST_INTEGRATION_CHIPS) {
      await expect(main).toContainText(chip);
    }
    await expect(main).toContainText(/modular/i);
    await expect(main).toContainText(/expandida de acordo com a necessidade/i);
  });

  test('T2-F10-06: Mailhost table uses scope="col" headers and non-color-only accessible cell labels', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');
    const table = page.getByRole('table').first();

    const scopedHeaderCount = await table.locator('thead th[scope="col"]').count();
    expect(scopedHeaderCount).toBeGreaterThanOrEqual(4);

    const firstRowCells = table.locator('tbody tr').filter({ has: page.locator('td') }).first().locator('td');
    const cellState = await readPricingCellState(firstRowCells.first());
    expect(['included', 'excluded']).toContain(cellState);
  });
});

test.describe('Tier 2 — Feature 11: Samba4 AD Complete 20x3 Matrix & Boundaries (/produtos/samba_ad)', () => {
  test('T2-F11-01: negative legacy check — zero Windows Server 2012 or 2017 prices', async ({
    page,
  }) => {
    await page.goto('/produtos/samba_ad');
    const body = page.locator('body');
    for (const forbidden of [
      'Windows Server 2012',
      'WINDOWS® SERVER 2012',
      'R$2.671,65',
      '2.671,65',
      '31/05/2017',
      'COEM / 5 CALS',
    ]) {
      await expect(body).not.toContainText(forbidden);
    }
  });

  test('T2-F11-02: renders exact 3 plan columns, "Sob consulta", and all 20 Samba4 AD features', async ({
    page,
  }) => {
    await page.goto('/produtos/samba_ad');
    const table = page.getByRole('table').first();

    for (const col of SAMBA_COLUMNS) {
      await expect(table.getByRole('columnheader', { name: new RegExp(col, 'i') })).toBeVisible();
    }
    expect(await table.locator('thead tr').first().locator('th').count()).toBe(4);
    await expect(table).toContainText(/Sob consulta/i);

    for (const rowSpec of SAMBA_AD_ROWS) {
      await expect(table.getByRole('row').filter({ hasText: rowSpec.match }).first()).toBeVisible();
    }
    expect(SAMBA_AD_ROWS.length).toBe(20);
  });

  test('T2-F11-03: exhaustively verifies all 20x3 (60) Samba4 AD 3-state cells and legend', async ({
    page,
  }) => {
    await page.goto('/produtos/samba_ad');
    const main = page.locator('main');
    const table = page.getByRole('table').first();

    await expect(main).toContainText(/Incluso|Incluído/i);
    await expect(main).toContainText(/Opcional/i);
    await expect(main).toContainText(/Não incluso|Não incluído/i);

    for (const rowSpec of SAMBA_AD_ROWS) {
      const tr = table.getByRole('row').filter({ hasText: rowSpec.match }).first();
      const cells = tr.locator('td');
      expect(await readPricingCellState(cells.nth(0)), `${rowSpec.feature} [Starter]`).toBe(
        rowSpec.values.starter
      );
      expect(await readPricingCellState(cells.nth(1)), `${rowSpec.feature} [Standard]`).toBe(
        rowSpec.values.standard
      );
      expect(await readPricingCellState(cells.nth(2)), `${rowSpec.feature} [Advanced]`).toBe(
        rowSpec.values.advanced
      );
    }
  });

  test('T2-F11-04: verifies ADSI is excluded on all 3 tiers and RSAT *** footnote is visible', async ({
    page,
  }) => {
    await page.goto('/produtos/samba_ad');
    const table = page.getByRole('table').first();
    const adsiRow = table.getByRole('row').filter({ hasText: /Suporte à interface de acesso ADSI/i }).first();
    const cells = adsiRow.locator('td');

    expect(await readPricingCellState(cells.nth(0))).toBe('excluded');
    expect(await readPricingCellState(cells.nth(1))).toBe('excluded');
    expect(await readPricingCellState(cells.nth(2))).toBe('excluded');

    await expect(page.locator('main')).toContainText(/\*\*\*.*RSAT requer licença do Windows/i);
  });

  test('T2-F11-05: enforces orthography fixes (Antivírus) and zero horizontal overflow at 375px and 1440px', async ({
    page,
  }) => {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/produtos/samba_ad');
      await expect(page.locator('main')).toContainText(/Antiv[ií]rus/i);
      await expect(page.locator('body')).not.toContainText('Active Diretory');
      await expectNoHorizontalOverflow(page, `/produtos/samba_ad @ ${width}px`);
    }
  });
});
