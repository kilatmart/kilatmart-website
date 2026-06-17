# KilatMart Website

Official marketing landing page for [www.kilatmart.com](https://www.kilatmart.com) — a static single-page site built with HTML, CSS, JavaScript, and Bootstrap 5.

## What's included

- **Hero** — brand story, stats, animated phone mockup
- **About & Why** — Q-commerce model, value propositions
- **How it works** — 4-step order flow
- **Customer app** — features + App Store / Google Play placeholders
- **Rider app** — earn & deliver section + apply CTA
- **Store partners** — merchant onboarding
- **Contact** — support, partners, riders emails + contact form
- **Trust & categories** — safety, product types

Brand assets are sourced from `kilatmart-brand-assets` (official palette: `#0D2B1E`, `#1E4D34`, `#FF8A00`, `#FFC107`).

## Local preview

```bash
cd Website/kilatmart-website
python3 -m http.server 8080
# Open http://localhost:8080
```

Or use any static file server (e.g. `npx serve .`).

## Deploy to GitHub Pages (custom domain)

### 1. Create GitHub repository

```bash
cd Website/kilatmart-website
git init
git add .
git commit -m "Initial KilatMart marketing site"
git branch -M main
git remote add origin git@github.com:KilatMart/kilatmart-website.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to **Repository → Settings → Pages**
2. Under **Build and deployment**:
   - **Source:** GitHub Actions
3. The workflow `.github/workflows/deploy.yml` deploys on every push to `main`.

### 3. Custom domain (`www.kilatmart.com`)

The repo includes a `CNAME` file with `www.kilatmart.com`.

**In GitHub (Settings → Pages → Custom domain):**

- Enter: `www.kilatmart.com`
- Enable **Enforce HTTPS** (after DNS propagates)

**In your DNS provider (for `kilatmart.com`):**

| Type  | Name | Value                    |
|-------|------|--------------------------|
| CNAME | www  | `<org>.github.io`        |

Replace `<org>` with your GitHub org or username (e.g. `kilatmart.github.io` if user pages, or the org Pages URL shown in GitHub Settings).

**Optional apex redirect (`kilatmart.com` → `www`):**

| Type | Name | Value |
|------|------|-------|
| A    | @    | `185.199.108.153` |
| A    | @    | `185.199.109.153` |
| A    | @    | `185.199.110.153` |
| A    | @    | `185.199.111.153` |

Then add apex domain in GitHub Pages settings, or use your DNS provider's redirect to `www.kilatmart.com`.

### 4. Update app store links

When apps are live, replace placeholder `href="#"` on store buttons in `index.html` with real URLs and remove the coming-soon modal handler if desired.

Search for `data-store` attributes:

```html
<a href="https://apps.apple.com/app/..." class="store-btn" ...>
<a href="https://play.google.com/store/apps/details?id=..." class="store-btn" ...>
```

## Structure

```
kilatmart-website/
├── index.html
├── CNAME
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── images/          # logos from kilatmart-brand-assets
└── .github/workflows/deploy.yml
```

## Contact emails (placeholders)

| Purpose   | Email |
|-----------|-------|
| Support   | support@kilatmart.com |
| Partners  | partners@kilatmart.com |
| Riders    | riders@kilatmart.com |

Update these in `index.html` when real mailboxes are configured.
