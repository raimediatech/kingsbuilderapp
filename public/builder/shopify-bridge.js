// Shopify App Bridge integration for KingsBuilder
// This script helps with Shopify integration and cross-origin communication

(function() {
  // Store references to Shopify objects
  let shopifyApp = null;
  let shopifyActions = null;
  
  // Initialize Shopify App Bridge
  function initAppBridge() {
    try {
      console.log('Attempting to initialize Shopify App Bridge...');
      
      // Check if we're in a Shopify iframe
      const isInIframe = window.top !== window.self;
      console.log('Is in iframe:', isInIframe);
      
      // Check for App Bridge availability
      if (typeof window.shopify !== 'undefined') {
        console.log('Shopify object found in window');
      } else if (typeof window.Shopify !== 'undefined' && typeof window.Shopify.AppBridge !== 'undefined') {
        console.log('Shopify.AppBridge found');
        window.shopify = window.Shopify.AppBridge;
      } else {
        console.log('Loading Shopify App Bridge from CDN');
        // Try to load App Bridge from CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@shopify/app-bridge@3';
        document.head.appendChild(script);
        
        // Wait for script to load
        script.onload = function() {
          console.log('App Bridge script loaded from CDN');
          if (typeof window.Shopify !== 'undefined' && typeof window.Shopify.AppBridge !== 'undefined') {
            window.shopify = window.Shopify.AppBridge;
            initAppBridgeAfterLoad();
          }
        };
        
        return false;
      }
      
      // Get API key from meta tag or use default
      const apiKey = getApiKey();
      console.log('Using API key:', apiKey);
      
      // Get shop origin
      const shopOrigin = getShopOrigin();
      console.log('Shop origin:', shopOrigin);
      
      if (!shopOrigin) {
        console.error('No shop origin found, cannot initialize App Bridge');
        return false;
      }
      
      // Create App Bridge instance
      if (typeof window.shopify !== 'undefined' && typeof window.shopify.createApp !== 'undefined') {
        shopifyApp = window.shopify.createApp({
          apiKey: apiKey,
          shopOrigin: shopOrigin
        });
        
        console.log('App Bridge instance created');
        
        // Get actions
        if (window.shopify.actions) {
          shopifyActions = {
            Toast: window.shopify.actions.Toast,
            Loading: window.shopify.actions.Loading,
            Modal: window.shopify.actions.Modal,
            Navigation: window.shopify.actions.Navigation
          };
          
          // Set up message handlers
          setupMessageHandlers();
          
          console.log('Shopify App Bridge initialized successfully');
          return true;
        } else {
          console.error('Shopify actions not available');
        }
      } else if (typeof window.Shopify !== 'undefined' && 
                typeof window.Shopify.AppBridge !== 'undefined' && 
                typeof window.Shopify.AppBridge.createApp !== 'undefined') {
        // Try alternative initialization
        shopifyApp = window.Shopify.AppBridge.createApp({
          apiKey: apiKey,
          shopOrigin: shopOrigin
        });
        
        console.log('App Bridge instance created using Shopify.AppBridge');
        
        // Get actions
        if (window.Shopify.AppBridge.actions) {
          shopifyActions = {
            Toast: window.Shopify.AppBridge.actions.Toast,
            Loading: window.Shopify.AppBridge.actions.Loading,
            Modal: window.Shopify.AppBridge.actions.Modal,
            Navigation: window.Shopify.AppBridge.actions.Navigation
          };
          
          // Set up message handlers
          setupMessageHandlers();
          
          console.log('Shopify App Bridge initialized successfully with alternative method');
          return true;
        } else {
          console.error('Shopify actions not available with alternative method');
        }
      } else {
        console.error('Shopify createApp method not available');
      }
      
      return false;
    } catch (error) {
      console.error('Error initializing Shopify App Bridge:', error);
      return false;
    }
  }
  
  // Initialize App Bridge after script loads
  function initAppBridgeAfterLoad() {
    const initialized = initAppBridge();
    
    // Add a class to indicate initialization status
    document.documentElement.classList.add(
      initialized ? 'shopify-app-bridge-initialized' : 'shopify-app-bridge-failed'
    );
  }
  
  // Get API key from meta tag
  function getApiKey() {
    // Try to get from meta tag
    const metaTag = document.querySelector('meta[name="shopify-api-key"]');
    if (metaTag && metaTag.content) {
      return metaTag.content;
    }
    
    // Default to empty string, will be set by server-side rendering
    return '';
  }
  
  // Get shop origin from URL or cookies
  function getShopOrigin() {
    // Try to get from URL
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get('shop');
    
    if (shop) {
      return shop;
    }
    
    // Try to get from cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('shopOrigin=')) {
        return cookie.substring('shopOrigin='.length, cookie.length);
      }
    }
    
    // Try to get from localStorage
    const storedShop = localStorage.getItem('shopOrigin');
    if (storedShop) {
      return storedShop;
    }
    
    // Default to a placeholder
    return 'kingsbuilder.myshopify.com';
  }
  
  // Set up message handlers for Shopify App Bridge
  function setupMessageHandlers() {
    if (!shopifyApp || !shopifyActions) {
      console.error('Cannot set up message handlers: App Bridge not initialized');
      return;
    }
    
    try {
      // Listen for save events
      const saveBtn = document.getElementById('save-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', function() {
          try {
            // Show toast notification
            shopifyApp.dispatch(shopifyActions.Toast.create({
              message: 'Saving page...',
              duration: 2000,
            }));
            
            // Show loading indicator
            const loading = shopifyApp.dispatch(shopifyActions.Loading.create({
              message: 'Saving page...'
            }));
            
            // Hide loading after save completes
            setTimeout(() => {
              shopifyApp.dispatch(shopifyActions.Loading.remove(loading));
              
              // Show success toast
              shopifyApp.dispatch(shopifyActions.Toast.create({
                message: 'Page saved successfully!',
                duration: 3000,
                isError: false
              }));
            }, 2000);
          } catch (error) {
            console.error('Error dispatching App Bridge action:', error);
          }
        });
        
        console.log('Save button event listener added');
      } else {
        console.warn('Save button not found');
      }
      
      // Listen for publish events
      const publishBtn = document.getElementById('publish-btn');
      if (publishBtn) {
        publishBtn.addEventListener('click', function() {
          try {
            // Show toast notification
            shopifyApp.dispatch(shopifyActions.Toast.create({
              message: 'Publishing page...',
              duration: 2000,
            }));
            
            // Show loading indicator
            const loading = shopifyApp.dispatch(shopifyActions.Loading.create({
              message: 'Publishing page...'
            }));
            
            // Hide loading after publish completes
            setTimeout(() => {
              shopifyApp.dispatch(shopifyActions.Loading.remove(loading));
              
              // Show success toast
              shopifyApp.dispatch(shopifyActions.Toast.create({
                message: 'Page published successfully!',
                duration: 3000,
                isError: false
              }));
            }, 2000);
          } catch (error) {
            console.error('Error dispatching App Bridge action:', error);
          }
        });
        
        console.log('Publish button event listener added');
      } else {
        console.warn('Publish button not found');
      }
    } catch (error) {
      console.error('Error setting up message handlers:', error);
    }
  }
  
  // Initialize when the DOM is ready
  function init() {
    console.log('Initializing Shopify integration...');
    
    // Create a hidden save-page menu item
    const menuItem = document.createElement('div');
    menuItem.id = 'save-page';
    menuItem.style.display = 'none';
    document.body.appendChild(menuItem);
    
    // Create a hidden publish-page menu item
    const publishMenuItem = document.createElement('div');
    publishMenuItem.id = 'publish-page';
    publishMenuItem.style.display = 'none';
    document.body.appendChild(publishMenuItem);
    
    // Add API key meta tag if not present
    if (!document.querySelector('meta[name="shopify-api-key"]')) {
      // Don't add a hardcoded API key, it should be set by the server
      console.log('No API key meta tag found');
    }
    
    // Try to initialize App Bridge
    const appBridgeInitialized = initAppBridge();
    
    // Add a class to indicate initialization status
    document.documentElement.classList.add(
      appBridgeInitialized ? 'shopify-app-bridge-initialized' : 'shopify-app-bridge-failed'
    );
    
    // Store shop in localStorage for persistence
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get('shop');
    if (shop) {
      localStorage.setItem('shopOrigin', shop);
    }
    
    console.log('Shopify integration initialization complete');
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Also run after a short delay to ensure it works even if loaded dynamically
  setTimeout(init, 1000);
  
  // Expose to window for debugging
  window.kingsBuilderShopify = {
    initAppBridge,
    getShopOrigin,
    getApiKey
  };
})();