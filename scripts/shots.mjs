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

const BASE = process.argv[2] ?? "http://localhost:4321";

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

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    reducedMotion: "reduce", // settle entrance motion before capture
  });
  const page = await ctx.newPage();

  for (const [path, label] of ROUTES) {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });

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
    await page.waitForLoadState("networkidle");
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
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.click("[data-open-work]");
  await page.waitForTimeout(500);
  if (!vp.mobile) {
    await page.hover(".name[data-i='1']");
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: join(OUT, `${vp.name}-overlay.png`) });
  console.log(`${vp.name}-overlay.png`);

  await ctx.close();
}

await browser.close();
console.log(`\nwrote to ${OUT}`);
