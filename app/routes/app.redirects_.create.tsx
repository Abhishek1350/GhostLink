import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
    useActionData,
    useLoaderData,
    useNavigate,
    useNavigation,
    useSubmit,
} from "react-router";
import { createRedirect, getUrlRedirect, updateRedirect } from "~/lib/url-redirect.server";
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
        return redirect("/app/redirects?success=updated");
    }

    if (intent === "create") {
        const result = await createRedirect(admin, { path, target });

        if (result.error) {
            return { error: result.error };
        }
        return redirect("/app/redirects?success=created");
    }

    return { error: "Invalid intent" };
};

export default function CreateOrEditRedirect() {
    const { redirect: existingRedirect } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const submit = useSubmit();
    const appBridge = useAppBridge();
    const navigate = useNavigate();

    const [path, setPath] = useState(existingRedirect?.path ?? "");
    const [target, setTarget] = useState(existingRedirect?.target ?? "");

    const isEditing = !!existingRedirect;
    const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";

    useEffect(() => {
        if (actionData?.error) {
            appBridge.toast.show(actionData.error, { isError: true });
        }
    }, [actionData, appBridge]);

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!path.trim() || !target.trim()) return;

        const formData = new FormData();
        formData.set("intent", isEditing ? "update" : "create");
        formData.set("path", path);
        formData.set("target", target);
        if (isEditing && existingRedirect) {
            formData.set("id", existingRedirect.id);
        }

        submit(formData, { method: "POST" });
    }

    return (
        <s-page heading={isEditing ? "Edit Redirect" : "Create Redirect"}>
            <ui-title-bar title={isEditing ? "Edit Redirect" : "Create Redirect"}>
                <button variant="breadcrumb" onClick={() => navigate("/app/redirects")}>
                    Redirects
                </button>
            </ui-title-bar>

            <s-section>
                <form onSubmit={handleFormSubmit}>
                    <s-box padding="base">
                        <s-stack direction="block" gap="base">
                            <s-box>
                                <s-text-field
                                    label="Path"
                                    name="path"
                                    value={path}
                                    onChange={(e: any) => setPath(e.target.value)}
                                    required
                                />
                                <s-text tone="info">The old path you want to redirect (e.g., /old-page)</s-text>
                            </s-box>

                            <s-box>
                                <s-text-field
                                    label="Target"
                                    name="target"
                                    value={target}
                                    onChange={(e: any) => setTarget(e.target.value)}
                                    required
                                />
                                <s-text tone="info">The new destination URL or path (e.g., /pages/new-page)</s-text>
                            </s-box>

                            <s-box paddingBlockStart="base">
                                <s-stack direction="inline" gap="small">
                                    <s-button
                                        variant="primary"
                                        loading={isSubmitting || undefined}
                                    >
                                        {isEditing ? "Save redirect" : "Create redirect"}
                                    </s-button>
                                    <s-button onClick={() => navigate("/app/redirects")}>
                                        Cancel
                                    </s-button>
                                </s-stack>
                            </s-box>
                        </s-stack>
                    </s-box>
                </form>
            </s-section>
        </s-page>
    );
}
