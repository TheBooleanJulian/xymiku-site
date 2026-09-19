import type { DiagnosticStat } from "./types";

// Fixed HUD flavor text (camera gear readouts) — not gallery content, so
// this stays static rather than living in Supabase. Real photography and
// event data comes from lib/data.ts.

export const diagnostics: DiagnosticStat[] = [
  { label: "CAMERA", value: "D850" },
  { label: "SENSOR", value: "45.6 MP" },
  { label: "ARCHIVE", value: "12,847 IMAGES" },
  { label: "EVENTS", value: "083" },
  { label: "YEARS", value: "2021—2026" },
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
