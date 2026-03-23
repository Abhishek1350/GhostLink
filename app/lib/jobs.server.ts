import { LinkStatus, Session } from "@prisma/client";
import { logHit, updateLogStatus } from "~/lib/link-logs.server";
import { createRedirect } from "~/lib/url-redirect.server";
import { getSettings } from "~/lib/settings.server";
import { unauthenticated } from "~/shopify.server";
import db from "~/db.server";

type JobParams = {
  shop: Session["shop"];
  pathKey: string;
  fullUrl: string;
  referrer?: string;
};

/**
 * Background job to log the 404 hit to the database.
 */
export async function logHitJob({ shop, pathKey, fullUrl, referrer }: JobParams) {
  try {
    return await logHit(shop, { pathKey, fullUrl, referrer });
  } catch (error) {
    console.error("GhostLink: Error in logHitJob:", error);
    return null;
  }
}

/**
 * Background job to handle Auto-Pilot redirection logic.
 */
export async function handleAutoPilotJob({ shop, pathKey }: { shop: string; pathKey: string }) {
  try {
    const settings = await getSettings(shop);
    if (!settings?.autoPilot) return;

    const { admin } = await unauthenticated.admin(shop);
    if (!admin) return;

    // Retry logic for Shopify API
    let createStatus;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {
        createStatus = await createRedirect(admin, {
          path: pathKey,
          target: settings.autoTarget || "/",
        });
        if (createStatus?.success) break;
      } catch (e) {
        console.error(`GhostLink: Auto-Pilot attempt ${attempts + 1} failed for ${shop}:`, e);
      }
      attempts++;
      if (attempts < maxAttempts) await new Promise((r) => setTimeout(r, 500));
    }

    if (createStatus?.success) {
      const log = await db.ghostLinkLog.findUnique({
        where: { shop_path: { shop, path: pathKey } }
      });

      if (log && log.status !== LinkStatus.FIXED) {
        await updateLogStatus(log.id, LinkStatus.FIXED);
      }
    }
  } catch (error) {
    console.error("GhostLink: Error in handleAutoPilotJob:", error);
  }
}
