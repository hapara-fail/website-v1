// nav-data.js
// Single source of truth for all navigation items.

const siteNavItems = [
  // Pages to be shown in the Full-Screen Menu & Command Palette
  { name: 'Home', href: 'index.html', type: 'page' },
  { name: 'ChromeOS DNS Bypass', href: 'bypass.html', type: 'page' },
  { name: 'Google Form Unlocker Guide', href: 'forms.html', type: 'page' },
  { name: 'Paramus Schools WiFi Passwords', href: 'wifi.html', type: 'page' },
  // Add new site pages here in the future, e.g.:
  // { name: 'New Awesome Guide', href: 'new-guide.html', type: 'page' },

  // External links primarily for the Command Palette (can be filtered out of visual menus if desired)
  { name: 'Discord', href: 'https://discord.gg/KA66dHUF4P', type: 'external', target: '_blank' },
  { name: 'GitHub', href: 'https://github.com/hapara-fail', type: 'external', target: '_blank' },
  { name: 'Contact', href: 'mailto:support@hapara.fail', type: 'external' }
  // { name: 'Proxy', href: 'your-proxy-link-here', type: 'external', target: '_blank' } // Example if you add proxy back
];