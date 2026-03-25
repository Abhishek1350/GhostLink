import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const { topic, shop } = await authenticate.webhook(request);
    console.log(`Received ${topic} webhook for ${shop}`);

    try {
        await db.$transaction([
            db.ghostLinkLog.deleteMany({ where: { shop } }),
            db.ghostLinkSettings.deleteMany({ where: { shop } }),
            db.shopInstallEvent.deleteMany({ where: { shop } }),
            db.shop.deleteMany({ where: { shop } }),
        ]);
    } catch (error) {
        console.error(`Error handling SHOP_REDACT for shop=${shop}:`, error);
    }

    return new Response();
};