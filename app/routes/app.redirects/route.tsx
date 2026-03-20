import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect } from "react";
import {
    ActionFunctionArgs,
    data,
    LoaderFunctionArgs,
    useFetcher,
    useLoaderData,
} from "react-router";
import { deleteRedirect, getUrlRedirects } from "~/lib/url-redirect.server";
import { authenticate } from "~/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const { admin } = await authenticate.admin(request);
    return getUrlRedirects(admin);
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "delete") {
        const id = formData.get("id") as string;
        return await deleteRedirect(admin, { id });
    }

    return data({ success: false, error: "Invalid action" }, { status: 400 });
};

export default function Redirects() {
    const redirects = useLoaderData<typeof loader>();

    const deleteFetcher = useFetcher<typeof action>();

    const appBridge = useAppBridge();

    function deleteRedirect(id: string) {
        deleteFetcher.submit(
            {
                intent: "delete",
                id,
            },
            { method: "POST" },
        );
    }

    useEffect(() => {
        if (deleteFetcher.data?.success) {
            appBridge.toast.show("Saved successfully");
        } else if (deleteFetcher.data?.error) {
            appBridge.toast.show(deleteFetcher.data.error, { isError: true });
        }
    }, [deleteFetcher.data, appBridge]);

    return (
        <s-page heading="Redirects">
            <s-button variant="auto" icon="plus" slot="primary-action">
                Create Redirect
            </s-button>
            <s-section heading="Redirects">
                <s-paragraph>
                    These redirects were created for you by GhostLink. You can make
                    changes.
                </s-paragraph>

                <s-box paddingBlockStart="base">
                    {!redirects || redirects?.nodes?.length === 0 ? (
                        <s-paragraph>No redirects found.</s-paragraph>
                    ) : (
                        <s-table>
                            <s-table-header-row>
                                <s-table-header listSlot="secondary">Path</s-table-header>
                                <s-table-header listSlot="secondary">Target</s-table-header>
                                <s-table-header listSlot="secondary">Actions</s-table-header>
                            </s-table-header-row>
                            <s-table-body>
                                {redirects.nodes.map((redirect) => (
                                    <s-table-row key={redirect.id}>
                                        <s-table-cell>{redirect.path}</s-table-cell>

                                        <s-table-cell>{redirect.target}</s-table-cell>
                                        <s-table-cell>
                                            <s-stack direction="inline" gap="small">
                                                <s-button
                                                    accessibilityLabel="Delete"
                                                    variant="auto"
                                                    icon="delete"
                                                    tone="critical"
                                                    onClick={() => deleteRedirect(redirect.id)}
                                                    loading={
                                                        deleteFetcher.state !== "idle" &&
                                                        deleteFetcher.formData?.get("id") === redirect.id
                                                    }
                                                />
                                                <s-button
                                                    accessibilityLabel="Edit"
                                                    variant="auto"
                                                    icon="edit"
                                                />
                                            </s-stack>
                                        </s-table-cell>
                                    </s-table-row>
                                ))}
                            </s-table-body>
                        </s-table>
                    )}
                </s-box>
            </s-section>
        </s-page>
    );
}
