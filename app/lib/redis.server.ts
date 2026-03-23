import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

type ThrottleType = "log" | "fix";

/**
 * Checks if a specific action should be processed based on its TTL.
 * 'log' has a 2s TTL to protect DB connection spikes.
 * 'fix' has a 1m TTL to protect Shopify API quota.
 */
export async function shouldProcess(
  shop: string,
  path: string,
  type: ThrottleType,
): Promise<boolean> {
  try {
    const ttl = type === "log" ? 1 : 60;
    const key = `ghostlink:404:${type}:${shop}:${path}`;

    const result = await redis.set(key, "1", { nx: true, ex: ttl });
    return result === "OK";
  } catch (error) {
    console.error(`GhostLink: Redis error in shouldProcess(${type}):`, error);
    return true; // Fallback to processing if Redis fails
  }
}

export default redis;
