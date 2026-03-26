import type { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "../lib/auth.js";

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const session = await auth.api.getSession({
    headers: request.headers as any,
  });

  if (!session) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  (request as any).session = session;
}
