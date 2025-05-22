# hapara.fail Website Source Code

This repository contains the source code for the [hapara.fail](https://hapara.fail) website. The site aims to provide resources and guides, primarily focusing on DNS bypass techniques and other methods for enhancing user freedom in restricted ChromeOS environments.

## Live Site

Visit the live website at: **[https://hapara.fail](https://hapara.fail)**

## Project Overview

The website has been significantly updated with a focus on improved navigation, expanded content, and a consistent, modern aesthetic.

**Main Pages & Content:**

1.  **Homepage (`index.html`):**
    * A sleek, minimalist landing page featuring a dynamic particle background.
    * Introduces the site's purpose and provides access to all content through a new dual navigation system.
    * Includes persistent footer links to external resources (Discord, GitHub, Contact).

2.  **ChromeOS DNS Bypass Guide (`bypass.html`):**
    * A detailed technical walkthrough explaining how to configure NextDNS and adjust ChromeOS settings for DNS-level bypass.
    * Includes a direct link to the `hapara.fail` custom blocklist.
    * Features consistent styling, particle background, and unified navigation.

3.  **Google Form Unlocker Guide (`forms.html`):**
    * Provides a detailed guide and a live "view-source" demo tool for bypassing certain Google Forms locked mode restrictions.
    * Includes setup instructions, a technical explanation of the bypass method, potential risks, and usage precautions.
    * Features consistent styling, particle background, and unified navigation.

4.  **ChromeOS WiFi Password Extractor (`wifi.html`):**
    * Offers a guide and an interactive tool to help users find saved WiFi passwords on ChromeOS by leveraging data from `chrome://sync-internals`.
    * Includes step-by-step instructions, troubleshooting tips, and credits for the original method.
    * Features consistent styling, particle background, and unified navigation.

5.  **Under Construction Page (`under-construction.html`):**
    * A reusable, styled template for pages that are planned or not yet complete, matching the site's overall design and featuring the particle background.

**Supporting Resources:**

* **DNS Blocklist:** A curated blocklist hosted on a separate GitHub repository, designed to block surveillance and filtering domains. Includes its own `README.md` for usage instructions and is linked from the `bypass.html` guide.

## Key Features

* **Modern & Consistent Design:** All pages share a dark theme, monospace font, and animated particle backgrounds (powered by TSparticles) for a unified, sleek look.
* **Unified Dual Navigation System:**
    * Navigation data is centralized in `nav-data.js` for easy updates across the entire site.
    * Functionality is handled by a shared `navigation.js` script.
    * **Full-Screen Overlay Menu:** Triggered by an animated hamburger-to-X icon in the top-right corner, providing a visually clear list of main site pages aligned to the bottom-left.
    * **Command Palette:** Activated via `Ctrl+K` (or `Cmd+K`), offering a macOS Spotlight-style search interface to quickly find and navigate to all site pages and external links.
* **Responsive Layout:** Designed for optimal viewing and usability across various screen sizes.
* **Accessibility Considerations:**
    * Includes `prefers-reduced-motion` checks to disable animations.
    * ARIA attributes are used for better screen reader compatibility with navigation elements.
* **Informative Content & Tools:** Guides provide step-by-step instructions, technical explanations, and interactive demo tools.

## Technologies Used

* **HTML5:** For the structure of the web pages.
* **CSS3:** For styling, layout, animations (including the hamburger/X icon), and responsiveness.
* **JavaScript (ES6+):**
    * Powers the dynamic TSparticles animation.
    * Manages the centralized functionality of the full-screen overlay menu and the command palette (toggling visibility, populating links from `nav-data.js`, search filtering, keyboard navigation).
    * Provides client-side logic for interactive tools (e.g., Form Unlocker Demo, WiFi Password Extractor).
* **TSparticles (v2.12.0):** A lightweight JavaScript library for creating animated particle backgrounds.
* **SVG:** Used for icons (menu trigger, command palette search icon).

## Purpose

The primary goal is to offer a clean, accessible, and user-friendly platform for sharing information, guides, and tools related to bypassing internet restrictions and enhancing user control, particularly in educational or managed ChromeOS environments.

---

*This repository is maintained by the hapara.fail project under GPL-3.0.*
