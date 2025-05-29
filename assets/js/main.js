// assets/js/main.js
// Main script for global initializations.

document.addEventListener('DOMContentLoaded', () => {
  // Initialize tsParticles
  if (typeof loadParticles === 'function') {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadParticles);
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(loadParticles, 100);
    }
  } else {
    console.error("loadParticles function not found. Ensure particles-init.js is loaded before main.js.");
  }

  // Note: navigation.js self-initializes its event listeners and DOM manipulations
  // within its own DOMContentLoaded listener. No explicit call needed here.
});