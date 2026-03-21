import { GhostLinkLog } from "@prisma/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

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

    const modalRef = useRef<HTMLElementTagNameMap["s-modal"]  | null>(null);

    useEffect(() => {
        if (fetcher.data?.success) {
            appBridge.toast.show("Fixed successfully")
            modalRef.current?.toggleOverlay();
            modalRef.current?.hideOverlay();
            onClose();
        } else if (fetcher.data?.error) {
            appBridge.toast.show(fetcher.data.error, { isError: true });
        }
    }, [fetcher.data, appBridge]);

    function handleSave() {
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
                    label="Target"
                    name="target"
                    value={target}
                    onChange={(e) => setTarget(e.currentTarget.value)}
                    required
                    details="The new destination URL or path (e.g., /pages/new-page)"
                />
            </s-stack>
            <s-button
                slot="primary-action"
                variant="primary"
                loading={loading}
                onClick={handleSave}
            >
                Submit
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
