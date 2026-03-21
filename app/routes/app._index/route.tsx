import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, data, useOutletContext } from "react-router";
import { Fragment } from "react";
import shopify from "~/shopify.server";
import { ExtensionStatus, Settings, Table } from "./components";
import { getLogs, updateLogStatus } from "~/lib/link-logs.server";
import { getSettings, saveSettings } from "~/lib/settings.server";
import { AppOutletContext } from "~/routes/app";
import { LinkStatus } from "@prisma/client";
import { createRedirect } from "~/lib/url-redirect.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { session } = await shopify.authenticate.admin(request);
    const shop = session.shop;

    const url = new URL(request.url);
    const type = url.searchParams.get("type") as LinkStatus;
    const page = url.searchParams.get("page");

    const logsPromise = getLogs(shop, { type, page: Number(page) });
    const settingsPromise = getSettings(shop);

    const [logs, settings] = await Promise.all([logsPromise, settingsPromise]);

    return {
        logs,
        settings,
        hasFilters: !!type || !!page,
    };
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { session, admin } = await shopify.authenticate.admin(request);
    const shop = session.shop;
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "saveSettings") {
        const autoPilot = formData.get("autoPilot") === "true";
        const autoTarget = formData.get("autoTarget") as string;

        return await saveSettings({ shop, autoPilot, autoTarget });
    }

    if (intent === "fixLink") {
        const id = formData.get("id") as string;
        const path = formData.get("path") as string;
        const target = (formData.get("target") as string) ?? "/";

        const redirect = await createRedirect(admin, { path, target });
        
        if (redirect.error) {
            return data({ error: redirect.error }, { status: 400 });
        }

        updateLogStatus(Number(id), LinkStatus.FIXED);

        return data({ success: true });
    }

    return data({ error: "Invalid action" }, { status: 400 });
};

export default function Index() {
    const { logs, settings, hasFilters } = useLoaderData<typeof loader>();

    const { extensionStatus } = useOutletContext<AppOutletContext>();

    return (
        <s-page heading="GhostLink Dashboard">
            <ui-title-bar title="GhostLink Dashboard" />
            {extensionStatus === "active" ? (
                <Fragment>
                    <s-section heading="Detected Broken Links">
                        <s-paragraph>
                            Broken links can tank your SEO and hurt your conversion rates.
                        </s-paragraph>
                        {!hasFilters && logs?.data?.length === 0 ? (
                            <s-box padding="base" background="subdued" borderRadius="base">
                                <s-stack direction="block" gap="small">
                                    <s-paragraph>
                                        No broken links detected yet. Please give us some time to
                                        scan your site. In the meantime, you can enable autopilot
                                        and let us do the work!
                                    </s-paragraph>
                                </s-stack>
                            </s-box>
                        ) : null}
                        <Table logs={logs} hasFilters={hasFilters} />
                    </s-section>

                    <Settings heading="Settings" slot="aside" settings={settings} />
                </Fragment>
            ) : (
                <ExtensionStatus heading="Extension Status" status={extensionStatus} />
            )}
        </s-page>
    );
}
