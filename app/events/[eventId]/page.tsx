import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArchivePlaceholder } from "@/components/ArchivePlaceholder";
import { getAllEventIds, getEvent, getEventImages } from "@/lib/data";

export async function generateStaticParams() {
  const ids = await getAllEventIds();
  // "output: export" requires at least one generated path per dynamic route.
  // Before any event is registered, fall back to a placeholder id that
  // resolves to notFound() below rather than failing the build.
  if (ids.length === 0) return [{ eventId: "_none" }];
  return ids.map((eventId) => ({ eventId }));
}

export default async function EventGalleryPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  if (!event) notFound();

  const images = await getEventImages(eventId);

  return (
    <>
      <Header />
      <main className="min-h-screen border-b border-cyan/15 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-technical text-[11px] tracking-[0.3em] text-cyan">
            ◆ EVENT GALLERY
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {event.name}
          </h1>
          <p className="mt-2 font-technical text-sm text-mute">
            {event.date} · {event.imageCount.toLocaleString()} IMAGES
          </p>

          {images.length === 0 ? (
            <p className="mt-12 font-technical text-sm text-mute">
              No images have been uploaded for this event yet.
            </p>
          ) : (
            <div className="mt-10 columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
              {images.map((image) => (
                <div key={image.id} className="break-inside-avoid">
                  <ArchivePlaceholder image={image} className="aspect-[3/4]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
