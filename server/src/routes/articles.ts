import { db } from "../db/index.js";
import { articles } from "../db/schema.js";
import { eq, and, desc, isNull } from "drizzle-orm";
import {
  createArticleSchema,
  updateArticleSchema,
  LOCALES,
  type CreateArticle,
  type UpdateArticle,
} from "@acquisition/shared";
import { requireAuth } from "../middleware/auth.js";
import { revalidatePath } from "../lib/revalidate.js";
import type { FastifyInstance } from "fastify";

type ArticleRow = typeof articles.$inferSelect;

function toApiFull(row: ArticleRow) {
  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    excerpt: row.excerpt,
    cover_image: row.coverImage,
    blocks: row.blocks,
    meta_title: row.metaTitle,
    meta_description: row.metaDescription,
    og_image: row.ogImage,
    canonical_url: row.canonicalUrl,
    linked_translation_id: row.linkedTranslationId,
    status: row.status,
    published_at: row.publishedAt?.toISOString() ?? null,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

function toListItem(row: {
  id: string;
  slug: string;
  locale: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  publishedAt: Date | null;
  metaTitle: string | null;
}) {
  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    excerpt: row.excerpt,
    cover_image: row.coverImage,
    status: row.status,
    published_at: row.publishedAt?.toISOString() ?? null,
    meta_title: row.metaTitle,
  };
}

function insertFromCreate(data: CreateArticle) {
  return {
    slug: data.slug,
    locale: data.locale,
    title: data.title,
    excerpt: data.excerpt ?? null,
    coverImage: data.cover_image ?? null,
    blocks: data.blocks,
    metaTitle: data.meta_title ?? null,
    metaDescription: data.meta_description ?? null,
    ogImage: data.og_image ?? null,
    canonicalUrl: data.canonical_url ?? null,
    linkedTranslationId: data.linked_translation_id ?? null,
  };
}

function patchToColumns(body: UpdateArticle): Partial<typeof articles.$inferInsert> {
  const out: Partial<typeof articles.$inferInsert> = {};
  if (body.slug !== undefined) out.slug = body.slug;
  if (body.locale !== undefined) out.locale = body.locale;
  if (body.title !== undefined) out.title = body.title;
  if (body.excerpt !== undefined) out.excerpt = body.excerpt ?? null;
  if (body.cover_image !== undefined) out.coverImage = body.cover_image ?? null;
  if (body.blocks !== undefined) out.blocks = body.blocks;
  if (body.meta_title !== undefined) out.metaTitle = body.meta_title ?? null;
  if (body.meta_description !== undefined) out.metaDescription = body.meta_description ?? null;
  if (body.og_image !== undefined) out.ogImage = body.og_image ?? null;
  if (body.canonical_url !== undefined) out.canonicalUrl = body.canonical_url ?? null;
  if (body.linked_translation_id !== undefined)
    out.linkedTranslationId = body.linked_translation_id ?? null;
  return out;
}

function parseOptionalStatus(
  body: unknown,
): { ok: true; status?: "draft" | "published" } | { ok: false } {
  if (typeof body !== "object" || body === null || !("status" in body)) {
    return { ok: true };
  }
  const v = (body as { status?: unknown }).status;
  if (v === undefined) return { ok: true };
  if (v === "draft" || v === "published") return { ok: true, status: v };
  return { ok: false };
}

export async function articlesRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const { locale, status } = request.query as { locale?: string; status?: string };

    if (locale && !(LOCALES as readonly string[]).includes(locale)) {
      return reply.code(400).send({ error: `Invalid locale. Allowed: ${LOCALES.join(", ")}` });
    }
    if (status && !["draft", "published", "all"].includes(status)) {
      return reply.code(400).send({ error: "Invalid status. Allowed: draft, published, all" });
    }

    const conditions = [isNull(articles.deletedAt)];
    if (status !== "all") {
      conditions.push(eq(articles.status, status === "draft" ? "draft" : "published"));
    }
    if (locale !== undefined && locale !== "") {
      conditions.push(eq(articles.locale, locale));
    }
    const rows = await db
      .select({
        id: articles.id,
        slug: articles.slug,
        locale: articles.locale,
        title: articles.title,
        excerpt: articles.excerpt,
        coverImage: articles.coverImage,
        status: articles.status,
        publishedAt: articles.publishedAt,
        metaTitle: articles.metaTitle,
      })
      .from(articles)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(articles.publishedAt));
    return rows.map(toListItem);
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const locale = (request.query as { locale?: string }).locale ?? "ka";

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(id);
    const [row] = isUuid
      ? await db.select().from(articles).where(and(eq(articles.id, id), isNull(articles.deletedAt)))
      : await db
          .select()
          .from(articles)
          .where(and(eq(articles.slug, id), eq(articles.locale, locale), isNull(articles.deletedAt)));

    if (!row) {
      return reply.code(404).send({ error: "Not found" });
    }
    return toApiFull(row);
  });

  app.post(
    "/",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const parsed = createArticleSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "Validation failed", errors: parsed.error.flatten() });
      }
      const [created] = await db.insert(articles).values(insertFromCreate(parsed.data)).returning();
      return toApiFull(created);
    },
  );

  app.patch(
    "/:id",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = updateArticleSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "Validation failed", errors: parsed.error.flatten() });
      }
      const statusParsed = parseOptionalStatus(request.body);
      if (!statusParsed.ok) {
        return reply.code(400).send({ error: "Invalid status" });
      }

      const [existing] = await db.select().from(articles).where(eq(articles.id, id));
      if (!existing) {
        return reply.code(404).send({ error: "Not found" });
      }

      const patch = patchToColumns(parsed.data);
      const transitioningToPublished =
        statusParsed.status === "published" && existing.status !== "published";

      const [updated] = await db
        .update(articles)
        .set({
          ...patch,
          ...(statusParsed.status !== undefined ? { status: statusParsed.status } : {}),
          ...(transitioningToPublished ? { publishedAt: new Date() } : {}),
          updatedAt: new Date(),
        })
        .where(eq(articles.id, id))
        .returning();

      if (!updated) {
        return reply.code(404).send({ error: "Not found" });
      }

      if (transitioningToPublished) {
        revalidatePath(`/${updated.locale}/blog/${updated.slug}`);
      }

      return toApiFull(updated);
    },
  );

  app.delete(
    "/:id",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const [deleted] = await db
        .update(articles)
        .set({ deletedAt: new Date() })
        .where(and(eq(articles.id, id), isNull(articles.deletedAt)))
        .returning({ id: articles.id });
      if (!deleted) {
        return reply.code(404).send({ error: "Not found" });
      }
      return { success: true };
    },
  );
}
