export type UplinkImage = {
  id: string;
  src: string;
  alt: string;
  year: number;
  event?: string;
  character?: string;
  cosplayer?: string;
  category: "cosplay" | "event" | "portrait" | "conceptual";
};

export type UplinkEvent = {
  id: string;
  name: string;
  date: string;
  imageCount: number;
  status: "online" | "processing" | "archived";
  cover: string;
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
