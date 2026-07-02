# Portfolio — GitHub Pages

Static portfolio site for [l-muroni/l-muroni](https://github.com/l-muroni/l-muroni). No build step, no external dependencies.

## Contents

- `index.html` — main page
- `styles.css` — styles

## Local preview

Open `index.html` in a browser, or serve locally (recommended — relative links and assets work better):

```bash
# Python
python -m http.server 8080 --directory portfolio

# Node (npx)
npx serve portfolio
```

Then visit:

- Portfolio: http://localhost:8080
- CV italiano: http://localhost:8080/cv/it.html
- CV inglese: http://localhost:8080/cv/en.html

### Regenerate CV HTML and PDFs locally

After editing `cv/*.md`:

```bash
node .github/scripts/sync-cv-from-md.mjs
npm install puppeteer@24 --no-save
node .github/scripts/generate-cv-pdfs.mjs
```

This also regenerates `portfolio/og-image.png`.

## Publish with GitHub Pages

### Option A — GitHub Actions (recommended)

The repository includes `.github/workflows/pages.yml`. It deploys the `portfolio/` folder on every push to `main`.

1. Push to `main`.
2. Go to **Settings → Pages** in the repository.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. After the workflow completes, the site is available at:

   ```
   https://l-muroni.github.io/l-muroni/
   ```

### Option B — Manual deploy

1. Go to **Settings → Pages**.
2. Set **Source** to **Deploy from a branch**.
3. Select branch `main` and folder `/portfolio`.
4. Save.

## Custom domain (optional)

1. Add a `CNAME` file in `portfolio/` with your domain (e.g. `portfolio.example.com`).
2. Configure DNS with your provider (A/CNAME records as per GitHub docs).
3. Enable **Enforce HTTPS** in Pages settings.

## CV links

CV pages and PDFs are served from the portfolio site:

- Online: `cv/it.html`, `cv/en.html`
- PDF download: `cv/luca-muroni-cv-it.pdf`, `cv/luca-muroni-cv-en.pdf`

PDFs are generated automatically on deploy from the HTML CV pages (see `.github/scripts/generate-cv-pdfs.mjs`).

Source Markdown (for editing) remains in the repository root:

- https://github.com/l-muroni/l-muroni/blob/main/cv/luca-muroni-cv.it.md
- https://github.com/l-muroni/l-muroni/blob/main/cv/luca-muroni-cv.en.md

## Update content

Edit `index.html` and `styles.css` directly. Push to `main` to trigger redeploy (if using Actions).

## Analytics (Cloudflare Web Analytics)

Free, privacy-friendly, no cookie banner required. Tracks aggregate visits (not individual users).

### Setup (one time)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up (free).
2. Open **Web Analytics** → **Add a site**.
3. Enter your site URL: `https://l-muroni.github.io/l-muroni/` (or your custom domain).
4. Copy the **token** from the snippet Cloudflare provides.
5. Paste it in `portfolio/analytics.config.js`:

   ```javascript
   window.CF_ANALYTICS_TOKEN = 'your-token-here';
   ```

6. Push to `main`. Data appears in the Cloudflare dashboard within a few hours.

### What you can see

- Total visits and page views
- Top pages (portfolio, CV IT, CV EN)
- Referrers (e.g. `linkedin.com`, `github.com`)
- Countries, browsers, devices

You do **not** need to move DNS to Cloudflare — Web Analytics works on any site.
