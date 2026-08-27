import type { ImageMetadata } from "astro";
import type { TopicId } from "../data/topics";

/** Every ingested master, keyed by path. Eager so covers resolve at build. */
const files = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/work/**/*.jpg",
  { eager: true },
);

export interface WorkImage {
  src: ImageMetadata;
  /** Portrait frames get more grid height; the ratio drives the ragged grid. */
  ratio: number;
  isPortrait: boolean;
}

const byTopic = new Map<string, WorkImage[]>();

for (const [path, mod] of Object.entries(files)) {
  const topic = path.split("/").at(-2)!;
  const src = mod.default;
  const list = byTopic.get(topic) ?? [];
  list.push({
    src,
    ratio: src.width / src.height,
    isPortrait: src.height > src.width,
  });
  byTopic.set(topic, list);
}

// Filenames are zero-padded in display order, so a plain sort is the order.
for (const list of byTopic.values()) {
  list.sort((a, b) => a.src.src.localeCompare(b.src.src));
}

export const imagesFor = (topic: TopicId): WorkImage[] =>
  byTopic.get(topic) ?? [];

export const coverFor = (topic: TopicId): WorkImage | undefined =>
  imagesFor(topic)[0];
