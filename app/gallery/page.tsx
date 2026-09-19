import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GalleryBrowser } from "@/components/GalleryBrowser";
import { getAllEvents } from "@/lib/data";

export default async function GalleryPage() {
  const events = await getAllEvents();

  return (
    <>
      <Header />
      <main className="min-h-screen border-b border-cyan/15 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-technical text-[11px] tracking-[0.3em] text-cyan">
            ◆ FULL ARCHIVE
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            ALL EVENTS
          </h1>
          <p className="mt-2 max-w-md font-technical text-sm text-mute">
            Every shoot in the archive, {events.length.toLocaleString()} and counting.
          </p>

          <div className="mt-10">
            <Suspense fallback={<p className="font-technical text-sm text-mute">LOADING...</p>}>
              <GalleryBrowser events={events} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
