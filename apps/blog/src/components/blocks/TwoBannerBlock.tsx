import type { TwoBannerBlock as TwoBannerBlockData } from "@acquisition/shared";
import Image from "next/image";

type Side = TwoBannerBlockData["left"];

function BannerSide({ side, slot }: { side: Side; slot: "left" | "right" }) {
  const figure = (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
      <Image
        src={side.image}
        alt={side.alt ?? ""}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 400px"
      />
    </div>
  );

  if (side.link) {
    return (
      <a href={side.link} className="block min-w-0" data-slot={slot}>
        {figure}
      </a>
    );
  }

  return (
    <div data-slot={slot}>
      {figure}
    </div>
  );
}

export function TwoBannerBlock({
  block,
  position,
}: {
  block: TwoBannerBlockData;
  position: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-block-position={position}>
      <BannerSide side={block.left} slot="left" />
      <BannerSide side={block.right} slot="right" />
    </div>
  );
}
