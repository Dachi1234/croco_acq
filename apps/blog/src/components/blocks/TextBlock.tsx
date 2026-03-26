import type { TextBlock as TextBlockData } from "@acquisition/shared";

export function TextBlock({ block, position }: { block: TextBlockData; position: number }) {
  return (
    <div
      data-block-position={position}
      className="prose prose-invert prose-green max-w-none [&_h1]:text-white [&_h1]:font-bold [&_h2]:text-white [&_h2]:font-bold [&_h3]:text-white [&_h3]:font-bold [&_h4]:text-white [&_h4]:font-bold [&_h5]:text-white [&_h5]:font-bold [&_h6]:text-white [&_h6]:font-bold [&_a]:text-[#26c159] [&_a]:no-underline hover:[&_a]:text-[#189541] [&_p]:text-gray-300 [&_p]:leading-relaxed [&_li]:text-gray-300 [&_li]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
}
