/* ---------------------------------------------------------------------------
   PLACEHOLDERS — everything in this block is unconfirmed and must be replaced
   before launch. PRODUCT.md records these as not supplied; nothing here may be
   treated as fact. Replacing these five values is the whole handoff.
--------------------------------------------------------------------------- */
export const PLACEHOLDER = {
  /** Her surname. Wordmark currently renders the single word "REYNA". */
  surname: null as string | null,
  /** TODO: real address. `mailto:` targets across the site read from here. */
  email: "hello@example.com",
  /** TODO: real handle, without the @. */
  instagram: "reyna",
  /** TODO: e.g. "Central Ohio" — used in the contact page and meta description. */
  region: null as string | null,
  /** TODO: real domain, also set `site` in astro.config.mjs. */
  domain: "reyna.example.com",
} as const;

export const site = {
  wordmark: "REYNA",
  name: PLACEHOLDER.surname ? `Reyna ${PLACEHOLDER.surname}` : "Reyna",
  role: "Sports & Performance Photographer",
  email: PLACEHOLDER.email,
  instagram: PLACEHOLDER.instagram,
  instagramUrl: `https://instagram.com/${PLACEHOLDER.instagram}`,
  region: PLACEHOLDER.region,
  description:
    "Sports and performance photography — wrestling, football, flag football, dance and cheer.",
} as const;

/** True when any launch-blocking placeholder is still unreplaced. */
export const hasPlaceholders =
  PLACEHOLDER.email.includes("example.com") ||
  PLACEHOLDER.instagram === "reyna" ||
  PLACEHOLDER.surname === null;
