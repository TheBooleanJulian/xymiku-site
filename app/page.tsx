import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SystemDiagnostics } from "@/components/SystemDiagnostics";
import { PhotoDelivery } from "@/components/PhotoDelivery";
import { ArchiveTimeline } from "@/components/ArchiveTimeline";
import { CharacterIndex } from "@/components/CharacterIndex";
import { FeaturedCosplay } from "@/components/FeaturedCosplay";
import { Portfolio } from "@/components/Portfolio";
import { VisualSynthesis } from "@/components/VisualSynthesis";
import { MikuSignature } from "@/components/MikuSignature";
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
        <MikuSignature />
      </main>
      <Footer />
    </>
  );
}
