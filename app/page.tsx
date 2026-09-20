import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PhotoDelivery } from "@/components/PhotoDelivery";
import { UplinkTimeline } from "@/components/UplinkTimeline";
import { CharacterIndex } from "@/components/CharacterIndex";
import { FeaturedCosplay } from "@/components/FeaturedCosplay";
import { SectionDivider } from "@/components/SectionDivider";
import { InstagramFeed } from "@/components/InstagramFeed";
import { SignalDivider } from "@/components/SignalDivider";
import { Footer } from "@/components/Footer";
import {
  getRecentEvents,
  getTimelineImages,
  getCharacterIndex,
  getFeaturedCosplay,
} from "@/lib/data";
import { getInstagramFeed } from "@/lib/instagram";

export default async function Home() {
  const [events, timelineImages, characters, featuredCosplay, instagramPosts] = await Promise.all([
    getRecentEvents(),
    getTimelineImages(),
    getCharacterIndex(),
    getFeaturedCosplay(),
    getInstagramFeed(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <InstagramFeed posts={instagramPosts} />
        <PhotoDelivery events={events} />
        <UplinkTimeline images={timelineImages} />
        <CharacterIndex characters={characters} />
        <FeaturedCosplay images={featuredCosplay} />
        <SectionDivider
          headline="UPLINK SYNTHESIS COMPLETE //"
          highlight="2021—2026"
          subtext="FIVE YEARS OF SIGNAL, ORGANIZED BY XYMIKU.39"
        />
      </main>
      <SignalDivider />
      <Footer />
    </>
  );
}
