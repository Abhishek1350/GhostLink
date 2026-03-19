import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, data } from "react-router";
import { Fragment } from "react";
import shopify from "~/shopify.server";
import db from "~/db.server";
import { useExtensionActivation } from "~/hooks/useExtensionActivation";
import { ExtensionStatus, Settings, Table } from "./components";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { session } = await shopify.authenticate.admin(request);
    const shop = session.shop;

    const logs = await db.ghostLinkLog.findMany({
        where: { shop },
        orderBy: { hitCount: "desc" },
    });

    const settings = await db.ghostLinkSettings.findUnique({
        where: { shop },
    });

    return {
        logs,
        settings,
    };
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { session } = await shopify.authenticate.admin(request);
    const shop = session.shop;
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "saveSettings") {
        const autoPilot = formData.get("autoPilot") === "true";
        const autoTarget = formData.get("autoTarget") as string;

        await db.ghostLinkSettings.upsert({
            where: { shop },
            update: { autoPilot, autoTarget },
            create: { shop, autoPilot, autoTarget },
        });
        return { success: true };
    }

    return data({ error: "Invalid action" }, { status: 400 });
};

export default function Index() {
    const { logs, settings } = useLoaderData<typeof loader>();

    const extensionStatus = useExtensionActivation();

    return (
        <s-page heading="GhostLink Dashboard">
            <ui-title-bar title="GhostLink Dashboard" />
            {extensionStatus === "active" ? (
                <Fragment>
                    <Table heading="Detected Broken Links" logs={logs} />
                    <Settings heading="Settings" slot="aside" settings={settings} />
                </Fragment>
            ) : (
                <ExtensionStatus heading="Extension Status" status={extensionStatus} />
            )}
        </s-page>
    );
}
