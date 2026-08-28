# Reyna — Photography Portfolio: Design Reference

Working design reference for building Reyna's photography site. Inspiration site supplied
by the client: `https://www.newschoolrepresents.com/artists/erika-kamano/`

---

## 0. Provenance

This document merges two passes:

- An earlier pass (2026-08-24, cloud session) that had **no outbound network access** and
  worked from search-indexed URLs and meta copy. It established the content strategy —
  URL architecture, title conventions, bio tone, IA, stack — and was explicit that the
  visual system was unknown.
- A second pass (2026-08-24, local session) that **did** reach the site and inspected it
  directly: live DOM, computed styles, the shipped JS bundles, and the full sitemap, at
  both mobile and desktop viewports.

A third pass (2026-08-27) built the site and rewrote everything after §11 from the shipped
artifact.

The document now has three parts, and they carry different authority:

| Sections | What they are |
|---|---|
| **§1–§11** | The **reference site**, measured first-hand. Where a number appears (`420px`, `0.4`, `scale(0.7)`) it is the actual value from that implementation. |
| **§12** | The **built site**, recorded from the shipped code. Departures from the reference are stated with their reason. This is the authority for the current build. |
| **§13–§15** | Outstanding content, open questions, and copy-paste tokens. |

Where §12 and §1–§11 disagree, §12 wins: it describes what exists.

The first pass's `[TO CONFIRM]` list (typefaces, colour, grid, hover, scroll animation,
cursor, menus, mobile layout, stack) is now closed. Two of its `[VERIFIED]` structural
claims turned out to be wrong; both are corrected in §11.1 with the evidence.

One caveat: the browser pane would not composite frames during inspection, so the site was
never seen *rendered*. Everything below is read from the DOM, CSSOM, and source. That makes
the numbers more precise than eyeballing would, but it means subjective judgements about
how the site *feels* are inferred from the code, not observed.

---

## 1. What kind of site this is

A **roster site for a creative agency**, not a single photographer's portfolio. New School
Represents is a London creative collective representing ~17 artists across art, fashion,
editorial, advertising and entertainment. Erika Kamano is one artist on that roster.

This matters: a lot of the reference's structure exists to solve "17 artists, one brand."
Reyna needs a single-artist architecture. §11 handles that translation. Do not copy the
roster layer wholesale.

Stack it is built on: Next.js (pages router) + styled-components + a Strapi CMS
(`cms.newschoolrepresents.com`) + `react-slick` for carousels. Only four routes exist:

| Route | What it is |
|---|---|
| `/` | Fullscreen looping video. Nothing else. |
| `/artists/[...slug]` | Artist landing, project grid, gallery overview, project carousel |
| `/playground/[slug]` | "Spotlight" — the agency's own production arm |
| `/[slug]` | Catch-all for `privacy-policy` |

There is **no `/about` page and no `/contact` page.** Both live in full-screen overlays that
slide in over whatever you are looking at. This is the single biggest structural idea on the
site.

---

## 2. Core design philosophy

Five principles the whole thing hangs off:

1. **The image is the interface.** Chrome is a 60px transparent header and two corner
   buttons. No sidebar, no breadcrumb, no visible nav bar. Every page opens on media at
   full-bleed.
2. **Navigation is an event, not a place.** Menus are 100vw × 100vh coloured panels that
   slide in from off-screen. You never "go to" the nav — it arrives.
3. **Colour is the only decoration.** The content layer is strictly black / white / grey.
   All saturated colour is confined to the overlays and the artist name. Nothing is
   tinted, gradient-ed, or shadowed.
4. **Type does one job.** One typeface (Satoshi) at essentially two sizes: 14px for
   everything functional, and a large display size for names. Weight carries the hierarchy,
   not size.
5. **Motion is slow and reversible.** Two durations exist site-wide (0.25s and 0.4s), both
   `ease-in-out`. Nothing bounces, nothing springs, nothing has a custom cubic-bezier.

---

## 3. Typography

### Fonts

**Satoshi** — Indian Type Foundry, by Deni Anggara. Free from
[fontshare.com/fonts/satoshi](https://www.fontshare.com/fonts/satoshi). Self-hosted as
woff2/woff/ttf from `/fonts/`, `font-display: swap`.

Loaded as **separate families per weight**, not one family with numeric weights — the CSS
says `font-family: Satoshi-Black`, not `font-weight: 900`. A variable version
(`Satoshi-Variable`, wght 300–900) is declared but never used in the shipped CSS. For a new
build, just use the variable font and normal `font-weight` — the split families are a legacy
quirk, not a design decision.

Weights actually in use:

| Family | Weight | Used for |
|---|---|---|
| `Satoshi-Light` | 300 | Body copy in overlays, footer text, filter tabs (inactive) |
| `Satoshi-Regular` | 400 | Default body, form inputs, buttons |
| `Satoshi-Medium` | 500 | Section headings (`h5`) |
| `Satoshi-Bold` | 700 | Header buttons, section titles, `<strong>`, active filter tab |
| `Satoshi-Black` | 900 | Artist names (display), project titles on hover, nav list hover |

**Montserrat Bold** (Google Fonts, 400/500/700) is loaded for exactly one thing: the text
inside the rotating circular SVG logo. Everything else is Satoshi.

### Scale

Declared as CSS custom properties on `:root`, with two breakpoint jumps on the display sizes
only:

```css
:root {
  --size-smaller: 11px;
  --size-small:   14px;   /* the workhorse — most of the site is this */
  --size-medium:  16px;
  --size-big:     22px;
  --size-huge:    38px;

  --size-display: 28px;   /* artist name in nav list */
  --size-hero:    32px;   /* artist name on their page */

  --leading-tight: 1.1;   /* headings */
  --leading-base:  1.5;   /* body */
  --leading-loose: 1.7;   /* links, buttons, small, label */
}

@media (min-width: 568px) { :root { --size-display: 40px; --size-hero: 48px; } }
@media (min-width: 992px) { :root { --size-display: 52px; --size-hero: 72px; } }
```

There is **no fluid `clamp()` typography** — the display sizes step at two breakpoints and
that is it. Body copy never changes size at any breakpoint. 14px on a phone, 14px on a
27-inch monitor.

### Global type rules

```css
*, ::before, ::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
body { font-family: Satoshi-Regular; font-size: var(--size-small); line-height: var(--leading-base); }
h1,h2,h3,h4,h5,h6 { line-height: var(--leading-tight); }
p { line-height: var(--leading-base); text-align: justify; }   /* see warning below */
a, button, small, label { line-height: var(--leading-loose); }
strong { font-family: Satoshi-Bold; }
```

**`p { text-align: justify }` is a mistake worth not copying.** It produces rivers and ragged
word-spacing in the artist bios, especially in narrow columns. Use `text-align: left` and cap
the measure with `max-width: 80ch` (which the site already does via its bio wrapper).

Uppercase + `Satoshi-Bold` is the standard treatment for every interactive label
(`CONTACT AGENT`, `INSTAGRAM`, `GALLERY`, `BACK`, `SUBSCRIBE`, `SPOTLIGHT`).

---

## 4. Colour

### Content layer — monochrome only

| Token | Hex | Use |
|---|---|---|
| Black | `#000000` | Text on light pages, footer background, preloader, homepage backdrop |
| White | `#ffffff` | Text on dark/overlay pages, logo |
| Grey | `#a1a1a1` | Secondary text in footer, inactive filter tabs, muted input borders |

That is it. No greys in between, no off-white, no borders except 1px underlines on inputs.

### Accent palette — 7 colours, used *only* for overlays and names

Pulled from the CMS as `menuBackgroundColours` / `colourOne`…`colourSeven`:

| # | Hex | Reads as |
|---|---|---|
| 1 | `#a73b34` | Brick red |
| 2 | `#be6f40` | Burnt orange |
| 3 | `#495f39` | Olive green |
| 4 | `#b83b6c` | Raspberry |
| 5 | `#312048` | Deep purple |
| 6 | `#2f518b` | Cobalt blue |
| 7 | `#c091ab` | Dusty pink *(defined, but not in the active menu rotation)* |

Muted, slightly desaturated, mid-to-dark. They read as **painted backdrops**, not UI accent
colours — which is why white text sits on them comfortably at 14px.

### How the accent gets picked — two different mechanisms

**a) The Artists overlay cycles round-robin.** A module-level counter advances every time the
menu opens: `index = (index + 1) % colours.length`. So the panel is a different colour each
time you open it. Default fallback if the CMS list is empty: `#312048`.

**b) The artist's name colour is picked by WCAG contrast, then randomised.** The shipped
code:

1. Computes relative luminance (proper sRGB linearisation, `0.2126R + 0.7152G + 0.0722B`)
   for each palette colour.
2. Computes contrast ratio against a fixed dark reference of `rgb(24,24,24)` — i.e. the
   dimmed hero image behind the name.
3. Sorts descending by ratio, takes the **top 3**, picks one at **random**.

So the name is always legible over the darkened hero, but the exact colour changes on every
page load. Reloading `/artists/erika-kamano/` gave `#a73b34` once and `#b83b6c` the next
time. This is a genuinely good pattern — steal it.

### The 40% black scrim

Every hero cover has a hardcoded overlay on top of the image or video:

```css
position: absolute; inset: 0; background: black; opacity: 0.4; pointer-events: none;
```

This is what makes white text safe over *any* photo the CMS throws at it. Non-negotiable if
you want editable hero images.

---

## 5. Layout & breakpoints

Breakpoints (min-width, mobile-first, with one max-width exception):

| px | Job |
|---|---|
| 335 | Tiny phone margin fix |
| 400 | Logo 150px → 200px |
| 568 | Display type step 1 |
| 576 | Grid 1-col → 2-col |
| 650 | Padding 11px → 30px; header padding 5px → 20px; logo goes `fixed` |
| 768 | Minor min-width resets |
| **992** | **The real desktop breakpoint.** Almost everything switches here. |
| 1100 / 1200 | Minor min-width bumps |
| `max-width: 991` | Forces the hero back to 100vw/100vh, disables shrink + cursor tooltip |

**992px is the line.** Below it you get a stacked, single-column, full-screen-media
experience. Above it you get two columns, the scroll-shrink hero, the cursor-following
tooltip, and the rotating logo.

Spacing is blunt and consistent: `11px` gutters on mobile, `20–30px` on desktop,
`gap: 10px` inside stacks, `gap: 20px` between button rows, `40px` between footer blocks.
Content maxes at `1500px` for grids, `1200px` for the artist list, `80ch` for prose, `700px`
for the Info column.

---

## 6. Page-by-page

### 6.1 Home — `/`

Literally one element: a `<video>` filling the viewport on a black backdrop.

```html
<video autoplay loop muted playsinline style="object-fit: cover">
```

No text, no headline, no scroll. Chrome only: fixed header (`ARTISTS` · logo · `INFO`),
`SUBSCRIBE` bottom-left, `SPOTLIGHT` bottom-right. That is the entire homepage.

### 6.2 Artist landing — `/artists/[slug]/`

Vertical order:

1. **Hero** — full-bleed `100vw × 100vh` image or video, `object-fit: cover`,
   `object-position: bottom center`, `quality=90`, `priority` loaded, plus the 40% black
   scrim.
2. **Overlay block**, absolutely centred (`top:50% left:50% translate(-50%,-50%)`):
   - `<h2>` artist name — `var(--size-hero)`, `Satoshi-Black`, `line-height: 1.1`, inline
     accent colour
   - Role line — `var(--size-big)`, `Satoshi-Bold`, white, e.g. "Photographer + Director"
   - Button row, `gap: 20px`, wrapping, uppercase 14px: `CONTACT AGENT` (mailto with
     `?subject=<Artist Name>`) · `INSTAGRAM` · `GALLERY`
3. **Scroll cue** — a CSS-only chevron pinned bottom-centre. A 15×15 box with
   `border-width: 0.25em 0.25em 0 0` rotated `135deg`. No icon font, no SVG.
4. **Bio** — `max-width: 80ch`, `Satoshi-Light` 300.
5. **Filter tabs** — `ALL` / `STILLS` / `MOTION` / plus a per-artist third category
   (`PERSONAL`, `SHOWS`…). Active = black + `Satoshi-Bold`; inactive = `#a1a1a1` + weight
   300. Hover on both: `scale(1.06)` and colour → white.
6. **Project grid** — flex-wrap, `max-width: 1500px`:
   `flex: 0 0 100%` → `50%` @576 → `33.333%` @992. Items are 15px-padded,
   `margin: 20px 0 50px` (→ `20px 0 70px` @992). Images `object-fit: contain`,
   `max-height: 400px` — so the grid is **ragged, not a uniform crop**. Each project's aspect
   ratio survives.
7. **Footer** — black panel, full `100dvh` on mobile, `auto` height @992.

#### The signature animation: scroll-shrink hero

Desktop only (`≥992px`). As you scroll the first 420px, the full-bleed hero contracts
laterally into the width of the bio column beneath it, keeping the viewport aspect ratio.

```js
progress = clamp(window.scrollY / 420, 0, 1)          // 0 at top, 1 after 420px
target   = artistTargetWidth || min(viewportWidth, 1000)
width    = viewportWidth - (viewportWidth - target) * progress
height   = width / viewportWidth * viewportHeight     // preserves vw:vh ratio
```

`targetWidth` is measured live from the bio block's `getBoundingClientRect().width`, so the
hero lands exactly flush with the text column. CSS carries it:
`transition: width var(--transition-slow), height var(--transition-slow)`.

Below 992px it is hard-disabled: `width: 100vw !important; height: 100vh !important`, and
`progress` is forced to `0`.

#### Cursor-following project label

Desktop only. On `mousemove` over the grid, the project title is positioned at
`left: pageX + 30`, `top: pageY - scrollY + 2`, and **hides itself if `pageX + 130` would
overflow the viewport** so it never clips off the right edge.

#### Grid hover

`opacity: 0.3` on the image over `0.4s ease-in-out`, title fades in. Two variants exist:
title sits *below* the image on the landing grid (`top: 100%`), and *centred over* it on the
gallery overview (`translate(-50%,-50%)`, `opacity 0 → 1`).

### 6.3 Gallery overview — `/artists/[slug]/portfolio/overview/`

Reached via the `GALLERY` button. Every image from every project, flattened.

- Header row: a 3-column CSS grid — `BACK` (left) · `ARTIST NAME` (centre) · `ROLE` (right),
  all uppercase `Satoshi-Bold` 14px, `padding: 100px 11px 10px` (→ `120px 25px 15px` @576).
- Body: a **JS masonry** — children are absolutely positioned inside a relative container,
  margins `0 11px 60px` (→ `25px` @576).
- Hover: image → `opacity: 0.3`, centred title fades in.
- Images lazy-loaded via a `lazyload-wrapper`.

### 6.4 Project carousel — `/artists/[slug]/portfolio/[project]/`

White page, black header text. A `react-slick` **centre-mode** carousel:

```css
main            { min-height: 100vh; display: flex; align-items: flex-end; }
.carousel       { margin-top: 25vh; }              /* → 20vh @992 */
.slick-list     { padding: 70px 0 !important; }    /* → 0 @992 */
.slick-slide    { transition: transform 0.5s; }
.slick-slide:not(.slick-current) { opacity: 0.4; transform: scale(0.7); }
```

Current slide `max-height: 504px`, `object-fit: cover`. Caption bar underneath:
`padding: 80px 20px 16px`, centred column, `gap: 15px` — project title (`Satoshi-Black`),
then a `BACK` button (uppercase `Satoshi-Bold`, `:hover { opacity: 0.5 }`).

### 6.5 Spotlight / Playground — `/playground/`

Intro paragraph (`max-width: 80ch`, `margin: 60px auto 0`, 14px weight 300), then another
centre-mode carousel — slightly different numbers from the project one:

```css
.slick-slide { opacity: 0.4; transform: scale(0.78);
               transition: transform 0.4s, opacity 0.4s; }
.slick-slide.slick-current { opacity: 1; transform: scale(1); z-index: 1; }
```

This one has visible arrows: 36×36 transparent buttons, 32px glyph, absolutely positioned at
`top: 50%` left/right edge, `:hover { opacity: 0.5 }`. Slides are `max-width: 300px`
(→ 350px @1200), `min-height: 400px`, `object-fit: contain`, `max-height: 450px`. Captions
are `--size-smaller` (11px) and **left**-aligned here.

---

## 7. Chrome — header, overlays, corner buttons

### Header

```css
position: fixed; top:0; left:0; right:0; height: 60px; z-index: 10100;
display: flex; justify-content: space-between; align-items: center;
padding: 15px 5px;                 /* → 15px 20px @650 */
background: transparent;           /* always — it never gains a solid fill */
transition: background-color var(--transition-base);
```

Three items: `Artists` button (left) · logo (centre) · `Info` button (right). Both buttons
are `Satoshi-Bold`, uppercase, `background: transparent`, no border, with
`:hover { transform: scale(1.06) }` over `0.25s`.

**Text colour flips per page**: white on the dark pages (home, artist landing), black on the
light pages (project carousel, gallery overview). It is a per-route prop, not
`mix-blend-mode`.

The logo is a white SVG from the CMS, 150px wide (→ 200px @400). Below 650px it is a static
centred block; at ≥650px it becomes `position: fixed` with
`transform: scale(1) translateX(-50%)` and a `0.4s ease-in-out` transition.

### Corner buttons

`SUBSCRIBE` bottom-left, `SPOTLIGHT` bottom-right. `position: fixed`, `z-index: 10100`,
`padding: 15px 11px` (→ `15px 20px` @650). Same `scale(1.06)` hover.

### The three full-screen overlays

All three share the same mechanics — `position: fixed`, `100vw × 100vh`, white text,
`overflow: auto`, and:

```css
transform: translate3d(-100vw, 0, 0);        /* closed */
transition: all var(--transition-slow);      /* 0.4s ease-in-out */
/* open: */
transform: translate3d(0vw, 0, 0);
```

| Overlay | Slides from | Default bg | z-index |
|---|---|---|---|
| **Artists** | left (`-100vw`) | `#312048`, then cycles the palette | 999 |
| **Info** | right (`+100vw`) | `#2f518b` | 10000 |
| **Subscribe** | left (`-100vw`) | `#495f39` | 10000 |

They translate in from off-screen rather than fading, and they sit *under* the header
(10100) so the close affordance stays reachable.

#### Artists overlay — the best interaction on the site

A `<ul>`, `grid-template-columns: 1fr` → **`2fr 3fr` @992**, `gap: 10px`,
`max-width: 1200px`. On desktop, even-numbered items are `text-align: right` — so the names
zig-zag down the page in two ragged columns instead of sitting in a tidy list.

Each name is `var(--size-display)` (52px @992) in `Satoshi-Regular`, white. On hover:

- Font family swaps **Regular → Black** and colour → `#000`. Because the two cuts have
  different widths, the name visibly *thickens and shifts* — a deliberate, slightly unstable
  effect. (Compensated with `margin: -1px 0 -2px` to stop layout jumping.)
- The role label — absolutely positioned at `top: 90%; left: 100%`, `white-space: nowrap`,
  `pointer-events: none` — fades in beside the name over `0.15s`.
- A CMS-assigned **image or video for that artist appears in a corner of the panel**
  (`navImagePosition` defaults `TopLeft`, `navVideoPosition` defaults `BottomRight`). Videos
  are `muted autoPlay loop playsInline` with a poster frame.
- After a **150ms hover dwell**, Next.js prefetches that artist's route. Cheap
  perceived-speed win — worth copying.

"Playground" is force-sorted to the bottom of an otherwise alphabetical list.

#### Info overlay

Two columns @992: rotating circular logo on the left, content on the right
(`max-width: 700px`, `gap: 10px`). Sections: **About** (h5 + paragraph), **Info** (two office
addresses + phone numbers), email, **Instagram**, and a **Subscribe** input.

Form inputs are bottom-border-only:

```css
border: none; border-bottom: 1px solid #fff;
background: transparent; color: #fff; padding: 0 0 5px;
outline: none; min-width: 250px;   /* @992 */
```

Submit is the same treatment, uppercase, `:hover { font-weight: bold }`.

---

## 8. Motion

Two durations. That is the whole system.

```css
--transition-base: 0.25s ease-in-out;   /* hovers, header, scale */
--transition-slow: 0.4s  ease-in-out;   /* overlays, image opacity, hero shrink */
```

| Thing | Spec |
|---|---|
| Overlay slide | `translate3d(±100vw → 0)` over `0.4s ease-in-out` |
| Hero shrink | width + height over `0.4s`, driven by `scrollY / 420` |
| Button hover | `transform: scale(1.06)` over `0.25s` |
| Grid image hover | `opacity → 0.3` over `0.4s` |
| Carousel slides | `scale(0.7)/0.4` → `scale(1)/1` over `0.5s` (playground: `0.78`, `0.4s`) |
| Nav role label | `opacity` over `0.15s` |
| Carousel arrows / BACK | `opacity → 0.5` |

### Rotating circular logo

An SVG `<textPath>` on a circle (`r=80` in a `250×250` viewBox) reading
"new school represents." in Montserrat Bold 48px, spinning forever:

```css
animation: rotate 8s linear infinite reverse;   /* 12s in the footer variant */
@keyframes rotate { 0% { transform: rotate(360deg); } }
```

200×200 on mobile, 300×300 @992 (160px in the footer). Desktop-only in the footer
(`display: none` below 992).

### Preloader

Black full-screen panel (`z-index: 110000`) with the white logo centred at 60% width (40%
@992). The logo then **zooms straight through the camera** while the panel fades:

```css
@keyframes fade {        /* desktop */
  0%   { width: 30%; }
  100% { width: 8000%; transform: translateX(-1000px) translateY(-500px); }
}
@keyframes mobileFade {  /* same, starting at 60% */
  0%   { width: 60%; }
  100% { width: 8000%; transform: translateX(-1000px) translateY(-500px); }
}
/* panel: */ transition: 1.4s ease-out 0.2s; opacity: 0 !important;
/* logo:  */ animation: 1.4s ease-out 0.2s 1 normal none running fade;
```

1.4s, `ease-out`, 0.2s delay, runs once. Showy, but it is the site's whole brand moment. For
a single-photographer site this is ~1.6s of dead time on every cold load — see §12.

---

## 9. Imagery rules

- Heroes: `object-fit: cover`, `object-position: bottom center` (keeps faces in frame when
  cropping), `quality=90`, `priority` loading.
- Grid thumbs: `object-fit: contain`, `quality=75`, capped at `max-height: 400–450px`. The
  ragged grid is intentional — nothing is force-cropped to a square.
- Responsive `sizes`: `(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw` for grids;
  `(max-width: 992px) 100vw, 60vw` for heroes.
- Video is **always** `muted playsInline autoPlay loop`, with a poster frame from the medium
  format. `preload="none"` on non-hero video.
- Media type drives the filter tabs automatically: images → STILLS, video/GIF → MOTION.
  There is a mime-type sniff with a file-extension fallback.

---

## 10. Accessibility & quality notes

Things the reference site gets wrong. Do not inherit them.

- `p { text-align: justify }` — rivers in every bio. Use left-aligned + `80ch`.
- The nav name changes *font family* on hover, causing a visible reflow. Fine as an effect,
  but pair it with a fixed-width technique (`font-variation-settings` on a variable font, or
  a hidden bold ghost element) if you want it stable.
- No `prefers-reduced-motion` anywhere. The preloader zoom, the 8s infinite rotation, and
  the scroll-shrink all run regardless. **Add a `@media (prefers-reduced-motion: reduce)`
  block** — it is three lines and it matters.
- Overlay open/close has no visible focus trap and the buttons carry no `aria-expanded`.
- `#a1a1a1` on white is ~2.6:1 — below WCAG AA for body text. It is used for footer copy and
  inactive tabs. Darken to ~`#767676` if you want AA.
- **Every project is reachable at two URLs, each self-canonicalising.** See §11.1. This is a
  real duplicate-content bug. Do not reproduce it.
- Good, and worth copying: the contrast-driven accent picker (§4), the 40% scrim, the 150ms
  hover prefetch, the tooltip edge-detection, `pointer-events: none` on decorative labels.

---

## 11. Content conventions

### 11.1 URL architecture — with two corrections

The earlier pass recorded two structural claims that the sitemap does not support. Both are
corrected here.

**Correction 1 — slugs.** The earlier pass concluded slugs are human-readable with one
"legacy numeric" exception. The truth is stranger. Across all 1,026 sitemap URLs there are
**zero** numeric slugs — the sitemap is entirely readable
(`/portfolio/beabadoobee-pylon/`, `/portfolio/re-edition-aw24/`). But the project grid on
the artist landing page links **exclusively by numeric ID** (`/portfolio/1526/`), and a
numeric URL serves the page and sets its canonical *to itself*:

```html
<link rel="canonical" href=".../artists/erika-kamano/portfolio/1526/"/>
```

So every project has two live, self-canonicalising URLs: the readable one Google is told
about, and the numeric one every internal link actually points at. Internal link equity flows
to URLs absent from the sitemap. **For Reyna: pick one readable slug per project, link to it
internally, and canonicalise to it.**

**Correction 2 — `personal` is a category, not a parallel track.** The earlier pass read
`/personal/` as a sibling section to `/portfolio/`, and made "keep the portfolio/personal
split" a headline recommendation. In fact the second path segment is the **filter category**,
and there are six of them. Frequency across the sitemap:

| Segment | Count |
|---|---|
| `portfolio/` | 634 |
| `stills/` | 279 |
| `shows/` | 46 |
| `motion/` | 37 |
| `personal/` | 2 |
| `reel/` | 1 |

`personal` appears twice in the entire site. These segments map one-to-one onto the
`ALL / STILLS / MOTION / PERSONAL|SHOWS` filter tabs in §6.2 — the category is in the URL,
which is a nice touch (filter state is linkable), but it is a flat tagging system, not a
two-track split. Reyna's equivalent is her five topics (§12.1) — a flat set, one level, no
parallel tracks.

Structure is three levels: **artist → category → project**, plus a dedicated
`/portfolio/overview/` index that is distinct from the artist landing page. The landing page
and the work index are two different things — worth keeping.

### 11.2 Page title convention

```
Erika Kamano | New School Represents
Erika Kamano | Portfolio | Overview | New School Represents
Erika Kamano | Portfolio | Beabadoobee 'Pylon' | New School Represents
```

Pattern: `{Artist} | {Section} | {Project} | {Site}`, pipe-delimited, breadcrumb order, most
specific in the middle. For Reyna: `{Project} | {Section} | Reyna {Surname}`.

Project titles are the **client or publication name** (Rosalía, CR Magazine, Givenchy,
Dazed, Cou Cou Intimates, Tank Air) — not descriptive art titles. In this genre the client
name *is* the credential. Many carry a secondary line with issue or place and year
("Issue 26, Behind The Scenes", "Bangkok, 2025", "London, 2023"), rendered under the title in
the grid.

### 11.3 Bio copy and tone

The reference bio, in full:

> Born in Hawaii, USA, and raised in the North of England by Japanese and English parents,
> Erika Kamano encapsulates her rich cultural background through visual storytelling.
> Celebrating the organic human form often found intertwined with nature Kamano creates
> intimate, ethereal portraits that build visual narratives transcending the viewer from
> reality into the surreal. Raw human connection and empowerment sit at the core of her
> vision, culminating in imagery that reads as visual poetry. Her curiosity, paired with a
> deep love of fashion, has led to sensational staged narratives and collaborations with
> leading fashion houses including Marc Jacobs, Mugler, Givenchy and Fendi.

Tone notes for writing Reyna's:

- Third person, present tense.
- Opens with origin/biography, then the *idea* behind the work, then the client list.
- One paragraph, ~90 words.
- Client names land as a closing sentence, not a bulleted logo wall.

---

## 12. The built site

**Sections 2–11 describe the reference site.** Everything from here describes what
actually shipped, recorded from the built artifact rather than from intentions. Where the
build departs from the reference, the departure is stated with its reason.

Built 2026-08-27. Astro 5 + Tailwind 4, static output, 8 routes.

### 12.1 Routes

```
/                      hero + intro + the five subjects        (chrome: dark)
/work/wrestling/       gallery                                 (chrome: light)
/work/football/
/work/flag-football/
/work/dance-cheer/
/work/graphics/
/about/                                                        (chrome: light)
/contact/                                                      (chrome: light)
```

There is **no per-event level** and no project carousel: the user chose one gallery per
topic, and the delivered filenames carry no event metadata to group by. The reference's
flattened `/portfolio/overview/` has no equivalent — with five topics the home page is
already the index.

`chrome` is a per-route prop on the layout. `dark` means white header text over full-bleed
media; `light` means black on white. It is a prop, not `mix-blend-mode`, exactly as the
reference does it.

### 12.2 The five subjects

| Topic | Slug | Accent | Grid | Frames |
|---|---|---|---|---|
| Wrestling | `wrestling` | `#a73b34` brick | ragged | 20 |
| Football | `football` | `#2f518b` cobalt | ragged | 20 |
| Flag Football | `flag-football` | `#495f39` olive | ragged | 18 |
| Dance & Cheer | `dance-cheer` | `#b83b6c` raspberry | ragged | 12 |
| Graphics | `graphics` | `#be6f40` ember | **uniform 4:5** | 8 |

Defined in `src/data/topics.ts`. The accent is not decoration — it is wayfinding. Hovering
a topic in the overlay floods the panel with its colour, and that colour carries into the
gallery heading, the count rule, the next-topic rule, and the page's focus rings.

The reference cycles its palette round-robin and picks the artist-name colour by WCAG
contrast at runtime. **The build does neither**, and the change is deliberate: with one
photographer and five fixed subjects, a colour that changes on reload is noise, while a
colour bound to a subject is navigation. The contrast reasoning is preserved as a
constraint on the palette rather than a runtime computation — every accent is checked
against the 40% scrim and against white.

`grid` is the one field that diverges per topic. `ragged` preserves each frame's own
aspect ratio; `uniform` crops to 4:5. See 12.4.

### 12.3 Type

One face: **Satoshi**, self-hosted as the **variable** cut (`/fonts/Satoshi-Variable.woff2`,
42 KB, `font-weight: 300 900`). The reference loads five separate families
(`Satoshi-Light` … `Satoshi-Black`) and addresses them by family name; §3 records that as a
legacy quirk, and the build uses real `font-weight` against one variable file instead.

Scale is the reference's, with one change:

```
--size-smaller  11px      --size-display  28 / 40 / 52px
--size-small    14px      --size-hero     44 / 48 / 72px
--size-medium   16px
--size-big      22px      --leading-tight 1.1
--size-huge     38px      --leading-base  1.5
                          --leading-loose 1.7
```

**`--size-hero` starts at 44px, not the reference's 32px.** The reference's hero carries a
one-word name; this one sits above a two-line role, and at 32px the subtitle out-weighed
the wordmark on a phone. The role is correspondingly demoted to 14px uppercase at 0.14em
tracking so the two never read as a pair.

Two global rules depart from the reference on purpose:

- `p { text-align: left }` — the reference justifies body copy, which rivers badly in a
  narrow column (§3). The hero role re-centres itself explicitly, since it is the one place
  that needs it back.
- `strong { font-weight: 900 }` — the Black cut, matching the reference's `Satoshi-Black`.

### 12.4 The two grids

**Ragged** (`columns: 1 / 2 / 3`, gap 15px → 24px) is the photography grid. Frames keep
their own height; nothing is re-cropped. This is not a preference — §12.1 measured 19
distinct aspect ratios in wrestling alone, spanning 0.56 to 1.51, because she crops
per-frame. Any uniform cell would crop her framing a second time.

Note the reading-order consequence: CSS columns fill top-to-bottom per column, so the
curated order (strongest first) runs down column one, not across the top row. Acceptable
for a gallery, which is browsed rather than read.

**Uniform** (`grid`, `aspect-ratio: 4/5`, `object-fit: cover`) is used by `graphics` only.
Designed assets look sloppy ragged, which is the opposite of how photographs behave — and
their fixed 1080×1350 Instagram exports force it anyway. The gallery page states this to the
visitor in a line above the grid rather than leaving it unexplained.

### 12.5 Chrome

Fixed 60px transparent header, never gains a fill: `WORK` (opens the overlay) · `REYNA` ·
`CONTACT`. Contact is in the header at every width, satisfying the product principle that
contact is never more than one action away.

`ABOUT` bottom-left and `INSTAGRAM` bottom-right, in the fixed corner slots the reference
uses for `SUBSCRIBE` / `SPOTLIGHT` — **but only on the dark-chrome home page**. On the light
inner pages they were black text pinned over scrolling content, and went invisible against
the black footer. The footer already carries both links, so nothing was lost.

### 12.6 The work overlay — the signature interaction

One overlay, not the reference's three. `position: fixed`, 100vw × 100dvh,
`translate3d(-100vw,0,0)` closed → `translate3d(0,0,0)` open over `--transition-slow`.

Five names in a single column, alternating `text-align` left/right at ≥992px — the
reference's two-column zig-zag re-read for five items instead of seventeen, with the type
pushed to `clamp(4rem, 8.4vw, 8rem)` so five names fill the panel where 52px left it sparse.

On hover or focus: the panel background becomes that topic's accent, the name goes from
weight 400 to 900, its note fades in, and the topic's cover frame rises in the bottom-right
corner. After a **150ms dwell** the route is prefetched — the reference's trick, kept.

Departures, each forced by a real failure found in review:

- Right-aligned rows reserve `clamp(170px, 17vw, 300px)` of right padding, or a long name
  ("Dance & Cheer") runs straight through the corner frame.
- Unhovered names sit at `opacity: 0.85`, which holds above 4.5:1 on every panel colour.
- Below 992px and on any `hover: none` pointer, the notes are **always visible** — there is
  no hover on touch, so they would otherwise never appear, and without them five names
  leave most of the panel empty.
- Page chrome hides while the overlay is open (`body.is-locked`); the header's Contact link
  otherwise sat underneath the overlay's own Close control.
- The overlay traps focus and closes on Escape. The reference does neither.

### 12.7 The hero shrink

Desktop only, ≥992px:

```js
progress = clamp(scrollY / 420, 0, 1)
target   = width of the .intro column   // measured live, ~765px at 1440
width    = vw - (vw - target) * progress
height   = width / vw * vh              // preserves the viewport ratio
```

At 1440px the frame runs 1440 → 765 across the first 420px of scroll, landing flush with
the prose column beneath it. An earlier build capped `target` at `vw - 60`, which was a 4%
move — technically the interaction, visibly nothing. Below 992px, and under
`prefers-reduced-motion`, it is disabled and the frame stays full-bleed.

The 40% black scrim (`inset: 0; background: #000; opacity: 0.4`) sits over every hero. It is
what makes white type safe over any frame, and it is not optional.

### 12.8 Motion

Two durations, as the reference: `--transition-base: 0.25s ease-in-out` and
`--transition-slow: 0.4s ease-in-out`. Nothing else, no springs, no custom beziers.

A global `prefers-reduced-motion: reduce` block collapses every animation and transition to
0.01ms and disables smooth scrolling. **The reference has no reduced-motion handling at
all** (§10); this is an addition.

### 12.9 Accessibility

Fixed here rather than inherited:

- Body grey is `#767676` (4.54:1 on white), not the reference's `#a1a1a1` (~2.6:1). The
  lighter grey survives only on black, where it is 7.0:1, and is scoped to the footer.
- Visible `:focus-visible` rings in `currentColor` at 2px / 4px offset.
- Skip link to `#main`.
- Overlay: focus trap, Escape to close, `aria-expanded` on the triggers, `aria-hidden` when
  closed.
- 44px minimum touch targets on every header, corner, and overlay control.
- Decorative images carry `alt=""`; gallery frames are numbered in their alt text.

### 12.10 Images

78 frames selected by eye from the 413 unique originals, via numbered contact sheets.
`scripts/ingest.mjs` maps the chosen sheet IDs to source paths and writes 2400px long-edge
mozjpeg masters into `src/assets/work/<topic>/`; Astro emits 340 responsive AVIF/WebP
variants at build. Repo cost is 31 MB of masters against 4.1 GB of originals, which stay at
`D:\Reyna-originals` and are gitignored.

Hero: `object-position: center 30%`, `loading="eager"`, `fetchpriority="high"`.
Grids: first four eager, the rest lazy, `sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 33vw"`.

### 12.11 Known gaps

- **Bio copy is placeholder** and flagged as draft on the page itself. `src/data/site.ts`
  holds the five unsupplied values: surname, email, Instagram handle, region, domain.
  `hasPlaceholders` drives the on-page warnings, so they disappear on their own once real
  values land.
- No favicon, no OG image, no `robots.txt`, no sitemap.
- `astro.config.mjs` still points `site` at a placeholder domain; set it before deploying or
  canonical URLs will be wrong.

---

## 13. Content to collect from Reyna

Work cannot start without:

**Per topic** (dance, graphics, flag football, football, wrestling):

- [ ] **15–25 selected images** — her edit, not a full take. Export-ready, sRGB, long edge
      ≥ 2560px. This selection is the highest-leverage decision on the project (§12.1).
- [ ] One cover image strong enough to carry the topic
- [ ] One nav preview image for the overlay corner (§7) — can be the cover
- [ ] A one- or two-line blurb, if she wants one
- [ ] Whether the topic breaks into individual events/projects, or reads as one body

**Site-wide:**

- [ ] A hero image or video that survives a 40% black scrim with centred white type over it
      (§4). Her work is ~78% portrait (§12.1), so a vertical hero is the natural choice and
      the reference's `object-position: bottom center` suits it — but the hero crops to
      100vw × 100vh, so check it still reads on a wide desktop viewport.
- [ ] **Graphics re-exported at ≥2560px long edge**, if they are to appear at any size above
      a grid thumbnail. The supplied files are 1080px Instagram exports (§12.1).
- [ ] Bio for `/about/`, one paragraph, third person (see §11.3 for tone)
- [ ] Contact email, Instagram handle, where she is based
- [ ] Any teams, schools, or programmes she has shot for — the equivalent of the reference's
      client list
- [ ] Topic ordering, and image ordering within each topic — she will care about this more
      than anything else here
- [ ] Confirmation of the per-topic accent colours (§12.1) or her own five
- [ ] Wordmark: name as plain type, or a supplied logo file
- [ ] Domain name

---

## 14. Open questions

### Settled by the build

| Question | Answer |
|---|---|
| Graphics: peer topic or its own section? | Peer topic, uniform 4:5 grid (user's choice) |
| Do topics break into events? | No — one gallery per topic (user's choice) |
| Where do About and Contact live? | Real pages. Contact in the header at all widths; About in a corner slot on the home page only |
| Five names sparse in the overlay? | Solved with much larger type, `clamp(4rem, 8.4vw, 8rem)` |
| Landing page: hero or straight to topics? | Hero, with the subjects immediately beneath |
| Dark hero / light body, or commit to one? | Kept the split; it is a per-route `chrome` prop |
| Preloader? | Dropped. ~1.6s before first paint is an agency flex, not a working photographer's |

### Still open

1. **Is "Dance & Cheer" one subject or two?** The delivered folder combines them and the
   build follows that. Splitting is a data change in `src/data/topics.ts` plus a re-ingest.
2. **Motion/video work?** None was supplied. The grid and the ingest script assume stills;
   video would need a poster-frame path and a player decision.
3. **Does she need to edit it herself?** If yes, add Sveltia or Decap CMS over the existing
   Markdown/TypeScript rather than moving to a hosted CMS.
4. **Should the wrestling edit be re-cut?** 20 of 235 were selected here. It is the topic
   with the most frames and the lowest hit rate, and it is her call which twenty represent
   her.
5. **Does the ragged grid's column reading order matter to her?** CSS columns fill
   top-to-bottom per column, so the curated order runs down column one rather than across
   the top row (§12.4).

---

## 15. Copy-paste starting tokens

```css
:root {
  /* type scale */
  --size-smaller: 11px;
  --size-small:   14px;
  --size-medium:  16px;
  --size-big:     22px;
  --size-huge:    38px;
  --size-display: 28px;
  --size-hero:    32px;

  --leading-tight: 1.1;
  --leading-base:  1.5;
  --leading-loose: 1.7;

  /* motion */
  --transition-base: 0.25s ease-in-out;
  --transition-slow: 0.4s  ease-in-out;

  /* monochrome */
  --black: #000000;
  --white: #ffffff;
  --grey:  #767676;   /* darkened from the reference's #a1a1a1 for WCAG AA */

  /* accent palette */
  --accent-1: #a73b34;  /* brick red */
  --accent-2: #be6f40;  /* burnt orange */
  --accent-3: #495f39;  /* olive */
  --accent-4: #b83b6c;  /* raspberry */
  --accent-5: #312048;  /* deep purple */
  --accent-6: #2f518b;  /* cobalt */
  --accent-7: #c091ab;  /* dusty pink */

  /* layout */
  --gutter:      11px;
  --gutter-lg:   30px;
  --max-content: 1500px;
  --max-prose:   80ch;
  --header-h:    60px;
  --scrim:       0.4;   /* black overlay opacity on hero media */
}

@media (min-width: 568px) { :root { --size-display: 40px; --size-hero: 48px; } }
@media (min-width: 992px) { :root { --size-display: 52px; --size-hero: 72px; } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Breakpoints: `400 · 568 · 576 · 650 · 768 · 992 · 1200`, with **992** doing the heavy
lifting.

---

*Reference site inspected 2026-08-24. §2–§11 values read from live computed styles, the
shipped JS bundles, and the sitemap — not estimated. §12 onward is proposal.*
