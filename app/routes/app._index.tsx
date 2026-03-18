import type { ActionFunctionArgs, LoaderFunctionArgs, HeadersFunction } from "react-router";
import { useLoaderData, useFetcher, data } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import shopify from "../shopify.server";
import dbStatic from "../db.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = dbStatic as any;

interface GhostLinkLog {
  id: number;
  shop: string;
  url: string;
  referrer: string | null;
  hitCount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface GhostLinkSettings {
  autoPilot: boolean;
  autoTarget: string;
}

interface LoaderData {
  logs: GhostLinkLog[];
  settings: GhostLinkSettings;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await shopify.authenticate.admin(request);
  const shop = session.shop;

  const logs: GhostLinkLog[] = await db.ghostLinkLog.findMany({
    where: { shop },
    orderBy: { hitCount: 'desc' },
  });

  const settings: GhostLinkSettings = await db.ghostLinkSettings.findUnique({ where: { shop } }) || {
    autoPilot: false,
    autoTarget: "/"
  };

  return { logs, settings };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await shopify.authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "fix") {
    const logId = Number(formData.get("logId"));
    const targetPath = formData.get("targetPath") as string;
    
    const log = await db.ghostLinkLog.findUnique({ where: { id: logId } });
    if (!log) return data({ error: "Log not found" }, { status: 404 });

    const response = await admin.graphql(
      `#graphql
      mutation urlRedirectCreate($urlRedirect: UrlRedirectInput!) {
        urlRedirectCreate(urlRedirect: $urlRedirect) {
          userErrors { message }
        }
      }`,
      { variables: { urlRedirect: { path: log.url, target: targetPath } } }
    );

    const resJson: any = await response.json();
    if (resJson.data.urlRedirectCreate.userErrors.length > 0) {
      return data({ error: resJson.data.urlRedirectCreate.userErrors[0].message }, { status: 400 });
    }

    await db.ghostLinkLog.update({ where: { id: logId }, data: { status: "fixed" } });
    return { success: true };
  }

  if (intent === "saveSettings") {
    const autoPilot = formData.get("autoPilot") === "true";
    const autoTarget = formData.get("autoTarget") as string;

    await db.ghostLinkSettings.upsert({
      where: { shop },
      update: { autoPilot, autoTarget },
      create: { shop, autoPilot, autoTarget }
    });
    return { success: true };
  }

  return data({ error: "Invalid action" }, { status: 400 });
};

export default function Index() {
  const { logs, settings } = useLoaderData<LoaderData>();
  const fetcher = useFetcher<{ success?: boolean; error?: string }>();
  const shopifyBridge = useAppBridge();
  
  const [targetPaths, setTargetPaths] = useState<Record<number, string>>({});
  const [autoPilot, setAutoPilot] = useState(settings.autoPilot);
  const [autoTarget, setAutoTarget] = useState(settings.autoTarget);

  useEffect(() => {
    if (fetcher.data?.success) {
      shopifyBridge.toast.show("Saved successfully");
    } else if (fetcher.data?.error) {
      shopifyBridge.toast.show(fetcher.data.error, { isError: true });
    }
  }, [fetcher.data, shopifyBridge]);

  const handleFix = (logId: number) => {
    fetcher.submit({ intent: "fix", logId: logId.toString(), targetPath: targetPaths[logId] || "/" }, { method: "POST" });
  };

  const handleSaveSettings = () => {
    fetcher.submit({ intent: "saveSettings", autoPilot: autoPilot.toString(), autoTarget }, { method: "POST" });
  };

  const pendingLogs = logs.filter((l) => l.status === "pending");

  return (
    <s-page heading="GhostLink Dashboard">
      <ui-title-bar title="GhostLink Dashboard" />
      
      <s-section heading="Settings">
        <s-stack direction="block" gap="base">
          <s-checkbox 
            label="Enable Auto-Pilot (Automatically fix new 404s)"
            checked={autoPilot}
            onChange={(e: any) => setAutoPilot(e.target.checked)}
          ></s-checkbox>
          
          <s-text-field 
            label="Auto-Pilot Target Path" 
            value={autoTarget} 
            onChange={(e: any) => setAutoTarget(e.target.value)}
          ></s-text-field>
          
          <s-button onClick={handleSaveSettings}>
            Save Configuration
          </s-button>
        </s-stack>
      </s-section>

      <s-section heading="Detected Broken Links">
        <s-paragraph>
          These URLs resulted in 404 errors for your customers. Create redirects to recover lost traffic.
        </s-paragraph>

        {pendingLogs.length === 0 ? (
          <s-box padding="base" background="subdued" borderRadius="base">
            <s-text>Everything looks ghost-free! No new 404s detected.</s-text>
          </s-box>
        ) : (
          <s-box paddingBlockStart="base">
            <s-table variant="list">
              <s-table-header-row>
                <s-table-header listSlot="primary">Hits</s-table-header>
                <s-table-header listSlot="secondary">Path</s-table-header>
                <s-table-header listSlot="inline">Action</s-table-header>
              </s-table-header-row>
              <s-table-body>
                {pendingLogs.map((log: any) => (
                  <s-table-row key={log.id}>
                    <s-table-cell>
                      <s-badge tone="caution">{log.hitCount}</s-badge>
                    </s-table-cell>
                    
                    <s-table-cell>
                      <s-stack direction="block" gap="small">
                        <s-text type="strong">{log.url}</s-text>
                        {log.referrer && (
                          <s-text color="subdued">Referrer: {log.referrer}</s-text>
                        )}
                      </s-stack>
                    </s-table-cell>

                    <s-table-cell>
                      <s-stack direction="inline" gap="small" alignItems="center">
                        <s-text-field
                          placeholder="Redirect target (e.g. /)"
                          value={targetPaths[log.id] || ""}
                          onChange={(e: any) => setTargetPaths({ ...targetPaths, [log.id]: e.target.value })}
                        ></s-text-field>
                        <s-button variant="primary" onClick={() => handleFix(log.id)}>Repair</s-button>
                      </s-stack>
                    </s-table-cell>
                  </s-table-row>
                ))}
              </s-table-body>
            </s-table>
          </s-box>
        )}
      </s-section>

      <s-section slot="aside" heading="Analytics">
        <s-stack direction="block" gap="base">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>Recoverable Hits</s-heading>
            <s-text type="strong">
              {pendingLogs.reduce((acc, log) => acc + log.hitCount, 0)}
            </s-text>
          </s-box>
        </s-stack>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
