import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";

import { authenticate } from "~/shopify.server";
import {
  useExtensionActivation,
  ExtStatus,
} from "~/hooks/useExtensionActivation";

export type AppOutletContext = {
  extensionStatus: ExtStatus;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    shop: session.shop,
  };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  const extensionStatus = useExtensionActivation();

  const outletContext: AppOutletContext = {
    extensionStatus,
  };

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">Home</s-link>
      </s-app-nav>
      <Outlet context={outletContext} />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
