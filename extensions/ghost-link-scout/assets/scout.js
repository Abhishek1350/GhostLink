(function() {
  console.log("GhostLink Scout initialized");

  // Check if current page is a 404
  // Shopify provides some information in window.Shopify, but detection often relies on template detection
  // or checking for 404 characteristics in the document.
  
  // Method 1: Check document.title or body classes (theme dependent)
  // Method 2: Check window.Shopify.designMode if needed, but for runtime 404:
  
  const is404 = window.Shopify && window.Shopify.template === '404';

  if (is404) {
    const url = window.location.href;
    const referrer = document.referrer;
    
    // The app proxy URL as defined in shopify.app.toml
    const proxyUrl = "/apps/ghost-link/log-404";
    
    const payload = JSON.stringify({
      url: url,
      referrer: referrer,
      timestamp: new Date().toISOString()
    });

    console.log("GhostLink: 404 detected. Logging to proxy...", url);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(proxyUrl, payload);
    } else {
      fetch(proxyUrl, {
        method: 'POST',
        body: payload,
        keepalive: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(err => console.error("GhostLink: Failed to log 404", err));
    }
  }
})();
