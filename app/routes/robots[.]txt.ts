import { LoaderFunctionArgs } from "react-router";

export function loader() {
    const robots = `
User-agent: *
Allow: /

`.trim();

    return new Response(robots, {
        headers: {
            "Content-Type": "text/plain",
            "Cache-Control":
                "public, max-age=600, s-maxage=86400, stale-while-revalidate=86400",
        },
    });
}
