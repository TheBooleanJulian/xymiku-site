import type {
  ArchiveEvent,
  ArchiveImage,
  CharacterCategory,
  DiagnosticStat,
} from "./types";

// All `src` values below are mock placeholders (rendered by <ArchivePlaceholder />)
// until real photography is wired up to Supabase / R2 / Pixieset / a CDN.

export const diagnostics: DiagnosticStat[] = [
  { label: "CAMERA", value: "D850" },
  { label: "SENSOR", value: "45.6 MP" },
  { label: "ARCHIVE", value: "12,847 IMAGES" },
  { label: "EVENTS", value: "083" },
  { label: "YEARS", value: "2016—2026" },
  { label: "SIGNAL", value: "39" },
];

export const visualSignal = [
  { label: "EXPOSURE", value: "+0.39" },
  { label: "CONTRAST", value: "+0.39" },
  { label: "SATURATION", value: "+0.39" },
  { label: "SHARPNESS", value: "+0.39" },
];

export const captureMeta = [
  { label: "LENS", value: "35mm" },
  { label: "APERTURE", value: "f/1.8" },
  { label: "ISO", value: "800" },
  { label: "SHUTTER", value: "1/250" },
];

export const recentEvents: ArchiveEvent[] = [
  {
    id: "afa-2026",
    name: "AFA 2026",
    date: "12 SEP 2026",
    imageCount: 1248,
    status: "online",
    cover: "/mock/afa-2026",
  },
  {
    id: "cosfest-2026",
    name: "COSFEST 2026",
    date: "06 SEP 2026",
    imageCount: 892,
    status: "online",
    cover: "/mock/cosfest-2026",
  },
  {
    id: "miku-39-2026",
    name: "MIKU-19 BIRTHDAY",
    date: "30 AUG 2026",
    imageCount: 614,
    status: "processing",
    cover: "/mock/miku-39-2026",
  },
];

export const characterIndex: CharacterCategory[] = [
  { id: "hatsune-miku", name: "HATSUNE MIKU", designation: "V01", count: 4213, cover: "/mock/char-miku", href: "#" },
  { id: "snow-miku", name: "SNOW MIKU", designation: "SM", count: 891, cover: "/mock/char-snow", href: "#" },
  { id: "racing-miku", name: "RACING MIKU", designation: "RM", count: 1204, cover: "/mock/char-racing", href: "#" },
  { id: "magical-mirai", name: "MAGICAL MIRAI", designation: "MM", count: 733, cover: "/mock/char-mirai", href: "#" },
  { id: "sakura-miku", name: "SAKURA MIKU", designation: "SK", count: 512, cover: "/mock/char-sakura", href: "#" },
  { id: "project-sekai", name: "PROJECT SEKAI", designation: "PS", count: 967, cover: "/mock/char-sekai", href: "#" },
  { id: "original", name: "ORIGINAL / FAN DESIGNS", designation: "OG", count: 388, cover: "/mock/char-original", href: "#" },
];

function img(
  id: string,
  year: number,
  category: ArchiveImage["category"],
  extra: Partial<ArchiveImage> = {}
): ArchiveImage {
  return {
    id,
    src: `/mock/${id}`,
    alt: extra.alt ?? `${extra.character ?? "Hatsune Miku"} cosplay, ${year}`,
    year,
    category,
    ...extra,
  };
}

export const timelineImages: ArchiveImage[] = [
  img("tl-2016-a", 2016, "cosplay", { character: "Hatsune Miku", event: "AFA 2016", cosplayer: "Xymiku.39" }),
  img("tl-2017-a", 2017, "event", { character: "Snow Miku", event: "Cosfest 2017", cosplayer: "Xymiku.39" }),
  img("tl-2018-a", 2018, "cosplay", { character: "Racing Miku", event: "AFA 2018", cosplayer: "Xymiku.39" }),
  img("tl-2019-a", 2019, "portrait", { character: "Hatsune Miku", event: "Magical Mirai 2019", cosplayer: "Xymiku.39" }),
  img("tl-2020-a", 2020, "conceptual", { character: "Hatsune Miku", event: "Studio Session", cosplayer: "Xymiku.39" }),
  img("tl-2021-a", 2021, "cosplay", { character: "Sakura Miku", event: "Cosfest 2021", cosplayer: "Xymiku.39" }),
  img("tl-2022-a", 2022, "event", { character: "Project Sekai", event: "AFA 2022", cosplayer: "Xymiku.39" }),
  img("tl-2023-a", 2023, "cosplay", { character: "Hatsune Miku", event: "AFA 2023", cosplayer: "Xymiku.39" }),
  img("tl-2024-a", 2024, "portrait", { character: "Snow Miku", event: "Cosfest 2024", cosplayer: "Xymiku.39" }),
  img("tl-2025-a", 2025, "cosplay", { character: "Racing Miku", event: "AFA 2025", cosplayer: "Xymiku.39" }),
  img("tl-2026-a", 2026, "event", { character: "Hatsune Miku", event: "MIKU-19", cosplayer: "Xymiku.39" }),
];

export const featuredCosplay: ArchiveImage[] = [
  img("feat-01", 2026, "cosplay", { character: "Hatsune Miku", event: "MIKU-19", cosplayer: "Xymiku.39" }),
  img("feat-02", 2025, "portrait", { character: "Racing Miku", event: "AFA 2025", cosplayer: "Xymiku.39" }),
  img("feat-03", 2024, "cosplay", { character: "Snow Miku", event: "Cosfest 2024", cosplayer: "Xymiku.39" }),
  img("feat-04", 2023, "event", { character: "Project Sekai", event: "AFA 2023", cosplayer: "Xymiku.39" }),
  img("feat-05", 2022, "conceptual", { character: "Hatsune Miku", event: "Studio Session", cosplayer: "Xymiku.39" }),
  img("feat-06", 2026, "cosplay", { character: "Sakura Miku", event: "MIKU-19", cosplayer: "Xymiku.39" }),
];

export const portfolioWork: Record<"COSPLAY" | "EVENT" | "PORTRAIT" | "CONCEPTUAL", ArchiveImage[]> = {
  COSPLAY: [img("port-cos-01", 2026, "cosplay", { character: "Hatsune Miku" }), img("port-cos-02", 2024, "cosplay", { character: "Snow Miku" })],
  EVENT: [img("port-evt-01", 2025, "event", { event: "AFA 2025" }), img("port-evt-02", 2023, "event", { event: "Cosfest 2023" })],
  PORTRAIT: [img("port-por-01", 2024, "portrait", { character: "Racing Miku" }), img("port-por-02", 2022, "portrait", { character: "Hatsune Miku" })],
  CONCEPTUAL: [img("port-con-01", 2021, "conceptual"), img("port-con-02", 2019, "conceptual")],
};
