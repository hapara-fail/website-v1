# hapara.fail Website Source Code

This repository contains the source code for the [hapara.fail](https://hapara.fail) website. The site aims to provide resources and guides, primarily focusing on DNS bypass techniques and other methods for enhancing user freedom in restricted ChromeOS environments.

## Live Site

Visit the live website at: **[https://hapara.fail](https://hapara.fail)**

## Project Overview (v2.0)

The website has been significantly updated with a focus on improved navigation, expanded content, and a consistent, modern aesthetic.

**Main Pages & Content:**

1.  **Homepage (`index.html`):**
    * A sleek, minimalist landing page featuring a dynamic particle background.
    * Introduces the site's purpose and provides access to all content through a new dual navigation system.
    * Includes persistent footer links to external resources (Discord, GitHub, Contact).

2.  **ChromeOS DNS Bypass Guide (`bypass.html`):**
    * A detailed technical walkthrough explaining how to configure NextDNS and adjust ChromeOS settings for DNS-level bypass.
    * Includes a direct link to the `hapara.fail` custom blocklist.
    * Features a consistent particle background and a "back to homepage" button.

3.  **Google Form Unlocker Guide (`forms.html`):**
    * *(Placeholder for content)* Intended to guide users on methods related to Google Forms.
    * Currently uses a polished "Under Construction" page template.

4.  **Paramus Schools WiFi Passwords (`wifi.html`):**
    * *(Placeholder for content)* Intended to provide information related to WiFi access.
    * Currently uses a polished "Under Construction" page template.

5.  **Under Construction Page:**
    * A reusable, styled template for pages that are not yet complete, matching the site's overall design and featuring the particle background.

**Supporting Resources:**

* **DNS Blocklist:** A curated blocklist hosted on GitHub, designed to block surveillance and filtering domains. Includes its own `README.md` for usage instructions.

## Key Features (v2.0)

* **Modern & Consistent Design:** All pages share a dark theme, monospace font, and animated particle backgrounds powered by TSparticles for a unified, sleek look.
* **Dual Navigation System:**
    * **Full-Screen Overlay Menu:** Triggered by an animated hamburger-to-X icon in the top-right corner, providing a visually clear list of main site pages aligned to the bottom-left.
    * **Command Palette:** Activated via `Ctrl+K` (or `Cmd+K`), offering a macOS Spotlight-style search interface to quickly find and navigate to all site pages and external links.
* **Responsive Layout:** Designed for optimal viewing and usability across various screen sizes (desktop, tablet, mobile).
* **Accessibility Considerations:**
    * Includes `prefers-reduced-motion` checks to disable animations for users who prefer it.
    * ARIA attributes are used for better screen reader compatibility with navigation elements.
* **Informative Content:** Guides provide step-by-step instructions for technical processes.
* **Integrated Blocklist:** The DNS Bypass guide directly links to the custom-maintained blocklist.

## Technologies Used

* **HTML5:** For the structure of the web pages.
* **CSS3:** For styling, layout, animations (including the hamburger/X icon), and responsiveness.
* **JavaScript (ES6+):**
    * Powers the dynamic TSparticles animation.
    * Manages the functionality of the full-screen overlay menu and the command palette (toggling visibility, populating links, search filtering, keyboard navigation).
* **TSparticles (v2.12.0):** A lightweight JavaScript library for creating animated particle backgrounds.
* **SVG:** Used for icons (menu trigger, command palette search icon).

## Folder Structure

The project currently has the following main files in its root directory:

.
├── index.html              # Homepage
├── under-construction.html # Placeholder for pages being worked on
├── bypass.html             # ChromeOS DNS Bypass Guide page
├── forms.html              # Placeholder for Google Form Unlocker Guide (uses construction template)
├── wifi.html               # Placeholder for Paramus Schools WiFi Passwords (uses construction template)
├── favicon.png             # Favicon for the website
├── LICENCE                 # Contains the GPL-3.0 licence
└── README.md               # This file

*(The actual blocklist and its README are hosted in a separate repository, linked from `bypass.html`)*

## Purpose

The primary goal is to offer a clean, accessible, and user-friendly platform for sharing information, guides, and tools related to bypassing internet restrictions and enhancing user control, particularly in educational or managed ChromeOS environments.

---

*This repository is maintained by the hapara.fail project under GPL-3.0.*