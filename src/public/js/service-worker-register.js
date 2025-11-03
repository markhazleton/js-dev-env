/**
 * Service Worker Registration
 * 
 * This script registers the service worker for PWA support.
 * It's extracted from inline scripts to improve security.
 */
// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Calculate the path to the root of the site
    // pathname looks like: /js-dev-env/getting-started/ or /js-dev-env/
    const pathname = window.location.pathname;
    
    // Find the root by looking for the first directory after domain
    // For GitHub Pages: /js-dev-env/... -> /js-dev-env/
    // For root domain: /... -> /
    const pathParts = pathname.split('/').filter(p => p);
    const rootPath = pathParts.length > 0 ? `/${pathParts[0]}/` : '/';
    
    // Service worker must be at the root of the site scope
    const swPath = `${rootPath}service-worker.js`;
    
    navigator.serviceWorker
      .register(swPath)
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
