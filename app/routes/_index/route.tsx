import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import styles from "./styles.module.css";
import { siteConfig } from "~/config/site";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return null;
};

export default function App() {
  return (
    <main>
      <h1 className={styles.title}>{siteConfig.name}</h1>
      <p className={styles.description}>{siteConfig.description}</p>
    </main>
  );
}
