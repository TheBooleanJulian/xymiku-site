export type InstagramPost = {
  id: string;
  url: string;
  image: string;
  caption: string;
  publishedAt: string | null;
};

// Two sources, tried in order, both fetched only at build time (static
// export — there's no server to hit these per-request):
//
// 1. Instagram's own Graph API ("Instagram API with Instagram Login"),
//    used when INSTAGRAM_ACCESS_TOKEN is set. No RSS.app item cap — can
//    pull up to GRAPH_LIMIT posts. The token expires ~60 days from
//    generation and needs manually regenerating (Meta App Dashboard ->
//    Instagram -> API setup -> Generate token) — see README Maintenance.
// 2. The RSS.app JSON feed, used whenever there's no token or the Graph
//    API call fails for any reason (bad/expired token, rate limit, etc).
//    Capped at 6 items on this RSS.app plan; its photo URLs are signed
//    Instagram CDN links that expire in a few days (see README).

const GRAPH_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const GRAPH_LIMIT = 30;

const RSS_FEED_URL = "https://rss.app/feeds/v1.1/9NH3qtc3KAQCoiuj.json";

type GraphMediaItem = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

type GraphResponse = {
  data?: GraphMediaItem[];
};

async function getFromGraphApi(): Promise<InstagramPost[] | null> {
  if (!GRAPH_ACCESS_TOKEN) return null;

  try {
    const url = new URL("https://graph.instagram.com/me/media");
    url.searchParams.set(
      "fields",
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
    );
    url.searchParams.set("limit", String(GRAPH_LIMIT));
    url.searchParams.set("access_token", GRAPH_ACCESS_TOKEN);

    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = (await res.json()) as GraphResponse;
    if (!data.data) return null;

    // A VIDEO's media_url points at the video file itself, not a still —
    // thumbnail_url is the frame to show. Skip any video missing one
    // rather than rendering a broken <img>.
    return data.data
      .filter((item) => item.media_type !== "VIDEO" || item.thumbnail_url)
      .map((item) => ({
        id: item.id,
        url: item.permalink,
        image: item.media_type === "VIDEO" ? item.thumbnail_url! : item.media_url,
        caption: (item.caption ?? "").trim(),
        publishedAt: item.timestamp,
      }));
  } catch {
    return null;
  }
}

type JsonFeedItem = {
  id: string;
  url: string;
  title?: string;
  content_text?: string;
  image?: string;
  date_published?: string;
};

type JsonFeed = {
  items?: JsonFeedItem[];
};

async function getFromRssFallback(): Promise<InstagramPost[]> {
  try {
    const res = await fetch(RSS_FEED_URL);
    if (!res.ok) return [];
    const data = (await res.json()) as JsonFeed;

    return (data.items ?? [])
      .filter((item): item is JsonFeedItem & { image: string } => Boolean(item.image))
      .map((item) => ({
        id: item.id,
        url: item.url,
        image: item.image,
        caption: (item.content_text ?? item.title ?? "").trim(),
        publishedAt: item.date_published ?? null,
      }));
  } catch {
    return [];
  }
}

export async function getInstagramFeed(): Promise<InstagramPost[]> {
  const graphPosts = await getFromGraphApi();
  if (graphPosts && graphPosts.length > 0) return graphPosts;
  return getFromRssFallback();
}
