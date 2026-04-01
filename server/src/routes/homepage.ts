import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { homepageConfigSchema } from "@acquisition/shared";
import { db } from "../db/index.js";
import { homepageConfig } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { revalidatePath } from "../lib/revalidate.js";

const emptyHomepageConfig = {
  hero_slides: [],
  featured_promotions: [],
  featured_articles: [],
} as const;

function formatHomepageRow(row: typeof homepageConfig.$inferSelect) {
  return {
    id: row.id,
    locale: row.locale,
    hero_slides: row.heroSlides,
    cta_banner: row.ctaBanner,
    featured_promotions: row.featuredPromotions,
    featured_articles: row.featuredArticles,
    updated_at: row.updatedAt,
  };
}

/** Public API: read-only homepage config */
export async function homepagePublicRoutes(app: FastifyInstance) {
  app.get("/:locale", async (_request, _reply) => {
    const { locale } = _request.params as { locale: string };
    const [row] = await db.select().from(homepageConfig)
      .where(eq(homepageConfig.locale, locale)).limit(1);
    if (!row) return { locale, ...emptyHomepageConfig };
    return formatHomepageRow(row);
  });
}

/** Admin API: read + write homepage config */
export async function homepageAdminRoutes(app: FastifyInstance) {
  app.get("/:locale", async (request, _reply) => {
    const { locale } = request.params as { locale: string };
    const [row] = await db.select().from(homepageConfig)
      .where(eq(homepageConfig.locale, locale)).limit(1);
    if (!row) return { locale, ...emptyHomepageConfig };
    return formatHomepageRow(row);
  });

  app.patch("/:locale", { preHandler: requireAuth }, async (request, reply) => {
    const { locale } = request.params as { locale: string };
    const parsed = homepageConfigSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const body = parsed.data;
    const [row] = await db.insert(homepageConfig).values({
      locale,
      heroSlides: body.hero_slides,
      ctaBanner: body.cta_banner ?? null,
      featuredPromotions: body.featured_promotions,
      featuredArticles: body.featured_articles,
    }).onConflictDoUpdate({
      target: homepageConfig.locale,
      set: {
        heroSlides: body.hero_slides,
        ctaBanner: body.cta_banner ?? null,
        featuredPromotions: body.featured_promotions,
        featuredArticles: body.featured_articles,
        updatedAt: new Date(),
      },
    }).returning();

    revalidatePath(`/${locale}`);

    return formatHomepageRow(row);
  });
}
