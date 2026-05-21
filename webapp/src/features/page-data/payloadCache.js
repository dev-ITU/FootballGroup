import { fetchJson } from "@/shared/lib/fetchJson.js";

const payloadCache = new Map();
const inflightPayloads = new Map();

function getCacheKey(route) {
  return route?.apiPath || "";
}

export function readCachedPayload(route) {
  const key = getCacheKey(route);
  if (!key) return null;
  return payloadCache.get(key) || null;
}

export function primePayloadCache(route, payload) {
  const key = getCacheKey(route);
  if (!key || !payload) return;
  payloadCache.set(key, payload);
}

export async function loadPagePayload(route, options = {}) {
  const key = getCacheKey(route);
  if (!key) {
    throw new Error("Cannot load page payload without route.apiPath");
  }

  const cached = readCachedPayload(route);
  if (cached) {
    return cached;
  }

  if (inflightPayloads.has(key)) {
    return inflightPayloads.get(key);
  }

  const promise = fetchJson(route.apiPath, options)
    .then((payload) => {
      payloadCache.set(key, payload);
      return payload;
    })
    .finally(() => {
      inflightPayloads.delete(key);
    });

  inflightPayloads.set(key, promise);
  return promise;
}

export function prefetchPagePayload(route) {
  const key = getCacheKey(route);
  if (!key || payloadCache.has(key) || inflightPayloads.has(key)) {
    return;
  }

  loadPagePayload(route).catch(() => {});
}
