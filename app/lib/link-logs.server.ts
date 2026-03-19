import { Session } from "@prisma/client";
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
