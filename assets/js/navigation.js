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
    fullscreenMenuList.innerHTML = ''; 
    
    const currentWindowPath = window.location.pathname;
    let currentPageIdentifier = currentWindowPath.substring(currentWindowPath.lastIndexOf('/') + 1);

    if (currentPageIdentifier === "" || currentWindowPath.endsWith("/")) {
        currentPageIdentifier = 'index.html'; 
    }

    siteNavItems.filter(item => item.type === 'page').forEach(item => { 
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.href; 
      link.textContent = item.name;
      
      const navItemHref = item.href;
      const navItemBase = navItemHref.replace(".html", "");
      const currentPageBase = currentPageIdentifier.replace(".html", "");

      // console.log(`[Highlight Check V2.1] Menu Item: '${item.name}', CurrentPageID: '${currentPageIdentifier}', CurrentPageBase: '${currentPageBase}', NavItemHref: '${navItemHref}', NavItemBase: '${navItemBase}', Match: ${navItemBase === currentPageBase || navItemHref === currentPageIdentifier}`);

      if (navItemBase === currentPageBase || navItemHref === currentPageIdentifier) {
        link.classList.add('current-page');
        link.setAttribute('aria-current', 'page');
        // Note: link.style.cursor = 'default' will be handled by CSS for .current-page
      }

      // Add click listener to all page links in the menu
      link.addEventListener('click', function(event) {
        if (this.classList.contains('current-page')) {
          event.preventDefault(); // Prevent re-navigating to the same page
        }
        // For all page link clicks (current or not), close the menu
        if (fullscreenMenu.classList.contains('is-active')) {
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
      if (document.body.contains(menuTrigger) && menuTrigger.offsetParent !== null) {
        menuTrigger.focus(); 
      }
    } else {
      if (commandPalette && commandPalette.classList.contains('is-active')) {
        closeCommandPalette();
      }
      fullscreenMenu.classList.add('is-active');
      menuTrigger.classList.add('is-active'); 
      menuTrigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('overlay-active');
      
      // Focus the menu container itself for better accessibility and to avoid initial focus on "Home"
      if (fullscreenMenuList) {
          fullscreenMenuList.setAttribute('tabindex', '-1'); // Make it programmatically focusable
          fullscreenMenuList.focus();
      }
    }
  }
  
  if (menuTrigger && fullscreenMenu) {
    menuTrigger.addEventListener('click', toggleFullScreenMenu); 
    if (fullscreenMenuList) {
        populateFullScreenMenu();
    }
  }

  // --- Command Palette Logic (remains the same as your last working version) ---
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
        siteNavItems.filter(item => item.type === 'page') :
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
          let isCurrentPage = false;
          let currentClickPath = window.location.pathname;
          if (currentClickPath === '/') currentClickPath = '/index.html';
          
          let itemClickPath = item.href;
          if (itemClickPath && !itemClickPath.startsWith('/') && !itemClickPath.startsWith('http')) {
            itemClickPath = '/' + itemClickPath;
          }

          if (itemClickPath === currentClickPath) {
            isCurrentPage = true;
          } else { 
            const currentClickBase = currentClickPath.substring(currentClickPath.lastIndexOf('/') + 1).replace(".html", "");
            const itemClickBase = item.href.substring(item.href.lastIndexOf('/') + 1).replace(".html", "");
            if (currentClickBase === itemClickBase && currentClickBase !== "") isCurrentPage = true;
          }

          if (item.target === '_blank') {
            window.open(item.href, '_blank', 'noopener,noreferrer');
          } else if (isCurrentPage && item.type === 'page') {
            // Current page, do nothing special, menu will close via closeCommandPalette()
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

  if (commandPaletteInput && commandPaletteResults) {
    commandPaletteInput.addEventListener('input', (e) => {
      renderCommandPaletteResults(e.target.value);
    });
  }
  if (commandPaletteBackdrop) {
      commandPaletteBackdrop.addEventListener('click', closeCommandPalette);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (fullscreenMenu && fullscreenMenu.classList.contains('is-active')) {
        toggleFullScreenMenu(); 
      }
      if (commandPalette && commandPalette.classList.contains('is-active')) {
        closeCommandPalette();
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault(); 
      if (commandPalette && commandPalette.classList.contains('is-active')) {
         if(commandPaletteInput) commandPaletteInput.focus(); 
      } else {
        openCommandPalette(); 
      }
    }

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
        } else if (resultsItems.length > 0 && commandPaletteInput && commandPaletteInput.value.trim() !== "") { 
          resultsItems[0].click(); 
        } else if (resultsItems.length > 0 && commandPaletteInput && commandPaletteInput.value.trim() === "") {
          resultsItems[0].click();
        }
      }
    }
  });
});