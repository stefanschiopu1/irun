// Randare slide-uri PNG 1080x1350. Pune fotografia de grup în foto/grup.jpg (sau .png) și rulează: node render.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = __dirname;
  const photo = ['grup.jpg','grup.jpeg','grup.png','grup.webp'].map(f => path.join(dir,'foto',f)).find(fs.existsSync);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1500 } });
  await page.goto('file://' + path.join(dir, 'carusel.html'));
  if (photo) {
    const b64 = fs.readFileSync(photo).toString('base64');
    const mime = photo.endsWith('.png') ? 'image/png' : photo.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
    await page.evaluate(src => { const p = document.getElementById('photo'); p.classList.remove('empty'); p.style.backgroundImage = `url(${src})`; }, `data:${mime};base64,${b64}`);
  }
  await page.evaluate(() => document.fonts.ready);
  for (const i of [1,2,3]) await page.locator('#slide-' + i).screenshot({ path: path.join(dir, `slide-${i}.png`) });
  await browser.close();
  console.log(photo ? 'Randat cu fotografia: ' + photo : 'Randat FĂRĂ fotografie (placeholder pe slide 1)');
})();
