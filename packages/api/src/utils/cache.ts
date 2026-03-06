import type { MiddlewareHandler } from "hono";

const CACHE_TTL = 86400;

async function getCache(): Promise<Cache | null> {
  try {
    return await caches.open("warhammer-api-v2");
  } catch {
    return null;
  }
}

export const cacheMiddleware: MiddlewareHandler = async (c, next) => {
  if (c.req.method !== "GET") return next();

  const cache = await getCache();

  if (cache) {
    const cacheKey = new Request(c.req.url);
    const cached = await cache.match(cacheKey);

    if (cached) {
      const headers = new Headers(cached.headers);
      headers.set("X-Cache", "HIT");
      return new Response(cached.body, {
        status: cached.status,
        headers,
      });
    }
  }

  await next();

  if (c.res.ok && cache) {
    const cacheKey = new Request(c.req.url);
    const toCache = c.res.clone();
    const headers = new Headers(toCache.headers);
    headers.set("Cache-Control", `public, max-age=${CACHE_TTL}`);
    headers.set("CDN-Cache-Control", `public, max-age=${CACHE_TTL}`);
    headers.set("X-Cache", "MISS");
    const cacheResponse = new Response(toCache.body, {
      status: toCache.status,
      headers,
    });
    c.executionCtx.waitUntil(cache.put(cacheKey, cacheResponse));
  }
};
