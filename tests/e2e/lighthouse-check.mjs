import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, 'test-results', 'lighthouse');
const SYSTEM_CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const THRESHOLDS = {
  performance: 90, // strictly > 90
  accessibility: 95,
  'best-practices': 95,
  seo: 95,
};

function parseArgs(argv) {
  let preset = 'both';
  let routes = ['/', '/empresa', '/servicos/preventivas', '/produtos/mailhost'];
  for (const arg of argv) {
    if (arg.startsWith('--preset=')) {
      preset = arg.split('=')[1] || 'both';
    } else if (arg.startsWith('--routes=')) {
      routes = (arg.split('=')[1] || '/').split(',').filter(Boolean);
    } else if (arg === '--quick') {
      routes = ['/'];
    }
  }
  return { preset, routes };
}

function resolveChromePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  if (process.platform === 'win32' && fs.existsSync(SYSTEM_CHROME)) {
    return SYSTEM_CHROME;
  }
  return undefined;
}

function resolveLighthouseRunner() {
  try {
    const localCli = require.resolve('lighthouse/cli/index.js', { paths: [ROOT_DIR] });
    return { scriptPath: localCli, prefixArgs: [] };
  } catch {
    const nodeDir = path.dirname(process.execPath);
    const candidates = [
      path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npx-cli.js'),
      'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npx-cli.js',
    ];
    for (const npxCli of candidates) {
      if (fs.existsSync(npxCli)) {
        return { scriptPath: npxCli, prefixArgs: ['--yes', 'lighthouse'] };
      }
    }
    throw new Error('Could not locate local lighthouse/cli/index.js or npm npx-cli.js');
  }
}

function resolveNpmCli() {
  const nodeDir = path.dirname(process.execPath);
  const candidates = [
    path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
  ];
  for (const npmCli of candidates) {
    if (fs.existsSync(npmCli)) return npmCli;
  }
  throw new Error('Could not locate npm-cli.js alongside Node executable');
}

async function isServerReachable(url) {
  try {
    const res = await fetch(url, { method: 'GET' });
    return res.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(url, timeoutMs = 45_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await isServerReachable(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for server at ${url}`);
}

function slugForRoute(route) {
  if (route === '/') return 'home';
  return route.replace(/^\/+/, '').replace(/[^a-zA-Z0-9_-]+/g, '-');
}

function runLighthouseForUrl({ runner, targetUrl, mode, reportPath, chromePath }) {
  const lhArgs = [
    ...runner.prefixArgs,
    targetUrl,
    '--output=json',
    `--output-path=${reportPath}`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
    '--quiet',
    ...(mode === 'desktop' ? ['--preset=desktop'] : []),
  ];

  const env = {
    ...process.env,
    ...(chromePath ? { CHROME_PATH: chromePath } : {}),
  };

  const result = spawnSync(process.execPath, [runner.scriptPath, ...lhArgs], {
    cwd: ROOT_DIR,
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.error) {
    throw result.error;
  }
  if (!fs.existsSync(reportPath)) {
    throw new Error(
      `Lighthouse failed to generate ${reportPath} (exit ${result.status}):\n${result.stderr || result.stdout}`
    );
  }
  return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
}

async function main() {
  const { preset, routes } = parseArgs(process.argv.slice(2));
  const port = process.env.PORT || '3000';
  const baseUrl = (process.env.BASE_URL || `http://localhost:${port}`).replace(/\/+$/, '');
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || baseUrl).replace(/\/+$/, '');
  const chromePath = resolveChromePath();
  const runner = resolveLighthouseRunner();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let serverProcess = null;
  const alreadyRunning = await isServerReachable(baseUrl);

  if (!alreadyRunning) {
    const buildIdPath = path.join(ROOT_DIR, '.next', 'BUILD_ID');
    if (!fs.existsSync(buildIdPath)) {
      throw new Error(
        `Production build not found at ${buildIdPath}. Run "npm run build" before running lighthouse-check.mjs.`
      );
    }
    const npmCli = resolveNpmCli();
    serverProcess = spawn(process.execPath, [npmCli, 'run', 'start'], {
      cwd: ROOT_DIR,
      env: {
        ...process.env,
        PORT: port,
        NEXT_PUBLIC_SITE_URL: siteUrl,
        NODE_ENV: 'production',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    await waitForServer(baseUrl);
  }

  const modes = preset === 'both' ? ['desktop', 'mobile'] : [preset];
  const failures = [];

  try {
    for (const route of routes) {
      const targetUrl = `${baseUrl}${route === '/' ? '/' : route}`;
      const slug = slugForRoute(route);

      for (const mode of modes) {
        const reportPath = path.join(OUTPUT_DIR, `report-${slug}-${mode}.json`);
        const lhr = runLighthouseForUrl({ runner, targetUrl, mode, reportPath, chromePath });

        const scores = {
          performance: Math.round((lhr.categories?.performance?.score ?? 0) * 100),
          accessibility: Math.round((lhr.categories?.accessibility?.score ?? 0) * 100),
          'best-practices': Math.round((lhr.categories?.['best-practices']?.score ?? 0) * 100),
          seo: Math.round((lhr.categories?.seo?.score ?? 0) * 100),
        };
        const fontDisplayScore = lhr.audits?.['font-display']?.score;
        const lcp = lhr.audits?.['largest-contentful-paint']?.displayValue || 'n/a';
        const fcp = lhr.audits?.['first-contentful-paint']?.displayValue || 'n/a';
        const cls = lhr.audits?.['cumulative-layout-shift']?.displayValue || 'n/a';
        const tbt = lhr.audits?.['total-blocking-time']?.displayValue || 'n/a';

        console.log(
          `[Lighthouse ${mode}] ${route} -> Perf=${scores.performance} A11y=${scores.accessibility} BP=${scores['best-practices']} SEO=${scores.seo} | FCP=${fcp} LCP=${lcp} CLS=${cls} TBT=${tbt} | font-display=${fontDisplayScore}`
        );

        if (!(scores.performance > THRESHOLDS.performance)) {
          failures.push(`${route} (${mode}) performance=${scores.performance} <= 90`);
        }
        if (scores.accessibility < THRESHOLDS.accessibility) {
          failures.push(`${route} (${mode}) accessibility=${scores.accessibility} < 95`);
        }
        if (scores['best-practices'] < THRESHOLDS['best-practices']) {
          failures.push(`${route} (${mode}) best-practices=${scores['best-practices']} < 95`);
        }
        if (scores.seo < THRESHOLDS.seo) {
          failures.push(`${route} (${mode}) seo=${scores.seo} < 95`);
        }
        if (fontDisplayScore === 0) {
          failures.push(`${route} (${mode}) font-display audit failed (score=0)`);
        }
      }
    }
  } finally {
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill('SIGTERM');
    }
  }

  if (failures.length > 0) {
    console.error('\nLighthouse gate failures:\n- ' + failures.join('\n- '));
    process.exit(1);
  }

  console.log(`\nAll Lighthouse checks passed! Reports saved to ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
