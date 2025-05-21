// navigation.js
// Contains all logic for the full-screen menu and command palette.
// It assumes `siteNavItems` is globally available from nav-data.js.

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

  if (!menuTrigger && !commandPalette) {
    // If no navigation elements are found, don't proceed.
    // This allows including the script on pages without these nav features if needed.
    // console.log("Navigation elements not found on this page. Skipping navigation script init.");
    return;
  }
  
  let currentFocusedResultIndex = -1;

  // --- Full-Screen Menu Logic ---
  function populateFullScreenMenu() {
    if (!fullscreenMenuList || typeof siteNavItems === 'undefined') return;
    fullscreenMenuList.innerHTML = ''; 
    siteNavItems.filter(item => item.type === 'page').forEach(item => { 
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.name;
      
      const currentPath = window.location.pathname;
      let itemPath = item.href;
      // Ensure itemPath starts with '/' if it's a relative root path like "index.html"
      if (!itemPath.startsWith('/') && !itemPath.startsWith('http')) {
        itemPath = '/' + itemPath;
      }

      const isCurrentPage = currentPath === itemPath || 
                            (currentPath.endsWith('/') && item.href === 'index.html') || // Handles root index.html
                            currentPath.endsWith(item.href); // Handles direct file match

      if (isCurrentPage) {
        link.style.color = '#fff'; 
        link.style.cursor = 'default';
        link.style.fontWeight = 'bold'; // Emphasize current page
        link.onclick = (e) => e.preventDefault(); 
      }
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
      menuTrigger.focus(); 
    } else {
      if (commandPalette && commandPalette.classList.contains('is-active')) {
        closeCommandPalette();
      }
      fullscreenMenu.classList.add('is-active');
      menuTrigger.classList.add('is-active'); 
      menuTrigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('overlay-active');
      const firstLink = fullscreenMenuList.querySelector('a:not([style*="cursor: default"])'); 
      if (firstLink) firstLink.focus();
      else if (menuTrigger) menuTrigger.focus(); 
    }
  }
  
  if (menuTrigger && fullscreenMenu) {
    menuTrigger.addEventListener('click', toggleFullScreenMenu); 
    populateFullScreenMenu(); // Populate on load
  }

  // --- Command Palette Logic ---
  function openCommandPalette() {
    if (!commandPalette || !commandPaletteBackdrop || !commandPaletteInput) return;
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
          item.name.toLowerCase().includes(lowerCaseQuery)
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
          const currentPath = window.location.pathname;
          let itemPath = item.href;
          if (!itemPath.startsWith('/') && !itemPath.startsWith('http')) {
            itemPath = '/' + itemPath;
          }
          const isCurrentPage = currentPath === itemPath || 
                                (currentPath.endsWith('/') && item.href === 'index.html') ||
                                (currentPath === '/' && item.href === 'index.html') ||
                                currentPath.endsWith(item.href);

          if (item.target === '_blank') {
            window.open(item.href, '_blank', 'noopener,noreferrer');
          } else if (isCurrentPage && item.type === 'page') {
            // If it's the current page, just close the palette
            // Allow re-clicking external links
          }
          else {
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
    if (e.key === 'Escape') {
      if (fullscreenMenu && fullscreenMenu.classList.contains('is-active')) {
        toggleFullScreenMenu(); 
      }
      if (commandPalette && commandPalette.classList.contains('is-active')) {
        closeCommandPalette();
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { // Ensure 'k' check is case-insensitive
      e.preventDefault(); 
      if (commandPalette && commandPalette.classList.contains('is-active')) {
         if(commandPaletteInput) commandPaletteInput.focus(); 
      } else {
        openCommandPalette(); 
      }
    }

    if (commandPalette && commandPalette.classList.contains('is-active')) {
      const resultsItems = commandPaletteResults.querySelectorAll('li');
      if (resultsItems.length === 0 && e.key !== 'Escape') return; 

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
        } else if (resultsItems.length > 0 && currentFocusedResultIndex === -1) { // If Enter is pressed without prior arrow key nav
            resultsItems[0].click(); 
        }
      }
    }
  });
});