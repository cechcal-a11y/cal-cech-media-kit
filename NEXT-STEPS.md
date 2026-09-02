# Next Steps — Cal Cech Media Kit

Open items that need Cal's input before this site is fully launch-ready. Everything
else (marketing copy, layout, technical SEO) has already been handled in code.

## Blocking launch

- **GA4 measurement ID** (`index.html`, `<head>`) — currently `G-XXXXXXXXXX`.
  Analytics isn't tracking anything until this is swapped for a real ID.
- **Canonical URL / domain** (`index.html`, `<head>`) — currently guesses
  `https://cechcal-a11y.github.io/cal-cech-media-kit/` since there's no confirmed
  custom domain or live GitHub Pages deploy yet. Confirm the final URL and update
  the `canonical`, `og:url`, `og:image`, `twitter:image`, and JSON-LD `image` tags
  together (they all currently share this same placeholder base URL).

## Nice to have

- **Testimonial** — the `#testimonial` section is fully commented out in
  `index.html` pending a real quote from a brand or agency partner. Re-add it
  (markup + styling already exist, just uncomment and fill in) once one's available.
- **Rate floor** — the "Work Together" tiers all say "Rates on request." Adding a
  starting price (e.g. "Starting at $X") would pre-qualify inbound leads, but that's
  a pricing decision only Cal can make.
- **Sales-impact proof** — Featured Content cards currently show views/likes only.
  If GMV-per-video numbers become available for any of the three featured clips,
  adding that stat would be the single strongest credibility signal on the page for
  brands evaluating a TikTok Shop affiliate specifically.
- **Dedicated OG share image** — `og:image`/`twitter:image` currently reuse the
  circular headshot, which wasn't sized/cropped for a 1200×630 social-share card.
  Works fine as-is; a purpose-built share image would look sharper when the link is
  posted on X/LinkedIn/etc.
