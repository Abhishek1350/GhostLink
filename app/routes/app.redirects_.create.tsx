import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
    useLoaderData,
    useFetcher,
} from "react-router";
import {
    createRedirect,
    getUrlRedirect,
    updateRedirect,
} from "~/lib/url-redirect.server";
import { authenticate } from "~/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const { admin } = await authenticate.admin(request);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
        const urlRedirect = await getUrlRedirect(admin, id);
        return { redirect: urlRedirect };
    }

    return { redirect: null };
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);

    const formData = await request.formData();

    const intent = formData.get("intent") as string;
    const path = formData.get("path") as string;
    const target = formData.get("target") as string;

    if (intent === "update") {
        const id = formData.get("id") as string;
        const result = await updateRedirect(admin, { id, path, target });

        if (result.error) {
            return { error: result.error };
        }

        return redirect("/app/redirects");
    }

    if (intent === "create") {
        const result = await createRedirect(admin, { path, target });

        if (result.error) {
            return { error: result.error };
        }

        return redirect("/app/redirects");
    }

    return { error: "Invalid intent" };
};

export default function CreateOrEditRedirect() {
    const { redirect: existingRedirect } = useLoaderData<typeof loader>();
    const appBridge = useAppBridge();

    const [path, setPath] = useState(existingRedirect?.path ?? "");
    const [target, setTarget] = useState(existingRedirect?.target ?? "/");

    const isEditing = !!existingRedirect;

    const fetcher = useFetcher();

    useEffect(() => {
        if (fetcher.data?.error) {
            appBridge.toast.show(fetcher.data.error, { isError: true });
        }

        if (fetcher.data?.success) {
            appBridge.toast.show("Saved successfully");
        }
    }, [fetcher, appBridge]);

    function handleFormSubmit() {
        if (!path.trim() || !target.trim() || fetcher.state !== "idle") return;

        fetcher.submit(
            {
                intent: isEditing ? "update" : "create",
                id: existingRedirect?.id ?? "",
                path,
                target,
            },
            { method: "POST" },
        );
    }

    return (
        <s-page heading={isEditing ? "Edit Redirect" : "Create Redirect"}>
            <s-section heading={isEditing ? "Edit Redirect" : "Create Redirect"}>
                <s-paragraph>
                    These URLs resulted in 404 errors for your customers. Create redirects
                    to recover lost traffic.
                </s-paragraph>
                <s-box padding="base">
                    <s-stack direction="block" gap="base">
                        <s-text-field
                            label="Path"
                            name="path"
                            value={path}
                            onChange={(e) => setPath(e.currentTarget.value)}
                            required
                            details="The old path you want to redirect (e.g., /old-page)"
                        />

                        <s-text-field
                            label="Target"
                            name="target"
                            value={target}
                            onChange={(e) => setTarget(e.currentTarget.value)}
                            required
                            details="The new destination URL or path (e.g., /pages/new-page)"
                        />
                        <s-stack direction="inline" gap="small">
                            <s-button href="/app/redirects">Cancel</s-button>
                            <s-button
                                variant="primary"
                                type="submit"
                                onClick={handleFormSubmit}
                                loading={fetcher.state !== "idle"}
                            >
                                {isEditing ? "Save redirect" : "Create redirect"}
                            </s-button>
                        </s-stack>
                    </s-stack>
                </s-box>
            </s-section>
        </s-page>
    );
}
