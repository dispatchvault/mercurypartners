# Mercury Partners website — working notes

This is the Mercury Partners website (mercurypartners.netlify.app, moving to
mercfund.com). It is a small, static, five-page informational site. Pushing to
the `astro/main` branch publishes to the live site automatically.

## Scope of changes

This repo is set up for **copy and content edits**: headlines, paragraphs,
FAQ questions and answers, stat labels, button text, page descriptions.

Please **do not** change, unless explicitly asked:

- `src/styles/global.css` — the design system (colors, type, spacing, layout)
- Page structure, section order, or which components a page uses
- Fonts, images, or anything in `public/`
- Build configuration (`astro.config.mjs`, `package.json`)

If a request seems to need one of the above, say so and ask before doing it.

## Where the copy lives

All page text is in the page files themselves:

| Page | File |
|---|---|
| Home | `src/pages/index.astro` |
| About | `src/pages/about.astro` |
| Founder Legacy | `src/pages/founder-legacy.astro` |
| Investments | `src/pages/investments.astro` |
| Contact | `src/pages/contact.astro` |

Repeated elements live in `src/components/` — the closing call-to-action band
(`CtaBand.astro`), navigation (`Nav.astro`), and footer (`Footer.astro`).
Editing one of those changes every page, so mention that when it applies.

Near the top of most pages there are lists (`const principles = [...]`,
`const faqs = [...]`). Editing the text inside those lists is the normal way to
change cards and FAQ entries.

## House style

- **The italic phrase in headlines is deliberate.** Each headline has exactly
  one `<em>` phrase, which renders in a serif italic. Keep one per headline,
  and keep it on the meaningful part ("maintaining *your legacy*").
- **Keep numbers consistent site-wide.** The firm's experience is stated as
  "30 years" / "30+" everywhere. If a figure changes, change every instance
  across all pages, not just the one mentioned.
- Sentence case for body copy; the hero buttons are uppercase.
- Avoid exclamation points and hard-sell phrasing — the tone is understated.

## Workflow

1. Make the edit.
2. Run `npm run build` to confirm the site still builds.
3. Commit to a **branch**, not directly to `astro/main`, and open a pull
   request. Netlify builds a preview of the branch so the change can be
   reviewed on a real URL before it goes live.

## Contact

Jay Zaslaw (Zinc) maintains this site — jzaslaw@zincsolutions.com.
For anything structural, design-related, or beyond copy, check with Jay first.
