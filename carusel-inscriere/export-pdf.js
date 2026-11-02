// Exportă caruselele ca PDF (o pagină 1080x1350 per slide), cu text editabil, pentru import în Canva.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const [html, out] of [['carusel.html','iRun-inscriere-3-slideuri.pdf'],['carusel-extins.html','iRun-inscriere-7-slideuri.pdf']]) {
    const p = await b.newPage();
    await p.goto('file://' + path.join(__dirname, html));
    await p.addStyleTag({ content: '@page{size:1080px 1350px;margin:0} body{background:none!important;padding:0!important;gap:0!important;display:block!important} .slide{page-break-after:always;break-after:page}' });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: path.join(__dirname, out), width: '1080px', height: '1350px', printBackground: true, preferCSSPageSize: true });
    await p.close(); console.log(out);
  }
  await b.close();
})();
