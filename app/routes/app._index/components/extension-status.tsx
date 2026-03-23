import { useRouteLoaderData } from "react-router";
import { EXTENSION_HANDLE, ExtStatus } from "~/hooks/useExtensionActivation";
import { useNavigate } from "react-router";

type Props = JSX.IntrinsicElements["s-section"] & {
    status: ExtStatus;
};

export function ExtensionStatus({ status, ...props }: Props) {
    const parentData = useRouteLoaderData("routes/app") as {
        apiKey: string;
    };

    function handleEnableThemeEditor() {
        const deepLink =
            `shopify://admin/themes/current/editor` +
            `?context=apps&activateAppId=${parentData.apiKey}/${EXTENSION_HANDLE}`;

        open(deepLink, "_top");
    }

    const navigate = useNavigate();

    function refresh() {
        navigate(0);
    }

    function renderContent() {
        switch (status) {
            case "loading":
                return (
                    <s-stack alignItems="center" gap="base" padding="large">
                        <s-spinner accessibilityLabel="Loading" size="large-100"></s-spinner>
                        <s-text>Checking Extension Status...</s-text>
                    </s-stack>
                )

            case "inactive":
                return (
                    <s-stack direction="block" gap="small" alignItems="center">
                        <s-badge tone="critical">Scout Not Found</s-badge>
                        <s-text>
                            Enable the App Embed to start tracking broken links.
                        </s-text>
                        <s-button variant="primary" onClick={handleEnableThemeEditor}>
                            Enable in Theme Editor
                        </s-button>
                    </s-stack>
                );

            case "error":
                return (
                    <s-stack direction="block" gap="small" alignItems="center">
                        <s-badge tone="critical">Error</s-badge>
                        <s-text>Something went wrong. Please try again.</s-text>
                        <s-button variant="primary" onClick={refresh}>
                            Refresh Status
                        </s-button>
                    </s-stack>
                );

            default:
                return null;
        }
    }

    if (status === "active") return null;

    return (
        <s-section {...props}>
            <s-box padding="base" borderWidth="base" borderRadius="base">
                <s-stack
                    direction="block"
                    gap="base"
                    alignItems="center"
                    justifyContent="center"
                >
                    {renderContent()}
                </s-stack>
            </s-box>
        </s-section>
    );
}
