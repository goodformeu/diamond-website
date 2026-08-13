import Image from "next/image";

type PhotoPlaceholderProps = {
  label?: string;
  ratio?: string;
  className?: string;
  /** When provided, renders this real photo instead of the empty placeholder frame. */
  src?: string;
  alt?: string;
};

/**
 * Corner crop-marks, no fill — reads as an empty editorial photo frame ready
 * for a real photo, not a grey dev placeholder box. Pass `src` once a real
 * photo is available for that frame; frames without one keep showing the
 * placeholder.
 */
export function PhotoPlaceholder({
  label = "[REAL DIAMOND PHOTOS]",
  ratio = "aspect-[4/5]",
  className = "",
  src,
  alt,
}: PhotoPlaceholderProps) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${ratio} ${className}`}>
        <Image src={src} alt={alt ?? ""} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-linear-to-br from-white/[0.05] to-white/[0.01] ${ratio} ${className}`}
    >
      <CornerMark className="top-3 left-3 border-t border-l" />
      <CornerMark className="top-3 right-3 border-t border-r" />
      <CornerMark className="bottom-3 left-3 border-b border-l" />
      <CornerMark className="right-3 bottom-3 border-r border-b" />
      <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.25em] text-mist/70">
        {label}
      </span>
    </div>
  );
}

function CornerMark({ className }: { className: string }) {
  return <span aria-hidden className={`absolute h-5 w-5 border-line ${className}`} />;
}
