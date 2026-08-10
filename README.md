# Brake Painting & Home Improvement LLC Website

Single-page marketing site. Hand-coded HTML/CSS/JS, no frameworks, no build step.

## Files
- `index.html`: all page markup
- `styles.css`: design system + responsive styles
- `script.js`: sticky header, mobile nav, scroll reveal, gallery lightbox, form validation
- Image assets (`Brakelogo.png`, `Brakework1-5.png`, `Jerry.png`, `Miguel and Anthony.png`) live in the project root and are referenced directly.

## Run locally
```bash
python3 -m http.server 3000
# open http://localhost:3000
```

## Deploy to Vercel (via GitHub)
1. Push this folder to a GitHub repo.
2. In Vercel: New Project → import the repo.
3. Framework preset: **Other**. Build command: none. Output directory: `./` (root).
4. Deploy. Vercel serves the static files as-is.

## Before launch: wire up the form
`script.js` validates the estimate form and shows a confirmation, but it does **not** send anything yet. Connect it to a real endpoint:
- Easiest: [Formspree](https://formspree.io). Set `<form action="https://formspree.io/f/XXXX" method="POST">` and let it submit normally, or POST via `fetch` in the submit handler.
- Or a Vercel Serverless Function under `/api/estimate` that emails `brakepainting@gmail.com`.

Look for the `No backend wired up` comment in `script.js`.
