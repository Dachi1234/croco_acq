import { z } from "zod";

export const bannerBlockSchema = z.object({
  type: z.literal("banner"),
  image: z.string(),
  alt: z.string().optional(),
  link: z.string().optional(),
});

export const textBlockSchema = z.object({
  type: z.literal("text"),
  content: z.string(),
});

const twoBannerSideSchema = z.object({
  image: z.string(),
  alt: z.string().optional(),
  link: z.string().optional(),
});

export const twoBannerBlockSchema = z.object({
  type: z.literal("two_banner"),
  left: twoBannerSideSchema,
  right: twoBannerSideSchema,
});

export const promoCTABlockSchema = z.object({
  type: z.literal("promo_cta"),
  icon: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  button_text: z.string(),
  button_link: z.string(),
  variant: z
    .enum(["default", "highlight", "compact"])
    .optional()
    .default("default"),
});

export const blockSchema = z.discriminatedUnion("type", [
  bannerBlockSchema,
  textBlockSchema,
  twoBannerBlockSchema,
  promoCTABlockSchema,
]);

export type BannerBlock = z.infer<typeof bannerBlockSchema>;
export type TextBlock = z.infer<typeof textBlockSchema>;
export type TwoBannerBlock = z.infer<typeof twoBannerBlockSchema>;
export type PromoCTABlock = z.infer<typeof promoCTABlockSchema>;
export type Block = z.infer<typeof blockSchema>;
