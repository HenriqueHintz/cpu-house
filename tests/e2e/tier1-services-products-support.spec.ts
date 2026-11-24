import { expect, test } from '@playwright/test';
import { expectAllImagesValid, readPricingCellState } from './helpers/assertions';
import {
  MAILHOST_CATEGORIES,
  MAILHOST_COLUMNS,
  MAILHOST_INTEGRATION_CHIPS,
  SAMBA_AD_ROWS,
  SAMBA_COLUMNS,
} from './helpers/matrices';
import {
  ALL_ROUTES,
  EXPECTED_OFFICES,
  SUPPORTING_ROUTES,
  WHATSAPP_CONSULTA_REGEX,
  WHATSAPP_PHONE,
} from './helpers/routes';

test.describe('Tier 1 — Feature 8: Preventivas Corporativas (/servicos/preventivas)', () => {
  test('T1-F08-01: heading, proactive support intro, and zero Lorem Ipsum', async ({ page }) => {
    await page.goto('/servicos/preventivas');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Preventivas Corporativas/i);
    await expect(page.locator('main')).toContainText(/suporte pró-ativo/i);
    await expect(page.locator('main')).toContainText(
      /falhas são previstas e corrigidas antes que se manifestem/i
    );
    await expect(page.locator('body')).not.toContainText('Sed magna ornare ultricies');
  });

  test('T1-F08-02: checklist renders all 7 monitored assets', async ({ page }) => {
    await page.goto('/servicos/preventivas');
    const main = page.locator('main');

    const assets = [
      'Hardwares utilizados e disponíveis',
      'Histórico de manutenção do hardware',
      'Sistemas Operacionais instalados',
      'Atualizações de segurança e otimização aplicadas',
      'Softwares e licenças instalados e em uso',
      'Controle do acesso aos dispositivos',
      'Definições e agendamento de rotinas de backup',
    ];

    for (const item of assets) {
      await expect(main).toContainText(item);
    }
  });

  test('T1-F08-03: Inventário section renders all 8 benefits with fixed orthography', async ({
    page,
  }) => {
    await page.goto('/servicos/preventivas');
    const main = page.locator('main');

    await expect(main).toContainText(/Inventário/i);

    const benefits = [
      'Preventivas previamente agendadas com seu acompanhamento',
      'Checklist online automático ou feito por nossos técnicos',
      'Acesso exclusivo único, seguro e intransferível ao seu inventário e relatórios',
      'Possibilidade de check-in, check-out, relocação, desativação ou reserva de dispositivos',
      'Controle online das licenças de software em uso na sua infraestrutura',
      'Controle primário da atribuição e reservas de escopos IP na rede',
      'Abertura e controle de seus chamados a partir da Área do Cliente',
      'A sua avaliação em todos os atendimentos prestados via WEB',
    ];

    for (const benefit of benefits) {
      await expect(main).toContainText(benefit);
    }

    await expect(main).not.toContainText("Área do Cliente'");
  });

  test('T1-F08-04: Telas do sistema de Inventário renders 4 browser-mockup placeholders without broken images', async ({
    page,
  }) => {
    await page.goto('/servicos/preventivas');
    const gallerySection = page
      .locator('section')
      .filter({ hasText: /Telas do sistema de Inventário/i })
      .first();
    await expect(gallerySection).toBeVisible();

    const frames = gallerySection.locator('article, figure, [data-mockup], div[class*="rounded"]');
    const frameCount = await frames.count();
    expect(frameCount).toBeGreaterThanOrEqual(4);

    await expectAllImagesValid(page);
  });

  test('T1-F08-05: bottom consultation CTA routes to WhatsApp', async ({ page }) => {
    await page.goto('/servicos/preventivas');
    const cta = page.locator('main').getByRole('link', { name: /Agendar consultoria/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', WHATSAPP_CONSULTA_REGEX);
  });
});

test.describe('Tier 1 — Feature 9: Servidor Proxy (/produtos/proxy)', () => {
  test('T1-F09-01: heading, subtitle, and problem statement render cleanly', async ({ page }) => {
    await page.goto('/produtos/proxy');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Servidor Proxy/i);
    const main = page.locator('main');
    await expect(main).toContainText(/Solução completa para controle de acesso à WEB/i);
    await expect(main).toContainText(/largura de banda/i);
    await expect(main).toContainText(/memória/i);
    await expect(main).toContainText(/uso de disco/i);
  });

  test('T1-F09-02: proxy delivery copy describes speed, access control, and content filtering', async ({
    page,
  }) => {
    await page.goto('/produtos/proxy');
    const main = page.locator('main');

    await expect(main).toContainText(/velocidade de acesso/i);
    await expect(main).toContainText(/controle/i);
    await expect(main).toContainText(/monitoramento/i);
    await expect(main).toContainText(/malwares/i);
    await expect(main).toContainText(/vírus/i);
  });

  test('T1-F09-03: renders 6 advantage cards covering all specified benefits', async ({ page }) => {
    await page.goto('/produtos/proxy');
    const main = page.locator('main');

    for (const advantage of [
      /Economia de banda|economia no uso do plano de acesso à Internet/i,
      /Controle de acesso|controle das informações acessadas/i,
      /Anonimato e segurança/i,
      /Tempo de resposta/i,
      /Política de uso aceitável|política de acesso aceitável/i,
      /carga administrativa|sobrecargas administrativas/i,
    ]) {
      await expect(main).toContainText(advantage);
    }
  });

  test('T1-F09-04: architecture section renders 3 stages and diagram without legacy typos', async ({
    page,
  }) => {
    await page.goto('/produtos/proxy');
    const main = page.locator('main');

    await expect(main).toContainText(/Arquitetura da solução/i);
    await expect(main).toContainText('Objetos de rede');
    await expect(main).toContainText('Perfis de acesso');
    await expect(main).toContainText('Regras de filtro de conteúdo');

    await expect(main).not.toContainText('extruturas');
    await expect(main).not.toContainText('regras de de filtro');
    await expect(main).not.toContainText('consciliado');
  });

  test('T1-F09-05: evaluation CTA points to WhatsApp or /contato instead of Facebook', async ({
    page,
  }) => {
    await page.goto('/produtos/proxy');
    const cta = page
      .locator('main')
      .getByRole('link', { name: /Solicit(ar|e uma) avaliação técnica/i })
      .first();
    await expect(cta).toBeVisible();
    const href = (await cta.getAttribute('href')) || '';
    expect(href).not.toContain('facebook.com');
    expect(href.includes(WHATSAPP_PHONE) || href.startsWith('/contato')).toBe(true);
  });
});

test.describe('Tier 1 — Feature 10: Servidor de E-mails (/produtos/mailhost)', () => {
  test('T1-F10-01: heading, free-software security copy, and proposal CTA', async ({ page }) => {
    await page.goto('/produtos/mailhost');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Servidor de E-Mails/i);
    const main = page.locator('main');
    await expect(main).toContainText(/segredos comerciais/i);
    await expect(main).toContainText(/spam/i);
    await expect(main).toContainText(/vírus/i);
    await expect(main).toContainText(/criptografia/i);
    await expect(main).toContainText(/softwares livres/i);
    await expect(main).toContainText(/baixo footprint/i);

    const cta = main.getByRole('link', { name: /Solicit(ar|e uma) proposta/i }).first();
    await expect(cta).toBeVisible();
    const href = (await cta.getAttribute('href')) || '';
    expect(href).not.toContain('facebook.com');
  });

  test('T1-F10-02: renders all 6 integration chips', async ({ page }) => {
    await page.goto('/produtos/mailhost');
    const main = page.locator('main');

    for (const chip of MAILHOST_INTEGRATION_CHIPS) {
      await expect(main).toContainText(chip);
    }
  });

  test('T1-F10-03: comparison table has 4 tier columns and "Sob consulta" pricing', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');
    const table = page.getByRole('table').first();
    await expect(table).toBeVisible();

    for (const col of MAILHOST_COLUMNS) {
      await expect(table.getByRole('columnheader', { name: new RegExp(col, 'i') })).toBeVisible();
    }

    const headerCells = table.locator('thead tr').first().locator('th');
    expect(await headerCells.count()).toBe(5);

    await expect(table).toContainText(/Sob consulta/i);
    await expect(page.locator('body')).not.toContainText('CONSULTE');
  });

  test('T1-F10-04: expanding all 4 categories reveals all 37 Mailhost feature rows', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');

    for (const cat of MAILHOST_CATEGORIES) {
      const catButton = page.getByRole('button', { name: new RegExp(cat.title, 'i') }).first();
      await expect(catButton).toBeVisible();
      if ((await catButton.getAttribute('aria-expanded')) === 'false') {
        await catButton.click();
      }
      await expect(catButton).toHaveAttribute('aria-expanded', 'true');
    }

    const table = page.getByRole('table').first();
    let verifiedCount = 0;
    for (const cat of MAILHOST_CATEGORIES) {
      for (const rowSpec of cat.rows) {
        const row = table.getByRole('row').filter({ hasText: rowSpec.feature }).first();
        await expect(row, `Missing Mailhost feature row: ${rowSpec.feature}`).toBeVisible();
        verifiedCount += 1;
      }
    }
    expect(verifiedCount).toBe(37);
  });

  test('T1-F10-05: spot-checks Mailhost tier matrix accuracy across key differentiators', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');
    for (const cat of MAILHOST_CATEGORIES) {
      const catButton = page.getByRole('button', { name: new RegExp(cat.title, 'i') }).first();
      if ((await catButton.getAttribute('aria-expanded')) === 'false') {
        await catButton.click();
      }
    }

    const table = page.getByRole('table').first();
    const targets = [
      'Autenticação em LDAP ou Active Directory',
      'Autenticação em Radius',
      'Listas RBL Real Time Blackhole',
      'Filtros automáticos de mensagens (SIEVE)',
      'Acesso via Webmail',
      'Suporte Groupware (Agenda, Contatos, etc)',
    ];

    const allRows = MAILHOST_CATEGORIES.flatMap((c) => c.rows);
    for (const targetName of targets) {
      const expectedRow = allRows.find((r) => r.feature === targetName)!;
      const tr = table.getByRole('row').filter({ hasText: targetName }).first();
      const cells = tr.locator('td');

      expect(await readPricingCellState(cells.nth(0))).toBe(expectedRow.values.starter);
      expect(await readPricingCellState(cells.nth(1))).toBe(expectedRow.values.standard);
      expect(await readPricingCellState(cells.nth(2))).toBe(expectedRow.values.advanced);
      expect(await readPricingCellState(cells.nth(3))).toBe(expectedRow.values.hosted);
    }
  });

  test('T1-F10-06: Detalhes section explains modular scalability across hardware', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');
    const main = page.locator('main');
    await expect(main).toContainText(/modular/i);
    await expect(main).toContainText(
      /um só hardware ou em uma série de servidores organizados para trabalhar conjuntamente/i
    );
  });
});

test.describe('Tier 1 — Feature 11: Samba4 AD Small Business (/produtos/samba_ad)', () => {
  test('T1-F11-01: heading, subtitle, and first-server / AD / SSO copy render cleanly', async ({
    page,
  }) => {
    await page.goto('/produtos/samba_ad');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Samba4 AD Small Business/i);
    const main = page.locator('main');
    await expect(main).toContainText(
      /Solução completa para a gerência de usuários e serviços de rede/i
    );
    await expect(main).toContainText(/primeiro servidor/i);
    await expect(main).toContainText(/Active Directory \(AD\)/i);
    await expect(main).toContainText(/LDAP/i);
    await expect(main).toContainText(/apenas uma senha/i);
  });

  test('T1-F11-02: renders exact 3 plan columns with "Sob consulta" pricing', async ({ page }) => {
    await page.goto('/produtos/samba_ad');
    const table = page.getByRole('table').first();
    await expect(table).toBeVisible();

    for (const col of SAMBA_COLUMNS) {
      await expect(table.getByRole('columnheader', { name: new RegExp(col, 'i') })).toBeVisible();
    }

    expect(await table.locator('thead tr').first().locator('th').count()).toBe(4);
    await expect(table).toContainText(/Sob consulta/i);
  });

  test('T1-F11-03: renders all 20 exact Samba4 AD feature rows', async ({ page }) => {
    await page.goto('/produtos/samba_ad');
    const table = page.getByRole('table').first();

    for (const rowSpec of SAMBA_AD_ROWS) {
      const row = table.getByRole('row').filter({ hasText: rowSpec.match }).first();
      await expect(row, `Missing Samba4 AD row: ${rowSpec.feature}`).toBeVisible();
    }
    expect(SAMBA_AD_ROWS.length).toBe(20);
  });

  test('T1-F11-04: verifies 3-state legend, Opcional puzzle rows, and RSAT footnote', async ({
    page,
  }) => {
    await page.goto('/produtos/samba_ad');
    const main = page.locator('main');
    const table = page.getByRole('table').first();

    await expect(main).toContainText(/Incluso|Incluído/i);
    await expect(main).toContainText(/Opcional/i);
    await expect(main).toContainText(/Não incluso|Não incluído/i);

    for (const rowIdx of [15, 16, 17, 18]) {
      const rowSpec = SAMBA_AD_ROWS[rowIdx];
      const tr = table.getByRole('row').filter({ hasText: rowSpec.match }).first();
      const cells = tr.locator('td');

      expect(await readPricingCellState(cells.nth(0))).toBe(rowSpec.values.starter);
      expect(await readPricingCellState(cells.nth(1))).toBe(rowSpec.values.standard);
      expect(await readPricingCellState(cells.nth(2))).toBe(rowSpec.values.advanced);
    }

    await expect(main).toContainText(/\*\*\*.*RSAT requer licença do Windows/i);
  });

  test('T1-F11-05: strictly excludes Windows Server 2012 column and 2017 pricing', async ({
    page,
  }) => {
    await page.goto('/produtos/samba_ad');
    const body = page.locator('body');

    for (const forbidden of [
      'Windows Server 2012',
      'WINDOWS® SERVER 2012',
      'R$2.671,65',
      '2.671,65',
      'COEM / 5 CALS',
      '31/05/2017',
      'Valor para pagamento à vista',
    ]) {
      await expect(body).not.toContainText(forbidden);
    }
  });
});

test.describe('Tier 1 — Feature 12: Supporting Zero-404 Routes', () => {
  test('T1-F12-01: all 6 supporting routes return HTTP 200 with semantic main and h1', async ({
    page,
  }) => {
    for (const route of SUPPORTING_ROUTES) {
      const res = await page.goto(route);
      expect(res?.status(), `Expected HTTP 200 for ${route}`).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const mainText = await page.locator('main').innerText();
      expect(mainText.trim().length, `Empty <main> on ${route}`).toBeGreaterThan(100);
    }
  });

  test('T1-F12-02: /servicos and /solucoes hubs link to Preventivas and all 3 products with zero # links', async ({
    page,
  }) => {
    await page.goto('/servicos');
    await expect(page.locator('main a[href="/servicos/preventivas"]').first()).toBeVisible();
    for (const svc of ['Conectividade', 'Segurança', 'Servidores', 'Suporte Pró-ativo', 'Treinamento', 'Estratégia de Backup']) {
      await expect(page.locator('main')).toContainText(svc);
    }
    await expect(page.locator('main a[href="#"]')).toHaveCount(0);

    await page.goto('/solucoes');
    await expect(page.locator('main a[href="/produtos/mailhost"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/produtos/proxy"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/produtos/samba_ad"]').first()).toBeVisible();
    await expect(page.locator('main a[href="#"]')).toHaveCount(0);
  });

  test('T1-F12-03: /contato displays BA/MG offices, phones, WhatsApp CTA, and zero login forms', async ({
    page,
  }) => {
    await page.goto('/contato');
    const main = page.locator('main');

    await expect(main).toContainText(EXPECTED_OFFICES.ba.street);
    await expect(main).toContainText(EXPECTED_OFFICES.ba.cep);
    await expect(main).toContainText(EXPECTED_OFFICES.ba.phonePrimary);
    await expect(main).toContainText(EXPECTED_OFFICES.ba.phoneSecondary);

    await expect(main).toContainText(EXPECTED_OFFICES.mg.street);
    await expect(main).toContainText(EXPECTED_OFFICES.mg.cep);
    await expect(main).toContainText(EXPECTED_OFFICES.mg.phonePrimary);

    await expect(main.locator(`a[href*="${WHATSAPP_PHONE}"]`).first()).toBeVisible();
    await expect(page.locator('form:has(input[type="password"])')).toHaveCount(0);
  });

  test('T1-F12-04: /faq renders interactive accessible accordion', async ({ page }) => {
    await page.goto('/faq');

    const faqButtons = page.locator('main button[aria-expanded]');
    const count = await faqButtons.count();
    expect(count).toBeGreaterThanOrEqual(3);

    const firstBtn = faqButtons.first();
    const initial = await firstBtn.getAttribute('aria-expanded');
    await firstBtn.click();
    const next = initial === 'true' ? 'false' : 'true';
    await expect(firstBtn).toHaveAttribute('aria-expanded', next);

    await firstBtn.click();
    await expect(firstBtn).toHaveAttribute('aria-expanded', initial!);
  });

  test('T1-F12-05: /termos and /privacidade render real B2B legal & LGPD content linked from Footer', async ({
    page,
  }) => {
    await page.goto('/termos');
    await expect(page.locator('main')).toContainText(/CPU House/i);
    await expect(page.locator('body')).not.toContainText('Sed magna ornare ultricies');

    await page.goto('/privacidade');
    await expect(page.locator('main')).toContainText(/LGPD|Lei Geral de Proteção de Dados/i);

    await page.getByRole('contentinfo').locator('a[href="/privacidade"]').first().click();
    await page.waitForURL('**/privacidade');
  });

  test('T1-F12-06: site-wide internal link crawl returns HTTP 200 across all 12 routes', async ({
    page,
  }) => {
    const visitedTargets = new Set<string>();

    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href^="/"]')).map((a) =>
          (a.getAttribute('href') || '').split('#')[0]
        )
      );
      for (const path of hrefs) {
        if (!path || visitedTargets.has(path)) continue;
        visitedTargets.add(path);
        const res = await page.request.get(path);
        expect(res.status(), `Internal link ${path} on ${route} returned ${res.status()}`).toBe(200);
      }
    }
    expect(visitedTargets.size).toBeGreaterThanOrEqual(ALL_ROUTES.length);
  });
});
