import type { FastifyRequest, FastifyReply } from "fastify";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3002", "http://localhost:3003"];

export async function csrfProtection(request: FastifyRequest, reply: FastifyReply) {
  if (SAFE_METHODS.has(request.method)) return;

  const origin = request.headers.origin;
  if (!origin) {
    // Server-to-server calls (e.g. revalidation) won't have an origin header
    return;
  }

  if (!ALLOWED_ORIGINS.includes(origin)) {
    return reply.code(403).send({ error: "Forbidden: invalid origin" });
  }
}
