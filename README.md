# hapara.fail Website Source Code

This repository contains the source code for the [hapara.fail](https://hapara.fail) website. The site aims to provide resources, guides, and tools, primarily focusing on DNS bypass techniques and other methods for enhancing user freedom and privacy in restricted ChromeOS environments.

## Live Site

Visit the live website at: **[https://hapara.fail](https://hapara.fail)**

[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/1wfyp.svg)](https://status.hapara.fail/)

## Quick Deploy

You can deploy your own instance of this project to Netlify or Vercel using the buttons below. This will clone the source Git repository (`https://github.com/hapara-fail/website`) and guide you through the deployment process.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhapara-fail%2Fwebsite)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/integration/start/deploy?repository=https://github.com/hapara-fail/website)

## Project Overview

The website provides a collection of guides and tools related to ChromeOS customization and bypassing certain restrictions. It features a modern, consistent design and a user-friendly dual navigation system to access all content.

**Main Pages & Content:**

1.  **Homepage (`index.html`):**
    * A sleek, minimalist landing page with a dynamic particle background.
    * Introduces the site's purpose and provides access to content via the navigation systems.
    * Includes persistent footer links to Discord, GitHub, and a contact email.

2.  **ChromeOS DNS Bypass Guide (`bypass.html`):**
    * A detailed technical walkthrough explaining how to configure NextDNS with a custom blocklist and adjust ChromeOS network settings for DNS-level filtering bypass.
    * Links directly to the `hapara.fail` curated blocklist.

3.  **Google Form Unlocker Guide (`forms.html`):**
    * Provides a guide and an interactive "view-source" demo tool for understanding and potentially bypassing certain Google Forms locked mode restrictions.
    * Includes setup instructions, a technical explanation of the method, discussion of potential risks, and usage precautions.

4.  **ChromeOS WiFi Password Extractor (`wifi.html`):**
    * Offers two distinct tools and detailed guides for helping users find saved WiFi passwords or network configurations on ChromeOS by leveraging data from `chrome://sync-internals` and analyzing `chrome://net-export` logs.
    * Includes step-by-step instructions for each tool, technical explanations, troubleshooting tips, and credits.

5.  **Under Construction Page (`under-construction.html`):**
    * A reusable, styled template for pages that are planned or not yet complete, maintaining the site's overall aesthetic and featuring the particle background.

6.  **About Us Page (`about.html`):**
    * Explains the mission and philosophy behind `hapara.fail`, drawing parallels with student digital rights advocacy and detailing the site's stance on privacy and empowerment in educational tech environments.

7.  **Donation Page (`donate.html`):**
    * Provides various methods for users to financially support the `hapara.fail` project, including PayPal and cryptocurrency options.
    * Includes information on claiming a Discord `@Donator` role and how to contribute to the open-source projects.


**Supporting Resources:**

* **DNS Blocklist:** A curated blocklist (hosted on a separate GitHub repository) designed to block common surveillance, tracking, and filtering domains, enhancing the effectiveness of DNS bypass methods. Linked from the `bypass.html` guide.

## Key Features

* **Modern & Consistent Design:** All pages share a dark theme, monospace typography, and animated particle backgrounds (powered by TSparticles) for a unified and professional look.
* **Unified Dual Navigation System:**
    * Navigation data is centralized in `assets/js/nav-data.js` for easy sitewide updates.
    * Core functionality is handled by a shared `assets/js/navigation.js` script.
    * **Full-Screen Overlay Menu:** Activated by an animated hamburger-to-X icon, providing a clear list of main site pages. The current page is dynamically highlighted.
    * **Command Palette:** Triggered by `Ctrl+K` (or `Cmd+K`), offering a Spotlight-style search to quickly find and navigate to site pages and key external links. Includes keyboard navigability.
* **Responsive Layout:** Designed for optimal viewing and usability across desktop and mobile devices.
* **Organized Codebase:**
    * Recently refactored for improved organization and maintainability.
    * CSS and JavaScript are externalized into an `assets/` folder structure.
    * Features shared stylesheets (`main.css`, `navigation.css`, `particles.css`) and scripts (`navigation.js`, `particles-init.js`, `main.js`).
    * Page-specific styles and JavaScript logic are separated into their own files for clarity (e.g., `assets/css/page-specific/forms.css`, `assets/js/page-specific/wifi-extractor.js`).
* **Accessibility Considerations:**
    * Includes `prefers-reduced-motion` media query to disable or reduce animations for users who prefer it.
    * Use of ARIA attributes (e.g., `aria-current="page"`, `aria-expanded`, `aria-label`, `role="dialog"`) for navigation elements to enhance screen reader compatibility.
    * Semantic HTML structure.
* **Informative Content & Tools:** Guides provide step-by-step instructions, technical explanations, and interactive tools where applicable.

## Technologies Used

* **HTML5:** For the semantic structure of the web pages.
* **CSS3:** For styling, layout (including Flexbox), animations, and responsiveness.
* **Vanilla JavaScript (ES6+):**
    * Powers the dynamic TSparticles animation.
    * Manages the centralized functionality of the full-screen overlay menu and the command palette (toggling visibility, populating links, search filtering, keyboard navigation, active page highlighting).
    * Provides client-side logic for interactive tools on specific pages.
* **TSparticles (v2.12.0):** A lightweight JavaScript library for creating animated particle backgrounds.
* **SVG:** Used for icons (e.g., menu trigger, command palette search icon, footer social icons, button icons).

## Purpose

The primary goal of `hapara.fail` is to offer a clean, accessible, and user-friendly platform for sharing information, guides, and tools related to understanding and navigating digital restrictions, with a particular focus on ChromeOS environments often found in educational settings. The aim is to empower users with knowledge and resources while promoting responsible exploration.

---

*This repository is maintained by the `hapara.fail` project under the GPL-3.0 License.*
