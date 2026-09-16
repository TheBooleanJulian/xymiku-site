export function SectionDivider({
  headline,
  highlight,
  subtext,
}: {
  headline: string;
  highlight: string;
  subtext: string;
}) {
  return (
    <div className="border-b border-cyan/15 px-4 py-10 text-center sm:px-6">
      <p className="font-display text-lg font-bold tracking-[0.3em] text-ink sm:text-xl">
        <span className="text-signal">•</span> {headline}{" "}
        <span className="text-cyan">{highlight}</span>{" "}
        <span className="text-signal">•</span>
      </p>
      <p className="mt-2 font-technical text-[10px] tracking-[0.2em] text-mute">
        {subtext}
      </p>
    </div>
  );
}
