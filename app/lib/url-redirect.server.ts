import { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import {
    GET_URL_REDIRECTS,
    GET_URL_REDIRECT,
    CREATE_REDIRECT,
    UPDATE_REDIRECT,
    DELETE_REDIRECT,
    BULK_DELETE_REDIRECTS_BY_IDS,
    BULK_DELETE_ALL_REDIRECTS,
} from "./gql.server";
import {
    UrlRedirectQuery,
    GetUrlRedirectQueryVariables,
    UrlRedirectCreateMutationVariables,
    UrlRedirectUpdateMutationVariables,
    UrlRedirectDeleteMutationVariables,
    UrlRedirectBulkDeleteByIdsMutationVariables,
} from "~/types/admin.generated";

type PaginationParams = {
    first?: number;
    last?: number;
    after?: string;
    before?: string;
};

export async function getUrlRedirects(
    admin: AdminApiContext,
    params: PaginationParams = { first: 15 },
) {
    try {
        const response = await admin.graphql(GET_URL_REDIRECTS, {
            variables: params,
        });
        if (!response.ok) throw new Error(response.statusText);

        const { data } = await response.json();

        return data?.urlRedirects;
    } catch (error) {
        return null;
    }
}

export async function getUrlRedirect(
    admin: AdminApiContext,
    id: string,
) {
    try {
        const variables: GetUrlRedirectQueryVariables = { id };
        const response = await admin.graphql(GET_URL_REDIRECT, { variables });
        if (!response.ok) throw new Error(response.statusText);

        const { data } = await response.json();
        return data?.urlRedirect;
    } catch (error) {
        return null;
    }
}

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

type UpdateRedirectParams = {
    id: string;
    path: UrlRedirectUpdateMutationVariables["urlRedirect"]["path"];
    target: UrlRedirectUpdateMutationVariables["urlRedirect"]["target"];
};

export async function updateRedirect(
    admin: AdminApiContext,
    params: UpdateRedirectParams,
) {
    const { id, path, target } = params;

    const urlRedirectInput: Record<string, unknown> = {};
    if (typeof path === "string") urlRedirectInput.path = path;
    if (typeof target === "string") urlRedirectInput.target = target;

    try {
        const variables: UrlRedirectUpdateMutationVariables = {
            id,
            urlRedirect: urlRedirectInput,
        };

        const response = await admin.graphql(UPDATE_REDIRECT, { variables });

        if (!response.ok) throw new Error(response.statusText);

        const { data } = await response.json();

        const errors = data?.urlRedirectUpdate?.userErrors ?? [];
        if (errors.length > 0) {
            throw new Error(errors[0].message);
        }
        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) };
    }
}

export async function deleteRedirect(
    admin: AdminApiContext,
    params: UrlRedirectDeleteMutationVariables,
) {
    try {
        const variables: UrlRedirectDeleteMutationVariables = params;

        const response = await admin.graphql(DELETE_REDIRECT, { variables });

        if (!response.ok) throw new Error(response.statusText);

        const { data } = await response.json();

        const errors = data?.urlRedirectDelete?.userErrors ?? [];
        if (errors.length > 0) {
            throw new Error(errors[0].message);
        }

        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) };
    }
}

export async function bulkDeleteRedirectsByIds(
    admin: AdminApiContext,
    params: UrlRedirectBulkDeleteByIdsMutationVariables,
) {
    try {
        const variables: UrlRedirectBulkDeleteByIdsMutationVariables = params;

        const response = await admin.graphql(BULK_DELETE_REDIRECTS_BY_IDS, { variables });

        if (!response.ok) throw new Error(response.statusText);

        const { data } = await response.json();

        const errors = data?.urlRedirectBulkDeleteByIds?.userErrors ?? [];
        if (errors.length > 0) {
            throw new Error(errors[0].message);
        }

        return { success: true };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

export async function bulkDeleteAllRedirects(
    admin: AdminApiContext,
) {
    try {
        const response = await admin.graphql(BULK_DELETE_ALL_REDIRECTS);

        if (!response.ok) throw new Error(response.statusText);

        const { data } = await response.json();

        const errors = data?.urlRedirectBulkDeleteAll?.userErrors ?? [];
        if (errors.length > 0) {
            throw new Error(errors[0].message);
        }

        return { success: true };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : String(error),
        };
    }
}