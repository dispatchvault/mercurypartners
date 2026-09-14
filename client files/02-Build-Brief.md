# Mercury Partners — Webflow Build Brief

## Overview

This package contains a fully-designed reference implementation of the Mercury Partners website, broken into five standalone pages. The goal is to recreate this design and content in Webflow as five separate, linkable pages (not a single-page JS app), so each section has its own URL for SEO and direct linking.

## Site Map & URLs (suggested)

| Page | Suggested Webflow URL | Reference File |
|---|---|---|
| Home | `/` | `index.html` |
| About | `/about` | `about.html` |
| Founder Legacy | `/founder-legacy` | `founder-legacy.html` |
| Investments | `/investments` | `investments.html` |
| Contact | `/contact` | `contact.html` |

Each reference file is a complete, self-contained HTML page (CSS embedded, logo embedded as base64) that can be opened directly in a browser to preview the design and copy.

## What's in This Package

1. **Five HTML reference pages** (`index.html`, `about.html`, `founder-legacy.html`, `investments.html`, `contact.html`) — open any of these in a browser to see the full design with real content and working hover/FAQ interactions.
2. **`01-Style-Guide.md`** — color palette, typography, spacing, and component specs (design tokens) for matching the look in Webflow's style panel.
3. **`mercury-logo.png`** — standalone transparent logo asset for Webflow's asset manager.

## Page-by-Page Notes

**Home (`index.html`)**
- Hero with animated headline and stats
- "Principles" 3-card grid
- "How We Invest" 4-step section (dark background)
- Pull-quote from Bill Erbes (President and Co-Founder, DirectMed)
- FAQ accordion (5 questions)
- CTA banner linking to Contact

**About (`about.html`)**
- Page hero
- Three "pillars" row (No Forced Sale Timelines, etc.)
- Brad de Koning bio section (two-column)
- Investment strategy 4-card grid (Financial Criteria, Transaction Type, Industry Focus, etc.)
- Additional FAQ section

**Founder Legacy (`founder-legacy.html`)**
- Split-screen hero (dark/light)
- "Why Founders Choose Mercury" 4-item grid (roman numerals I–IV)
- "Aligned for the Long Run" 4-card grid (dark background)
- Founder-focused FAQ

**Investments (`investments.html`)**
- Page hero
- 4-stat track record bar (24 Investments, 25+ Years, 70%+ Healthcare & Business Services, LMM)
- 7-card investment grid, alphabetically ordered
- Sectors breakdown (Healthcare Services / Business Services, two columns)

**Contact (`contact.html`)**
- Two-column layout: firm contact info (left, dark) + inquiry form (right, light)
- Form fields: name, email, phone, role dropdown, inquiry subject, message, privacy checkbox
- **Webflow note:** this form should use Webflow's native form element so submissions are captured automatically (emails/notifications, stored entries) — the reference HTML form is static and won't submit anywhere on its own.

## Interactions to Replicate

1. **FAQ accordions** (Home, About, Founder Legacy) — clicking a question expands/collapses the answer with a "+"/"×" icon rotation. In Webflow, this can be built with interactions (click trigger → toggle class → height/opacity animation), or with Webflow's native accordion component if preferred.
2. **Card hover states** — cards across Principles, Investments, Why-Mercury, etc. invert to a dark background on hover with text/border color shifts. These are pure CSS `:hover` states — straightforward to replicate with Webflow's hover state styling.
3. **Nav** — fixed/sticky nav with blurred dark background; "Contact" styled as an outlined pill button, distinct from other nav links.

## Open Items / Decisions for Brad

- **Color palette:** this package uses the "blue" accent variant (`#3b82c4`). A "gold" variant (`#c9a96e`) was also reviewed — confirm final choice before building out all components.
- **Form handling:** confirm whether form submissions should go to a specific email/inbox, or integrate with a CRM.
- **Domain:** `www.mercfund.com` is currently registered separately — once the Webflow site is ready to go live, DNS records will need to be added at the domain registrar (Webflow will provide the exact records once a custom domain is connected in Project Settings).

## Fonts

Both fonts are loaded via Google Fonts and can be added natively in Webflow's font settings:
- **Cormorant Garamond** (weights 300, 400, 500, plus italics)
- **Jost** (weights 200, 300, 400, 500)
