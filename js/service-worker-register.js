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
    // or on dev server: /data-tables/ or just /
    const pathname = window.location.pathname;
    
    // Detect if we're on GitHub Pages (has js-dev-env in path)
    const isGitHubPages = pathname.includes('/js-dev-env/');
    
    let rootPath;
    if (isGitHubPages) {
      // For GitHub Pages: /js-dev-env/... -> /js-dev-env/
      rootPath = '/js-dev-env/';
    } else {
      // For local dev server: always use root /
      rootPath = '/';
    }
    
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
