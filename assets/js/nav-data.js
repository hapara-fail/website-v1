// assets/js/nav-data.js
// Single source of truth for all navigation items.

const siteNavItems = [
  // Pages to be shown in the Full-Screen Menu & Command Palette
  { name: 'Home', href: 'index.html', type: 'page' },
  { name: 'ChromeOS DNS Bypass', href: 'bypass.html', type: 'page' },
  { name: 'Google Form Unlocker', href: 'forms.html', type: 'page' },
  { name: 'ChromeOS WiFi Password Extractor', href: 'wifi.html', type: 'page' },
  // { name: 'Coming Soon Page', href: 'under-construction.html', type: 'page' }, // Example

  // External links primarily for the Command Palette
  { name: 'Discord', href: 'https://discord.gg/KA66dHUF4P', type: 'external', target: '_blank' },
  { name: 'GitHub', href: 'https://github.com/hapara-fail', type: 'external', target: '_blank' },
  { name: 'Status', href: 'https://status.hapara.fail', type: 'external', target: '_blank' },
  { name: 'Contact', href: 'mailto:support@hapara.fail', type: 'external' }
];
