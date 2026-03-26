import type { TextBlock as TextBlockData } from "@acquisition/shared";
import sanitizeHtml from "sanitize-html";

export function TextBlock({ block, position }: { block: TextBlockData; position: number }) {
  const clean = sanitizeHtml(block.content, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "a", "strong", "em", "u", "s", "sub", "sup", "code", "pre",
      "blockquote", "span", "div",
      "table", "thead", "tbody", "tr", "th", "td",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "style"],
      "*": ["class", "id", "style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
        "color": [/.*/],
        "font-size": [/^\d+(\.\d+)?(px|em|rem|%)$/],
        "font-weight": [/^\d+$/, /^(bold|normal|medium)$/],
      },
    },
  });

  return (
    <div
      data-block-position={position}
      className={[
        "max-w-none",
        // paragraphs
        "[&_p]:text-[14px] [&_p]:leading-[25.2px] [&_p]:text-[#83969c] [&_p]:mb-[16px]",
        // headings
        "[&_h1]:text-[22px] [&_h1]:font-medium [&_h1]:leading-[30px] [&_h1]:text-white [&_h1]:mt-[24px] [&_h1]:mb-[12px]",
        "[&_h2]:text-[20px] [&_h2]:font-medium [&_h2]:leading-[28px] [&_h2]:text-white [&_h2]:mt-[24px] [&_h2]:mb-[10px]",
        "[&_h3]:text-[16px] [&_h3]:font-medium [&_h3]:leading-[19.6px] [&_h3]:text-white [&_h3]:mt-[20px] [&_h3]:mb-[8px]",
        "[&_h4]:text-[14px] [&_h4]:font-medium [&_h4]:text-white [&_h4]:mt-[16px] [&_h4]:mb-[6px]",
        // inline
        "[&_strong]:font-medium [&_strong]:text-white",
        "[&_em]:italic",
        "[&_u]:underline",
        "[&_s]:line-through",
        // links
        "[&_a]:text-[#26c159] [&_a]:no-underline hover:[&_a]:text-[#189541]",
        // lists
        "[&_ul]:list-disc [&_ul]:pl-[20px] [&_ul]:mb-[16px]",
        "[&_ol]:list-decimal [&_ol]:pl-[20px] [&_ol]:mb-[16px]",
        "[&_li]:text-[14px] [&_li]:leading-[25.2px] [&_li]:text-[#83969c] [&_li]:mb-[4px]",
        // blockquote
        "[&_blockquote]:border-l-2 [&_blockquote]:border-[#26c159] [&_blockquote]:pl-[16px] [&_blockquote]:my-[16px] [&_blockquote]:text-[#83969c] [&_blockquote]:italic",
        // code
        "[&_code]:bg-[#001e28] [&_code]:text-[#26c159] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px] [&_code]:font-mono",
        "[&_pre]:bg-[#001e28] [&_pre]:p-[16px] [&_pre]:rounded-[8px] [&_pre]:mb-[16px] [&_pre]:overflow-x-auto",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        // divider
        "[&_hr]:border-[#072c38] [&_hr]:my-[24px]",
        // images
        "[&_img]:rounded-[8px] [&_img]:max-w-full [&_img]:my-[16px]",
        // table
        "[&_table]:w-full [&_table]:border-collapse [&_table]:mb-[16px] [&_table]:text-[14px]",
        "[&_th]:border [&_th]:border-[#072c38] [&_th]:px-[12px] [&_th]:py-[8px] [&_th]:text-left [&_th]:text-white [&_th]:bg-[#001e28]",
        "[&_td]:border [&_td]:border-[#072c38] [&_td]:px-[12px] [&_td]:py-[8px] [&_td]:text-[#83969c]",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
