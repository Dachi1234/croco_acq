import type { FastifyInstance } from "fastify";
import { desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { uploads } from "../db/schema.js";
import { saveFile } from "../lib/upload.js";
import { requireAuth } from "../middleware/auth.js";

export async function uploadsRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: requireAuth }, async (request, reply) => {
    const file = await request.file();
    if (!file) {
      return reply.code(400).send({ error: "No file uploaded" });
    }

    const buffer = await file.toBuffer();
    const originalName = file.filename ?? "upload";
    const mimeType = file.mimetype ?? "application/octet-stream";

    const saved = await saveFile(buffer, originalName, mimeType);

    const [row] = await db
      .insert(uploads)
      .values({
        filename: saved.filename,
        originalName,
        mimeType,
        sizeBytes: saved.sizeBytes,
        url: saved.url,
      })
      .returning();

    return {
      id: row.id,
      url: row.url,
      filename: row.filename,
      original_name: row.originalName,
    };
  });

  app.get("/", { preHandler: requireAuth }, async () => {
    const rows = await db.select().from(uploads).orderBy(desc(uploads.createdAt));
    return rows.map((r) => ({
      id: r.id,
      filename: r.filename,
      original_name: r.originalName,
      mime_type: r.mimeType,
      size_bytes: r.sizeBytes,
      url: r.url,
      created_at: r.createdAt,
    }));
  });
}
