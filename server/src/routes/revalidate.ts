import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { revalidatePath } from "../lib/revalidate.js";
import { requireAuth } from "../middleware/auth.js";

const revalidateBodySchema = z.object({
  path: z.string().min(1),
});

export async function revalidateRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: requireAuth }, async (request, reply) => {
    const parsed = revalidateBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const revalidated = await revalidatePath(parsed.data.path);
    return { revalidated };
  });
}
