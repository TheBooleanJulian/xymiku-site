import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SystemDiagnostics } from "@/components/SystemDiagnostics";
import { PhotoDelivery } from "@/components/PhotoDelivery";
import { UplinkTimeline } from "@/components/UplinkTimeline";
import { CharacterIndex } from "@/components/CharacterIndex";
import { FeaturedCosplay } from "@/components/FeaturedCosplay";
import { Portfolio } from "@/components/Portfolio";
import { VisualSynthesis } from "@/components/VisualSynthesis";
import { SectionDivider } from "@/components/SectionDivider";
import { MikuSignature } from "@/components/MikuSignature";
import { InstagramFeed } from "@/components/InstagramFeed";
import { SignalDivider } from "@/components/SignalDivider";
import { Footer } from "@/components/Footer";
import {
  getRecentEvents,
  getTimelineImages,
  getCharacterIndex,
  getFeaturedCosplay,
  getPortfolioWork,
} from "@/lib/data";

export default async function Home() {
  const [events, timelineImages, characters, featuredCosplay, portfolioWork] = await Promise.all([
    getRecentEvents(),
    getTimelineImages(),
    getCharacterIndex(),
    getFeaturedCosplay(),
    getPortfolioWork(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <SystemDiagnostics />
        <PhotoDelivery events={events} />
        <UplinkTimeline images={timelineImages} />
        <CharacterIndex characters={characters} />
        <FeaturedCosplay images={featuredCosplay} />
        <Portfolio work={portfolioWork} />
        <VisualSynthesis />
        <SectionDivider
          headline="UPLINK SYNTHESIS COMPLETE //"
          highlight="2021—2026"
          subtext="FIVE YEARS OF SIGNAL, ORGANIZED BY XYMIKU.39"
        />
        <MikuSignature />
        <InstagramFeed />
      </main>
      <SignalDivider />
      <Footer />
    </>
  );
}
