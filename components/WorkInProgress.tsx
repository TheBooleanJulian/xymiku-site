export function WorkInProgress({ label = "SIGNAL PENDING" }: { label?: string }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-2 border border-dashed border-cyan/20 bg-deep/30 px-6 py-14 text-center">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan/50 pulse-dot" />
      <p className="font-display text-sm font-bold tracking-[0.15em] text-cyan/70">
        WORK IN PROGRESS
      </p>
      <p className="font-technical text-[10px] tracking-[0.2em] text-mute">
        {label} // CHECK BACK SOON
      </p>
    </div>
  );
}
