const photos = ["picknick", "freunde", "rooftop", "selfie", "lauf", "brunch", "cafe", "club"];

/** Laufendes Fotoband (pausiert bei Hover; bei «Bewegung reduzieren» seitlich scrollbar). */
export function PhotoMarquee() {
  const row = (hidden: boolean) =>
    photos.map((p) => (
      // eslint-disable-next-line @next/next/no-img-element -- Fotos sind bereits als WebP optimiert
      <img
        key={`${p}-${hidden}`}
        src={`/images/photos/${p}.webp`}
        alt=""
        aria-hidden={hidden || undefined}
        width={640}
        height={800}
        loading="lazy"
        decoding="async"
        className="h-56 w-44 shrink-0 rounded-xl object-cover sm:h-72 sm:w-56"
      />
    ));
  return (
    <div className="overflow-x-auto [scrollbar-width:none] motion-safe:overflow-hidden" aria-hidden="true">
      <div
        className="animate-marquee flex w-max gap-3 sm:gap-4"
        style={{ ["--marquee-duration" as string]: "55s" }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
