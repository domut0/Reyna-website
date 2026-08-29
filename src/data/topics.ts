/* Five subjects. Accent assignment follows DESIGN.md §12.1 — one palette
   member each, so the colour is wayfinding rather than decoration: hovering a
   topic paints the overlay its colour, and that colour carries into the
   gallery, the scroll indicator, and the page's focus rings.

   Two values per topic, because the page ground is black:
     `accent` — the deep hue, used only as a *surface* (the overlay flood, the
                hover wash over a frame). White type sits on it at 4.8:1 or
                better.
     `tint`   — the same hue lifted for use as *ink* on black: headings, rules,
                focus rings. Every one clears 5:1 on #000. The deep values fail
                there (cobalt is 2.7:1), which is why there are two.

   `grid` is the one place graphics diverges. The photography is shot at wildly
   scattered aspect ratios (19 distinct in wrestling, 0.56–1.51) so it runs a
   ragged `contain` grid that never re-crops her framing. The graphics are
   fixed 4:5 Instagram exports capped at 1080px, so they run uniform — designed
   assets look sloppy ragged, which is the opposite of how photographs behave. */

export type TopicId =
  | "football"
  | "flag-football"
  | "wrestling"
  | "dance-cheer"
  | "graphics";

export interface Topic {
  id: TopicId;
  title: string;
  /** Deep hue — surfaces only. White type on it stays legible. */
  accent: string;
  /** Lifted hue — ink on the black ground. */
  tint: string;
  /** `ragged` preserves each frame's own ratio; `uniform` crops to 4:5. */
  grid: "ragged" | "uniform";
  order: number;
}

export const topics: Topic[] = [
  {
    id: "football",
    title: "Football",
    accent: "#2f518b",
    tint: "#6a8fd8",
    grid: "ragged",
    order: 1,
  },
  {
    id: "flag-football",
    title: "Flag Football",
    accent: "#495f39",
    tint: "#82a56b",
    grid: "ragged",
    order: 2,
  },
  {
    id: "wrestling",
    title: "Wrestling",
    accent: "#a73b34",
    tint: "#cf5a50",
    grid: "ragged",
    order: 3,
  },
  {
    id: "dance-cheer",
    title: "Dance & Cheer",
    accent: "#b83b6c",
    tint: "#de5f8f",
    grid: "ragged",
    order: 4,
  },
  {
    id: "graphics",
    title: "Graphics",
    accent: "#a85f34",
    tint: "#cf8b56",
    grid: "uniform",
    order: 5,
  },
];

export const getTopic = (id: string): Topic | undefined =>
  topics.find((t) => t.id === id);

/** Where she has shot. Replaces the old "Subjects" list on the about page:
 *  the galleries are five, the experience is wider than five. */
export const experience = [
  "Football",
  "Flag Football",
  "Cheer",
  "Song/Dance",
  "Filam (Filipino American Student Association)",
  "Wrestling",
  "Men's Volleyball",
  "Basketball",
  "Men's Lacrosse",
  "Track & Field",
] as const;
