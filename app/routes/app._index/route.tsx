import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, data, useOutletContext } from "react-router";
import { Fragment } from "react";
import shopify from "~/shopify.server";
import { ExtensionStatus, Settings, Table } from "./components";
import { getLogs } from "~/lib/link-logs.server";
import { getSettings, saveSettings } from "~/lib/settings.server";
import { AppOutletContext } from "~/routes/app";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { session } = await shopify.authenticate.admin(request);
    const shop = session.shop;

    const logsPromise = getLogs(shop);
    const settingsPromise = getSettings(shop);

    const [logs, settings] = await Promise.all([logsPromise, settingsPromise]);

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

        return await saveSettings({ shop, autoPilot, autoTarget });
    }

    return data({ error: "Invalid action" }, { status: 400 });
};

export default function Index() {
    const { logs, settings } = useLoaderData<typeof loader>();

    const { extensionStatus } = useOutletContext<AppOutletContext>();

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
