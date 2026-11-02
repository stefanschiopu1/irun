// Randare slide-uri PNG 1080x1350.
// Pune fotografia de grup în foto/grup.jpg (sau .png/.webp) și rulează: node render.js
// Generează: varianta scurtă (3 slide-uri) în rădăcina folderului și varianta extinsă (7 slide-uri) în extins/.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const dir = __dirname;
const variants = [
  { html: 'carusel.html', out: dir },
  { html: 'carusel-extins.html', out: path.join(dir, 'extins') },
];
(async () => {
  const photo = ['grup.jpg','grup.jpeg','grup.png','grup.webp'].map(f => path.join(dir,'foto',f)).find(fs.existsSync);
  const browser = await chromium.launch();
  for (const v of variants) {
    fs.mkdirSync(v.out, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1200, height: 1500 } });
    await page.goto('file://' + path.join(dir, v.html));
    if (photo) {
      const b64 = fs.readFileSync(photo).toString('base64');
      const mime = photo.endsWith('.png') ? 'image/png' : photo.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
      await page.evaluate(src => { const p = document.getElementById('photo'); p.classList.remove('empty'); p.style.backgroundImage = `url(${src})`; }, `data:${mime};base64,${b64}`);
    }
    await page.evaluate(() => document.fonts.ready);
    const n = await page.locator('.slide').count();
    for (let i = 1; i <= n; i++) await page.locator('.slide').nth(i - 1).screenshot({ path: path.join(v.out, `slide-${i}.png`) });
    await page.close();
    console.log(`${v.html}: ${n} slide-uri -> ${path.relative(dir, v.out) || '.'}`);
  }
  await browser.close();
  console.log(photo ? 'Cu fotografia: ' + photo : 'FĂRĂ fotografie (placeholder pe slide 1)');
})();
