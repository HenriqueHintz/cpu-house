import { expect, test } from '@playwright/test';
import {
  expectAllImagesValid,
  expectNoHorizontalOverflow,
  readPricingCellState,
  scrollToPercentAndSettle,
} from './helpers/assertions';
import { WHATSAPP_CONSULTA_REGEX, WHATSAPP_PHONE } from './helpers/routes';

test.describe('Tier 1 — Feature 4: Reusable UI & Motion Primitives', () => {
  test('T1-F04-01: PricingTable thead stays sticky on desktop 1440x900 scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/produtos/mailhost');

    const table = page.getByRole('table').first();
    await expect(table).toBeVisible();

    const tableTop = await table.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior }), tableTop + 260);

    await expect
      .poll(async () =>
        table.evaluate((el) => {
          const thead = el.querySelector('thead');
          const th = el.querySelector('thead th');
          const theadPos = thead ? getComputedStyle(thead).position : '';
          const thPos = th ? getComputedStyle(th).position : '';
          const rect = (thead || th)?.getBoundingClientRect();
          return {
            isSticky: theadPos === 'sticky' || thPos === 'sticky',
            top: rect ? rect.top : -1,
          };
        })
      )
      .toMatchObject({ isSticky: true });

    const stickyRect = await table.evaluate((el) => {
      const thead = el.querySelector('thead');
      return thead ? thead.getBoundingClientRect().top : -1;
    });
    expect(stickyRect).toBeGreaterThanOrEqual(0);
    expect(stickyRect).toBeLessThanOrEqual(160);
  });

  test('T1-F04-02: Samba4 AD PricingTable displays 3-state legend and accessible non-color cell labels', async ({
    page,
  }) => {
    await page.goto('/produtos/samba_ad');

    await expect(page.getByText(/Incluso|Incluído/i).first()).toBeVisible();
    await expect(page.getByText(/Opcional/i).first()).toBeVisible();
    await expect(page.getByText(/Não incluso|Não incluído/i).first()).toBeVisible();

    const catalogRow = page.getByRole('row').filter({ hasText: /Gerência do Catálogo Global/i });
    await expect(catalogRow).toBeVisible();

    const cells = catalogRow.locator('td');
    expect(await cells.count()).toBeGreaterThanOrEqual(3);

    expect(await readPricingCellState(cells.nth(0))).toBe('excluded');
    expect(await readPricingCellState(cells.nth(1))).toBe('optional');
    expect(await readPricingCellState(cells.nth(2))).toBe('included');
  });

  test('T1-F04-03: PricingTable collapsible category toggles aria-expanded and row visibility', async ({
    page,
  }) => {
    await page.goto('/produtos/mailhost');

    const categoryBtn = page
      .getByRole('button', { name: /Segurança & Anti-spam/i })
      .first();
    await expect(categoryBtn).toBeVisible();

    const initialExpanded = await categoryBtn.getAttribute('aria-expanded');
    expect(['true', 'false']).toContain(initialExpanded);

    const sampleFeature = page.getByText('Filtragem de SPAM').first();

    await categoryBtn.click();
    const flipped = initialExpanded === 'true' ? 'false' : 'true';
    await expect(categoryBtn).toHaveAttribute('aria-expanded', flipped);

    if (flipped === 'false') {
      await expect(sampleFeature).toBeHidden();
    } else {
      await expect(sampleFeature).toBeVisible();
    }

    await categoryBtn.click();
    await expect(categoryBtn).toHaveAttribute('aria-expanded', initialExpanded!);
  });

  test('T1-F04-04: TeamCard renders circular avatars, Cristiano real photo, and grayscale-to-color styling', async ({
    page,
  }) => {
    await page.goto('/');

    const teamSection = page
      .locator('section')
      .filter({ hasText: /Nosso patrimônio intelectual/i })
      .first();
    await teamSection.scrollIntoViewIfNeeded();

    const cristianoImg = teamSection.locator('img[alt*="Cristiano" i]').first();
    await expect(cristianoImg).toBeVisible();

    const imgStats = await cristianoImg.evaluate((img: HTMLImageElement) => {
      const cs = getComputedStyle(img);
      return {
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        borderRadius: cs.borderRadius,
        filter: cs.filter,
        parentRadius: img.parentElement ? getComputedStyle(img.parentElement).borderRadius : '',
      };
    });

    expect(imgStats.complete).toBe(true);
    expect(imgStats.naturalWidth).toBeGreaterThan(0);
    expect(imgStats.borderRadius !== '0px' || imgStats.parentRadius !== '0px').toBe(true);
    expect(imgStats.filter).toMatch(/grayscale/i);

    await cristianoImg.hover();
    await expectAllImagesValid(page);
  });

  test('T1-F04-05: Reveal sections and AnimatedCounter settle visible under normal and reduced motion', async ({
    page,
  }) => {
    await page.goto('/');
    await scrollToPercentAndSettle(page, 50);
    await scrollToPercentAndSettle(page, 100);

    await expect(page.getByText('Desde 2007').first()).toBeVisible();
    await expect(page.getByText(/2\s+estados atendidos/i).first()).toBeVisible();
    await expect(page.getByText(/100%\s+open source/i).first()).toBeVisible();

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await scrollToPercentAndSettle(page, 50);
    await scrollToPercentAndSettle(page, 100);

    await expect(page.getByText(/2007/).first()).toBeVisible();
    await expect(page.getByText(/estados atendidos/i).first()).toBeVisible();
    await expect(page.getByText(/open source/i).first()).toBeVisible();
  });
});

test.describe('Tier 1 — Feature 5: Hero 3D Isometric Vector Scene & SVGs', () => {
  test('T1-F05-01: Hero 3D scene has aria-hidden="true", non-zero isometric SVG, and CSS 3D transforms', async ({
    page,
  }) => {
    await page.goto('/');

    const hero = page.locator('main section').first();
    const decorativeScene = hero.locator('[aria-hidden="true"]').filter({ has: page.locator('svg') }).first();
    await expect(decorativeScene).toBeVisible();

    const sceneMetrics = await decorativeScene.evaluate((el) => {
      const svgs = Array.from(el.querySelectorAll('svg'));
      const maxSvg = svgs.reduce(
        (acc, svg) => {
          const r = svg.getBoundingClientRect();
          return r.width * r.height > acc.width * acc.height
            ? { width: r.width, height: r.height }
            : acc;
        },
        { width: 0, height: 0 }
      );

      const nodes = [el, ...Array.from(el.querySelectorAll('*'))];
      const has3d = nodes.some((node) => {
        const cs = getComputedStyle(node);
        return (
          cs.transformStyle === 'preserve-3d' ||
          (cs.perspective && cs.perspective !== 'none') ||
          (cs.transform && cs.transform.includes('matrix3d'))
        );
      });

      return { maxSvg, has3d };
    });

    expect(sceneMetrics.maxSvg.width).toBeGreaterThan(100);
    expect(sceneMetrics.maxSvg.height).toBeGreaterThan(100);
    expect(sceneMetrics.has3d).toBe(true);
    await expectNoHorizontalOverflow(page, 'Hero 3D scene');
  });

  test('T1-F05-02: Hero H1 is immediately visible above the fold on desktop and mobile', async ({
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

  test('T1-F05-03: Hero vector loops animate normally and become static under prefers-reduced-motion', async ({
    page,
  }) => {
    await page.goto('/');
    const animatedNormal = await page.evaluate(() => {
      const hero = document.querySelector('main section');
      if (!hero) return false;
      const hidden = hero.querySelector('[aria-hidden="true"]');
      if (!hidden) return false;
      const all = [hidden, ...Array.from(hidden.querySelectorAll('*'))];
      return all.some((el) => {
        const cs = getComputedStyle(el);
        return cs.animationName !== 'none' && parseFloat(cs.animationDuration || '0') > 0;
      });
    });
    expect(animatedNormal).toBe(true);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const reducedMetrics = await page.evaluate(() => {
      const hero = document.querySelector('main section');
      const hidden = hero?.querySelector('[aria-hidden="true"]');
      const svg = hidden?.querySelector('svg');
      const svgBox = svg?.getBoundingClientRect();
      const all = hidden ? [hidden, ...Array.from(hidden.querySelectorAll('*'))] : [];
      const activeAnimations = all.filter((el) => {
        const cs = getComputedStyle(el);
        return (
          cs.animationName !== 'none' &&
          parseFloat(cs.animationDuration || '0') > 0.01 &&
          cs.animationPlayState !== 'paused'
        );
      }).length;
      return {
        svgWidth: svgBox?.width || 0,
        activeAnimations,
      };
    });

    expect(reducedMetrics.svgWidth).toBeGreaterThan(100);
    expect(reducedMetrics.activeAnimations).toBe(0);
  });

  test('T1-F05-04: Home Soluções section renders 3 static isometric SVGs across its tabs', async ({ page }) => {
    await page.goto('/');
    const solSection = page.locator('#solucoes');
    await solSection.scrollIntoViewIfNeeded();

    const tabs = solSection.getByRole('tab');
    expect(await tabs.count()).toBe(3);

    for (let i = 0; i < 3; i++) {
      await tabs.nth(i).click();
      const activeSvg = solSection.locator('[aria-hidden="true"] svg').nth(i + 3);
      const box = await activeSvg.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(60);
      expect(box!.height).toBeGreaterThan(60);
    }
  });

  test('T1-F05-05: Proxy page renders vector flow diagram with 3 architecture stages', async ({
    page,
  }) => {
    await page.goto('/produtos/proxy');

    const archSection = page
      .locator('section')
      .filter({ hasText: /Arquitetura da solução/i })
      .first();
    await archSection.scrollIntoViewIfNeeded();

    await expect(archSection).toContainText('Objetos de rede');
    await expect(archSection).toContainText('Perfis de acesso');
    await expect(archSection).toContainText('Regras de filtro de conteúdo');

    const svgBox = await archSection.locator('svg').first().boundingBox();
    expect(svgBox).not.toBeNull();
    expect(svgBox!.width).toBeGreaterThan(20);
    expect(svgBox!.height).toBeGreaterThan(20);
  });
});

test.describe('Tier 1 — Feature 6: Home Page (/)', () => {
  test('T1-F06-01: Hero displays exact copy and primary/secondary CTAs without legacy trust badges', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByText(/CONSULTORIA E SOLUÇÕES EM TI\s*·\s*DESDE 2007/i).first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Infraestrutura de TI segura, estável e sem surpresas.'
    );
    await expect(
      page.getByText(
        'Servidores, segurança, backup em nuvem e suporte pró-ativo com tecnologias open source consagradas, para sua equipe produzir mais e parar menos.'
      )
    ).toBeVisible();

    const primaryCta = page.getByRole('link', { name: /Agendar consultoria/i }).first();
    await expect(primaryCta).toBeVisible();
    await expect(primaryCta).toHaveAttribute('href', WHATSAPP_CONSULTA_REGEX);

    const secondaryCta = page.getByRole('link', { name: /Conhecer soluções/i }).first();
    await expect(secondaryCta).toBeVisible();
    await expect(secondaryCta).toHaveAttribute('href', /^#/);

    await expect(page.locator('main section').first()).not.toContainText('+18 anos de mercado');
  });

  test('T1-F06-02: Serviços section renders 6 cards without Conheça nossos serviços label and links to /servicos/preventivas', async ({
    page,
  }) => {
    await page.goto('/');
    const section = page.locator('#servicos');
    await expect(section).toBeVisible();
    await expect(section).not.toContainText('Conheça nossos serviços');

    for (const title of [
      'Conectividade',
      'Segurança',
      'Servidores',
      'Suporte Pró-ativo',
      'Treinamento',
      'Estratégia de Backup',
    ]) {
      await expect(section.getByRole('heading', { name: title })).toBeVisible();
    }

    await expect(section.locator('a[href="/servicos/preventivas"]').first()).toBeVisible();
    await expect(section.locator('a[href="#"]')).toHaveCount(0);
  });

  test('T1-F06-03: Soluções section switches cleanly via interactive tabs in single-screen showcase', async ({
    page,
  }) => {
    await page.goto('/');
    const section = page.locator('#solucoes');
    await expect(section).toBeVisible();

    await expect(section.getByRole('tab', { name: /Segurança Corporativa/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(section.locator('a[href="/produtos/proxy"]').first()).toBeVisible();

    await section.getByRole('tab', { name: /Backup em Nuvem/i }).click();
    await expect(section).toContainText('LGPD');
    await expect(section).toContainText('criptografia');

    await section.getByRole('tab', { name: /E-Cidade/i }).click();
    await expect(
      section.locator('a[href*="ecidade.softwarepublico.org"]').first()
    ).toBeVisible();
  });

  test('T1-F06-04: Home page excludes removed Produtos summary section', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('#produtos')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText('Produtos prontos para a sua infraestrutura');
  });

  test('T1-F06-05: Números section (3 counters) and dark Final CTA render required copy and WhatsApp CTA', async ({
    page,
  }) => {
    await page.goto('/');
    await scrollToPercentAndSettle(page, 100);

    await expect(page.getByText('Desde 2007').first()).toBeVisible();
    await expect(page.getByText(/2\s+estados atendidos/i).first()).toBeVisible();
    await expect(page.getByText(/100%\s+open source/i).first()).toBeVisible();

    await expect(
      page.getByText(/Entre em contato agora mesmo com nossos consultores/i).first()
    ).toBeVisible();
    await expect(page.locator(`a[href*="${WHATSAPP_PHONE}"]`).first()).toBeVisible();
  });

  test('T1-F06-06: Equipe section renders 4 members, valid LinkedIn links, and excludes broken Davi link & 2018 banner', async ({
    page,
  }) => {
    await page.goto('/');
    const section = page
      .locator('section')
      .filter({ hasText: /Nosso patrimônio intelectual/i })
      .first();
    await expect(section).toBeVisible();
    await expect(section.locator('a[href="/empresa"]').first()).toBeVisible();

    for (const member of ['Cristiano Furtado', 'Christian Tosta', 'Davi Furtado', 'Moisés Dantas']) {
      await expect(section).toContainText(member);
    }

    await expect(section.locator('a[href*="cristiano-furtado-425780b5"]')).toHaveCount(1);
    await expect(section.locator('a[href*="christian-tosta-24399049"]')).toHaveCount(1);
    await expect(section.locator('a[href*="moshe-dantas"]')).toHaveCount(1);
    await expect(section.locator('a[href="https://br.linkedin.com/in/"]')).toHaveCount(0);

    await expect(page.locator('body')).not.toContainText('Acelere o rendimento no trabalho');
  });
});

test.describe('Tier 1 — Feature 7: Empresa Page (/empresa)', () => {
  test('T1-F07-01: Empresa renders heading and verbatim leadership quote', async ({ page }) => {
    await page.goto('/empresa');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Nossa História|Sobre a CPU House/i);
    await expect(page.locator('main')).toContainText(
      /Um líder deve incentivar, motivar e sempre acreditar em seus liderados\. Dessa forma não teremos um grande líder e sim uma grande equipe formada por líderes/i
    );
  });

  test('T1-F07-02: vertical timeline renders 2007, 2014, 2018, and Hoje without outdated 12-year copy', async ({
    page,
  }) => {
    await page.goto('/empresa');
    const main = page.locator('main');

    await expect(main).toContainText('2007');
    await expect(main).toContainText('1º de março de 2007');
    await expect(main).toContainText('2014');
    await expect(main).toContainText(/consultoria em gestão/i);
    await expect(main).toContainText('2018');
    await expect(main).toContainText(/SaaS em nuvem/i);
    await expect(main).toContainText('Hoje');

    await expect(main).not.toContainText('mais de 12 anos');
  });

  test('T1-F07-03: Comunidade Open Source lists all 7 entities with fixed Open Invention Network spelling', async ({
    page,
  }) => {
    await page.goto('/empresa');
    const main = page.locator('main');

    for (const entity of [
      'ASL',
      'Open Invention Network',
      'Fedora',
      'Fedora Educacional',
      'Ekaaty Linux',
      'Sacix',
      'Suporte Linux',
    ]) {
      await expect(main).toContainText(entity);
    }

    await expect(main).not.toContainText('Open Inventation Network');
    await expect(main.locator('a[href*="facebook.com/suportelinux"]').first()).toBeVisible();
  });

  test('T1-F07-04: Projetos Sociais lists Casa Brasil, Crianças Hackers, Texto Livre, and Clube da Leitura', async ({
    page,
  }) => {
    await page.goto('/empresa');
    const main = page.locator('main');

    await expect(main).toContainText(/Projetos Sociais/i);
    for (const project of ['Casa Brasil', 'Crianças Hackers', 'Texto Livre', 'FALE/UFMG', 'Clube da Leitura']) {
      await expect(main).toContainText(project);
    }
  });

  test('T1-F07-05: Crianças Hackers card renders 4 clickable external links', async ({ page }) => {
    await page.goto('/empresa');
    const main = page.locator('main');

    const expectedLinks = [
      'raulhc.cc/Projetos/CriancasHacker',
      'g1.globo.com/bahia/noticia/2015/10/criancas-hackers',
      'gshow.globo.com/Rede-Bahia/Aprovado/noticia/2016/05/projeto-criancas-hackers',
      'youtube.com/watch?v=A-nK1aGsR90',
    ];

    for (const urlPart of expectedLinks) {
      const link = main.locator(`a[href*="${urlPart}"]`).first();
      await expect(link, `Expected clickable link for ${urlPart}`).toBeVisible();
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });
});
