# Next Steps — Cal Cech Media Kit

Open items that need Cal's input. Everything else (marketing copy, layout, technical
SEO, accessibility) has been handled in code.

Live at https://cechcal-a11y.github.io/cal-cech-media-kit/

## Blocking

- **GA4 measurement ID** (`index.html`, `<head>`) — the gtag block is currently
  **commented out**. It previously shipped live with the placeholder `G-XXXXXXXXXX`,
  which made every visitor download ~100KB of `gtag.js` and fire hits against an ID
  that doesn't exist: no data collected, just load cost. To turn analytics on,
  replace both occurrences of `G-XXXXXXXXXX` and uncomment the block.

## Needs a number or an asset from Cal

- **Lullabites view count** — Goli (8M+), Kava Haven (5M+), and MSHUKCOE (21M+) all
  carry a `.pill-stat-badge` in the Brands row. Lullabites is the only one without,
  which makes the row read inconsistent. Either supply the number or say the word and
  the badges come off all four.
- **Bioemblem** — named in My Story but not in the Brands row, because there's no logo
  asset and no view count for it. With either one it becomes a pill (an initials badge
  works fine, that's what MSHUKCOE uses).
- **Testimonial** — the `#testimonial` section is still commented out in `index.html`
  pending a real quote from a brand or agency partner. Markup and styling both exist;
  uncomment and fill in. Note this is the only thing still using the `--rose` accent
  and the `.quote-card` block — if the testimonial isn't happening, both can go.
- **Sales-impact proof** — Featured Content cards show views and likes only. A
  GMV-per-video number on any of the three clips would be the single strongest
  credibility signal on the page for a brand evaluating a TikTok Shop affiliate.

## Decisions

- **Résumé PDF** — `assets/ResumeforOrion.pdf` is sitting in the repo untracked and
  unreferenced. The Resume section is the natural home for a download link, but the
  file has personal details in it, so publishing it is Cal's call. Link it or delete
  it; leaving it untracked in the working tree is the one option that helps nobody.
- **Rate floor** — there are no rates anywhere on the site, by choice: the old "Work
  Together" tiers were removed and the section is now purely a contact CTA (renamed to
  match). Adding a "Starting at $X" would pre-qualify inbound, but that's a pricing
  call only Cal can make.
- **Dedicated OG share image** — `og:image`/`twitter:image` currently reuse the
  circular headshot, which wasn't cropped for a 1200×630 social card. Works as-is; a
  purpose-built image would look sharper when the link is posted.

## Done

- Canonical URL confirmed — the GitHub Pages deploy above is live and serving. No
  custom domain, so `canonical`, `og:url`, `og:image`, `twitter:image`, and the JSON-LD
  `image` all correctly share that base. Update them together if a domain is added.
