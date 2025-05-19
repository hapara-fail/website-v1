# hapara.fail Website Source Code

This repository contains the source code for the [hapara.fail](https://hapara.fail) website. The site aims to provide resources and guides, primarily focusing on DNS bypass techniques for restricted ChromeOS environments.

## Live Site

Visit the live website at: **[https://hapara.fail](https://hapara.fail)**

## Project Overview

The website currently consists of two main pages:

1.  **Homepage (`index.html`):**
    * A sleek, modern landing page with a particle background.
    * Provides a brief introduction and a clear call-to-action button linking to the DNS Bypass Guide.
    * Includes footer links to external resources like a proxy, Discord, GitHub, and contact email.

2.  **DNS Bypass Guide (`bypass.html`):**
    * A detailed technical walkthrough explaining how to configure NextDNS and adjust ChromeOS settings for DNS-level bypass.
    * Features a consistent particle background and a "back to homepage" button for easy navigation.
    * Content is formatted for readability with clear headings, lists, and code block styling.

## Key Features

* **Consistent Design:** Both pages share a dark theme, monospace font, and animated particle backgrounds powered by TSparticles.
* **Responsive Layout:** Designed to be usable across different screen sizes.
* **Clear Navigation:** Simple navigation between the homepage and the guide.
* **Accessibility Considerations:** Includes `prefers-reduced-motion` checks to disable animations for users who prefer it.
* **Informative Content:** The DNS Bypass Guide provides step-by-step instructions for a technical process.

## Technologies Used

* **HTML5:** For the structure of the web pages.
* **CSS3:** For styling, layout, and responsiveness.
* **JavaScript (ES6+):** For dynamic functionalities, primarily the TSparticles animation.
* **TSparticles (v2.12.0):** A lightweight JavaScript library for creating animated particle backgrounds.

## Purpose

The primary goal is to offer a clean, accessible platform for sharing information and tools related to bypassing internet restrictions, particularly in educational or managed ChromeOS environments.