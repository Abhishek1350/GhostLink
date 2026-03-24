import { GhostLinkLog } from "@prisma/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { formatDateTime, validateRedirectTarget } from "~/lib/utils";

export const FIX_MODAL = "fix-modal";
export type MODAL_TYPE = "Fix" | "Details";

type Props = JSX.IntrinsicElements["s-modal"] & {
    log: GhostLinkLog;
    type: MODAL_TYPE;
};

export function FixModal({ log, type, ...props }: Props) {
    const fetcher = useFetcher();
    const appBridge = useAppBridge();

    const loading = fetcher.state !== "idle";

    const [target, setTarget] = useState(log?.url || "/");
    const [targetError, setTargetError] = useState<string | undefined>();

    const modalRef = useRef<HTMLElementTagNameMap["s-modal"] | null>(null);

    useEffect(() => {
        if (fetcher.data?.success) {
            appBridge.toast.show("Fixed successfully");
            modalRef.current?.toggleOverlay();
            modalRef.current?.hideOverlay();
            setTargetError(undefined);
        } else if (fetcher.data?.error) {
            appBridge.toast.show(fetcher.data.error, { isError: true });
        }
    }, [fetcher.data, appBridge]);

    function handleSave() {
        const { valid, error } = validateRedirectTarget(target);
        if (!valid) {
            setTargetError(error);
            return;
        }
        setTargetError(undefined);

        fetcher.submit(
            {
                intent: "fixLink",
                id: log?.id as number,
                path: log?.path as string,
                target,
            },
            { method: "POST" },
        );
    }

    function FixForm() {
        return (
            <Fragment>
                <s-stack direction="block" gap="base">
                    <s-text-field
                        label="Target Path"
                        name="target"
                        value={target}
                        onChange={(e) => {
                            setTarget(e.currentTarget.value);
                            if (targetError) setTargetError(undefined);
                        }}
                        required
                        details="The new URL that visitors should be forwarded to. If you want to redirect to your store's homepage, enter / (a forward slash)"
                        error={targetError}
                    />
                </s-stack>
                <s-button
                    slot="primary-action"
                    variant="primary"
                    loading={loading}
                    onClick={handleSave}
                    disabled={!target}
                >
                    Create redirect
                </s-button>
                <s-button
                    slot="secondary-actions"
                    variant="secondary"
                    commandFor={props?.id || FIX_MODAL}
                    command="--hide"
                >
                    Cancel
                </s-button>
            </Fragment>
        );
    }

    return (
        <s-modal
            id={FIX_MODAL}
            heading={`${type === "Details" ? "Details" : "Fix"}: ${log?.path}`}
            {...props}
            ref={modalRef}
        >
            {type === "Fix" ? <FixForm /> : <LogDetailsContent log={log} />}
        </s-modal>
    );
}

export function LogDetailsContent({ log }: Pick<Props, "log">) {
    const titleGap = "small-400";
    return (
        <s-box padding="none">
            <s-box
                background="base"
                border="small-100 subdued solid"
                borderRadius="large-100"
                padding="large"
            >
                <s-stack direction="block" gap="large">
                    <s-stack
                        direction="inline"
                        gap="base"
                        justifyContent="space-between"
                        alignItems="start"
                    >
                        <s-stack gap={titleGap}>
                            <s-text color="subdued">Path</s-text>
                            <s-text type="strong">{log?.path ?? "—"}</s-text>
                        </s-stack>

                        <s-stack gap={titleGap} alignItems="end">
                            {log ? (
                                <s-badge tone={log.status === "FIXED" ? "success" : "critical"}>
                                    {log.status}
                                </s-badge>
                            ) : (
                                <s-text>—</s-text>
                            )}
                        </s-stack>
                    </s-stack>

                    <s-divider direction="inline" />

                    <s-stack direction="inline" gap="base" justifyContent="space-between" alignItems="start">
                        <s-stack gap={titleGap}>
                            <s-text color="subdued">Hits</s-text>
                            <s-text type="strong">{log?.hitCount ?? "—"}</s-text>
                        </s-stack>

                        <s-stack gap={titleGap}>
                            <s-text color="subdued">First hit</s-text>
                            <s-text>{formatDateTime(log?.createdAt ?? null)}</s-text>
                        </s-stack>

                        <s-stack gap={titleGap}>
                            <s-text color="subdued">Last hit</s-text>
                            <s-text>
                                {formatDateTime(log?.updatedAt ?? log?.createdAt ?? null)}
                            </s-text>
                        </s-stack>
                    </s-stack>

                    <s-divider direction="inline" />

                    <s-stack direction="inline" gap="base">
                        <s-stack gap={titleGap}>
                            <s-text color="subdued">Full URL</s-text>
                            {log?.url ? (
                                <s-link href={log.url} target="_blank">
                                    {log.url}
                                </s-link>
                            ) : (
                                <s-text>—</s-text>
                            )}
                        </s-stack>

                        <s-stack gap={titleGap}>
                            <s-text color="subdued">Referrer</s-text>
                            {log?.referrer ? (
                                <s-link href={log.referrer} target="_blank">
                                    {log.referrer}
                                </s-link>
                            ) : (
                                <s-text>—</s-text>
                            )}
                        </s-stack>
                    </s-stack>
                </s-stack>
            </s-box>
        </s-box>
    );
}