# Portfolio — GitHub Pages

Static portfolio site for [l-muroni/l-muroni](https://github.com/l-muroni/l-muroni). No build step, no external dependencies.

## Contents

- `index.html` — main page
- `styles.css` — styles

## Local preview

Open `index.html` in a browser, or serve locally:

```bash
# Python
python -m http.server 8080 --directory portfolio

# Node (npx)
npx serve portfolio
```

Then visit `http://localhost:8080`.

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

GitHub Pages deploys only the `portfolio/` folder, so CV files are not available at relative paths. Links in `index.html` point to the Markdown files on GitHub:

- https://github.com/l-muroni/l-muroni/blob/main/cv/luca-muroni-cv.it.md
- https://github.com/l-muroni/l-muroni/blob/main/cv/luca-muroni-cv.en.md

## Update content

Edit `index.html` and `styles.css` directly. Push to `main` to trigger redeploy (if using Actions).
