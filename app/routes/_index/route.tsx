import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { Fragment } from "react";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import HowItWorks from "./components/how-it-works";
import Features from "./components/features";
import FAQ from "./components/faq";
import Contact from "./components/contact";
import Footer from "./components/footer";
import landingStyles from "./styles.css?url";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return null;
};

export default function LandingPage() {
  return (
    <Fragment>
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
