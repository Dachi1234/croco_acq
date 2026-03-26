import { z } from "zod";
import { blockSchema } from "./blocks";
import { localeSchema } from "./locale";

export const basePostSchema = z.object({
  slug: z.string().min(1),
  locale: localeSchema,
  title: z.string().min(1),
  excerpt: z.string().optional(),
  cover_image: z.string().optional(),
  blocks: z.array(blockSchema),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_image: z.string().optional(),
  canonical_url: z.string().optional(),
  linked_translation_id: z.string().uuid().optional(),
});

export const createArticleSchema = basePostSchema;
export const updateArticleSchema = basePostSchema.partial();
export const createPromotionSchema = basePostSchema;
export const updatePromotionSchema = basePostSchema.partial();

export const publishPostSchema = z.object({
  status: z.enum(["draft", "published"]),
});

export type BasePost = z.infer<typeof basePostSchema>;
export type CreateArticle = z.infer<typeof createArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;
export type CreatePromotion = z.infer<typeof createPromotionSchema>;
export type UpdatePromotion = z.infer<typeof updatePromotionSchema>;
export type PublishPost = z.infer<typeof publishPostSchema>;
