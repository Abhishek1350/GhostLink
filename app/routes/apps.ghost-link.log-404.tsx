import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { authenticate, unauthenticated } from "~/shopify.server";
import db from "~/db.server";
import { GraphqlQueryError } from "@shopify/shopify-api"; 

export const action = async ({ request }: ActionFunctionArgs) => {
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

  const { url, referrer } = body;

  if (!url) return data({ message: "URL required" }, { status: 400 });

  let cleanUrl = url;

  try {
    const parsed = new URL(url);
    cleanUrl = parsed.pathname + parsed.search;
  } catch { }

  console.log("GhostLink: 404 hit", {
    shop,
    cleanUrl,
    referrer: referrer ?? null,
  });

  // 1. Log the hit
  const log = await db.ghostLinkLog.upsert({
    where: { shop_url: { shop, url: cleanUrl } },
    update: {
      hitCount: { increment: 1 },
      referrer: referrer || null,
      updatedAt: new Date(),
    },
    create: {
      shop,
      url: cleanUrl,
      referrer: referrer || null,
      hitCount: 1,
      status: "pending",
    },
  });

  const settings = await db.ghostLinkSettings.findUnique({ where: { shop } });

  if (settings?.autoPilot && log.status === "pending") {
    const { admin } = await unauthenticated.admin(shop);

    console.log("inside admin")

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
              path: cleanUrl,
              target: settings.autoRedirectToHome
                ? "/"
                : settings.autoTarget || "/",
            },
          },
        },
      );

      const resJson = await response.json();

      const userErrors = resJson?.data?.urlRedirectCreate?.userErrors ?? [];
      if (userErrors.length === 0) {
        await db.ghostLinkLog.update({
          where: { id: log.id },
          data: { status: "fixed" },
        });
        console.log(
          `GhostLink: Auto-Pilot fixed ${cleanUrl} -> ${settings.autoRedirectToHome ? "/" : settings.autoTarget
          }`,
        );
      } else {
        console.warn("GhostLink: urlRedirectCreate userErrors", userErrors);
      }
    } catch (error) {
      if (error instanceof GraphqlQueryError) {
        console.error("GhostLink: Admin GraphQL error details:", error.body?.errors);
      } else {
        console.error("GhostLink: Unexpected Admin API error:", error);
      }
    }
  }

  return { success: true };
};
