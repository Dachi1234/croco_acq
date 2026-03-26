import type { FastifyInstance } from "fastify";
import { auth } from "../lib/auth.js";

export async function authRoutes(app: FastifyInstance) {
  app.all("/*", {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: "1 minute",
      },
    },
  }, async (request, reply) => {
    const url = new URL(
      request.url,
      `${request.protocol}://${request.hostname}`,
    );

    const headers = new Headers();
    for (const [key, value] of Object.entries(request.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    }

    const webRequest = new Request(url.toString(), {
      method: request.method,
      headers,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? JSON.stringify(request.body)
          : undefined,
    });

    const response = await auth.handler(webRequest);

    reply.status(response.status);
    response.headers.forEach((value: string, key: string) => {
      reply.header(key, value);
    });

    const text = await response.text();
    reply.send(text);
  });
}
