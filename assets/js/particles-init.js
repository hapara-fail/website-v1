// assets/js/particles-init.js
// Contains settings and initialization logic for tsParticles.

// Base particle settings object
const particleSettings = {
  fpsLimit: 60,
  particles: {
    number: {
      value: 60, // Default for desktop, will be adjusted dynamically
      density: { enable: true, area: 800 }
    },
    color: { value: "#666666" },
    shape: { type: "circle" },
    opacity: { value: 0.35 },
    size: { value: 2.2, random: { enable: true, minimumValue: 0.8 } },
    links: {
      enable: true,
      distance: 140,
      color: "#777777",
      opacity: 0.25,
      width: 1
    },
    move: {
      enable: true, // Default, will be adjusted for reduced motion
      speed: 0.9,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" }
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" }, // Default, will be adjusted
      onClick: { enable: true, mode: "push" },   // Default, will be adjusted
      resize: true
    },
    modes: {
      repulse: { distance: 70, duration: 0.4 },
      push: { quantity: 2 }
    }
  },
  detectRetina: true
};

function loadParticles() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Create a dynamic copy of settings to adjust
  let currentSettings = JSON.parse(JSON.stringify(particleSettings));

  if (prefersReducedMotion) {
    currentSettings.particles.number.value = 0;
    currentSettings.particles.move.enable = false;
    currentSettings.interactivity.events.onHover.enable = false;
    currentSettings.interactivity.events.onClick.enable = false;
  } else if (isMobile) {
    currentSettings.particles.number.value = 30;
  }
  // Desktop uses default currentSettings.particles.number.value (60)

  if (typeof tsParticles !== "undefined") {
    tsParticles.load("tsparticles", currentSettings)
      .then(container => {
        if (prefersReducedMotion && container) {
            if (container.particles && typeof container.particles.setCount === 'function') {
                 container.particles.setCount(0);
            }
            if (container.stop) {
                 container.stop();
            }
        }
      })
      .catch(error => {
        console.error("Error loading tsParticles:", error);
      });
  } else {
    console.error("tsParticles library not found.");
  }
}