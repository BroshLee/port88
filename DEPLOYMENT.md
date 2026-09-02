# Deployment Guide

The site builds to **plain static files** (`dist/` — HTML, CSS, fonts, one 2.3 kB JS file).
There is no server, no database and no runtime. That makes hosting free, fast and boring —
exactly what you want.

---

## Recommendation: Cloudflare Pages

| | Cloudflare Pages | Vercel | Netlify | GitHub Pages |
|---|---|---|---|---|
| Cost | Free | Free (Hobby) | Free | Free |
| Bandwidth | **Unlimited** | 100 GB/mo | 100 GB/mo | 100 GB/mo soft |
| Builds | 500/mo | 6,000 min/mo | 300 min/mo | unlimited |
| India edge POPs | **Excellent** (Delhi, Mumbai, Chennai…) | Good | Fewer | Fewer |
| Custom domain + HTTPS | Free, automatic | Free, automatic | Free, automatic | Free, automatic |
| Commercial use on free tier | Allowed | **Not allowed** | Allowed | Allowed |

**Pick Cloudflare Pages.** Unlimited bandwidth, the strongest edge presence in India
(your recruiters are mostly there), and if you buy the domain from Cloudflare Registrar
you pay wholesale price with no renewal markup.

**Pick Vercel instead** if you'd rather have the simplest possible dashboard and don't
mind the 100 GB cap. A portfolio will never come close to it.

---

## Step 1 — Push to GitHub

This folder isn't a git repo yet:

```bash
cd /home/ankitsaklani/www/prot80 && git init && git add -A && git commit -m "Portfolio site"
```

Create an empty repo on GitHub (e.g. `ankitsaklani/portfolio`), then:

```bash
git remote add origin git@github.com:ankitsaklani/portfolio.git && git branch -M main && git push -u origin main
```

> Making the repo **public** is a small plus — recruiters do look, and a clean
> Astro/Tailwind repo is itself a work sample.

## Step 2 — Connect Cloudflare Pages

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub and pick the repo.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Node version:** add an environment variable `NODE_VERSION` = `22`
4. **Save and Deploy.** First build takes about a minute.

You immediately get `your-project.pages.dev` with HTTPS already working.

## Step 3 — Domain

**Buying.** A `.dev` domain costs roughly **$12–15/year (₹1,000–1,300)** and is on the
HSTS preload list, so browsers force HTTPS automatically. `.com` is ~$10–12/year.
Cloudflare Registrar sells at cost with no first-year discount games.

Good options: `ankitsaklani.dev`, `ankitsaklani.com`, `saklani.dev`.

**Connecting.**
- *Domain bought at Cloudflare:* Pages project → **Custom domains** → **Set up a domain**.
  DNS is configured for you. Done.
- *Domain bought elsewhere* (Namecheap, GoDaddy, BigRock): add the site to Cloudflare,
  change the nameservers at your registrar to the two Cloudflare gives you, wait for
  it to go active, then add the custom domain in Pages.

**HTTPS** is issued automatically and renews itself. Nothing to configure, no cost.
In **SSL/TLS → Overview** set the mode to **Full (strict)**, and turn on
**Always Use HTTPS** so `http://` requests redirect.

## Step 4 — Update the site's own URL

Once the domain is live, change it in two places and redeploy:

- `astro.config.mjs` → `site: 'https://yourdomain.dev'`
- `public/robots.txt` → the `Sitemap:` line

These drive canonical URLs, the sitemap and the social-preview card.

---

## Ongoing workflow

```bash
git add -A && git commit -m "Update experience section" && git push
```

Every push to `main` triggers a rebuild and goes live in ~60 seconds.
Pull requests get their own preview URL, so you can look at a change before merging.

Rollback is one click in the Cloudflare dashboard — every deployment is kept.

## Total cost

| Item | Cost |
|---|---|
| Hosting, SSL, CDN, builds | **₹0** |
| Domain | **~₹1,000–1,300/year** |
| Contact form (Web3Forms, 250 submissions/mo) | **₹0** |

---

## After launch — worth doing

- **Google Search Console** — add the property, submit `https://yourdomain.dev/sitemap-index.xml`.
- **Analytics** — Cloudflare Web Analytics is free, cookie-free and needs no consent banner.
  Enable it in the dashboard; do not add Google Analytics unless you want a cookie notice.
- **Test the share card** — paste your URL into
  [opengraph.xyz](https://www.opengraph.xyz) to confirm `og.png` renders on LinkedIn.
- **Lighthouse** — run it in Chrome DevTools once live; this build should score in the high 90s.
- **Put the URL everywhere** — LinkedIn headline + featured section, GitHub profile README,
  the résumé PDF header, and your email signature.
