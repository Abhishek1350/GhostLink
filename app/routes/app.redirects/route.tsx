import {
    ActionFunctionArgs,
    data,
    LoaderFunctionArgs,
    useLoaderData,
    useNavigate,
    useSearchParams,
} from "react-router";
import {
    deleteRedirect,
    getUrlRedirects,
} from "~/lib/url-redirect.server";
import { authenticate } from "~/shopify.server";
import { RedirectTable } from "./components";
import { UrlRedirect } from "~/types/admin.types";
import { ITEMS_PER_PAGE } from "~/lib/constants";

export async function loader({ request }: LoaderFunctionArgs) {
    const { admin } = await authenticate.admin(request);
    const url = new URL(request.url);
    const after = url.searchParams.get("after") || undefined;
    const before = url.searchParams.get("before") || undefined;

    const paginationParams = before
        ? { last: ITEMS_PER_PAGE, before }
        : { first: ITEMS_PER_PAGE, after };

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

    const nodes: UrlRedirect[] = redirects?.nodes ?? [];
    const pageInfo = redirects?.pageInfo ?? {
        hasNextPage: false,
        hasPreviousPage: false,
    };


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

                <s-box paddingBlockStart="small">
                    {!redirects || nodes.length === 0 ? (
                        <s-paragraph>No redirects found.</s-paragraph>
                    ) : (
                        <RedirectTable
                            redirects={nodes}
                            pageInfo={pageInfo}
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                        />
                    )}
                </s-box>
            </s-section>
        </s-page>
    );
}
