import { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import { UrlRedirectCreateMutationVariables } from "~/types/admin.generated";

export const CREATE_REDIRECT = `#graphql
        mutation urlRedirectCreate($urlRedirect: UrlRedirectInput!) {
            urlRedirectCreate(urlRedirect: $urlRedirect) {
                urlRedirect { id }
                userErrors { message }
            }
        }
    `;

export async function createRedirect(
    admin: AdminApiContext,
    params: UrlRedirectCreateMutationVariables["urlRedirect"],
) {
    try {
        const variables: UrlRedirectCreateMutationVariables = {
            urlRedirect: params,
        };
        const response = await admin.graphql(CREATE_REDIRECT, { variables });

        if (!response.ok) throw new Error(response.statusText);
        const { data } = await response.json();

        const errors = data?.urlRedirectCreate?.userErrors ?? [];
        if (errors.length > 0) throw new Error(errors[0].message);

        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) };
    }
}
