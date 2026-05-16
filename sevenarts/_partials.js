/**
 * Shared HTML fragments for SevenArts client report pages.
 * Run `node generate.js` (in the same dir) to regenerate all pages.
 *
 * Brand: warm sienna accent over the inherited Apple-style base CSS so
 * SevenArts feels like an art-gallery dashboard, distinct from the
 * other report tenant on this platform.
 */

export const BRAND = {
  name: 'SevenArts',
  tagline: 'Art Auction · Marketplace · Artist Portfolio',
  /* Inline override of the design system's accent so this tenant has its
     own colour while still using the shared stylesheet. */
  cssOverride: `
    :root {
      --accent: #8a5a2b;
      --accent-soft: #b07a3c;
      --accent-dim: rgba(138, 90, 43, 0.10);
    }
    .nav-brand-mark { background: linear-gradient(135deg, #8a5a2b 0%, #c4925c 100%); }
    .hero h1 { background: linear-gradient(135deg, #1d1d1f 0%, #8a5a2b 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .screenshot-frame {
      display: block; max-width: 1000px; margin: 0 auto;
      border: 1px solid var(--border); border-radius: 14px;
      overflow: hidden; background: var(--surface);
      box-shadow: var(--shadow-md);
    }
    .screenshot-frame img { width: 100%; display: block; }
    .screenshot-caption {
      text-align: center; font-size: 13px; color: var(--text-mute);
      margin-top: 14px; max-width: 800px; margin-left: auto; margin-right: auto;
      line-height: 1.5;
    }
    .feature-table {
      width: 100%; border-collapse: collapse;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-xl); overflow: hidden;
    }
    .feature-table th, .feature-table td {
      padding: 14px 18px; text-align: left; font-size: 15px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    .feature-table th {
      background: var(--bg-soft); font-size: 12px;
      text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-mute);
      font-weight: 600;
    }
    .feature-table tr:last-child td { border-bottom: none; }
    .flow-step {
      display: flex; gap: 18px; padding: 18px 0;
      border-bottom: 1px dashed var(--border);
    }
    .flow-step:last-child { border-bottom: none; }
    .flow-step-num {
      flex-shrink: 0; width: 32px; height: 32px;
      border-radius: 50%;
      background: var(--accent); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px;
    }
    .flow-step h4 { margin: 4px 0 6px; font-size: 16px; letter-spacing: -0.01em; }
    .flow-step p { font-size: 14px; color: var(--text-soft); margin: 0; line-height: 1.5; }
    .flow-step code {
      font-size: 12px; background: var(--bg-soft); padding: 2px 6px;
      border-radius: 4px; color: var(--text-soft);
    }
  `,
};

export function nav(active = '') {
  const items = [
    { href: '/sevenarts/', label: 'Overview', key: 'overview' },
    { href: '/sevenarts/admin/', label: 'Admin Panel', key: 'admin' },
    { href: '/sevenarts/features/', label: 'Features', key: 'features' },
    { href: '/sevenarts/workflows/', label: 'Workflows', key: 'workflows' },
    { href: '/sevenarts/architecture/', label: 'Backend Architecture', key: 'architecture' },
    { href: '/sevenarts/remaining/', label: 'Remaining', key: 'remaining' },
  ];
  return `
    <header class="nav">
      <div class="nav-inner">
        <a href="/sevenarts/" class="nav-brand">
          <span class="nav-brand-mark">7</span>
          <span>SevenArts</span>
          <span class="muted" style="font-weight: 400; font-size: 13px;">· Backend Progress</span>
        </a>
        <nav>
          <ul class="nav-links">
            ${items
              .map(
                (i) =>
                  `<li class="nav-item"><a class="nav-link${i.key === active ? ' active' : ''}" href="${i.href}">${i.label}</a></li>`,
              )
              .join('')}
          </ul>
        </nav>
      </div>
    </header>
  `;
}

export function shell({ title, active, body, eyebrow, h1, tagline }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex,nofollow" />
<title>${title} · SevenArts Backend Progress</title>
<link rel="stylesheet" href="/assets/style.css?v=202605110223" />
<style>${BRAND.cssOverride}</style>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTQiIGZpbGw9IiM4YTVhMmIiLz48dGV4dCB4PSIzMiIgeT0iNDQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJTRiBQcm8gRGlzcGxheSwtYXBwbGUtc3lzdGVtLEhlbHZldGljYSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjM4IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjZmZmZmZmIj43PC90ZXh0Pjwvc3ZnPg==" />
</head>
<body>
${nav(active)}
<main>
  <section class="hero">
    ${eyebrow ? `<span class="hero-eyebrow">${eyebrow}</span>` : ''}
    <h1>${h1}</h1>
    ${tagline ? `<p class="tagline">${tagline}</p>` : ''}
  </section>
  ${body}
  <section class="section-tight">
    <div class="container" style="text-align:center; padding:48px 22px; border-top: 1px solid var(--border); margin-top: 60px;">
      <p class="muted" style="font-size: 13px;">SevenArts · Backend Progress Report · prepared 16 May 2026</p>
      <p class="muted" style="font-size: 12px; margin-top: 8px;">All screenshots captured live from the running backend. Data shown is real and currently in the database.</p>
    </div>
  </section>
</main>
</body>
</html>`;
}

export function screenshot(file, caption) {
  return `
    <div style="margin: 32px 0;">
      <div class="screenshot-frame">
        <img src="/sevenarts/screenshots/${file}" alt="${caption.replace(/"/g, '&quot;')}" loading="lazy" />
      </div>
      <p class="screenshot-caption">${caption}</p>
    </div>
  `;
}
