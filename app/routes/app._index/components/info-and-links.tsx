import { siteBasic } from "~/config/site";

type Props = JSX.IntrinsicElements["s-section"];

export function InfoAndLinks({ ...props }: Props) {
  function handleOpenRedirects() {
    open("shopify://admin/content/redirects", "_top");
  }

  return (
    <s-section {...props}>
      <s-stack direction="block" gap="small">
        <s-paragraph>
          {siteBasic.name} watches your 404 pages and creates standard{" "}
          <s-link onClick={handleOpenRedirects}>Shopify URL redirects</s-link>{" "}
          when you fix them or enable Auto‑Pilot.{" "}
          <s-link href="/" target="_blank">
            Learn more
          </s-link>
        </s-paragraph>

        <s-text>
          <s-link href="/privacy" target="_blank">
            Privacy policy
          </s-link>
          {" · "}
          <s-link href="/#contact" target="_blank">
            Contact support
          </s-link>
        </s-text>
      </s-stack>
    </s-section>
  );
}
