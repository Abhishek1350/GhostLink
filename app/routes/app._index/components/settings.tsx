import { GhostLinkSettings } from "@prisma/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

type Props = JSX.IntrinsicElements["s-section"] & {
    settings: GhostLinkSettings | null;
};

export function Settings({ settings, ...props }: Props) {
    const [autoPilot, setAutoPilot] = useState(settings?.autoPilot || false);
    const [autoTarget, setAutoTarget] = useState(settings?.autoTarget || "/");

    const fetcher = useFetcher<{ success?: boolean; error?: string }>();
    const shopifyBridge = useAppBridge();

    useEffect(() => {
        if (fetcher.data?.success) {
            shopifyBridge.toast.show("Saved successfully");
        } else if (fetcher.data?.error) {
            shopifyBridge.toast.show(fetcher.data.error, { isError: true });
        }
    }, [fetcher.data, shopifyBridge]);

    function handleSaveSettings() {
        fetcher.submit(
            {
                intent: "saveSettings",
                autoPilot: autoPilot.toString(),
                autoTarget,
            },
            { method: "POST" },
        );
    }

    return (
        <s-section {...props}>
            <s-paragraph>
                Configure GhostLink to automatically fix new 404s
            </s-paragraph>
            <s-stack direction="block" gap="base">
                <s-checkbox
                    label="Auto-Pilot"
                    details="Automatically fix new 404s"
                    checked={autoPilot}
                    onChange={(e: any) => setAutoPilot(e.target.checked)}
                />
                <s-text-field
                    label="Target Path"
                    details="Where to redirect 404s to"
                    value={autoTarget}
                    onChange={(e: any) => setAutoTarget(e.target.value)}
                />

                <s-button
                    variant="primary"
                    onClick={handleSaveSettings}
                    loading={fetcher.state !== "idle"}
                >
                    Save Configuration
                </s-button>
            </s-stack>
        </s-section>
    );
}
