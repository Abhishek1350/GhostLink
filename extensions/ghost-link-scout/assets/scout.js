(() => {
  const onDomReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  onDomReady(() => {
    console.log("Scout initialized");

    const root = document.getElementById("ghostlink-scout-root");
    if (!root) {
      // Should not happen, but be defensive
      return;
    }

    const pageType = root.dataset.pageType;

    if (pageType !== "404") {
      return;
    }

    // Don't log when the merchant is in the theme editor / preview
    if (window.Shopify && window.Shopify.designMode) {
      return;
    }

    const url = window.location.href;
    const referrer = document.referrer || null;

    const proxyUrl = "/apps/ghost-link/log-404";

    const payload = {
      url,
      referrer,
      timestamp: new Date().toISOString()
    };

    const json = JSON.stringify(payload);


    const sendWithFetch = () => {
      return fetch(proxyUrl, {
        method: "POST",
        body: json,
        keepalive: true,
        headers: {
          "Content-Type": "application/json"
        }
      }).catch((error) => {
        console.error("Scout: Failed to log 404 via fetch", error);
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
        console.warn("Scout: sendBeacon failed, falling back to fetch", error);
        sendWithFetch();
      }
    } else {
      // Older browsers: just use fetch
      sendWithFetch();
    }
  });
})();