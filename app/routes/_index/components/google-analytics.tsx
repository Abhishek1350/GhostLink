import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useLocation } from "react-router";

export function GoogleAnalytics() {
    const gaId = import.meta.env.VITE_GA_ID;
    const location = useLocation();

    useEffect(() => {
        if (!gaId) return;
        ReactGA.initialize(gaId);
    }, [gaId]);

    useEffect(() => {
        if (!gaId) return;
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
        });
    }, [location, gaId]);

    return null;
}
