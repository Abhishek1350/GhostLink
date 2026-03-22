export const siteBasic = {
    name: "GhostLink",
    tagline: "Auto‑fix 404s on your Shopify store",
    description:
        "Stop losing traffic and sales to broken links. GhostLink quietly watches your Shopify 404 pages, logs every broken URL, and turns them into standard Shopify URL redirects — automatically with Auto‑Pilot or in a single click from your dashboard.",
};

export const siteConfig = {
    ...siteBasic,
    url: import.meta.env.VITE_APP_URL,
    email: import.meta.env.VITE_CONTACT_EMAIL,
    logo: "/logo.webp",
    appStoreUrl: "https://apps.shopify.com/ghostlink",
    author: {
        name: "Abhishek Bhardwaj",
        url: "https://imabhishek.site",
        avatar: "https://avatars.githubusercontent.com/u/72749432?v=4",
    },
    ogImage: "/og-image.jpeg",
    keywords: [
        "shopify 404 fixer",
        "shopify broken link redirect",
        "auto fix 404 errors shopify",
        "shopify url redirect app",
        "shopify dead link detector",
        "404 error monitoring shopify",
        "shopify seo broken links",
        "fix broken links shopify store",
        "shopify 404 page redirect",
        "shopify auto redirect app",
        "broken url fixer shopify",
        "shopify 404 tracker",
        "free shopify redirect app",
    ],
} as const;

export const rootMeta = {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    keywords: siteConfig.keywords.join(", "),
    openGraph: {
        title: `${siteConfig.name} | ${siteConfig.tagline}`,
        description: siteConfig.description,
        type: "website",
        image: siteConfig.ogImage,
    },
    twitter: {
        card: "summary_large_image",
        title: `${siteConfig.name} | ${siteConfig.tagline}`,
        description: siteConfig.description,
        image: siteConfig.ogImage,
    },
    author: siteConfig.author,
};
