import type { FastifyReply } from "fastify";

export function handleDbError(err: unknown, reply: FastifyReply) {
  const message = err instanceof Error ? err.message : "Unknown error";

  // Log the full error server-side for debugging
  reply.log.error(err, "Database operation failed");

  // Return a safe message to the client
  return reply.code(500).send({ error: "Internal server error" });
}
