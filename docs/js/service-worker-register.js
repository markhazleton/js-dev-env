/**
 * Service Worker Registration
 * 
 * This script registers the service worker for PWA support.
 * It's extracted from inline scripts to improve security.
 */
// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Use relative path for service worker to work with GitHub Pages subdirectory
    const swPath = new URL('./service-worker.js', document.baseURI).pathname;
    
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
