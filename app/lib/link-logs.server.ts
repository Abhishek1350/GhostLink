import { GhostLinkLog, LinkStatus, Session } from "@prisma/client";
import db from "~/db.server";

export async function getLogs(shop: Session["shop"]) {
    try {
        return await db.ghostLinkLog.findMany({
            where: { shop },
            orderBy: { hitCount: "desc" },
        });
    } catch (error) {
        return [];
    }
}

type logHitPrams = {
    pathKey: string;
    fullUrl: string;
    referrer?: string;
};

export async function logHit(
    shop: Session["shop"],
    { pathKey, fullUrl, referrer }: logHitPrams,
) {
    try {
        return await db.ghostLinkLog.upsert({
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
                status: LinkStatus.PENDING,
            },
        });
    } catch (error) {
        return null;
    }
}

export async function updateLogStatus(
    id: GhostLinkLog["id"],
    status: LinkStatus,
) {
    try {
        return await db.ghostLinkLog.update({
            where: { id },
            data: { status },
        });
    } catch (error) {
        return null;
    }
}
