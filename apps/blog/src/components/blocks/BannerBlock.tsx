import type { BannerBlock as BannerBlockData } from "@acquisition/shared";
import Image from "next/image";

export function BannerBlock({ block, position }: { block: BannerBlockData; position: number }) {
  const inner = (
    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl">
      <Image
        src={block.image}
        alt={block.alt ?? ""}
        fill
        className="object-cover"
        sizes="(max-width: 800px) 100vw, 800px"
      />
    </div>
  );

  if (block.link) {
    return (
      <a href={block.link} className="block w-full" data-block-position={position}>
        {inner}
      </a>
    );
  }

  return <div data-block-position={position}>{inner}</div>;
}
