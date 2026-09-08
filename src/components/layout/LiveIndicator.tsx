export function LiveIndicator({ label = 'Live Demo' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11.5px] font-semibold tracking-[0.01em] text-brand-700">
      <span className="relative grid size-2 place-items-center">
        <span className="absolute inset-0 rounded-full bg-brand-500 animate-pulse-ring" />
        <span className="size-2 rounded-full bg-brand-600" />
      </span>
      {label}
    </span>
  );
}
