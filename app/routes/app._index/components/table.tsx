import { GhostLinkLog } from "@prisma/client";

type Props = JSX.IntrinsicElements["s-section"] & {
    logs: GhostLinkLog[];
};

export function Table({ logs, ...props }: Props) {
    return (
        <s-section {...props}>
            <s-paragraph>
                These URLs resulted in 404 errors for your customers. Create redirects
                to recover lost traffic.
            </s-paragraph>

            {!logs || logs.length === 0 ? (
                <s-box padding="base" background="subdued" borderRadius="base">
                    <s-stack direction="block" gap="small">
                        <s-paragraph >
                            Looks clean! It seems you’ve installed it now. Please give us some time to identify any broken links. In the meantime, you can enable the settings to autopilot—it will automatically handle redirects for you. Alternatively, you can manually add redirects to specific pages by clicking the button below to configure them.
                        </s-paragraph>
                        <s-button href="/app/redirects" variant="auto">
                            Configure Redirects
                        </s-button>
                    </s-stack>
                </s-box>
            ) : (
                <s-box paddingBlockStart="base">
                    <s-table>
                        <s-table-header-row>
                            <s-table-header listSlot="primary">Hits</s-table-header>
                            <s-table-header listSlot="secondary">Path</s-table-header>
                            <s-table-header listSlot="secondary">Status</s-table-header>
                        </s-table-header-row>
                        <s-table-body>
                            {logs.map((log) => (
                                <s-table-row key={log.id}>
                                    <s-table-cell>
                                        <s-badge tone="neutral">{log.hitCount}</s-badge>
                                    </s-table-cell>

                                    <s-table-cell>
                                        <s-text type="strong">{log.path}</s-text>
                                    </s-table-cell>
                                    <s-table-cell>
                                        <s-badge
                                            tone={log.status === "FIXED" ? "success" : "critical"}
                                        >
                                            {log.status}
                                        </s-badge>
                                    </s-table-cell>
                                </s-table-row>
                            ))}
                        </s-table-body>
                    </s-table>
                </s-box>
            )}
        </s-section>
    );
}
