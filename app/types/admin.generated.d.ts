/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types.d.ts';

export type UrlRedirectQueryVariables = AdminTypes.Exact<{
  first?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  last?: AdminTypes.InputMaybe<AdminTypes.Scalars['Int']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  before?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type UrlRedirectQuery = { urlRedirects: { nodes: Array<Pick<AdminTypes.UrlRedirect, 'id' | 'path' | 'target'>>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'> } };

export type GetUrlRedirectQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetUrlRedirectQuery = { urlRedirect?: AdminTypes.Maybe<Pick<AdminTypes.UrlRedirect, 'id' | 'path' | 'target'>> };

export type UrlRedirectCreateMutationVariables = AdminTypes.Exact<{
  urlRedirect: AdminTypes.UrlRedirectInput;
}>;


export type UrlRedirectCreateMutation = { urlRedirectCreate?: AdminTypes.Maybe<{ urlRedirect?: AdminTypes.Maybe<Pick<AdminTypes.UrlRedirect, 'id'>>, userErrors: Array<Pick<AdminTypes.UrlRedirectUserError, 'message'>> }> };

export type UrlRedirectUpdateMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  urlRedirect: AdminTypes.UrlRedirectInput;
}>;


export type UrlRedirectUpdateMutation = { urlRedirectUpdate?: AdminTypes.Maybe<{ urlRedirect?: AdminTypes.Maybe<Pick<AdminTypes.UrlRedirect, 'id'>>, userErrors: Array<Pick<AdminTypes.UrlRedirectUserError, 'field' | 'message'>> }> };

export type UrlRedirectDeleteMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type UrlRedirectDeleteMutation = { urlRedirectDelete?: AdminTypes.Maybe<(
    Pick<AdminTypes.UrlRedirectDeletePayload, 'deletedUrlRedirectId'>
    & { userErrors: Array<Pick<AdminTypes.UrlRedirectUserError, 'field' | 'message'>> }
  )> };

export type UrlRedirectBulkDeleteByIdsMutationVariables = AdminTypes.Exact<{
  ids: Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input'];
}>;


export type UrlRedirectBulkDeleteByIdsMutation = { urlRedirectBulkDeleteByIds?: AdminTypes.Maybe<{ job?: AdminTypes.Maybe<Pick<AdminTypes.Job, 'id' | 'done'>>, userErrors: Array<Pick<AdminTypes.UrlRedirectBulkDeleteByIdsUserError, 'message'>> }> };

export type UrlRedirectBulkDeleteAllMutationVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type UrlRedirectBulkDeleteAllMutation = { urlRedirectBulkDeleteAll?: AdminTypes.Maybe<{ job?: AdminTypes.Maybe<Pick<AdminTypes.Job, 'id' | 'done'>>, userErrors: Array<Pick<AdminTypes.UserError, 'message'>> }> };

interface GeneratedQueryTypes {
  "#graphql\n        query UrlRedirect($first: Int, $last: Int, $after: String, $before: String) {\n            urlRedirects(first: $first, last: $last, after: $after, before: $before) {\n                nodes {\n                    id\n                    path\n                    target\n                }\n                pageInfo {\n                    hasNextPage\n                    hasPreviousPage\n                    startCursor\n                    endCursor\n                }\n            }\n        }\n    ": {return: UrlRedirectQuery, variables: UrlRedirectQueryVariables},
  "#graphql\n    query GetUrlRedirect($id: ID!) {\n        urlRedirect(id: $id) {\n            id\n            path\n            target\n        }\n    }\n": {return: GetUrlRedirectQuery, variables: GetUrlRedirectQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n        mutation urlRedirectCreate($urlRedirect: UrlRedirectInput!) {\n            urlRedirectCreate(urlRedirect: $urlRedirect) {\n                urlRedirect { id }\n                userErrors { message }\n            }\n        }\n    ": {return: UrlRedirectCreateMutation, variables: UrlRedirectCreateMutationVariables},
  "#graphql\n        mutation UrlRedirectUpdate($id: ID!, $urlRedirect: UrlRedirectInput!) {\n            urlRedirectUpdate(id: $id, urlRedirect: $urlRedirect) {\n                urlRedirect {\n                    id\n                }\n                userErrors {\n                    field\n                    message\n                }\n            }\n        }\n    ": {return: UrlRedirectUpdateMutation, variables: UrlRedirectUpdateMutationVariables},
  "#graphql\n        mutation UrlRedirectDelete($id: ID!) {\n            urlRedirectDelete(id: $id) {\n                deletedUrlRedirectId\n                userErrors {\n                    field\n                    message\n                }\n            }\n        }\n    ": {return: UrlRedirectDeleteMutation, variables: UrlRedirectDeleteMutationVariables},
  "#graphql\n    mutation UrlRedirectBulkDeleteByIds($ids: [ID!]!) {\n        urlRedirectBulkDeleteByIds(ids: $ids) {\n            job {\n                id\n                done\n            }\n            userErrors {\n                message\n            }\n        }\n    }\n": {return: UrlRedirectBulkDeleteByIdsMutation, variables: UrlRedirectBulkDeleteByIdsMutationVariables},
  "#graphql\n    mutation UrlRedirectBulkDeleteAll {\n        urlRedirectBulkDeleteAll {\n            job {\n                id\n                done\n            }\n            userErrors {\n                message\n            }\n        }\n    }\n": {return: UrlRedirectBulkDeleteAllMutation, variables: UrlRedirectBulkDeleteAllMutationVariables},
  "#graphql\n      mutation urlRedirectCreate($urlRedirect: UrlRedirectInput!) {\n        urlRedirectCreate(urlRedirect: $urlRedirect) {\n          urlRedirect { id }\n          userErrors { message }\n        }\n      }": {return: UrlRedirectCreateMutation, variables: UrlRedirectCreateMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
