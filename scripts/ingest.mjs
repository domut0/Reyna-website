/**
 * Ingest — pulls the selected frames out of the 4.1 GB original take and
 * writes web-scale masters into src/assets/work/<topic>/.
 *
 * Selection was made by eye from numbered contact sheets covering all 413
 * unique images; the IDs below are those sheet labels. Order is display order,
 * strongest first — the first entry of each topic is that topic's cover.
 *
 * Originals stay at D:\Reyna-originals (gitignored, never in the repo). This
 * writes 2400px long-edge JPEGs; Astro's pipeline takes it from there and
 * emits the responsive AVIF/WebP variants at build time.
 *
 *   node scripts/ingest.mjs [--dry]
 */
import { readFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
// In the repo, so a re-ingest never depends on a session scratch directory.
const INDEX = join(__dirname, "source-index.tsv");
const OUT = join(ROOT, "src", "assets", "work");
const COVER_EDGE = 2400;
const LONG_EDGE = 2000;
const DRY = process.argv.includes("--dry");

/** Display order per topic, in the topic order the site uses. First = cover.
 *  The four covers below (F036, G013, W096, D021) are the frames Reyna picked
 *  herself; they were already in the take, so choosing them was a reorder, not
 *  an ingest. Graphics keeps its original lead — no cover was supplied for it. */
const SELECTION = {
  football: [
    "F036", "F028", "F002", "F014", "F044", "F005", "F050", "F011",
    "F042", "F029", "F052", "F001", "F026", "F053", "F008", "F043",
    "F020", "F030", "F055", "F004",
  ],
  "flag-football": [
    "G013", "G023", "G042", "G051", "G043", "G052", "G021", "G020",
    "G060", "G026", "G001", "G065", "G025", "G031", "G006", "G078",
    "G014", "G079",
  ],
  wrestling: [
    "W096", "W003", "W013", "W007", "W021", "W043", "W008", "W060",
    "W032", "W012", "W091", "W029", "W124", "W055", "W037", "W121",
    "W018", "W068", "W160", "W174",
  ],
  "dance-cheer": [
    "D021", "D013", "D020", "D003", "D024", "D014", "D004", "D023",
    "D025", "D016", "D005", "D026",
  ],
  graphics: [
    "X002", "X001", "X006", "X003", "X007", "X005", "X004", "X008",
  ],
};

/** The index was written from Git Bash, so paths look like `/d/Reyna-...`.
 *  Node on Windows needs `D:/Reyna-...`. */
const toWin = (p) => p.replace(/^\/([a-z])\//i, (_, d) => `${d.toUpperCase()}:/`);

// id -> absolute source path
const lookup = new Map(
  readFileSync(INDEX, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [id, path] = line.split("\t");
      return [id, toWin(path)];
    }),
);

/** Sheet-label prefix per topic, matching how source-index.tsv was written. */
const PREFIX = {
  football: "F",
  "flag-football": "G",
  wrestling: "W",
  "dance-cheer": "D",
  graphics: "X",
};

/** Reyna's running order first, then every remaining frame for that topic in
 *  sheet order. Nothing is dropped — the whole take ships, but her covers and
 *  her sequence still decide what a visitor meets first. */
const orderFor = (topic) => {
  const lead = SELECTION[topic] ?? [];
  const seen = new Set(lead);
  const rest = [...lookup.keys()].filter(
    (id) => id.startsWith(PREFIX[topic]) && !seen.has(id),
  );
  return [...lead, ...rest];
};

let written = 0;
const missing = [];

for (const topic of Object.keys(PREFIX)) {
  const ids = orderFor(topic);
  const dir = join(OUT, topic);
  if (!DRY) {
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
  }

  let n = 0;
  for (const [i, id] of ids.entries()) {
    const src = lookup.get(id);
    if (!src) {
      missing.push(id);
      continue;
    }
    // Zero-padded to 3 so filename sort still equals display order past 99.
    const name = `${topic}-${String(i + 1).padStart(3, "0")}.jpg`;
    n++;
    if (DRY) continue;

    const edge = i === 0 ? COVER_EDGE : LONG_EDGE;
    const img = sharp(src, { failOn: "none" }).rotate(); // honour EXIF orientation
    const { width = 0, height = 0 } = await img.metadata();
    const resize =
      width >= height
        ? { width: Math.min(width, edge) }
        : { height: Math.min(height, edge) };

    await img
      .resize({ ...resize, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(join(dir, name));
    written++;
  }
  console.log(
    `${topic.padEnd(14)} ${String(n).padStart(3)} frames  (${(SELECTION[topic] ?? []).length} lead the order)`,
  );
}

if (missing.length) {
  console.error(`\nMISSING IDS (not found in index): ${missing.join(", ")}`);
  process.exitCode = 1;
}
console.log(`\n${DRY ? "[dry run] " : ""}wrote ${written} files to ${OUT}`);
