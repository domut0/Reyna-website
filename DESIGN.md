# Reyna — Photography Portfolio: Design Reference

Working design reference for building Reyna's photography site. Inspiration site
supplied by the client: `https://www.newschoolrepresents.com/artists/erika-kamano/`

---

## 0. Read this first — provenance of everything below

This session's sandbox has **no outbound web access** (the egress proxy refuses all
hosts, including `example.com`), so the reference site could **not** be opened,
rendered, or inspected. Nothing in this document is a first-hand observation of
`newschoolrepresents.com`.

Every claim is tagged so future work doesn't mistake a proposal for a measurement:

| Tag | Meaning |
|---|---|
| **[VERIFIED]** | Confirmed from search-engine indexed URLs, page titles, and meta copy of the actual reference site. |
| **[PROPOSED]** | A design decision made for Reyna's site, informed by the conventions of fashion/editorial photography portfolios. Not taken from the reference site. |
| **[TO CONFIRM]** | Must be checked against the live reference site before it is treated as fact. |

Section 2 is the checklist for closing the **[TO CONFIRM]** gaps.

---

## 1. The reference site — what is actually known

### 1.1 It is an agency roster site, not a single-artist site **[VERIFIED]**

New School Represents is a creative collective / artist management agency (London,
founded 2021) representing artists across art, fashion, editorial, advertising and
entertainment. Erika Kamano is one artist on that roster.

This matters: the reference is a **multi-artist** architecture, and Reyna needs a
**single-artist** one. Section 3 handles that translation. Do not copy the roster
layer wholesale.

### 1.2 URL architecture **[VERIFIED]**

Confirmed live URLs on the reference site:

```
/artists/erika-kamano/                                    artist landing
/artists/erika-kamano/portfolio/overview/                 portfolio index
/artists/erika-kamano/portfolio/rosalia-tokyo-2023/       project
/artists/erika-kamano/portfolio/rosalia-press-shoot-2023/ project
/artists/erika-kamano/portfolio/cr-magazine-love-and-fantasies/
/artists/erika-kamano/portfolio/re-edition-aw24/
/artists/erika-kamano/portfolio/givenchy-chito-collaberation/
/artists/erika-kamano/portfolio/1213/                     project (Cou Cou Intimates)
/artists/erika-kamano/personal/cr-magazine/               separate "personal" track
```

Three structural takeaways:

1. **Three levels:** artist → section → project. Not a flat gallery.
2. **`portfolio` and `personal` are parallel sibling sections.** Commissioned/client
   work is separated from personal work at the URL level, not just by a filter.
3. **`/portfolio/overview/`** is an explicit index page, distinct from the artist
   landing page. The landing page and the work index are two different things.

Also note: slugs are human-readable and carry the client plus year
(`rosalia-tokyo-2023`, `re-edition-aw24`). One legacy numeric slug (`1213`) exists,
which suggests a CMS where the slug is editable and was sometimes left as an ID.
For Reyna, enforce readable slugs everywhere.

### 1.3 Page title convention **[VERIFIED]**

```
Erika Kamano | New School Represents
Erika Kamano | Portfolio | Overview | New School Represents
Erika Kamano | Portfolio | Rosalía | New School Represents
Erika Kamano | Personal | CR Magazine | New School Represents
```

Pattern: `{Artist} | {Section} | {Project} | {Site}`, pipe-delimited, breadcrumb
order, most specific in the middle. Worth mirroring for Reyna as
`{Project} | {Section} | Reyna {Surname}`.

Project titles are the **client or publication name** (Rosalía, CR Magazine,
Givenchy, Re-Edition, Cou Cou Intimates) — not descriptive art titles. In this genre
the client name *is* the credential.

### 1.4 Bio copy and tone **[VERIFIED]**

The artist bio on the reference site reads:

> Born in Hawaii, USA, and raised in the North of England by Japanese and English
> parents. Creates intimate, ethereal portraits that build visual narratives
> transcending the viewer from reality into the surreal, with raw human connection
> and empowerment at the core of her vision. A curiosity and deep love of fashion
> has led to sensational staged narratives and collaborations with leading fashion
> houses including Marc Jacobs, Mugler, Givenchy and Fendi.

Tone notes for writing Reyna's bio:

- Third person, present tense.
- Opens with origin/biography, then the *idea* behind the work, then the client list.
- Short — one paragraph, roughly 60–90 words.
- Client names are dropped as a closing sentence, not a bulleted logo wall.

### 1.5 What is *not* known **[TO CONFIRM]**

Not observed, and therefore **not** documented as fact anywhere below: typefaces,
colour values, grid columns, hover behaviour, scroll and page-transition animation,
cursor treatment, menu behaviour, image aspect ratios, lightbox behaviour, mobile
layout, and the CMS/stack. Section 4 onward proposes these for Reyna on genre
grounds; they are not reverse-engineered from the reference.

---

## 2. Checklist to close the gaps

Any one of these unblocks a proper teardown:

- **Re-run in an environment with egress access.** The network policy is set per
  environment when it is created (see
  https://code.claude.com/docs/en/claude-code-on-the-web). Allowing
  `newschoolrepresents.com` lets the page be fetched and inspected directly.
- **Or paste the raw page source** into the repo (`reference/artist-page.html`) plus
  the stylesheet. That yields fonts, tokens, breakpoints and transition timings exactly.
- **Or drop screenshots** into `reference/` — desktop + mobile, landing / index /
  project / info, plus a screen recording of hover and scroll behaviour.

When capturing manually, record specifically:

- [ ] Font families (DevTools → Computed → `font-family`), weights, and whether
      self-hosted or served from a foundry CDN
- [ ] Body and heading sizes, line-heights, letter-spacing (nav is often uppercase
      with wide tracking in this genre)
- [ ] Exact background and text colours (rarely pure `#fff`/`#000`)
- [ ] Grid: column count at desktop/tablet/mobile, gutter width, page margin
- [ ] Whether the grid is uniform, masonry, or editorial mixed-width
- [ ] Thumbnail hover: crossfade to second image? caption reveal? scale? none?
- [ ] Scroll-in animation: distance, duration, easing, stagger
- [ ] Page transitions: hard load, fade-through, or client-side router
- [ ] Menu: persistent header, or overlay triggered by a button?
- [ ] Project page: vertical scroll of stacked images, horizontal scroll, or slideshow?
- [ ] Captions/credits: always visible, on hover, or in a collapsible credits block?
- [ ] Mobile: columns, whether nav collapses, whether hover states have tap equivalents

---

## 3. Proposed information architecture for Reyna **[PROPOSED]**

Collapsing the agency's three levels to two, since there is only one artist:

```
/                          Landing — the work, immediately
/work/                     Index of all projects
/work/{project-slug}/      Individual project
/personal/                 Personal work index        (keep the reference's split)
/personal/{project-slug}/  Personal project
/info/                     Bio, client list, press, contact, socials
```

Decisions worth stating explicitly:

- **Keep the `portfolio` / `personal` split.** It is the one genuinely distinctive
  structural idea on the reference site, and it lets commissioned work stay
  client-legible while personal work stays free.
- **Landing page = work, not a splash.** In this genre the homepage is a grid or a
  full-bleed image, never a marketing hero with a headline and a CTA button.
- **One `/info/` page, not separate About and Contact.** A single-artist site does
  not have enough content to justify two.
- **No blog, no news feed.** Nothing that will sit stale.
- Contact is a plain `mailto:` and an Instagram link. No contact form — clients in
  this industry email directly, and a form is one more thing to maintain and spam-filter.

---

## 4. Visual system **[PROPOSED]**

The governing rule for this genre: **the interface should be close to invisible.**
Every design decision is subtractive. If an element is not a photograph, it should be
small, quiet, and out of the way. Colour, contrast and drama come from the images.

### 4.1 Colour

Near-monochrome. The UI must never compete with the photography.

```css
:root {
  --bg:            #fafafa;  /* off-white; pure #fff makes photos look clipped */
  --fg:            #111111;  /* near-black; pure #000 is harsh against imagery */
  --fg-muted:      #767676;  /* captions, credits, meta — AA at 14px+ on --bg */
  --rule:          #e4e4e4;  /* hairlines, dividers */
  --overlay:       rgba(250, 250, 250, 0.96); /* menu overlay */
  --focus:         #111111;  /* focus ring — keep visible, do not remove */
}
```

- No accent colour. No brand gradient. No shadows on images.
- If a dark theme is wanted, make it a deliberate single choice (`--bg: #0d0d0d`,
  `--fg: #f2f2f2`), not a `prefers-color-scheme` toggle — photographers usually want
  one controlled presentation, and images are colour-graded against one background.

### 4.2 Typography

One neutral grotesque throughout. Two typefaces is already one too many here.

**Self-hosted, free — recommended starting point:**

- **Inter** — neutral, excellent at small sizes, variable font available
- **Archivo** — slightly more character, good tight uppercase tracking
- **Space Grotesk** — if she wants a hint of personality in the wordmark

**Licensed, if there is budget** (these are what agency sites in this space actually
use): ABC Diatype, Neue Haas Grotesk, Söhne, Suisse Int'l.

Self-host the woff2 files (`font-display: swap`) rather than using a font CDN — it is
faster and avoids a third-party request.

Scale — deliberately small UI, large images:

| Role | Size | Weight | Tracking | Case |
|---|---|---|---|---|
| Nav / menu items | 12–13px | 400/500 | `0.08em` | UPPERCASE |
| Captions, credits, year | 11–12px | 400 | `0.04em` | Sentence |
| Body / bio | 15–16px | 400 | `0` | Sentence |
| Project title (page) | 18–22px | 400 | `0` | Sentence |
| Wordmark | 14–16px | 500 | `0.1em` | UPPERCASE |

- Line-height: `1.5` for body prose, `1.2` for anything uppercase.
- Body copy max-width: `58ch`. Bio paragraphs should never run the full window width.
- Do not scale headings up dramatically. There is no `48px` type on a site like this;
  the photographs carry the visual weight.

### 4.3 Layout and grid

- **Page margin:** `24px` mobile, `32px` tablet, `40px` desktop. Keep it consistent —
  the margin is what makes the site feel considered.
- **Work grid:** 12-column base. Thumbnails span 6 columns (2-up) or 4 columns (3-up)
  at desktop, 1-up on mobile. 2-up reads as more premium; 3-up shows more work.
- **Gutter:** `16px` mobile, `24px` desktop. Generous gutters, tight margins is the
  editorial look; the reverse looks like a template.
- **Vertical rhythm:** base spacing unit `8px`. Section gaps in multiples: `48 / 80 / 120`.
- Consider an **editorial mixed-width** project page — alternating full-bleed images,
  centred single images, and side-by-side pairs — rather than a uniform stack. This is
  what separates a photographer's site from a stock gallery template.

### 4.4 Imagery rules

- Preserve each image's native aspect ratio. Never crop to a uniform square in the
  grid; a photographer's framing is the work.
- Always set `width`/`height` or `aspect-ratio` on the element so nothing reflows as
  images load (cumulative layout shift is the most common flaw on portfolio sites).
- No rounded corners, no borders, no drop shadows, no filters.
- Full-bleed images should be truly edge-to-edge, ignoring the page margin.

---

## 5. Motion and interaction **[PROPOSED]**

Restrained and consistent. One easing curve, two durations, nothing bouncy.

```css
--ease:      cubic-bezier(0.22, 0.61, 0.36, 1); /* ease-out, calm */
--dur-fast:  200ms;  /* hovers, small state changes */
--dur-slow:  600ms;  /* image reveals, page transitions */
```

**Image reveal on scroll.** `opacity: 0 → 1` with `translateY(16px → 0)`, `600ms`,
`--ease`. Trigger via `IntersectionObserver` at ~15% visibility. Stagger siblings by
`60ms`. Never animate more than the first screen's worth on load.

**Thumbnail hover (desktop only).** Pick one, apply everywhere:
- *(a)* Crossfade to a second image from the project — the strongest option, shows more work
- *(b)* Caption fades in beneath — quietest
- *(c)* Image dims slightly (`opacity: 0.85`) — weakest, but fine

Whatever is chosen, mobile needs the caption visible by default, since there is no hover.

**Page transitions.** Fade-through: `150ms` out, `300ms` in. Skip elaborate shared-element
transitions — they are fragile and slow the first meaningful paint.

**Cursor.** A custom cursor is common in this genre and is a real accessibility and
performance cost. Recommend against it. If she insists, keep the native cursor visible
underneath and confine it to the work grid.

**Menu.** Full-screen overlay fading in over `--dur-fast`, links in the large-ish
uppercase treatment. Must trap focus and close on `Esc`.

**Reduced motion — non-negotiable:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Images must still be visible (`opacity: 1`) when motion is reduced — a common bug is
scroll-reveal leaving everything invisible.

---

## 6. Page specifications **[PROPOSED]**

### `/` Landing
Wordmark top-left, menu top-right. Immediately below: the work grid, or a single
full-bleed image that scrolls into the grid. No headline, no tagline, no scroll
indicator. First image should be preloaded and above the fold.

### `/work/` Index
The full grid. Each cell: image, then project title and year in caption type beneath.
Consider a quiet filter by year or client only if there are more than ~20 projects;
below that it is clutter.

### `/work/{slug}/` Project
- Project title + year at top, small.
- Sequence of images, editorial widths, generous vertical spacing.
- Credits block at the bottom: client, publication, talent, styling, hair, makeup,
  set design. Caption type, left-aligned, `--fg-muted`.
- Prev / next project links at the very bottom. These matter — they keep people moving
  through the work instead of bouncing.

### `/info/` Info
Bio paragraph (58ch max), then client list as a simple comma-separated or single-column
run of names, then press/publications, then contact. Optionally one portrait of Reyna.
Email as `mailto:`, Instagram linked. Representation details if she is signed.

---

## 7. Responsive behaviour **[PROPOSED]**

| Breakpoint | Grid | Margin | Notes |
|---|---|---|---|
| `< 600px` | 1-up | 24px | Captions always visible; no hover states |
| `600–1024px` | 2-up | 32px | |
| `> 1024px` | 2-up or 3-up | 40px | Hover states active |
| `> 1600px` | cap content at ~1800px | auto | Do not let images grow indefinitely |

Mobile is likely the majority of traffic from Instagram. Build and review it first.

---

## 8. Performance **[PROPOSED]**

An image-heavy site lives or dies here, and art directors browse on hotel wifi.

- Serve **AVIF** with **WebP** fallback via `<picture>`.
- `srcset` at 640 / 1024 / 1536 / 2048 / 2560px, with an accurate `sizes` attribute.
- `loading="lazy"` + `decoding="async"` on everything below the fold; the first
  image gets `loading="eager"` and `fetchpriority="high"`.
- LQIP: a blurred ~20px placeholder inlined as a data URI, crossfading to the full
  image. Cheap, and makes slow connections feel intentional.
- Budget: hero under 300KB, grid thumbnails under 150KB each.
- Strip EXIF on export, but **keep the colour profile** — sRGB, converted on export.
  Untagged Adobe RGB files are why photographers' images look flat in browsers.
- Targets: LCP < 2.5s on 4G, CLS < 0.05, no long tasks over 200ms.

---

## 9. Accessibility **[PROPOSED]**

Minimal sites fail these constantly. Non-negotiables:

- Real `alt` text on every image describing the photograph. Decorative repeats get `alt=""`.
- `--fg-muted` on `--bg` must clear 4.5:1. Verify any lighter grey before shipping.
- Visible focus ring on every interactive element. Do not `outline: none` without a
  replacement.
- Menu overlay: focus trap, `Esc` to close, `aria-expanded` on the trigger.
- Full keyboard navigation, including prev/next and any lightbox.
- Honour `prefers-reduced-motion` (Section 5).

---

## 10. Stack recommendation **[PROPOSED]**

**Astro + Tailwind, images in the repo, deployed on Netlify or Vercel.**

Rationale: ships zero JS by default (a portfolio is almost entirely static),
has an excellent built-in image pipeline (AVIF/WebP/srcset generated at build), and
content can live in Markdown files, so there is no CMS to maintain or pay for.

Content model, one Markdown file per project:

```yaml
---
title: "Rosalía"                    # client or publication
slug: "rosalia-tokyo-2023"
section: "work"                     # work | personal
year: 2023
client: "Rosalía"
publication: ""
cover: "./images/01.jpg"
credits:
  talent: ""
  styling: ""
  hair: ""
  makeup: ""
  set: ""
order: 1                            # manual ordering; she will want control
images:
  - src: "./images/01.jpg"
    alt: ""
    layout: "full"                  # full | contained | pair
---
```

If Reyna wants to update the site herself without touching Git, add Sveltia CMS or
Decap CMS on top of the same Markdown files rather than moving to a hosted CMS.

**Alternative:** if she would rather not have a developer involved long-term, a
well-chosen Squarespace or Cargo template gets 80% of this. Say so honestly before
building something custom that only one person can maintain.

---

## 11. Content to collect from Reyna

Blocking work cannot start without:

- [ ] 8–15 projects, each with 5–15 images, export-ready (sRGB, long edge ≥ 2560px)
- [ ] Project titles, clients/publications, years
- [ ] Full credits per project
- [ ] Bio, one paragraph, third person (see 1.4 for the tone to match)
- [ ] Client list for `/info/`
- [ ] Contact email, Instagram handle, representation if any
- [ ] Preferred project ordering — she will care about this more than anything else here
- [ ] Wordmark: name as plain type, or a supplied logo file
- [ ] Domain name

---

## 12. Open questions

1. Does Reyna want the `portfolio` / `personal` split, or a single body of work?
2. Motion/video work to accommodate? That changes the grid and adds player decisions.
3. Should the landing page be the grid, or a single full-bleed image?
4. Dark or light? (Section 4.1 — pick one, do not offer a toggle.)
5. Does she need to edit it herself?
6. Is she represented? If so, contact routes to the agency, not to her directly.

---

*Sections 4–12 are proposals for Reyna's site, not observations of the reference.
Reconcile them against the live reference site once it is reachable — see Section 2.*
