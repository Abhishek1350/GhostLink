(() => {
  const onDomReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  onDomReady(() => {
    console.log("GhostLink Scout initialized");

    const root = document.getElementById("ghostlink-scout-root");
    if (!root) {
      // Should not happen, but be defensive
      return;
    }

    const pageType = root.dataset.pageType;

    // Only log on real 404 pages
    if (pageType !== "404") {
      return;
    }

    // Don't log when the merchant is in the theme editor / preview
    if (window.Shopify && window.Shopify.designMode) {
      console.log("GhostLink Scout: 404 detected in designMode; not logging.");
      return;
    }

    const url = window.location.href;
    const referrer = document.referrer || null;

    // Must match the app proxy configuration in your app setup
    const proxyUrl = "/apps/ghost-link/log-404";

    const payload = {
      url,
      referrer,
      timestamp: new Date().toISOString()
    };

    const json = JSON.stringify(payload);

    console.log("GhostLink Scout: 404 detected. Logging to proxy...", url);

    const sendWithFetch = () => {
      return fetch(proxyUrl, {
        method: "POST",
        body: json,
        keepalive: true,
        headers: {
          "Content-Type": "application/json"
        }
      }).catch((error) => {
        console.error("GhostLink Scout: Failed to log 404 via fetch", error);
      });
    };

    if (navigator.sendBeacon) {
      try {
        // Using Blob with explicit JSON content type for clarity
        const blob = new Blob([json], { type: "application/json" });
        const success = navigator.sendBeacon(proxyUrl, blob);

        if (!success) {
          // Some browsers can return false; fall back to fetch
          sendWithFetch();
        }
      } catch (error) {
        console.warn("GhostLink Scout: sendBeacon failed, falling back to fetch", error);
        sendWithFetch();
      }
    } else {
      // Older browsers: just use fetch
      sendWithFetch();
    }
  });
})();