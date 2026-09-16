import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SystemDiagnostics } from "@/components/SystemDiagnostics";
import { PhotoDelivery } from "@/components/PhotoDelivery";
import { ArchiveTimeline } from "@/components/ArchiveTimeline";
import { CharacterIndex } from "@/components/CharacterIndex";
import { FeaturedCosplay } from "@/components/FeaturedCosplay";
import { Portfolio } from "@/components/Portfolio";
import { VisualSynthesis } from "@/components/VisualSynthesis";
import { SectionDivider } from "@/components/SectionDivider";
import { MikuSignature } from "@/components/MikuSignature";
import { SignalDivider } from "@/components/SignalDivider";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SystemDiagnostics />
        <PhotoDelivery />
        <ArchiveTimeline />
        <CharacterIndex />
        <FeaturedCosplay />
        <Portfolio />
        <VisualSynthesis />
        <SectionDivider
          headline="ARCHIVE SYNTHESIS COMPLETE //"
          highlight="2016—2026"
          subtext="TEN YEARS OF SIGNAL, ORGANIZED BY XYMIKU.39"
        />
        <MikuSignature />
      </main>
      <SignalDivider />
      <Footer />
    </>
  );
}
