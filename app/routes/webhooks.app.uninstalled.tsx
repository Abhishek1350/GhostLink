import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { handleAppUninstalled } from "~/lib/analytics.server";

export async function action({ request }: ActionFunctionArgs) {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  try {
    await handleAppUninstalled(shop);
  } catch (error) {
    console.error(`Error handling app/uninstalled for shop=${shop}:`, error);
  }

  return new Response();
}
