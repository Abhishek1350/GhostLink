import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { authenticate } from "~/shopify.server";
import { GraphqlQueryError } from "@shopify/shopify-api";
import { GhostLinkLog, LinkStatus, Session } from "@prisma/client";
import { logHit, updateLogStatus } from "~/lib/link-logs.server";
import { createRedirect } from "~/lib/url-redirect.server";
import { getSettings } from "~/lib/settings.server";
import { AdminApiContext } from "@shopify/shopify-app-react-router/server";

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

async function getShopAndAdminFromAppProxy(request: Request) {
  const { session, admin } = await authenticate.public.appProxy(request);

  if (!session || !session.shop) {
    throw data({ message: "Unauthorized" }, { status: 401 });
  }

  if (!admin) {
    throw data({ message: "No admin context for this shop" }, { status: 403 });
  }

  return { shop: session.shop, admin };
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

async function handle404Logging(
  shop: Session["shop"],
  url: string,
  referrer?: string,
) {
  const { pathKey, fullUrl } = normalizeUrlForRedirect(url);

  const log = await logHit(shop, { pathKey, fullUrl, referrer });

  return { log, pathKey, fullUrl };
}

async function handleAutoPilotFix({
  admin,
  pathKey,
  log,
  autoTarget,
}: {
  admin: AdminApiContext;
  pathKey: GhostLinkLog["path"];
  log: GhostLinkLog | null;
  autoTarget?: string | null;
}) {
  try {
    const createStatus = await createRedirect(admin, {
      path: pathKey,
      target: autoTarget || "/",
    });

    if (createStatus?.success && log?.status === LinkStatus.PENDING) {
      await updateLogStatus(log.id, LinkStatus.FIXED);
      console.log(
        `GhostLink: Auto-Pilot fixed ${pathKey} -> ${autoTarget ?? "/"}`,
      );
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

export async function action({ request }: ActionFunctionArgs) {
  const { shop, admin } = await getShopAndAdminFromAppProxy(request);

  const body = await parseJsonBody(request);
  const validated = validateBody(body);
  if (validated instanceof Response) return validated;

  const { url, referrer } = validated;

  const { log, pathKey } = await handle404Logging(
    shop,
    url,
    referrer,
  );

  const settings = await getSettings(shop);

  if (settings?.autoPilot) {
    await handleAutoPilotFix({
      admin,
      pathKey,
      log,
      autoTarget: settings.autoTarget,
    });
  }

  return data({ success: true }, { status: 200 });
}

export function loader() {
  return data("Not found", { status: 404 });
}
