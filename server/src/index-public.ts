import Fastify from "fastify";
import cors from "@fastify/cors";
import { articlesPublicRoutes } from "./routes/articles.js";
import { promotionsPublicRoutes } from "./routes/promotions.js";
import { homepagePublicRoutes } from "./routes/homepage.js";
import { settingsPublicRoutes } from "./routes/settings.js";
import type { FastifyError } from "fastify";

const PORT = Number(process.env.SERVER_PORT || 3003);

const app = Fastify({ logger: true, trustProxy: true });

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000", "http://localhost:3003"];

await app.register(cors, {
  origin: ALLOWED_ORIGINS,
  credentials: false,
  methods: ["GET", "HEAD", "OPTIONS"],
});

// No static file serving — uploads are proxied to Machine 2 at the Nginx level

app.setErrorHandler((error: FastifyError, request, reply) => {
  request.log.error(error);
  if (error.statusCode && error.statusCode < 500) {
    return reply.code(error.statusCode).send({
      error: error.message,
      ...(error.code ? { code: error.code } : {}),
    });
  }
  return reply.code(500).send({ error: "Internal server error" });
});

await app.register(articlesPublicRoutes, { prefix: "/api/articles" });
await app.register(promotionsPublicRoutes, { prefix: "/api/promotions" });
await app.register(homepagePublicRoutes, { prefix: "/api/homepage" });
await app.register(settingsPublicRoutes, { prefix: "/api/settings" });

app.get("/api/health", async () => ({ status: "ok", mode: "public" }));

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`Public API server running on port ${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
