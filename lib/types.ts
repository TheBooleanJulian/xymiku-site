export type UplinkImage = {
  id: string;
  src: string;
  alt: string;
  year: number;
  event?: string;
  character?: string;
  cosplayer?: string;
  category: "cosplay" | "event" | "portrait" | "conceptual";
  // Crop bias when this image is shown in a fixed-aspect box (object-cover).
  objectPosition?: "top" | "center" | "bottom";
};

export type UplinkEvent = {
  id: string;
  name: string;
  date: string;
  imageCount: number;
  status: "online" | "processing" | "archived";
  cover: string;
  coverPosition: "top" | "center" | "bottom";
  galleryUrl: string;
};

export type CharacterCategory = {
  id: string;
  name: string;
  designation: string;
  count: number;
  cover: string;
  href: string;
};

export type DiagnosticStat = {
  label: string;
  value: string;
};

export type TimelineEntry = {
  year: number;
  images: UplinkImage[];
};
