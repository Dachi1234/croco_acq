import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { articlesRoutes } from "./routes/articles.js";
import { promotionsRoutes } from "./routes/promotions.js";
import { homepageRoutes } from "./routes/homepage.js";
import { settingsRoutes } from "./routes/settings.js";
import { uploadsRoutes } from "./routes/uploads.js";
import { revalidateRoutes } from "./routes/revalidate.js";
import { authRoutes } from "./routes/auth.js";
import { csrfProtection } from "./middleware/csrf.js";
import type { FastifyError } from "fastify";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.resolve(__dirname, "../../uploads"));
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const PORT = Number(process.env.SERVER_PORT || 3001);

const app = Fastify({ logger: true });

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3002", "http://localhost:3003"];

await app.register(cors, {
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
});

await app.register(rateLimit, {
  global: false,
});

await app.register(multipart, {
  limits: { fileSize: 10 * 1024 * 1024 },
});

await app.register(fastifyStatic, {
  root: path.resolve(UPLOAD_DIR),
  prefix: "/uploads/",
  decorateReply: false,
});

app.addHook("onRequest", csrfProtection);

app.setErrorHandler((error: FastifyError, request, reply) => {
  request.log.error(error);

  // Fastify's own errors (validation, content-type, rate limit) — pass through
  if (error.statusCode && error.statusCode < 500) {
    return reply.code(error.statusCode).send({
      error: error.message,
      ...(error.code ? { code: error.code } : {}),
    });
  }

  // Everything else (DB errors, unexpected crashes) — hide internals
  return reply.code(500).send({ error: "Internal server error" });
});

await app.register(authRoutes, { prefix: "/api/auth" });
await app.register(articlesRoutes, { prefix: "/api/articles" });
await app.register(promotionsRoutes, { prefix: "/api/promotions" });
await app.register(homepageRoutes, { prefix: "/api/homepage" });
await app.register(settingsRoutes, { prefix: "/api/settings" });
await app.register(uploadsRoutes, { prefix: "/api/uploads" });
await app.register(revalidateRoutes, { prefix: "/api/revalidate" });

app.get("/api/health", async () => ({ status: "ok" }));

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`Server running on port ${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
