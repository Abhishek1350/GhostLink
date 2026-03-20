import { useAppBridge } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import {
    ActionFunctionArgs,
    data,
    LoaderFunctionArgs,
    useFetcher,
    useLoaderData,
    useNavigate,
    useSearchParams,
} from "react-router";
import {
    bulkDeleteRedirectsByIds,
    deleteRedirect,
    getUrlRedirects,
} from "~/lib/url-redirect.server";
import { authenticate } from "~/shopify.server";
import { RedirectTable } from "./components";
import { UrlRedirect } from "~/types/admin.types";

const PAGE_SIZE = 15;

export async function loader({ request }: LoaderFunctionArgs) {
    const { admin } = await authenticate.admin(request);
    const url = new URL(request.url);
    const after = url.searchParams.get("after") || undefined;
    const before = url.searchParams.get("before") || undefined;

    const paginationParams = before
        ? { last: PAGE_SIZE, before }
        : { first: PAGE_SIZE, after };

    return getUrlRedirects(admin, paginationParams);
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const intent = formData.get("intent");

    switch (intent) {
        case "delete": {
            const id = formData.get("id") as string;
            return await deleteRedirect(admin, { id });
        }

        case "bulk-delete": {
            const idsRaw = formData.get("ids") as string;
            const ids = JSON.parse(idsRaw) as string[];
            return await bulkDeleteRedirectsByIds(admin, { ids });
        }

        default:
            return data(
                { success: false, error: "Invalid action" },
                { status: 400 },
            );
    }
};

export default function Redirects() {
    const redirects = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const bulkDeleteFetcher = useFetcher<typeof action>();
    const appBridge = useAppBridge();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const nodes: UrlRedirect[] = redirects?.nodes ?? [];
    const pageInfo = redirects?.pageInfo ?? {
        hasNextPage: false,
        hasPreviousPage: false,
    };

    // Clear selection on data reload
    useEffect(() => {
        setSelectedIds([]);
    }, [redirects]);

    // Toast for bulk delete
    useEffect(() => {
        if (bulkDeleteFetcher.data?.success) {
            appBridge.toast.show("Deleted selected redirects");
        } else if (bulkDeleteFetcher.data?.error) {
            appBridge.toast.show(bulkDeleteFetcher.data.error, {
                isError: true,
            });
        }
    }, [bulkDeleteFetcher.data, appBridge]);

    // Toast for create/edit success via redirect URL parameters
    useEffect(() => {
        const successParam = searchParams.get("success");
        if (successParam === "created") {
            appBridge.toast.show("Redirect created");
            removeSuccessParam();
        } else if (successParam === "updated") {
            appBridge.toast.show("Redirect updated");
            removeSuccessParam();
        }
    }, [searchParams, appBridge]);

    function removeSuccessParam() {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("success");
        window.history.replaceState({}, document.title, newUrl.toString());
    }

    function handleBulkDelete() {
        bulkDeleteFetcher.submit(
            { intent: "bulk-delete", ids: JSON.stringify(selectedIds) },
            { method: "POST" },
        );
    }

    function handleNextPage() {
        if (pageInfo.endCursor) {
            const params = new URLSearchParams(searchParams);
            params.delete("before");
            params.set("after", pageInfo.endCursor);
            navigate(`?${params.toString()}`);
        }
    }

    function handlePreviousPage() {
        if (pageInfo.startCursor) {
            const params = new URLSearchParams(searchParams);
            params.delete("after");
            params.set("before", pageInfo.startCursor);
            navigate(`?${params.toString()}`);
        }
    }

    const handleEdit = useCallback((redirect: UrlRedirect) => {
        navigate(`/app/redirects/create?id=${encodeURIComponent(redirect.id)}`);
    }, [navigate]);

    return (
        <s-page heading="Redirects">
            <s-button
                variant="auto"
                icon="plus"
                slot="primary-action"
                onClick={() => navigate("/app/redirects/create")}
            >
                Create Redirect
            </s-button>

            <s-section heading="Redirects">
                <s-paragraph>
                    These redirects were created for you by GhostLink. You can
                    make changes.
                </s-paragraph>

                {selectedIds.length ? (
                    <s-box>
                        <s-stack direction="inline" gap="small">
                            <s-button
                                variant="auto"
                                tone="critical"
                                onClick={handleBulkDelete}
                                loading={
                                    bulkDeleteFetcher.state !== "idle" ? true : undefined
                                }
                            >
                                Delete Selected ({selectedIds.length})
                            </s-button>
                        </s-stack>
                    </s-box>
                ) : null}

                <s-box paddingBlockStart="base">
                    {!redirects || nodes.length === 0 ? (
                        <s-paragraph>No redirects found.</s-paragraph>
                    ) : (
                        <RedirectTable
                            redirects={nodes}
                            pageInfo={pageInfo}
                            selectedIds={selectedIds}
                            onSelectionChange={setSelectedIds}
                            onEdit={handleEdit}
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                        />
                    )}
                </s-box>
            </s-section>
        </s-page>
    );
}
