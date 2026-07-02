import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cvDir = join(__dirname, '../../portfolio/cv');
const portfolioDir = join(__dirname, '../../portfolio');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

const pages = [
  { html: 'it.html', pdf: 'luca-muroni-cv-it.pdf' },
  { html: 'en.html', pdf: 'luca-muroni-cv-en.pdf' },
];

function startServer(root) {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const pathname = req.url === '/' ? '/it.html' : req.url.split('?')[0];
      const filePath = join(root, pathname.replace(/^\//, ''));

      try {
        const data = await readFile(filePath);
        const type = MIME[extname(filePath)] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': type });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

const { server, port } = await startServer(cvDir);
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  ...(process.env.CI ? {} : { channel: 'chrome' }),
});

try {
  for (const { html, pdf } of pages) {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/${html}`, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: join(cvDir, pdf),
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
    });
    await page.close();
    console.log(`Generated ${pdf}`);
  }

  const ogPage = await browser.newPage();
  await ogPage.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await ogPage.goto(`file://${join(portfolioDir, 'og-image.html')}`, { waitUntil: 'networkidle0' });
  await ogPage.screenshot({
    path: join(portfolioDir, 'og-image.png'),
    type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  await ogPage.close();
  console.log('Generated og-image.png');
} finally {
  await browser.close();
  server.close();
}
