import { AdminApiContext } from "@shopify/shopify-app-react-router/server";

export type GraphQLResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

type ShopifyResponse<T> = {
    data?: T;
    errors?: { message: string }[];
};

type ErrorExtractor<T> = (data: T) => { message: string }[] | undefined;

export async function shopifyRequest<T>({
    admin,
    query,
    variables,
    extractErrors,
}: {
    admin: AdminApiContext;
    query: string;
    variables?: Record<string, unknown>;
    extractErrors?: ErrorExtractor<T>;
}): Promise<GraphQLResult<T>> {
    try {
        const response = await admin.graphql(query, { variables });

        if (!response.ok) {
            return { success: false, error: response.statusText };
        }

        const json: ShopifyResponse<T> = await response.json();

        if (!json.data) {
            return {
                success: false,
                error: json.errors?.[0]?.message ?? "No data returned from Shopify",
            };
        }

        if (extractErrors) {
            const errors = extractErrors(json.data);
            if (errors && errors.length > 0) {
                return { success: false, error: errors[0].message };
            }
        }

        return { success: true, data: json.data };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : String(err),
        };
    }
}

// export async function getUrlRedirectss(admin: AdminApiContext) {
//     const res = await shopifyRequest<UrlRedirectQuery>({
//         admin,
//         query: GET_URL_REDIRECTS,
//     });

//     if (!res.success) return null;

//     return res.data.urlRedirects
// }
