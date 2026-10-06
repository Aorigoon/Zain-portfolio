import { chromium } from '/home/zainulabidin/.nvm/versions/node/v24.18.0/lib/node_modules/@playwright/mcp/node_modules/playwright/index.mjs';
const b = await chromium.launch({ channel: 'chrome', args: ['--enable-gpu', '--use-angle=gl'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(4000);
const go = (f) => p.evaluate((f) => {
  const el = document.querySelector('#skills');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 2 + el.offsetHeight * f);
}, f);
await go(0); await p.waitForTimeout(1600);
await p.screenshot({ path: '/tmp/sk6-a.png' });
await go(0.5); await p.waitForTimeout(1600);
await p.screenshot({ path: '/tmp/sk6-b.png' });
await go(1.5); await p.waitForTimeout(1600);
await p.screenshot({ path: '/tmp/sk6-c.png' });
await b.close();
