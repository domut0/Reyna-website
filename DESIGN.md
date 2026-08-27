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

Everything in §2–§10 is measured first-hand. Where a number appears (`420px`, `0.4`,
`scale(0.7)`), it is the actual value from the reference implementation, not an estimate.
§11 onward is design strategy for Reyna's site — proposals, marked as such.

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

## 12. Adapting this for Reyna — one photographer, not an agency **[PROPOSED]**

### What to keep as-is

- The **full-bleed hero + centred name + 40% scrim** opening. This is the look.
- **Satoshi**, the 14px-everything body scale, uppercase bold labels.
- The **two-duration motion system** (0.25s / 0.4s, `ease-in-out`, nothing else).
- The **ragged `contain` grid** with `opacity: 0.3` hover — it respects the photos.
- The **centre-mode carousel**, if the per-event project level is used (§12.3).
- The **contrast-checked accent colour** logic, even with a smaller palette.
- The **cursor-following caption** and **hover prefetch** on desktop.
- A **work index separate from the landing page**.

### What to collapse or drop

- **The Artists overlay becomes the topics overlay.** The roster of 17 artists is replaced
  by Reyna's five subjects (§12.1), in the same two-column zig-zag layout. This is the
  cleanest possible mapping — the interaction was already "pick one of N things, each with
  its own colour and preview media," which is exactly what a topic menu is.
- **Split Info into About and Contact.** Reyna wants both as real pages
  (`/about/`, `/contact/`), not one merged Info panel. This departs from the reference,
  which has neither — see §12.2 for how to do it without losing the overlay feel.
- **Consider dropping the preloader.** ~1.6s before first paint is an agency flex; for a
  working photographer's site it is friction. If you keep it, gate it behind a
  `sessionStorage` flag so it only fires once per session.
- **The homepage-as-a-single-video** is a strong move but expensive to author and it costs
  every scrap of SEO text. Safer: hero image/video + the name + a scroll cue, and let the
  artist-landing layout *be* the homepage. Merge `/` and `/artists/[slug]/` into one route.
- **Playground/Spotlight** — drop unless she has a services offering to sell.
- **No blog, no news feed.** Nothing that will sit stale.

---

### 12.1 The five topics

Reyna's work is organised by **subject**, not by client. The five topics:

| Topic | Slug | Source folder | Files supplied |
|---|---|---|---|
| Dance & cheer | `dance-cheer` | `dance-cheer` | 29 |
| Graphics | `graphics` | `graphics` | 8 |
| Flag football | `flag-football` | `flag football` | 85 |
| Football | `football` | `football` | 58 |
| Wrestling | `wrestling` | `wrestling` | 236 |

Note the folder is `dance-cheer`, not `dance` — cheer is bundled in. Confirm whether that is
one topic or two. The `flag football` folder has a space that must become a hyphen in the
slug.

#### Measured from the delivered files, 2026-08-25

416 files, 4.1 GB, at `D:\Reyna-originals\website\`. Every file read successfully. **This
corrects an assumption stated in an earlier draft of this section.**

The earlier draft reasoned from genre that Reyna, shooting sport, would be working
**landscape**, in contrast to the reference site's fashion-editorial portrait crops. That is
wrong. She shoots overwhelmingly **vertical**:

| Topic | Portrait | Landscape |
|---|---|---|
| Football | 81% | 19% |
| Wrestling | 77% | 23% |
| Flag football | 74% | 26% |
| Dance & cheer | 72% | 28% |
| Graphics | 100% | 0% |

Mean aspect ratio sits at 0.81–0.89 (w/h) across every photographic topic. So the reference
site's layout — which was built around portrait imagery — fits her work **better** than the
earlier draft assumed, not worse. Consequences:

1. **Keep `object-position: bottom center` on the hero.** The earlier draft proposed
   switching to `center center` for landscape sports frames. Since the work is portrait and
   figure-centred, the reference's original value is right. Still make it per-image
   overridable (§13), but the default stands.
2. **The ragged `contain` grid is strongly vindicated.** Aspect ratios are not merely mixed,
   they are *scattered* — 19 distinct ratios in wrestling, 16 in football, spanning 0.56
   (very tall, near 9:16) to 1.51 (3:2 landscape). She crops per-frame and idiosyncratically.
   Any uniform grid would have to crop most images a second time, destroying her framing.
   §6.2's `contain` grid is the only honest option here.
3. **Resolution is ample for photography, and a hard problem for graphics.** All four photo
   topics have a minimum long edge of 3038px and a typical 5472px (Canon 45MP, 2:3). Graphics
   are the exception and are covered below.
4. **Editing matters more than layout.** 236 wrestling frames against 8 graphics would make
   wrestling 57% of the site. Twenty strong frames per topic beats two hundred. This is the
   single highest-leverage decision on the whole project, and it is Reyna's — see §14.

**Duplicates:** exactly 3 byte-identical pairs (one each in dance-cheer, football,
wrestling), verified by hash. 16 further files carry a ` (1)` suffix but are distinct
frames — Google Drive naming, not duplication. **Do not dedupe on filename**; it would
delete 16 real images. Two further pairs share a frame number with differing content
(`591A0997` in flag football, `591A0759` in football) — two edits of one shot, Reyna picks.
Effective unique count: **413**.

⚠️ **Graphics cannot be shown large.** All 8 are 1080×1350 or 1080×1349 — Instagram's 4:5
export — plus two smaller outliers at 847×928 and 792×990. Every one is below the 2560px
long edge a retina full-width display needs. They are fine as grid thumbnails and unusable
as hero or full-bleed images. Either Reyna re-exports them from the design source at 2× or
larger, or the graphics topic is designed to present them small and uniform. Given they are
already a fixed 4:5, **a uniform 4:5 grid for graphics is both the correct design call and
the one their resolution forces.**

⚠️ **"Graphics" is a different medium and should be flagged now.** The other four are
photography; graphics are presumably designed assets — gameday posters, social cards, player
features. They differ in that they are usually **fixed-ratio** (1:1 or 4:5 for social),
**contain type**, and are **artefacts rather than moments**. Two options:

- **Keep it as a sixth peer topic** (simplest, and it is how Reyna described it), but give
  the graphics grid a uniform aspect ratio rather than the ragged photo grid — designed
  assets look sloppy when ragged, the opposite of photographs.
- **Split it off** into its own section outside the photography topics, if she wants the
  photo work read as a single body.

Worth asking her directly. It is question 1 in §15.

**Assign one accent colour per topic.** The reference already has the machinery: an overlay
whose background is set per-hovered-item (§7), plus a 7-colour palette (§4). With five
topics that maps one-to-one, and it turns the accent from decoration into wayfinding —
hovering "Wrestling" in the menu paints the panel its colour, and that colour then carries
through the wrestling gallery. Suggested assignment, using the reference's palette:

```
dance          #b83b6c   raspberry
graphics       #be6f40   burnt orange
flag-football  #495f39   olive
football       #2f518b   cobalt
wrestling      #a73b34   brick red
```

Keep the §4 contrast check on top of this: if a topic colour fails against its own hero
image, fall back to the highest-contrast palette member rather than shipping unreadable
type.

One honest caveat: the zig-zag two-column list in §7 was designed for **17** names and looks
generous at that length. **Five** items at 52px in two columns will look sparse. Either bump
the display size well past 52px so five names fill the panel, or drop to a single centred
column. Worth mocking both before committing.

### 12.2 About and Contact as real pages

Reyna wants both, which the reference site has neither of — it hides all of it in one Info
overlay. Her call, and it is a defensible one: a photographer working with schools and
programmes gets found by people who expect a Contact page to exist, and "About" carries SEO
text that an overlay never will.

The thing to preserve is that **the site never feels like it has a navbar**. So:

- Keep the header at three items — but they become `WORK` · logo · `INFO`, where `INFO`
  opens a short overlay containing links to `/about/` and `/contact/` plus the Instagram and
  email. The overlay stays the *gesture*; the pages hold the content.
- Or, if that indirection feels fussy: put `ABOUT` bottom-left and `CONTACT` bottom-right in
  the corner-button slots the reference uses for `SUBSCRIBE` / `SPOTLIGHT` (§7). Same fixed
  positioning, same `scale(1.06)` hover, zero new chrome. **This is the simpler option and
  probably the right one** — it gives both pages a permanent, visible entry point without
  adding a nav bar.

Both pages inherit the light-page treatment from §6.4 (white background, black header text),
with prose at `max-width: 80ch`, `Satoshi-Light` 300.

**Contact page contents:** a single `mailto:`, Instagram, the topics she shoots, and where
she is based. **No contact form** — it is one more thing to maintain and spam-filter, and it
adds a backend to an otherwise static site. If she wants a form later, use a static-form
service rather than building one.

### 12.3 Route map

```
/                             hero + short intro + the five topics
/work/{topic}/                gallery for one topic
/work/{topic}/{project}/      optional: one game, meet, or shoot — carousel (§6.4)
/about/
/contact/
/privacy/
```

Topic slugs are the five in §12.1. Whether the third level exists depends on how Reyna
thinks about her work — as five continuous bodies of images, or as a series of discrete
events. Question 2 in §15.

Note this **drops the reference's flattened `/portfolio/overview/`**. With five topics that
already act as the index, a further "everything at once" page has no job. If she wants one,
it is `/work/` showing all topics' covers.

One readable slug per project, canonical, linked internally — do not repeat the reference's
numeric/readable duplication (§11.1).

Two overlays: **WORK** (the five topics, slides from left) and **INFO** (slides from right).

---

## 13. Stack recommendation **[PROPOSED]**

**Astro + Tailwind, images in the repo, deployed on Netlify or Vercel.**

Ships zero JS by default (a portfolio is almost entirely static), has an excellent built-in
image pipeline (AVIF/WebP/srcset generated at build), and content can live in Markdown files,
so there is no CMS to maintain or pay for.

Note that the reference does need real client JS for the scroll-shrink hero, the cursor
tooltip, and the carousels. Under Astro these are three small island components — everything
else stays static.

Two content collections — topics, and the projects inside them.

`src/content/topics/wrestling.md`:

```yaml
---
title: "Wrestling"
slug: "wrestling"
accent: "#a73b34"                   # §12.1 — carries into the overlay and gallery
cover: "./images/hero.jpg"
coverPosition: "center center"      # per-image; landscape sport needs this (§12.1)
navMedia: "./images/nav-preview.jpg"  # shown in the overlay corner on hover (§7)
blurb: ""                           # one or two lines, shown above the gallery
order: 1
uniformGrid: false                  # true only for `graphics` (§12.1)
---
```

`src/content/projects/2026-state-finals.md` — only if the third level is used:

```yaml
---
title: "State Finals"
slug: "2026-state-finals"
subtitle: "February 2026"           # the secondary line under the grid title
topic: "wrestling"
date: 2026-02-14
cover: "./images/01.jpg"
order: 1                            # manual ordering; she will want control
images:
  - src: "./images/01.jpg"
    alt: ""
---
```

Credits are dropped from the fashion model — sport has no styling/hair/makeup chain. If a
frame needs attribution it is the athlete, team, or event, which belongs in `alt` and the
caption, not a credits block.

If Reyna wants to update the site herself without touching Git, add Sveltia CMS or Decap CMS
on top of the same Markdown files rather than moving to a hosted CMS.

**Alternative:** if she would rather not have a developer involved long-term, a well-chosen
Squarespace or Cargo template gets 80% of this. Worth saying honestly before building
something custom that only one person can maintain.

---

## 14. Content to collect from Reyna

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

## 15. Open questions

1. **Is "graphics" a peer topic or its own section?** It is a different medium from the other
   four and probably wants a uniform-ratio grid rather than the ragged photo one (§12.1).
2. **Do topics break into individual events, or read as one continuous body?** This decides
   whether `/work/{topic}/{project}/` exists at all (§12.3).
3. **Where do About and Contact live in the chrome** — behind the INFO overlay, or as the two
   corner buttons? (§12.2 recommends the corners.)
4. Five names in the zig-zag overlay will look sparse at the reference's 52px. Bigger type,
   or a single centred column? (§12.1)
5. Motion/video work to accommodate? That changes the grid and adds player decisions.
6. Should the landing page open on the hero, or go straight to the five topics?
7. Keep the reference's dark-hero / light-body split, or commit to one? (Do not offer a toggle.)
8. Does she need to edit it herself?
9. Keep the preloader moment, or drop it for speed?

---

## 16. Copy-paste starting tokens

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
