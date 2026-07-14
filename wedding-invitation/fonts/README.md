# fonts/

The site loads **Cormorant Garamond**, **Cinzel**, **Great Vibes** and **Lato**
from Google Fonts (see the `<link>` tags in `index.html`).

This folder is here for **self-hosting** them instead — worth doing if you want
zero third-party requests (better privacy, one less DNS lookup, and the site
keeps working offline).

## How to self-host

1. Download the four families (e.g. via [google-webfonts-helper](https://gwfh.mranftl.com/fonts))
   and drop the `.woff2` files in this folder.
2. Delete the three Google Fonts `<link>` tags from `<head>` in `index.html`.
3. Add the `@font-face` rules to the top of `css/styles.css`:

```css
@font-face {
  font-family: "Cormorant Garamond";
  src: url("../fonts/cormorant-garamond-400.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;   /* text stays visible while the font loads */
}
/* …repeat for each weight/family you use… */
```

The font *names* must match exactly — `css/tailwind.src.css` references them by
name in its `@theme` block, and `css/styles.css` falls back to Georgia / system
sans if a family fails to load.
