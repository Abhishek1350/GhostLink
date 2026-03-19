import { Session, GhostLinkSettings } from "@prisma/client";
import db from "~/db.server";

export async function getSettings(shop: Session["shop"]) {
    try {
        return await db.ghostLinkSettings.findUnique({
            where: { shop },
        });
    } catch (error) {
        return null;
    }
}

type SaveSettingsParams = {
    shop: Session["shop"];
    autoPilot: GhostLinkSettings["autoPilot"];
    autoTarget: GhostLinkSettings["autoTarget"];
};

export async function saveSettings(params: SaveSettingsParams) {
    try {
        const { shop, autoPilot, autoTarget } = params;
        await db.ghostLinkSettings.upsert({
            where: { shop },
            update: { autoPilot, autoTarget },
            create: { shop, autoPilot, autoTarget },
        });
        return { success: true };
    } catch (error) {
        return { error: "Failed to save settings" };
    }
}
