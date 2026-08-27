/* Five subjects. Accent assignment follows DESIGN.md §12.1 — one palette
   member each, so the colour is wayfinding rather than decoration: hovering a
   topic paints the overlay its colour, and that colour carries into the
   gallery, the scroll indicator, and the page's focus rings.

   `grid` is the one place graphics diverges. The photography is shot at wildly
   scattered aspect ratios (19 distinct in wrestling, 0.56–1.51) so it runs a
   ragged `contain` grid that never re-crops her framing. The graphics are
   fixed 4:5 Instagram exports capped at 1080px, so they run uniform — designed
   assets look sloppy ragged, which is the opposite of how photographs behave. */

export type TopicId =
  | "wrestling"
  | "football"
  | "flag-football"
  | "dance-cheer"
  | "graphics";

export interface Topic {
  id: TopicId;
  title: string;
  /** Secondary line under the title in the overlay and on the gallery page. */
  note: string;
  accent: string;
  /** `ragged` preserves each frame's own ratio; `uniform` crops to 4:5. */
  grid: "ragged" | "uniform";
  order: number;
}

export const topics: Topic[] = [
  {
    id: "wrestling",
    title: "Wrestling",
    note: "Mats, corners, and the six seconds that decide it",
    accent: "#a73b34",
    grid: "ragged",
    order: 1,
  },
  {
    id: "football",
    title: "Football",
    note: "Friday nights under the lights",
    accent: "#2f518b",
    grid: "ragged",
    order: 2,
  },
  {
    id: "flag-football",
    title: "Flag Football",
    note: "Open field, full daylight",
    accent: "#495f39",
    grid: "ragged",
    order: 3,
  },
  {
    id: "dance-cheer",
    title: "Dance & Cheer",
    note: "Stage light, held mid-air",
    accent: "#b83b6c",
    grid: "ragged",
    order: 4,
  },
  {
    id: "graphics",
    title: "Graphics",
    note: "Gameday design and social features",
    accent: "#be6f40",
    grid: "uniform",
    order: 5,
  },
];

export const getTopic = (id: string): Topic | undefined =>
  topics.find((t) => t.id === id);
