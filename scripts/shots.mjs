/**
 * Capture review screenshots into .impeccable/review/.
 *
 * Entrance motion is settled before capture and animations are disabled, so a
 * frame mid-transition never reads as a missing element.
 *
 *   node scripts/shots.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, ".impeccable", "review");
mkdirSync(OUT, { recursive: true });

const BASE =
  process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "http://localhost:4321";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, dpr: 2 },
  // A 1-column portrait gallery at 390px is ~30,000px tall; at 2x DPR the
  // full-page PNG is large enough to stall the encoder. 1x plus a height cap
  // keeps mobile captures legible and finite.
  { name: "mobile", width: 390, height: 844, mobile: true, dpr: 1, cap: 9000 },
];

const ROUTES = [
  ["", "home"],
  ["/work/football/", "gallery-football"],
  ["/work/graphics/", "gallery-graphics"],
  ["/about/", "about"],
  ["/contact/", "contact"],
];

const ONLY = process.argv.find(a => a.startsWith("--vp="))?.split("=")[1];
for (const vp of VIEWPORTS.filter(v => !ONLY || v.name === ONLY)) {
  // One browser per viewport. Reusing a single browser across contexts hangs
  // on teardown here (the desktop context holds a large screenshot buffer and
  // an open overlay), and the second context never starts.
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    reducedMotion: "reduce", // settle entrance motion before capture
  });
  const page = await ctx.newPage();

  for (const [path, label] of ROUTES) {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 30000 });

    // A full-page shot does NOT trigger `loading="lazy"` images below the
    // fold — they render as empty boxes and read as missing content. Walk the
    // page down to force them in, then return to the top.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
        await page.evaluate(async () => {
      await Promise.all(
        Array.from(document.images).map((img) =>
          img.complete ? Promise.resolve() : img.decode().catch(() => {}),
        ),
      );
    });
    await page.waitForTimeout(500);

    const file = label === "home" ? `${vp.name}.png` : `${vp.name}-${label}.png`;
    const h = await page.evaluate(() => document.body.scrollHeight);
    const shot =
      vp.cap && h > vp.cap
        ? { clip: { x: 0, y: 0, width: vp.width, height: vp.cap } }
        : { fullPage: true };
    await page.screenshot({ path: join(OUT, file), ...shot });
    console.log(`${file}  (page ${h}px${vp.cap && h > vp.cap ? `, capped ${vp.cap}` : ""})`);
  }

  // The signature interaction only exists in an opened state, so capture it.
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
  // Two elements open the overlay (header button + hero action), so scope to
  // the header's — a bare selector trips Playwright's strict mode.
  await page.locator(".site-header [data-open-work]").click();
  await page.waitForTimeout(600);
  if (!vp.mobile) {
    await page.hover(".name[data-i='1']");
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: join(OUT, `${vp.name}-overlay.png`) });
  console.log(`${vp.name}-overlay.png`);

  // Chromium teardown hangs on this platform; the process exit reaps it, which
  // is why each viewport runs as its own invocation (see --vp).
  await Promise.race([browser.close(), new Promise(r => setTimeout(r, 3000))]);
}

console.log(`\nwrote to ${OUT}`);
