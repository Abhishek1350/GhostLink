/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types.d.ts';

export type UrlRedirectCreateMutationVariables = AdminTypes.Exact<{
  urlRedirect: AdminTypes.UrlRedirectInput;
}>;


export type UrlRedirectCreateMutation = { urlRedirectCreate?: AdminTypes.Maybe<{ urlRedirect?: AdminTypes.Maybe<Pick<AdminTypes.UrlRedirect, 'id'>>, userErrors: Array<Pick<AdminTypes.UrlRedirectUserError, 'message'>> }> };

interface GeneratedQueryTypes {
}

interface GeneratedMutationTypes {
  "#graphql\n        mutation urlRedirectCreate($urlRedirect: UrlRedirectInput!) {\n            urlRedirectCreate(urlRedirect: $urlRedirect) {\n                urlRedirect { id }\n                userErrors { message }\n            }\n        }\n    ": {return: UrlRedirectCreateMutation, variables: UrlRedirectCreateMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
