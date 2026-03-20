export const GET_URL_REDIRECTS = `#graphql
        query UrlRedirect($first: Int, $last: Int, $after: String, $before: String) {
            urlRedirects(first: $first, last: $last, after: $after, before: $before) {
                nodes {
                    id
                    path
                    target
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                }
            }
        }
    `;

export const GET_URL_REDIRECT = `#graphql
    query GetUrlRedirect($id: ID!) {
        urlRedirect(id: $id) {
            id
            path
            target
        }
    }
`;

export const CREATE_REDIRECT = `#graphql
        mutation urlRedirectCreate($urlRedirect: UrlRedirectInput!) {
            urlRedirectCreate(urlRedirect: $urlRedirect) {
                urlRedirect { id }
                userErrors { message }
            }
        }
    `
;

export const UPDATE_REDIRECT = `#graphql
        mutation UrlRedirectUpdate($id: ID!, $urlRedirect: UrlRedirectInput!) {
            urlRedirectUpdate(id: $id, urlRedirect: $urlRedirect) {
                urlRedirect {
                    id
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `
;

export const DELETE_REDIRECT = `#graphql
        mutation UrlRedirectDelete($id: ID!) {
            urlRedirectDelete(id: $id) {
                deletedUrlRedirectId
                userErrors {
                    field
                    message
                }
            }
        }
    `
;

export const BULK_DELETE_REDIRECTS_BY_IDS = `#graphql
    mutation UrlRedirectBulkDeleteByIds($ids: [ID!]!) {
        urlRedirectBulkDeleteByIds(ids: $ids) {
            job {
                id
                done
            }
            userErrors {
                message
            }
        }
    }
`;


export const BULK_DELETE_ALL_REDIRECTS = `#graphql
    mutation UrlRedirectBulkDeleteAll {
        urlRedirectBulkDeleteAll {
            job {
                id
                done
            }
            userErrors {
                message
            }
        }
    }
`;