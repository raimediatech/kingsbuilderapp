// This script fixes the "Cannot find menu item with id save-page" error
// and helps with cross-origin communication

(function() {
  // Create the missing menu item
  function createSaveMenuItem() {
    // Check if the menu item already exists
    if (document.getElementById('save-page')) {
      return;
    }
    
    // Create a hidden menu item that our code can find
    const menuItem = document.createElement('div');
    menuItem.id = 'save-page';
    menuItem.style.display = 'none';
    document.body.appendChild(menuItem);
    
    // Add click handler to the menu item
    menuItem.addEventListener('click', function() {
      // Find and click the save button
      const saveBtn = document.getElementById('save-btn');
      if (saveBtn) {
        saveBtn.click();
      }
    });
    
    console.log('Created missing save-page menu item');
  }
  
  // Handle cross-origin communication safely
  function setupCrossOriginHandler() {
    // Create a safe postMessage handler
    window.addEventListener('message', function(event) {
      // Verify the origin for security
      if (event.origin.includes('myshopify.com') || 
          event.origin.includes('shopify.com') || 
          event.origin.includes('kingsbuilder') ||
          event.origin.includes('localhost')) {
        
        try {
          const data = event.data;
          console.log('Received message:', data);
          
          // Handle different message types
          if (data.type === 'SAVE_PAGE') {
            console.log('Save page message received');
            // Trigger save functionality
            const saveBtn = document.getElementById('save-btn');
            if (saveBtn) {
              saveBtn.click();
            } else {
              console.error('Save button not found');
            }
          } else if (data.type === 'PUBLISH_PAGE') {
            console.log('Publish page message received');
            // Trigger publish functionality
            const publishBtn = document.getElementById('publish-btn');
            if (publishBtn) {
              publishBtn.click();
            } else {
              console.error('Publish button not found');
            }
          }
        } catch (error) {
          console.error('Error handling cross-origin message:', error);
        }
      } else {
        console.log('Message from untrusted origin:', event.origin);
      }
    });
    
    console.log('Set up cross-origin message handler');
  }
  
  // Patch the error that occurs when trying to find menu items
  function patchMenuItemError() {
    // Override the error that occurs in content-all.js
    // This is a workaround for the "Cannot find menu item with id save-page" error
    const originalGetElementById = document.getElementById;
    document.getElementById = function(id) {
      const element = originalGetElementById.call(document, id);
      
      // If element not found and it's a menu item we're looking for
      if (!element && (id === 'save-page' || id === 'publish-page')) {
        console.log('Creating missing menu item on demand:', id);
        
        // Create the element on demand
        const menuItem = document.createElement('div');
        menuItem.id = id;
        menuItem.style.display = 'none';
        document.body.appendChild(menuItem);
        
        return menuItem;
      }
      
      return element;
    };
  }
  
  // Initialize fixes when the DOM is ready
  function init() {
    createSaveMenuItem();
    setupCrossOriginHandler();
    patchMenuItemError();
    
    // Create a publish-page menu item too
    const publishMenuItem = document.createElement('div');
    publishMenuItem.id = 'publish-page';
    publishMenuItem.style.display = 'none';
    document.body.appendChild(publishMenuItem);
    
    // Add click handler to the publish menu item
    publishMenuItem.addEventListener('click', function() {
      // Find and click the publish button
      const publishBtn = document.getElementById('publish-btn');
      if (publishBtn) {
        publishBtn.click();
      }
    });
    
    // Add a class to indicate our fixes are active
    document.documentElement.classList.add('kings-builder-fixed');
    
    console.log('KingsBuilder fixes initialized');
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Also run after a short delay to ensure it works even if loaded dynamically
  setTimeout(init, 1000);
})();