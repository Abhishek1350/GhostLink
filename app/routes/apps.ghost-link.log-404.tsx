import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import shopify from "../shopify.server";
import dbStatic from "../db.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = dbStatic as any;

export const action = async ({ request }: ActionFunctionArgs) => {
  const auth = await shopify.authenticate.public.appProxy(request);
  const { shop } = auth as any;

  if (!shop) {
    return data({ message: "Unauthorized" }, { status: 401 });
  }

  // Handle payload from beacon/fetch
  const text = await request.text();
  let body: { url?: string; referrer?: string };
  try {
    body = JSON.parse(text);
  } catch (e) {
    return data({ message: "Invalid JSON" }, { status: 400 });
  }

  const { url, referrer } = body;
  if (!url) return data({ message: "URL required" }, { status: 400 });

  let cleanUrl = url;
  try {
    const urlObj = new URL(url);
    cleanUrl = urlObj.pathname + urlObj.search;
  } catch (e) {}

  console.log(`GhostLink: 404 hit for ${shop} at ${cleanUrl}`);

  // 1. Log the hit
  const log = await db.ghostLinkLog.upsert({
    where: { shop_url: { shop, url: cleanUrl } },
    update: { 
      hitCount: { increment: 1 },
      referrer: referrer || null,
      updatedAt: new Date()
    },
    create: {
      shop,
      url: cleanUrl,
      referrer: referrer || null,
      hitCount: 1,
      status: "pending"
    }
  });

  // 2. Check for Auto-Pilot
  const settings = await db.ghostLinkSettings.findUnique({ where: { shop } });
  
  if (settings?.autoPilot && log.status === "pending") {
    const { admin } = await shopify.unauthenticated.admin(shop);

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
            target: settings.autoTarget || "/",
          }
        }
      }
    );

    const resJson: any = await response.json();
    if (!resJson.data.urlRedirectCreate.userErrors.length) {
      await db.ghostLinkLog.update({
        where: { id: log.id },
        data: { status: "fixed" }
      });
      console.log(`GhostLink: Auto-Pilot fixed ${cleanUrl} -> ${settings.autoTarget}`);
    }
  }

  return { success: true };
};
