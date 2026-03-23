import { GhostLinkSettings } from "@prisma/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { validateRedirectTarget } from "~/lib/utils";

type Props = JSX.IntrinsicElements["s-section"] & {
    settings: GhostLinkSettings | null;
};

export function Settings({ settings, ...props }: Props) {
    const [autoPilot, setAutoPilot] = useState(settings?.autoPilot || false);
    const [autoTarget, setAutoTarget] = useState(settings?.autoTarget || "/");
    const [targetError, setTargetError] = useState<string | undefined>();

    const fetcher = useFetcher();
    const appBridge = useAppBridge();

    useEffect(() => {
        if (fetcher.data?.success) {
            appBridge.toast.show("Saved successfully");
        } else if (fetcher.data?.error) {
            appBridge.toast.show(fetcher.data.error, { isError: true });
        }
    }, [fetcher.data, appBridge]);

    function handleSaveSettings() {
        const { valid, error } = validateRedirectTarget(autoTarget);
        if (!valid) {
            setTargetError(error);
            return;
        }
        setTargetError(undefined);

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
            <s-stack direction="block" gap="base">
                <s-checkbox
                    label="Auto-Pilot"
                    details="Automatically fix new 404s"
                    checked={autoPilot}
                    onChange={(e) => setAutoPilot(e.currentTarget.checked)}
                />
                <s-text-field
                    label="Target Path"
                    details="The new URL that visitors should be forwarded to. If you want to redirect to your store's homepage, enter / (a forward slash)."
                    value={autoTarget}
                    onInput={(e) => {
                        setAutoTarget(e.currentTarget.value)
                        if(targetError) setTargetError(undefined);
                        console.log("fjsdlfjk")
                    }}
                    error={targetError}
                    disabled={!autoPilot}
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
