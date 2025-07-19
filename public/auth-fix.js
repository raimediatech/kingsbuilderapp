// 🚀 EMERGENCY AUTH FIX - FORCE TOKEN INJECTION
console.log('🚨 AUTH FIX: Loading emergency authentication...');

// Function to get access token from URL or cookies
function getAccessToken() {
    // Method 1: From URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token') || urlParams.get('access_token');
    
    // Method 2: From cookies
    const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken=') || row.startsWith('shopifyAccessToken='))
        ?.split('=')[1];
    
    // Method 3: From local storage
    const localToken = localStorage.getItem('accessToken') || localStorage.getItem('shopifyAccessToken');
    
    return urlToken || cookieToken || localToken;
}

// Function to get shop from URL or cookies
function getShop() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlShop = urlParams.get('shop');
    
    const cookieShop = document.cookie
        .split('; ')
        .find(row => row.startsWith('shopOrigin='))
        ?.split('=')[1];
        
    return urlShop || cookieShop || 'kingsbuilder.myshopify.com';
}

// Override all fetch requests to include auth headers
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
    const accessToken = getAccessToken();
    const shop = getShop();
    
    // Add authentication headers
    if (!options.headers) {
        options.headers = {};
    }
    
    if (accessToken) {
        options.headers['X-Shopify-Access-Token'] = accessToken;
        options.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    if (shop) {
        options.headers['X-Shopify-Shop-Domain'] = shop;
    }
    
    console.log('🔐 FETCH with auth:', url, {
        hasToken: !!accessToken,
        shop: shop,
        headers: options.headers
    });
    
    return originalFetch(url, options);
};

// Store tokens globally for builder
window.shopifyAccessToken = getAccessToken();
window.shopOrigin = getShop();

console.log('✅ AUTH FIX: Emergency authentication loaded!', {
    hasToken: !!window.shopifyAccessToken,
    shop: window.shopOrigin
});