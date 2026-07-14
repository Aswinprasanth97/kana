# Arjun &amp; Sandra — Wedding Invitation

A premium, single-page Kerala Hindu wedding invitation. Handmade-paper texture,
banana leaves, hanging jasmine garlands, lotus motifs, temple lamps and gold
accents — with subtle animation and a clean, modern layout.

**Sunday, 30 August 2026 · 10:30 – 11:30 AM · City Palace Auditorium, Beypore, Kozhikode**

Static, lightweight, and deployable to GitHub Pages, Netlify or Vercel with no
backend and no database.

---

## The couple portrait

The real portrait is in place at `assets/images/couple.png` (423 × 589,
transparent PNG). It's used in the hero, the About circle, and the Open Graph
share card.

It was compressed from the 380 KB source down to **111 KB** with a 256-colour
palette — it's the largest asset on the page and the hero preloads it, so the
bytes matter. A 128-colour palette halved it again but posterized the skin tones,
so 256 is the floor.

To swap it later, overwrite that same file and update the `width`/`height`
attributes on the two `<img>` tags in `index.html` (they prevent layout shift).
Keep it a **transparent** cut-out at roughly **0.72 : 1** — that's the ratio the
hero is tuned for.

`arjun_wedding-removebg-preview.png` is the untouched original, kept as a backup.
Nothing references it, so you can delete it before deploying to save 380 KB.

---

## Run it

It's plain HTML/CSS/JS — just open `index.html`. To serve it properly:

```bash
npm run serve      # or: python -m http.server
```

## Build the CSS

Tailwind is **precompiled** into `css/tailwind.css` (~10 KB, already committed),
so the deployed site is pure static files with no CDN script and no build step
at deploy time. You only need this if you change classes in the markup:

```bash
npm install
npm run build      # one-off, minified
npm run dev        # rebuild on change
```

`css/tailwind.src.css` holds the palette and font tokens (`@theme`);
`css/styles.css` holds every component style and animation, hand-written.

---

## Editing the content

Nearly everything lives in `index.html`. The few things wired up in code:

| What | Where |
| --- | --- |
| Countdown target | `data-countdown="2026-08-30T10:30:00+05:30"` in `index.html` |
| Calendar file (.ics) times | `WEDDING` object at the top of `js/script.js` (UTC) |
| Map, directions, WhatsApp text | `index.html` links + `WEDDING.venue` in `js/script.js` |
| Colours & fonts | `@theme` in `css/tailwind.src.css`, mirrored as `:root` vars in `css/styles.css` |

**If you change the venue**, regenerate the QR code (`assets/images/qr-placeholder.png`)
so it still points at the right place — it currently encodes the real Google
Maps link for City Palace Auditorium and is a working, scannable code, not a
decorative placeholder.

**Before you publish**, set the real URL in the `og:url` / `canonical` tags in
`<head>` so link previews resolve correctly.

---

## RSVP → Google Sheets

RSVPs are sent to a **Google Sheet** via a free Apps Script webhook, and also
saved in the guest's browser so the thank-you screen comes back on revisit.

**Setup (one time):** follow [`google-sheets/README.md`](google-sheets/README.md),
then paste your web app URL into `RSVP_SHEETS_URL` at the top of the RSVP block
in `js/script.js`.

**Share with family:** use Google Sheets **Share** to give others view or edit
access to the guest list.

Leave `RSVP_SHEETS_URL` empty to test locally without a backend (browser-only).

---

## Design

| Role | Colour |
| --- | --- |
| Background | `#FAF6EE` ivory |
| Secondary | `#FFF9F2` |
| Primary | `#A8743B` |
| Gold | `#D4AF37` |
| Dark brown | `#4D3A2F` |
| Leaf green | `#4E6E3D` |
| Text | `#2C2C2C` |

Titles in **Cormorant Garamond**, names in **Cinzel**, script in **Great Vibes**,
body in **Lato**.

Every decorative element — banana leaf, jasmine garland, lotus, nilavilakku,
temple bell, coconut palm, kolam, divider — is a hand-authored SVG in
`assets/images/decorations/`, so they stay crisp at any size and cost almost
nothing to load. The paper texture is a seamless 11 KB tile.

---

## Notes on the build

- **No AOS, no Framer Motion.** The scroll reveal is a ~40-line
  `IntersectionObserver` in `js/script.js` that honours the same `data-aos` /
  `data-aos-delay` attributes — one less network request, and nothing to break.
- **Zero runtime dependencies.** No CDN scripts at all.
- Every animation is disabled under `prefers-reduced-motion`.
- Images below the fold are `loading="lazy"`; the portrait is preloaded with
  `fetchpriority="high"`.
- Includes SEO meta, Open Graph + Twitter cards, `Event` JSON-LD, and a favicon.
- There's a print stylesheet — the page prints as a clean card.

## Structure

```text
wedding-invitation/
├── index.html
├── css/
│   ├── styles.css        ← all component styles + animations
│   ├── tailwind.src.css  ← @theme tokens (source)
│   └── tailwind.css      ← built output (committed)
├── js/
│   └── script.js         ← reveal, countdown, RSVP, share
├── google-sheets/
│   ├── Code.gs           ← paste into Apps Script
│   └── README.md         ← step-by-step Sheets setup
├── assets/images/
│   ├── couple.png        ← ⚠️ replace with the real portrait
│   ├── background.jpg    ← seamless paper texture
│   ├── og-image.jpg
│   ├── favicon.svg
│   ├── qr-placeholder.png
│   └── decorations/      ← hand-authored SVGs
├── fonts/                ← optional self-hosting (see fonts/README.md)
└── README.md
```

## Sections

Hero → Our Story → **The Invitation** → Countdown → Venue → RSVP → Share → Footer.

## Deploy

### GitHub Pages (recommended)

The repo includes a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`)
that publishes the `wedding-invitation/` folder to:

**https://aswinprasanth97.github.io/kana/**

One-time setup in GitHub:

1. Open **Settings → Pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Push to `main` — the workflow runs automatically on every push

After the first successful run, the site is live at the URL above.

### Other hosts

Any static host works too — push the `wedding-invitation/` folder (not the repo
root). No build command needed; publish directory is `wedding-invitation/`.

- **Netlify / Vercel** — connect the repo and set the publish directory to
  `wedding-invitation`.
