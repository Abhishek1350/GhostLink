import { GhostLinkLog } from "@prisma/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { validateRedirectTarget } from "~/lib/utils";

export const FIX_MODAL = "fix-modal";

type Props = JSX.IntrinsicElements["s-modal"] & {
    link: GhostLinkLog | null;
    onClose: VoidFunction;
};
export function FixModal({ link, onClose, ...props }: Props) {
    const fetcher = useFetcher();
    const appBridge = useAppBridge();

    const loading = fetcher.state !== "idle";

    const [target, setTarget] = useState(link?.url || "/");
    const [targetError, setTargetError] = useState<string | undefined>();

    const modalRef = useRef<HTMLElementTagNameMap["s-modal"] | null>(null);

    useEffect(() => {
        if (fetcher.data?.success) {
            appBridge.toast.show("Fixed successfully");
            modalRef.current?.toggleOverlay();
            modalRef.current?.hideOverlay();
            onClose();
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
                id: link?.id as number,
                path: link?.path as string,
                target,
            },
            { method: "POST" },
        );
    }

    return (
        <s-modal
            id={FIX_MODAL}
            heading={`Fix Broken Link: ${link?.path}`}
            {...props}
            ref={modalRef}
        >
            <s-stack direction="block" gap="base">
                <s-text-field
                    label="Target Path"
                    name="target"
                    value={target}
                    onInput={(e) => {
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
        </s-modal>
    );
}
