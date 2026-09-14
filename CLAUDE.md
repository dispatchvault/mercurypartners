# Mercury Partners website — working notes

This is the Mercury Partners website (mercfund.com). It is a small, static, five-page informational site. Pushing to
the `main` branch publishes to the live site automatically.

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

Every push to `main` triggers a paid production build on Netlify, so
**do not push after each edit.** Draft locally, then publish once.

1. Before starting, make sure you are on `main` and run `git pull` so you
   have the latest version of the site.
2. Start the local preview with `npm run dev` and keep it running. The site
   is viewable at http://localhost:4321 and updates instantly on every edit.
   Make as many edits as needed while reviewing there.
3. Only when the user says to **publish** (or "push it live", "make it
   live"): run `npm run build` to confirm the site builds, commit all the
   changes to `main` with a summary of what changed, and push. Netlify
   publishes to the live site within about a minute.

Do not commit or push unless the user has asked to publish. Batch the
session's edits into a single push whenever possible.

## Contact

Jay Zaslaw (Zinc) maintains this site — jzaslaw@zincsolutions.com.
For anything structural, design-related, or beyond copy, check with Jay first.
