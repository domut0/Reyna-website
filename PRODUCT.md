# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + Tailwind, content in Markdown, deployed static. Chosen by the user from a stack
question offering static HTML/CSS, Astro, or Next.js. Rationale: ships near-zero JS for what
is almost entirely static content, and its build-time image pipeline turns the 4.1 GB of
full-resolution originals into responsive AVIF/WebP without a hand-rolled step. The three
interactive pieces (scroll-shrink hero, topics overlay, filter tabs) become small islands.

## Users

**Primary:** athletic directors, team and programme coordinators, coaches, and parents at
schools and youth sports organisations, evaluating whether to hire Reyna to shoot a season,
a meet, or an event. They arrive from an Instagram link or a word-of-mouth referral, often on
a phone, and are deciding in a few minutes whether her work is good enough and how to reach
her.

**Secondary:** the athletes and families she has photographed, looking for images of
themselves — a repeat-visit audience that drives referrals.

## Product Purpose

A portfolio site that shows Reyna's sports and performance photography well enough to win
bookings, and makes contacting her trivial. Success is a visitor reaching the contact
details having already decided she is good.

Not a print store, not a client image-delivery gallery, not a blog. Those are separate
problems and adding them would dilute the portfolio.

## Positioning

She shoots five distinct subjects — wrestling, football, flag football, dance & cheer, and
graphic design work — rather than specialising in one. A prospective client is usually
looking for exactly one of those, so the site's job is to let them find their sport fast and
judge it on its own, not to blend everything into an undifferentiated feed.

## Operating Context

Work arrives in seasons and events: a meet or a game produces hundreds of frames, of which a
small number are portfolio-grade. The site is a standing shopfront updated occasionally
between seasons, not a feed. Most first visits are on a phone, from Instagram.

## Capabilities and Constraints

- Five topics, in Reyna's order: `football`, `flag-football`, `wrestling`, `dance-cheer`,
  `graphics`.
- One gallery per topic. No per-event or per-game sub-pages — confirmed by the user. The
  supplied filenames carry no event metadata, so event grouping would be manual.
- Static site. No CMS, no backend, no contact form, no auth, no e-commerce.
- **Source images:** 416 files, 4.1 GB, at `D:\Reyna-originals\website\` — outside the repo
  and gitignored. 413 unique. Measured characteristics in DESIGN.md §12.1.
- ~78% of her photography is **portrait** orientation, with scattered aspect ratios
  (19 distinct in wrestling alone, spanning 0.56–1.51). Any layout must not re-crop.
- **Graphics are capped at 1080px** — Instagram exports. They cannot be displayed above
  thumbnail size and are presented in a uniform 4:5 grid, confirmed by the user.
- **Supplied 2026-08-29** and now live in `src/data/site.ts`: email `reynaannj@gmail.com`,
  Instagram `@rjmnzphotos`, based in Manoa, HI and San Ramon, CA, domain `rjmnzphoto.com`
  (she is buying it). The placeholder machinery is gone.
- **Still not supplied:** Reyna's surname. **This is not a fact to invent —** the wordmark
  stays the single word REYNA until she gives one.
- **Confirmed:** "dance-cheer" is one topic. She asked for dance and cheer to stay a single
  section.

## Brand Commitments

- The name renders as **REYNA** — a single-word wordmark, set in pink (`#ff4d9d`) on the
  home page at her request. Single-word because her surname is still not supplied; revisit
  if she wants her full name.
- The site sits on a **black ground throughout**, her call. The per-topic subject colours
  she approved are unchanged.
- The user supplied `newschoolrepresents.com/artists/erika-kamano` as a binding visual
  reference. Its measured design system is recorded in DESIGN.md §2–§10 and is the
  authority for this build.

## Evidence on Hand

- 413 unique photographs across five topics, full-resolution, at `D:\Reyna-originals\`.
  This is a full take, not an edit — 236 wrestling frames against 8 graphics. The user
  delegated selection ("choose whatever images you think look best").
- A complete measured teardown of the reference site in `DESIGN.md`.
- Her own bio, supplied 2026-08-29 and used verbatim on `/about/`, plus a ten-sport
  experience list (football, flag football, cheer, song/dance, Filam, wrestling, men's
  volleyball, basketball, men's lacrosse, track & field). The list is wider than the five
  galleries: she has shot sports the site holds no frames for.
- **No client list, no testimonials, no press, no awards, no pricing.** None of these exist
  yet. Future work must not fabricate them.

## Product Principles

1. **The photograph is the product.** Every layout decision loses to the image. Chrome
   recedes; nothing crops her framing.
2. **One sport, found fast.** A visitor arrives wanting one of five things. Getting them
   into the right gallery beats showing them everything.
3. **Contact must never be more than one action away.** The site exists to produce an email.
4. **Edited, not exhaustive.** A tight selection reads as professional judgement; a full
   take reads as a camera roll.
5. **Phone-first.** Most first views are vertical, on a phone, from Instagram — and so is
   most of the work.

## Accessibility & Inclusion

No standard was specified by the user. Build to WCAG 2.1 AA as the working floor: the
reference site fails it in two places DESIGN.md §10 records (grey body text at ~2.6:1, and
no `prefers-reduced-motion` handling), and both are fixed here rather than inherited.
