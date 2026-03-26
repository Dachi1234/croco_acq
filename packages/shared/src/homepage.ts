import { z } from "zod";

export const heroSlideSchema = z.object({
  image: z.string(),
  badge_text: z.string().optional(),
  heading: z.string(),
  subtext: z.string().optional(),
  cta_text: z.string(),
  cta_link: z.string(),
});

export const ctaBannerSchema = z.object({
  headline: z.string(),
  subtext: z.string().optional(),
  button_text: z.string(),
  button_link: z.string(),
});

export const homepageConfigSchema = z.object({
  hero_slides: z.array(heroSlideSchema),
  cta_banner: ctaBannerSchema.optional(),
  featured_promotions: z.array(z.string().uuid()),
  featured_articles: z.array(z.string().uuid()),
});

export type HeroSlide = z.infer<typeof heroSlideSchema>;
export type CtaBanner = z.infer<typeof ctaBannerSchema>;
export type HomepageConfig = z.infer<typeof homepageConfigSchema>;
