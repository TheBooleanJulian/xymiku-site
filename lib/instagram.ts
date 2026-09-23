export type InstagramPost = {
  id: string;
  url: string;
  image: string;
  caption: string;
  publishedAt: string | null;
};

// Primary source: Meta Graph API (Instagram Business/Creator account).
// Not set up yet — INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_BUSINESS_ACCOUNT_ID
// are unset in production, so getInstagramFeed() falls through to the RSS
// feed below until this is configured.
const META_GRAPH_VERSION = "v21.0";
const META_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const META_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

type MetaMediaItem = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

type MetaMediaResponse = {
  data?: MetaMediaItem[];
  error?: { message: string };
};

async function getMetaFeed(): Promise<InstagramPost[]> {
  if (!META_ACCESS_TOKEN || !META_BUSINESS_ACCOUNT_ID) return [];

  const url =
    `https://graph.facebook.com/${META_GRAPH_VERSION}/${META_BUSINESS_ACCOUNT_ID}/media` +
    `?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp` +
    `&access_token=${META_ACCESS_TOKEN}`;

  const res = await fetch(url);
  if (!res.ok) return [];
  const data = (await res.json()) as MetaMediaResponse;
  if (data.error) return [];

  return (data.data ?? [])
    .filter((item) => item.media_type !== "VIDEO")
    .map((item) => ({
      id: item.id,
      url: item.permalink,
      image: item.media_type === "VIDEO" ? (item.thumbnail_url ?? "") : (item.media_url ?? ""),
      caption: (item.caption ?? "").trim(),
      publishedAt: item.timestamp,
    }))
    .filter((post) => Boolean(post.image));
}

// Fallback source: JSON Feed (v1.1) for instagram.com/xymiku.39, generated
// by RSS.app since Instagram has no native feed. This tier's feed caps at 6
// items — getting more requires upgrading the RSS.app plan for this feed.
//
// Fetched only at build time (static export): the photo URLs are signed
// Instagram CDN links that expire after a few days, so this section only
// stays fresh across redeploys, not indefinitely. See the scheduled-rebuild
// setup (README) for keeping it current automatically.
const RSS_FEED_URL = "https://rss.app/feeds/v1.1/9NH3qtc3KAQCoiuj.json";

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

async function getRssFeed(): Promise<InstagramPost[]> {
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
}

export async function getInstagramFeed(): Promise<InstagramPost[]> {
  try {
    const metaPosts = await getMetaFeed();
    if (metaPosts.length > 0) return metaPosts;
  } catch {
    // fall through to RSS
  }

  try {
    return await getRssFeed();
  } catch {
    return [];
  }
}
