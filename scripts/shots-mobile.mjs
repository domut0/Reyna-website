/**
 * Mobile review captures. Kept separate from shots.mjs because Chromium
 * teardown hangs on this machine when one process drives two viewports —
 * a fresh process per viewport is the reliable path.
 *
 *   node scripts/shots-mobile.mjs [baseUrl]
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
const W = 390;
const CAP = 9000; // a 1-col portrait gallery is ~10.5k tall; cap keeps PNGs finite

const ROUTES = [
  ["", "mobile.png"],
  ["/work/football/", "mobile-gallery-football.png"],
  ["/work/graphics/", "mobile-gallery-graphics.png"],
  ["/about/", "mobile-about.png"],
  ["/contact/", "mobile-contact.png"],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));

for (const [path, file] of ROUTES) {
  await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 30000 });
  // Walk the page so `loading="lazy"` frames decode before the shot.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
  const h = await page.evaluate(() => document.body.scrollHeight);
  // `clip` alone is viewport-relative and silently truncates to 844px, which
  // produces a file that looks valid and shows none of the page. fullPage
  // must be set; clip then applies to the document.
  await page.screenshot({
    path: join(OUT, file),
    fullPage: true,
    ...(h > CAP ? { clip: { x: 0, y: 0, width: W, height: CAP } } : {}),
  });
  console.log(`${file}  (page ${h}px, captured ${Math.min(h, CAP)}px)`);
}

// The overlay only exists in an opened state.
await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
await page.locator(".site-header [data-open-work]").click({ timeout: 10000 });
await page.waitForTimeout(700);
await page.screenshot({ path: join(OUT, "mobile-overlay.png") });
console.log("mobile-overlay.png");

console.log("DONE");
process.exit(0); // teardown hangs here; exiting reaps the browser
