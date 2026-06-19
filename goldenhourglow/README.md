# Golden Hour Glow

Marketing site for **Golden Hour Glow** — Brianna Lamacchia's Bomb Party live mystery-jewelry
business. Static single-page site (HTML / CSS / vanilla JS), no build step.

## Run locally
Any static file server works. Examples:

```bash
# Python
python -m http.server 3300

# Node (npx)
npx serve -p 3300 .
```

Then open <http://localhost:3300>.

Append `?still` to the URL (e.g. `http://localhost:3300/?still`) to freeze all looping
animation and swap the hero video for its poster — handy for screenshots.

## Structure
```
index.html          # the whole page
css/style.css       # styling (warm "golden hour" theme)
js/app.js           # preloader, scroll reveals, mobile menu, tap-to-reveal demo, hero video
assets/
  hero.mp4          # looping hero clip (muted, autoplay)
  hero-poster.jpg   # poster / reduced-motion + screenshot fallback for the hero video
  qr-code.png       # QR linking to the Bomb Party shop
```

## Deploy
It's fully static, so any host works. Easiest options:
- **GitHub Pages** — repo *Settings → Pages → Deploy from branch → `main` / root*.
- **Netlify / Cloudflare Pages / Vercel** — drag-and-drop the folder, or connect this repo for auto-deploy.

All asset paths are **relative**, so it works whether served from a domain root or a
project subpath (e.g. `username.github.io/goldenhourglow/`).

## Shop / links
- Shop: <https://bombparty.com/goldenhourglow/products>
- TikTok: [@briannarose19](https://www.tiktok.com/@briannarose19)
