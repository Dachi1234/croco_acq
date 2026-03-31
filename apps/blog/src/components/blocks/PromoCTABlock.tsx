import type { PromoCTABlock as PromoCTABlockData } from "@acquisition/shared";
import Image from "next/image";

/** Five-stop green → transparent radial, used for decorative blurs. */
const DECO_RADIAL =
  "radial-gradient(circle, rgba(24, 149, 65, 0.9) 0%, rgba(28, 175, 75, 0.45) 28%, rgba(38, 193, 89, 0.22) 52%, rgba(38, 193, 89, 0.06) 78%, transparent 100%)";

interface Props {
  block: PromoCTABlockData;
  position: number;
}

export function PromoCTABlock({ block, position }: Props) {
  const variant = block.variant ?? "default";
  const isCompact = variant === "compact";
  const showBlurs = !isCompact;

  const isHttp = /^https?:\/\//i.test(block.button_link);

  return (
    <div
      data-block-position={position}
      data-block-type="promo_cta"
      className={[
        "relative overflow-hidden rounded-[24px] border-[0.667px] border-[rgba(0,146,192,0.2)]",
        isCompact ? "p-[24px]" : "p-[40px]",
        "bg-[linear-gradient(159.05deg,rgba(0,146,192,0.12)_0%,rgba(28,175,75,0.06)_50%,rgba(0,146,192,0.04)_100%)]",
      ].join(" ")}
    >
      {showBlurs ? (
        <>
          <div
            className="pointer-events-none absolute h-32 w-32 opacity-30 blur-[25px]"
            style={{ left: "-40.67px", top: "-41px", background: DECO_RADIAL }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute h-24 w-24 opacity-20 blur-[20px]"
            style={{
              bottom: "-40.33px",
              right: "-20.67px",
              background: DECO_RADIAL,
            }}
            aria-hidden
          />
        </>
      ) : null}

      <div className="relative flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[12px]">
          {block.icon ? (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/10">
              <Image src={block.icon} alt="" fill className="object-contain p-1" sizes="48px" />
            </div>
          ) : null}
          <h3 className="text-[16px] font-medium leading-[21px] text-white">{block.title}</h3>
          {block.subtitle ? (
            <p className="text-[14px] leading-[18px] text-[#83969c]">{block.subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-start">
          <a
            href={block.button_link}
            data-cta-label={block.button_text}
            data-cta-dest={block.button_link}
            className="inline-flex items-center justify-center rounded-[200px] border border-[#26c159] bg-[#189541] px-[12px] py-[8px] text-[14px] font-medium text-white transition-colors hover:bg-[#26c159]"
            {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {block.button_text}
          </a>
        </div>
      </div>
    </div>
  );
}
