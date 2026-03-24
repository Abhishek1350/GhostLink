import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  MetaArgs,
} from "react-router";
import { data, redirect } from "react-router";
import { Fragment, useEffect } from "react";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import HowItWorks from "./components/how-it-works";
import Features from "./components/features";
import FAQ from "./components/faq";
import Contact from "./components/contact";
import Footer from "./components/footer";
import landingStyles from "./styles.css?url";
import { rootMeta, siteConfig } from "~/config/site";
import AOS from "aos";
import "aos/dist/aos.css";
import { GoogleAnalytics } from "./components/google-analytics";
import { sendMail } from "~/lib/mailer.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap",
  },
  { rel: "stylesheet", href: landingStyles },
];

export function meta({ location }: MetaArgs) {
  const canonicalUrl = `${siteConfig.url}${location.pathname}`;

  return [
    { title: rootMeta.title },
    { name: "description", content: rootMeta.description },
    { name: "keywords", content: rootMeta.keywords },
    { property: "og:title", content: rootMeta.openGraph.title },
    { property: "og:description", content: rootMeta.openGraph.description },
    { property: "og:type", content: rootMeta.openGraph.type },
    { property: "author", content: rootMeta.author.name },
    { tagName: "link", rel: "author", href: rootMeta.author.url },
    {
      property: "og:url",
      content: canonicalUrl.endsWith("/")
        ? canonicalUrl.slice(0, -1)
        : canonicalUrl,
    },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { name: "twitter:card", content: rootMeta.twitter.card },
    { name: "twitter:title", content: rootMeta.twitter.title },
    { name: "twitter:description", content: rootMeta.twitter.description },
    { name: "twitter:image", content: rootMeta.twitter.image },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(null, {
    headers: {
      "Cache-Control":
        "public, max-age=600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return data({ error: "All fields are required" });
  }

  if (name.length > 100 || message.length > 1000) {
    return data({
      error: "Name max 100 characters, message max 1000 characters",
    });
  }

  try {
    const sent = await sendMail({ name, email, message });

    if (sent) {
      return data({ success: "Message sent successfully" });
    }
    return data({ error: "Something went wrong" });
  } catch (error) {
    return data({ error: "Something went wrong" });
  }
};

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }, []);

  return (
    <Fragment>
      <GoogleAnalytics />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </Fragment>
  );
}
