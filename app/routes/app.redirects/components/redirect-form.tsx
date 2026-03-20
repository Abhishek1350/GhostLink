import { Fragment, useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { FetcherResponse } from "~/types";
import { Modal } from "~/components";

type RedirectData =
    | {
        id: string;
        path: string;
        target: string;
    }
    | null
    | undefined;

type Props = {
    redirect: RedirectData;
};

export const FORM_ID = "redirect-form";

export function RedirectForm({ redirect }: Props) {
    const fetcher = useFetcher<FetcherResponse>();
    const appBridge = useAppBridge();

    const [path, setPath] = useState("");
    const [target, setTarget] = useState("");

    const isEditing = !!redirect?.id;

    useEffect(() => {
        if (redirect) {
            setPath(redirect.path);
            setTarget(redirect.target);
        }
    }, [redirect]);

    useEffect(() => {
        if (fetcher.data?.success) {
            appBridge.toast.show(isEditing ? "Redirect updated" : "Redirect created");
        } else if (fetcher.data?.error) {
            appBridge.toast.show(fetcher.data.error, { isError: true });
        }
    }, [fetcher.data, appBridge, isEditing]);

    function handleSave() {
        if (!path.trim() || !target.trim()) return;

        if (isEditing) {
            fetcher.submit(
                { intent: "update", id: redirect!.id, path, target },
                { method: "POST" },
            );
        } else {
            fetcher.submit({ intent: "create", path, target }, { method: "POST" });
        }
    }

    return (
        <Fragment>
            <Modal
                id={FORM_ID}
                body={
                    <s-stack direction="block" gap="base">
                        <s-text-field
                            label="Path"
                            name="path"
                            value={path}
                            onChange={(e: any) => setPath(e.target.value)}
                            required
                        />
                        <s-text-field
                            label="Target"
                            name="target"
                            value={target}
                            onChange={(e: any) => setTarget(e.target.value)}
                            required
                        />
                    </s-stack>
                }
                heading={isEditing ? "Edit Redirect" : "Create Redirect"}
                primaryAction={{
                    label: "Save",
                    onClick: handleSave,
                    loading: fetcher.state === "submitting",
                }}
            />
        </Fragment>
    );
}
