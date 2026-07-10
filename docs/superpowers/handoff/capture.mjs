import { chromium } from 'playwright';

const [,, url, out, width=1280, height=900] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +width, height: +height } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('requestfailed', r => errors.push('REQFAIL: ' + r.url().slice(0, 120)));
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => errors.push('GOTO: '+e.message));
// scroll through the page to trigger IntersectionObserver reveals
await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y <= h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(900);
const stats = await page.evaluate(() => ({
  anims: document.querySelectorAll('.omj-anim').length,
  revealed: document.querySelectorAll('.omj-anim.is-inview').length,
  carousels: document.querySelectorAll('[data-omj-carousel]').length,
  dots: document.querySelectorAll('.omj-carousel__dots button').length,
  scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
  leaflet: typeof window.L, mapTiles: document.querySelectorAll('#omj-map-live img.leaflet-tile').length,
}));
await page.screenshot({ path: out, fullPage: true });
console.log(JSON.stringify({ stats, errors: errors.slice(0, 10) }, null, 1));
await browser.close();
