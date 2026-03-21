import db from "~/db.server";

export async function handleAppInstalled(shopDomain: string) {
    const now = new Date();

    try {
        await db.$transaction(async (tx) => {
            await tx.shop.upsert({
                where: { shop: shopDomain },
                update: {
                    installCount: { increment: 1 },
                    isInstalled: true,
                    lastInstalledAt: now,
                },
                create: {
                    shop: shopDomain,
                    installCount: 1,
                    uninstallCount: 0,
                    isInstalled: true,
                    firstInstalledAt: now,
                    lastInstalledAt: now,
                },
            });

            await tx.shopInstallEvent.create({
                data: {
                    shop: shopDomain,
                    type: "INSTALLED",
                },
            });
        });
    } catch (error) {
        console.error(
            "Failed to handle app installed for shop:",
            shopDomain,
            error,
        );
    }
}

export async function handleAppUninstalled(shopDomain: string) {
    const now = new Date();

    try {
        await db.$transaction(async (tx) => {
            await tx.shop.update({
                where: { shop: shopDomain },
                data: {
                    isInstalled: false,
                    uninstallCount: { increment: 1 },
                    lastUninstalledAt: now,
                },
            });

            await tx.shopInstallEvent.create({
                data: {
                    shop: shopDomain,
                    type: "UNINSTALLED",
                },
            });

            await tx.session.deleteMany({
                where: { shop: shopDomain },
            });
        });
    } catch (error) {
        console.error(`handleAppUninstalled error for shop=${shopDomain}:`, error);
        // For webhooks, *usually* still respond 200, but you want monitoring/alerts.
        throw error;
    }
}
