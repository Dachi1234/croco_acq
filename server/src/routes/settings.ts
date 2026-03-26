import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { siteSettings } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

const settingsPatchSchema = z.object({
  registration_url: z.string().optional(),
  site_name: z.string().optional(),
  default_og_image: z.string().optional(),
});

function formatSettingsRow(row: typeof siteSettings.$inferSelect) {
  return {
    id: row.id,
    registration_url: row.registrationUrl,
    site_name: row.siteName,
    default_og_image: row.defaultOgImage,
    updated_at: row.updatedAt,
  };
}

export async function settingsRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: requireAuth }, async () => {
    const [row] = await db.select().from(siteSettings).limit(1);
    if (!row) {
      return {};
    }
    return formatSettingsRow(row);
  });

  app.patch("/", { preHandler: requireAuth }, async (request, reply) => {
    const parsed = settingsPatchSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const body = parsed.data;
    const [existing] = await db.select().from(siteSettings).limit(1);

    if (existing) {
      const next = {
        registrationUrl:
          body.registration_url !== undefined
            ? body.registration_url
            : existing.registrationUrl,
        siteName: body.site_name !== undefined ? body.site_name : existing.siteName,
        defaultOgImage:
          body.default_og_image !== undefined
            ? body.default_og_image
            : existing.defaultOgImage,
        updatedAt: new Date(),
      };

      const [row] = await db
        .update(siteSettings)
        .set(next)
        .where(eq(siteSettings.id, existing.id))
        .returning();

      return formatSettingsRow(row);
    }

    const [row] = await db
      .insert(siteSettings)
      .values({
        registrationUrl: body.registration_url ?? null,
        siteName: body.site_name ?? null,
        defaultOgImage: body.default_og_image ?? null,
      })
      .returning();

    return formatSettingsRow(row);
  });
}
