// assets/js/navigation.js
// Logic for full-screen menu and command palette.
// Assumes `siteNavItems` is globally available from nav-data.js.

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const menuTrigger = document.querySelector('.menu-trigger');
  const fullscreenMenu = document.querySelector('.fullscreen-menu');
  const fullscreenMenuList = document.querySelector('.fullscreen-menu-list');

  const commandPaletteBackdrop = document.querySelector('.command-palette-backdrop');
  const commandPalette = document.querySelector('.command-palette');
  const commandPaletteInput = document.querySelector('.command-palette-input');
  const commandPaletteResults = document.querySelector('.command-palette-results');
  const commandPaletteNoResults = document.querySelector('.command-palette-no-results');

  // If core navigation elements aren't found, exit script for this page.
  if (!menuTrigger && !commandPaletteInput) {
    return;
  }
  
  let currentFocusedResultIndex = -1;

  // --- Full-Screen Menu Logic ---
  function populateFullScreenMenu() {
    if (!fullscreenMenuList || typeof siteNavItems === 'undefined') {
      console.error("Fullscreen menu list or siteNavItems not found for populating.");
      return;
    }
    fullscreenMenuList.innerHTML = ''; // Clear previous items
    
    const currentWindowPath = window.location.pathname;
    let currentPageIdentifier = currentWindowPath.substring(currentWindowPath.lastIndexOf('/') + 1);

    // Normalize for root path or paths ending with a slash (treat as index.html)
    if (currentPageIdentifier === "" || currentWindowPath.endsWith("/")) {
        currentPageIdentifier = 'index.html'; 
    }

    siteNavItems.filter(item => item.type === 'page').forEach(item => { 
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.href; 
      link.textContent = item.name;
      
      const navItemHref = item.href; // e.g., "index.html", "forms.html"
      const navItemBase = navItemHref.replace(".html", "");
      const currentPageBase = currentPageIdentifier.replace(".html", "");

      if (navItemBase === currentPageBase || navItemHref === currentPageIdentifier) {
        link.classList.add('current-page');
        link.setAttribute('aria-current', 'page');
        // CSS handles cursor styling for .current-page
      }

      // Add click listener to all page links in the menu
      link.addEventListener('click', function(event) {
        if (this.classList.contains('current-page')) {
          event.preventDefault(); // Prevent re-navigating to the same page
        }
        // For all page link clicks (current or not), close the menu
        // Check if menu is active before toggling to prevent issues if clicked rapidly or already closing
        if (fullscreenMenu && fullscreenMenu.classList.contains('is-active')) {
          toggleFullScreenMenu();
        }
        // If not current-page, default link navigation will proceed
      });
      
      listItem.appendChild(link);
      fullscreenMenuList.appendChild(listItem);
    });
  }

  function toggleFullScreenMenu() {
    if (!fullscreenMenu || !menuTrigger) return;
    const isActive = fullscreenMenu.classList.contains('is-active');
    if (isActive) {
      fullscreenMenu.classList.remove('is-active');
      menuTrigger.classList.remove('is-active'); 
      menuTrigger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overlay-active');
      // Return focus to the menu trigger if it's still part of the document and visible
      if (document.body.contains(menuTrigger) && menuTrigger.offsetParent !== null) {
        menuTrigger.focus(); 
      }
    } else {
      // If command palette is open, close it first
      if (commandPalette && commandPalette.classList.contains('is-active')) {
        closeCommandPalette();
      }
      fullscreenMenu.classList.add('is-active');
      menuTrigger.classList.add('is-active'); 
      menuTrigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('overlay-active');
      
      // Focus the menu container itself for better accessibility
      if (fullscreenMenuList) {
          fullscreenMenuList.setAttribute('tabindex', '-1'); // Make it programmatically focusable
          fullscreenMenuList.focus();
      }
    }
  }
  
  // Initialize menu if elements exist
  if (menuTrigger && fullscreenMenu && fullscreenMenuList) {
    menuTrigger.addEventListener('click', toggleFullScreenMenu); 
    populateFullScreenMenu(); // Populate menu on initial load
  }

  // --- Command Palette Logic ---
  function openCommandPalette() {
    if (!commandPalette || !commandPaletteBackdrop || !commandPaletteInput) return;
    // If fullscreen menu is open, close it
    if (fullscreenMenu && fullscreenMenu.classList.contains('is-active')) {
        toggleFullScreenMenu(); 
    }
    commandPaletteBackdrop.classList.add('is-active');
    commandPalette.classList.add('is-active');
    document.body.classList.add('overlay-active');
    commandPaletteInput.value = ''; 
    renderCommandPaletteResults(''); 
    commandPaletteInput.focus();
    currentFocusedResultIndex = -1; 
  }

  function closeCommandPalette() {
    if (!commandPalette || !commandPaletteBackdrop || !commandPaletteInput) return;
    commandPalette.classList.remove('is-active');
    commandPaletteBackdrop.classList.remove('is-active');
    document.body.classList.remove('overlay-active');
    commandPaletteInput.value = '';
    if (commandPaletteResults) commandPaletteResults.innerHTML = '';
    if (commandPaletteNoResults) commandPaletteNoResults.style.display = 'none';
  }

  function renderCommandPaletteResults(query) {
    if (!commandPaletteResults || !commandPaletteNoResults || typeof siteNavItems === 'undefined') return;
    commandPaletteResults.innerHTML = ''; 
    const lowerCaseQuery = query.toLowerCase().trim();
    
    const filteredItems = lowerCaseQuery === '' ? 
        siteNavItems.filter(item => item.type === 'page') : // Show only pages if query is empty
        siteNavItems.filter(item => 
          item.name.toLowerCase().includes(lowerCaseQuery) || // Also search href for more matches
          (item.href && item.href.toLowerCase().includes(lowerCaseQuery)) 
        );

    if (filteredItems.length === 0 && query.length > 0) {
      commandPaletteNoResults.style.display = 'block';
    } else {
      commandPaletteNoResults.style.display = 'none';
      filteredItems.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.dataset.index = index; 
        listItem.dataset.href = item.href;
        if (item.target) {
            listItem.dataset.target = item.target;
        }

        const itemNameSpan = document.createElement('span');
        itemNameSpan.className = 'item-name';
        itemNameSpan.textContent = item.name;
        listItem.appendChild(itemNameSpan);

        const itemTypeSpan = document.createElement('span');
        itemTypeSpan.className = 'item-type';
        itemTypeSpan.textContent = item.type === 'page' ? 'Page' : 'External Link';
        listItem.appendChild(itemTypeSpan);
        
        listItem.addEventListener('click', () => {
          // Determine if the clicked item is the current page
          let isCurrentPage = false;
          if (item.type === 'page') {
            let currentClickPath = window.location.pathname;
            if (currentClickPath === '/') currentClickPath = '/index.html';
            
            let itemClickPath = item.href;
            if (itemClickPath && !itemClickPath.startsWith('/') && !itemClickPath.startsWith('http')) {
              itemClickPath = '/' + itemClickPath;
            }

            if (itemClickPath === currentClickPath) {
              isCurrentPage = true;
            } else { 
              // Handle cases like /bypass vs /bypass.html for comparison
              const currentClickBase = currentClickPath.substring(currentClickPath.lastIndexOf('/') + 1).replace(".html", "");
              const itemClickBase = item.href.substring(item.href.lastIndexOf('/') + 1).replace(".html", "");
              if (currentClickBase === itemClickBase && currentClickBase !== "") { // Ensure base isn't empty
                  isCurrentPage = true;
              }
            }
          }

          if (item.target === '_blank') {
            window.open(item.href, '_blank', 'noopener,noreferrer');
          } else if (isCurrentPage && item.type === 'page') {
            // Current page, do nothing extra, palette will close
          } else {
            window.location.href = item.href;
          }
          closeCommandPalette();
        });
        commandPaletteResults.appendChild(listItem);
      });
    }
    currentFocusedResultIndex = -1; 
    updateCommandPaletteFocus();
  }
  
  function updateCommandPaletteFocus() {
    if (!commandPaletteResults) return;
    const resultsItems = commandPaletteResults.querySelectorAll('li');
    resultsItems.forEach((item, index) => {
      if (index === currentFocusedResultIndex) {
        item.classList.add('is-selected');
        item.scrollIntoView({ block: 'nearest' }); 
      } else {
        item.classList.remove('is-selected');
      }
    });
  }

  // Attach event listeners if elements exist
  if (commandPaletteInput && commandPaletteResults) {
    commandPaletteInput.addEventListener('input', (e) => {
      renderCommandPaletteResults(e.target.value);
    });
  }
  if (commandPaletteBackdrop) {
      commandPaletteBackdrop.addEventListener('click', closeCommandPalette);
  }

  // --- Global Event Listeners (Keyboard) ---
  window.addEventListener('keydown', (e) => {
    // Escape key for closing overlays
    if (e.key === 'Escape') {
      if (fullscreenMenu && fullscreenMenu.classList.contains('is-active')) {
        toggleFullScreenMenu(); 
      }
      if (commandPalette && commandPalette.classList.contains('is-active')) {
        closeCommandPalette();
      }
    }

    // Ctrl+K or Cmd+K for command palette
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault(); 
      if (commandPalette && commandPalette.classList.contains('is-active')) {
         if(commandPaletteInput) commandPaletteInput.focus(); // Refocus if already open
      } else {
        openCommandPalette(); 
      }
    }

    // Keyboard navigation for command palette
    if (commandPalette && commandPalette.classList.contains('is-active')) {
      const resultsItems = commandPaletteResults.querySelectorAll('li');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (resultsItems.length > 0) {
            currentFocusedResultIndex = (currentFocusedResultIndex + 1) % resultsItems.length;
            updateCommandPaletteFocus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (resultsItems.length > 0) {
            currentFocusedResultIndex = (currentFocusedResultIndex - 1 + resultsItems.length) % resultsItems.length;
            updateCommandPaletteFocus();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocusedResultIndex > -1 && resultsItems[currentFocusedResultIndex]) {
          resultsItems[currentFocusedResultIndex].click(); 
        } else if (resultsItems.length > 0) { 
          // If no specific item is focused via arrows, but results exist (e.g., user typed and hit enter)
          resultsItems[0].click(); 
        }
      }
    }
  });
});