import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { Fragment, useEffect } from "react";
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
  { rel: "preconnect", href: "https://unpkg.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/aos@2.3.4/dist/aos.css",
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
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/aos@2.3.4/dist/aos.js";
    script.onload = () => {
      if (typeof window !== "undefined" && (window as any).AOS) {
        (window as any).AOS.init({
          duration: 500,
          easing: "ease-out-cubic",
          once: true,
          offset: 60,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
