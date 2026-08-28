import type { APIRoute } from "astro";

/** Served rather than static so the Sitemap line carries the real origin —
 *  the spec wants an absolute URL, and the domain is only known at build. */
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap-index.xml", site)}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
