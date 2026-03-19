import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { authenticate, unauthenticated } from "~/shopify.server";
import db from "~/db.server";
import { GraphqlQueryError } from "@shopify/shopify-api";

const trackingParams = new Set([
  "_pos",
  "_sid",
  "_ss",
  "fbclid",
  "gclid",
  "msclkid",
  "scid",
]);

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

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.public.appProxy(request);

  if (!session || !session.shop) {
    return data({ message: "Unauthorized" }, { status: 401 });
  }

  const { shop } = session;

  let body: { url?: string; referrer?: string; timestamp?: string } | null =
    null;

  try {
    const text = await request.text();
    body = JSON.parse(text);
  } catch (e) {
    return data({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body.url !== "string") {
    return data({ message: "URL required" }, { status: 400 });
  }

  const { url, referrer, timestamp } = body;

  if (!url) return data({ message: "URL required" }, { status: 400 });

  const { pathKey, fullUrl } = normalizeUrlForRedirect(url);

  console.log("GhostLink: 404 hit", {
    shop,
    pathKey,
    fullUrl,
    referrer: referrer ?? null,
    timestamp: timestamp ?? null,
  });

  // 1. Log the hit
  const log = await db.ghostLinkLog.upsert({
    where: {
      shop_path: {
        shop,
        path: pathKey,
      },
    },
    update: {
      hitCount: { increment: 1 },
      url: fullUrl,
      referrer: referrer || null,
      updatedAt: new Date(),
    },
    create: {
      shop,
      path: pathKey,
      url: fullUrl,
      referrer: referrer || null,
      hitCount: 1,
      status: "pending",
    },
  });

  const settings = await db.ghostLinkSettings.findUnique({ where: { shop } });

  if (settings?.autoPilot) {
    const { admin } = await unauthenticated.admin(shop);
    try {
      const response = await admin.graphql(
        `#graphql
      mutation urlRedirectCreate($urlRedirect: UrlRedirectInput!) {
        urlRedirectCreate(urlRedirect: $urlRedirect) {
          urlRedirect { id }
          userErrors { message }
        }
      }`,
        {
          variables: {
            urlRedirect: {
              path: pathKey,
              target: settings.autoTarget || "/",
            },
          },
        },
      );

      const resJson = await response.json();

      const userErrors = resJson?.data?.urlRedirectCreate?.userErrors ?? [];
      if (userErrors.length === 0 && log.status === "pending") {
        await db.ghostLinkLog.update({
          where: { id: log.id },
          data: { status: "fixed" },
        });
        console.log(
          `GhostLink: Auto-Pilot fixed ${pathKey} -> ${settings.autoTarget}`,
        );
      } else {
        console.warn("GhostLink: urlRedirectCreate userErrors", userErrors);
      }
    } catch (error) {
      if (error instanceof GraphqlQueryError) {
        console.error(
          "GhostLink: Admin GraphQL error details:",
          error.body?.errors,
        );
      } else {
        console.error("GhostLink: Unexpected Admin API error:", error);
      }
    }
  }

  return data({ success: true }, { status: 200 });
}

export function loader() {
  return data("Not found", { status: 404 });
}
