import { data } from "react-router";
import { authenticate } from "~/shopify.server";
import { shouldProcess } from "~/lib/redis.server";
import { logHitJob, handleAutoPilotJob } from "~/lib/jobs.server";
import { waitUntil } from "@vercel/functions";

type ProxyBody = {
  url: string;
  referrer?: string;
  timestamp?: string;
};

const trackingParams = new Set([
  "_pos",
  "_sid",
  "_ss",
  "fbclid",
  "gclid",
  "msclkid",
  "scid",
]);

const BOT_PATTERNS = [
  "wp-admin",
  "wp-content",
  ".php",
  ".env",
  ".git",
  "xmlrpc",
  "cgi-bin",
  "/well-known/",
  "ads.txt",
  "robots.txt",
  "apple-touch-icon",
];

const ASSET_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".ico",
  ".css",
  ".js",
  ".map",
];

function normalizeUrlForRedirect(rawUrl: string) {
  let pathKey = rawUrl;
  let fullUrl = rawUrl;

  try {
    const parsed = new URL(rawUrl, "https://dummy.invalid");

    const pathname = parsed.pathname || "/";

    pathKey = pathname;

    const params = parsed.searchParams;
    for (const [key] of params) {
      if (trackingParams.has(key) || key.toLowerCase().startsWith("utm_")) {
        params.delete(key);
      }
    }

    const cleanedSearch = params.toString();
    fullUrl = cleanedSearch ? `${pathname}?${cleanedSearch}` : pathname;
  } catch {
    // Fallback to the raw string as path (best effort)
    pathKey = rawUrl;
    fullUrl = rawUrl;
  }

  return { pathKey, fullUrl };
}

async function getShopFromAppProxy(request: Request) {
  const { session } = await authenticate.public.appProxy(request);

  if (!session || !session.shop) {
    throw data({ message: "Unauthorized" }, { status: 401 });
  }

  return { shop: session.shop };
}

async function parseJsonBody(request: Request): Promise<ProxyBody | null> {
  try {
    const text = await request.text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function validateBody(body: ProxyBody | null) {
  if (!body) {
    return Response.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!body.url || typeof body.url !== "string") {
    return Response.json({ message: "URL required" }, { status: 400 });
  }

  return { ...body };
}

function isBotOrAsset(path: string): boolean {
  const lowerPath = path.toLowerCase();

  if (BOT_PATTERNS.some((pattern) => lowerPath.includes(pattern))) return true;
  if (ASSET_EXTENSIONS.some((ext) => lowerPath.endsWith(ext))) return true;

  return false;
}

export async function action({ request }: any) {
  const { shop } = await getShopFromAppProxy(request);

  const body = await parseJsonBody(request);
  const validated = validateBody(body);
  if (validated instanceof Response) return validated;

  const { url, referrer } = validated;
  const { pathKey, fullUrl } = normalizeUrlForRedirect(url);

  if (isBotOrAsset(pathKey)) {
    return data({ success: true, filtered: true }, { status: 200 });
  }

  // Schedule background work using waitUntil
  waitUntil(
    (async () => {
      try {
        if (await shouldProcess(shop, pathKey, "log")) {
          await logHitJob({ shop, pathKey, fullUrl, referrer });
        }

        if (await shouldProcess(shop, pathKey, "fix")) {
          await handleAutoPilotJob({ shop, pathKey });
        }
      } catch (error) {
        console.error("GhostLink: Error in background 404 processing:", error);
      }
    })(),
  );

  return data({ success: true }, { status: 200 });
}

export function loader() {
  return data("Not found", { status: 404 });
}
