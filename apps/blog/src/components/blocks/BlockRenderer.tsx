import type { Block } from "@acquisition/shared";
import type { Locale } from "@acquisition/shared";
import { BannerBlock } from "./BannerBlock";
import { TextBlock } from "./TextBlock";
import { TwoBannerBlock } from "./TwoBannerBlock";
import { PromoCTABlock } from "./PromoCTABlock";

export function BlockRenderer({ blocks, locale }: { blocks: Block[]; locale: Locale }) {
  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        switch (block.type) {
          case "banner":
            return <BannerBlock key={key} block={block} position={index} />;
          case "text":
            return <TextBlock key={key} block={block} position={index} />;
          case "two_banner":
            return <TwoBannerBlock key={key} block={block} position={index} />;
          case "promo_cta":
            return <PromoCTABlock key={key} block={block} position={index} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
