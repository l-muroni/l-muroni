import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const configs = [
  {
    md: 'cv/luca-muroni-cv.it.md',
    html: 'portfolio/cv/it.html',
    lang: 'it',
    altLang: { href: 'en.html', label: 'English' },
    portfolioHref: '../index.html',
    portfolioLabel: '← Portfolio',
    downloadLabel: 'Scarica PDF',
    printLabel: 'Stampa / Salva PDF',
    pdf: 'luca-muroni-cv-it.pdf',
    toolbarAria: 'Azioni CV',
    locationLine: 'Via Patrioti 11, 43039 Salsomaggiore Terme (PR)',
  },
  {
    md: 'cv/luca-muroni-cv.en.md',
    html: 'portfolio/cv/en.html',
    lang: 'en',
    altLang: { href: 'it.html', label: 'Italiano' },
    portfolioHref: '../index.html',
    portfolioLabel: '← Portfolio',
    downloadLabel: 'Download PDF',
    printLabel: 'Print / Save as PDF',
    pdf: 'luca-muroni-cv-en.pdf',
    toolbarAria: 'CV actions',
    locationLine: 'Via Patrioti 11, 43039 Salsomaggiore Terme, Italy',
  },
];

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMd(text) {
  return escapeHtml(text).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function parseMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const doc = { name: '', role: '', sections: [] };
  let i = 0;

  while (i < lines.length && !lines[i].startsWith('# ')) i += 1;
  if (lines[i]?.startsWith('# ')) doc.name = lines[i].slice(2).trim();

  i += 1;
  while (i < lines.length && !lines[i].startsWith('## ')) {
    const line = lines[i].trim();
    if (line.startsWith('**') && line.endsWith('**')) doc.role = line.slice(2, -2);
    i += 1;
  }

  while (i < lines.length) {
    if (!lines[i].startsWith('## ')) {
      i += 1;
      continue;
    }

    const section = { title: lines[i].slice(3).trim(), blocks: [] };
    i += 1;

    while (i < lines.length && !lines[i].startsWith('## ') && lines[i].trim() !== '---') {
      const line = lines[i];

      if (line.startsWith('### ')) {
        const heading = line.slice(4).trim();
        const [title, subtitle = ''] = heading.split(' — ');
        const entry = { type: 'entry', title, subtitle, date: '', lines: [] };
        i += 1;

        while (i < lines.length && !lines[i].startsWith('### ') && !lines[i].startsWith('## ') && lines[i].trim() !== '---') {
          const inner = lines[i].trim();
          if (inner.startsWith('*') && inner.endsWith('*')) {
            entry.date = inner.slice(1, -1);
          } else if (inner.startsWith('- ')) {
            entry.lines.push(inner.slice(2));
          } else if (inner && !inner.startsWith('|')) {
            entry.lines.push(inner);
          }
          i += 1;
        }

        section.blocks.push(entry);
        continue;
      }

      if (line.startsWith('|') && line.includes('|')) {
        const table = { type: 'table', headers: [], rows: [] };
        const tableLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i].trim());
          i += 1;
        }
        const cells = (row) => row.split('|').slice(1, -1).map((c) => c.trim());
        table.headers = cells(tableLines[0]);
        table.rows = tableLines.slice(2).map(cells);
        section.blocks.push(table);
        continue;
      }

      if (line.startsWith('**') && line.includes(':')) {
        const match = line.match(/^\*\*(.+?):\*\*\s*(.+)$/);
        if (match) {
          section.blocks.push({ type: 'skill', label: match[1], value: match[2] });
        }
        i += 1;
        continue;
      }

      if (line.trim() && !line.startsWith('- ')) {
        section.blocks.push({ type: 'paragraph', text: line.trim() });
      }

      i += 1;
    }

    if (lines[i]?.trim() === '---') i += 1;
    doc.sections.push(section);
  }

  return doc;
}

function renderEntry(entry) {
  const bullets = entry.lines.filter((line) => !line.startsWith('Tesi:') && !line.startsWith('Relatore:') && !line.startsWith('Thesis:') && !line.startsWith('Supervisor:'));
  const meta = entry.lines.filter((line) => line.startsWith('Tesi:') || line.startsWith('Relatore:') || line.startsWith('Thesis:') || line.startsWith('Supervisor:'));

  return `
      <div class="cv-entry">
        <div class="cv-entry-header">
          <h3 class="cv-entry-title">${escapeHtml(entry.title)}</h3>
          ${entry.date ? `<time class="cv-entry-date">${escapeHtml(entry.date)}</time>` : ''}
        </div>
        ${entry.subtitle ? `<p class="cv-entry-subtitle">${escapeHtml(entry.subtitle)}</p>` : ''}
        ${meta.length ? `<p class="cv-profile">${meta.map((line) => inlineMd(line)).join('<br>\n          ')}</p>` : ''}
        ${bullets.length ? `<ul>${bullets.map((line) => `<li>${inlineMd(line)}</li>`).join('')}</ul>` : ''}
      </div>`;
}

function renderSection(section) {
  const title = escapeHtml(section.title);
  const first = section.blocks[0];

  if (first?.type === 'paragraph' && section.blocks.every((b) => b.type === 'paragraph')) {
    return `
    <section class="cv-section">
      <h2 class="cv-section-title">${title}</h2>
      ${section.blocks.map((b) => `<p class="cv-profile">${inlineMd(b.text)}</p>`).join('')}
    </section>`;
  }

  if (section.blocks.every((b) => b.type === 'skill')) {
    return `
    <section class="cv-section">
      <h2 class="cv-section-title">${title}</h2>
      <div class="cv-skills">
        ${section.blocks.map((b) => `
        <div class="cv-skill-row"><span class="cv-skill-label">${escapeHtml(b.label)}</span><span class="cv-skill-value">${escapeHtml(b.value)}</span></div>`).join('')}
      </div>
    </section>`;
  }

  if (section.blocks.some((b) => b.type === 'table')) {
    const table = section.blocks.find((b) => b.type === 'table');
    return `
    <section class="cv-section">
      <h2 class="cv-section-title">${title}</h2>
      <table class="cv-table">
        <thead><tr>${table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
        <tbody>${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </section>`;
  }

  const footer = section.title.toLowerCase().includes('gdpr') || section.title.toLowerCase().includes('trattamento') || section.title.toLowerCase().includes('consent');
  if (footer && first?.type === 'paragraph') {
    return `
    <footer class="cv-footer">${inlineMd(first.text)}</footer>`;
  }

  return `
    <section class="cv-section">
      <h2 class="cv-section-title">${title}</h2>
      ${section.blocks.map((b) => (b.type === 'entry' ? renderEntry(b) : b.type === 'paragraph' ? `<p class="cv-profile">${inlineMd(b.text)}</p>` : '')).join('')}
    </section>`;
}

function renderHtml(config, doc) {
  const bodySections = doc.sections
    .filter((s) => !s.title.toLowerCase().includes('autorizzazione') && !s.title.toLowerCase().includes('consent') && !s.title.toLowerCase().includes('data processing'))
    .map(renderSection)
    .join('');

  const footerSection = doc.sections.find((s) =>
    s.title.toLowerCase().includes('autorizzazione') ||
    s.title.toLowerCase().includes('consent') ||
    s.title.toLowerCase().includes('data processing')
  );
  const footer = footerSection?.blocks[0]?.text
    ? `<footer class="cv-footer">${inlineMd(footerSection.blocks[0].text)}</footer>`
    : '';

  return `<!DOCTYPE html>
<html lang="${config.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(doc.name)} — CV (${config.lang === 'it' ? 'Italiano' : 'English'})</title>
  <link rel="stylesheet" href="cv.css">
</head>
<body>
  <nav class="cv-toolbar" aria-label="${config.toolbarAria}">
    <a href="${config.portfolioHref}">${config.portfolioLabel}</a>
    <a href="${config.altLang.href}">${config.altLang.label}</a>
    <a class="btn-primary" href="${config.pdf}" download>${config.downloadLabel}</a>
    <button type="button" onclick="window.print()">${config.printLabel}</button>
  </nav>

  <article class="cv-page">
    <header class="cv-header">
      <div class="cv-header-main">
        <div class="cv-header-text">
          <h1 class="cv-name">${escapeHtml(doc.name)}</h1>
          <p class="cv-role">${escapeHtml(doc.role)}</p>
          <p class="cv-contacts">
            ${escapeHtml(config.locationLine)}<br>
            <a href="mailto:muroniluca13@gmail.com">muroniluca13@gmail.com</a> ·
            <a href="tel:+393405777232">+39 340 5777232</a><br>
            GitHub: <a href="https://github.com/l-muroni">github.com/l-muroni</a> ·
            LinkedIn: <a href="https://www.linkedin.com/in/luca-muroni-612b9a1a8/">linkedin.com/in/luca-muroni-612b9a1a8</a>
          </p>
        </div>
        <img class="cv-photo" src="../assets/luca-muroni-cv.jpg" alt="${escapeHtml(doc.name)}" width="88" height="88">
      </div>
    </header>
${bodySections}
    ${footer}
  </article>
  <script src="../analytics.config.js"></script>
  <script src="../analytics.js"></script>
</body>
</html>
`;
}

for (const config of configs) {
  const md = await readFile(join(root, config.md), 'utf8');
  const doc = parseMarkdown(md);
  const html = renderHtml(config, doc);
  await writeFile(join(root, config.html), html, 'utf8');
  console.log(`Synced ${config.html} from ${config.md}`);
}
