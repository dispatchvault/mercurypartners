# Mercury Partners — mercfund.com

Branded informational site for Mercury Partners, built with Astro and plain CSS.
Content architecture from the client's reference package (`client files/`); look and feel from the
Mercury Partners Webflow site and the project style guide.

## Stack

- **Astro 7** (static output, Netlify adapter), TypeScript
- Plain CSS design tokens in `src/styles/global.css` (no CSS framework)
- Self-hosted fonts via `@font-face` (`public/fonts/`): Causten Light (headings), Freight Big Pro
  Light + Italic (serif accents). Inter (body) via `@fontsource-variable/inter`.
- `@astrojs/sitemap` emits `/sitemap-index.xml`; `public/robots.txt` points at it
- Deployed on Netlify

## Develop

```bash
npm install
npm run dev
```

`npm run build` outputs static pages to `dist/`;
`npm run preview` serves the production build locally.

## Contact form

`src/components/ContactForm.astro` is a plain HTML form handled by
[Netlify Forms](https://docs.netlify.com/forms/setup/) — no third-party service
and no API keys. Netlify detects the form in the built HTML at deploy time and
captures submissions.

- **Submissions:** Netlify dashboard → Project → **Forms**
- **Email notifications:** Forms → **Notifications** → add an email notification
- **Spam:** a hidden `bot-field` honeypot is included; Netlify filters on it

Progressive enhancement: with JavaScript the form posts via `fetch` and shows an
inline thank-you message; without it, the form posts normally and Netlify shows
its own success page.

## Design system

Tokens, type scale, components, and usage rules are documented in the project style guide
(internal artifact). Key rules: border-radius is always 0; one Freight-italic `<em>` phrase per
headline (renders indigo #263A99); International Orange is reserved for eyebrows and accents,
never fills; navy `#00224E` is the interactive color.

## Content

Page copy lives directly in `src/pages/*.astro`. The client's original reference pages are kept in
`client files/` for comparison; their design system (Cormorant Garamond/Jost, different palette)
was intentionally **not** used.
