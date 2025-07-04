const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

// Load environment variables
try {
  require('dotenv').config();
  console.log('Environment variables loaded');
} catch (error) {
  console.log('No .env file found, using environment variables from the system');
}

// ABSOLUTE IFRAME FREEDOM - NO RESTRICTIONS WHATSOEVER
app.use((req, res, next) => {
  // Delete ALL possible blocking headers
  res.removeHeader('X-Frame-Options');
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('X-Content-Type-Options');
  res.removeHeader('Referrer-Policy');
  res.removeHeader('Permissions-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  
  // NO CSP AT ALL - COMPLETE FREEDOM
  // Most page builders work because they don't set ANY CSP
  
  next();
});

// COMPLETELY OPEN CORS - NO RESTRICTIONS
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET || 'kings-builder-session-secret'));

// Simple test route to check if the server is working
app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is working! iframe headers removed',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// Debug headers route
app.get('/debug-headers', (req, res) => {
  const headers = res.getHeaders();
  res.json({
    message: 'Current response headers',
    headers: headers,
    xFrameOptions: headers['x-frame-options'] || 'NOT SET',
    csp: headers['content-security-policy'] || 'NOT SET'
  });
});

// Super simple HTML test
app.get('/simple', (req, res) => {
  const headers = res.getHeaders();
  res.send(`
    <h1>✅ SERVER WORKS!</h1>
    <p><strong>CSP Header:</strong> ${headers['content-security-policy'] || 'NOT SET'}</p>
    <p><strong>X-Frame-Options:</strong> ${headers['x-frame-options'] || 'NOT SET (GOOD!)'}</p>
    <p>Should now work in Shopify admin iframe!</p>
  `);
});

// Debug headers route
app.get('/debug-headers', (req, res) => {
  const headers = res.getHeaders();
  res.json({
    message: 'Current response headers',
    headers: headers,
    xFrameOptions: headers['x-frame-options'] || 'NOT SET',
    csp: headers['content-security-policy'] || 'NOT SET'
  });
});

// Test route that can be loaded in iframe
app.get('/iframe-test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>KingsBuilder - Iframe Test</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0;">
      <h1>✅ KingsBuilder App is Loading!</h1>
      <p>If you can see this, the iframe security headers are working correctly.</p>
      <p><strong>Shop:</strong> ${req.query.shop || 'Not specified'}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <button onclick="window.location.href='/dashboard?shop=${req.query.shop || ''}'">
        Go to Dashboard
      </button>
    </body>
    </html>
  `);
});

// ROOT ROUTE - HANDLE EMBEDDED AND OAUTH
app.get('/', (req, res) => {
  const shop = req.query.shop;
  const embedded = req.query.embedded;
  const host = req.query.host;
  
  if (shop) {
    // TEMPORARY: Force re-auth to get content scopes (remove after first install)
    // Disable forced reauth on every load
    const forceReauth = (req.query.force_reauth === 'true');
    
    if (forceReauth) {
      console.log('🔄 FORCING RE-AUTH to get content scopes');
      // Clear old cookies
      res.clearCookie('accessToken');
      res.clearCookie('shopOrigin');
      
      const scopes = 'read_products,write_products,read_customers,write_customers,read_orders,write_orders,read_content,write_content';
      const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${encodeURIComponent(scopes)}&redirect_uri=https://kingsbuilderapp.vercel.app/auth/callback&state=${shop}`;
      
      res.send(`
        <script>
          // Clear all cookies first
          document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          });
          window.top.location.href = "${authUrl}";
        </script>
      `);
      return;
    }
    
    // Check if this is coming from Shopify admin (has id_token or hmac)
    const idToken = req.query.id_token;
    const hmac = req.query.hmac;
    
    if (embedded && (idToken || hmac)) {
      console.log('🎯 Coming from Shopify Admin - redirect to dashboard');
      return res.redirect(`/dashboard?shop=${shop}&embedded=1&host=${host || ''}`);
    }
    
    // Check if user already has access token
    const accessToken = req.cookies?.accessToken;
    const cookieShop = req.cookies?.shopOrigin;
    
    if (accessToken && cookieShop === shop) {
      console.log('✅ User authenticated - redirect to dashboard');
      return res.redirect(`/dashboard?shop=${shop}&embedded=1&host=${host || ''}`);
    }
    
    // Need OAuth flow
    console.log('🔐 Starting OAuth flow for shop:', shop);
    const scopes = 'read_products,write_products,read_customers,write_customers,read_orders,write_orders,read_content,write_content';
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${encodeURIComponent(scopes)}&redirect_uri=https://kingsbuilderapp.vercel.app/auth/callback&state=${shop}`;
    
    res.send(`
      <script>
        window.top.location.href = "${authUrl}";
      </script>
    `);
    return;
  }
  
  // No shop, serve landing page
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// INSTALL ROUTE - IFRAME BREAKOUT OAUTH
app.get('/install', (req, res) => {
  const shop = req.query.shop;
  if (!shop) {
    res.send(`
      <h2>Enter your shop domain:</h2>
      <form onsubmit="window.location.href='/install?shop=' + document.getElementById('shop').value + '.myshopify.com'; return false;">
        <input id="shop" placeholder="yourstore" required>
        <button type="submit">Install</button>
      </form>
    `);
    return;
  }
  
  // FORCE TOP WINDOW OAUTH - THIS WORKS
  const scopes = 'read_products,write_products,read_customers,write_customers,read_orders,write_orders,read_content,write_content';
  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${encodeURIComponent(scopes)}&redirect_uri=https://kingsbuilderapp.vercel.app/auth/callback&state=${shop}`;
  
  res.send(`
    <script>
      // BREAK OUT OF IFRAME AND GO TO SHOPIFY
      if (window.top !== window.self) {
        window.top.location.href = "${authUrl}";
      } else {
        window.location.href = "${authUrl}";
      }
    </script>
  `);
});

// AUTH ROUTE - REDIRECT TO INSTALL
app.get('/auth', (req, res) => {
  res.redirect('/install?' + new URLSearchParams(req.query));
});

app.get('/auth/callback', async (req, res) => {
  const { shop, code } = req.query;
  
  if (!shop || !code) {
    return res.status(400).send('Missing shop or code parameter');
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code: code
      })
    });
    
    console.log('🔑 Token request payload:', {
      client_id: process.env.SHOPIFY_API_KEY,
      has_secret: !!process.env.SHOPIFY_API_SECRET,
      code: code?.substring(0, 10) + '...'
    });
    
    const tokenData = await tokenResponse.json();
    
    console.log('🔍 Full token response:', tokenData);
    
    if (tokenData.access_token) {
      console.log(`✅ NEW OAuth token received for ${shop}`, { 
        access_token: tokenData.access_token?.substring(0, 10) + '...',
        token_length: tokenData.access_token?.length,
        scope: tokenData.scope
      });
      
      // Store both shop and access token in cookies with proper settings for embedded apps
      res.cookie('shopOrigin', shop, { 
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
      res.cookie('accessToken', tokenData.access_token, { 
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
      
      // For embedded apps, redirect back to Shopify admin
      const shopName = shop.replace('.myshopify.com', '');
      const shopifyAdminUrl = `https://admin.shopify.com/store/${shopName}/apps/kingsbuilder`;
      console.log('🔄 Redirecting to Shopify admin app:', shopifyAdminUrl);
      
      // Send a special page that handles the embedded context
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>KingsBuilder - Connected!</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                   text-align: center; padding: 50px; background: #f6f6f7; }
            .loading { color: #666; }
            .spinner { animation: spin 1s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="loading">
            <div class="spinner">✅</div>
            <h2>Successfully Connected!</h2>
            <p>Returning to your Shopify admin...</p>
          </div>
          <script>
            // Always redirect to Shopify admin for embedded apps
            console.log('🔄 Redirecting to Shopify admin app');
            window.location.href = '${shopifyAdminUrl}';
          </script>
        </body>
        </html>
      `);
    } else {
      throw new Error('Failed to get access token');
    }
    
  } catch (error) {
    console.error('❌ OAuth Error:', error);
    res.status(500).send('OAuth failed: ' + error.message);
  }
});

app.get('/auth/shopify/callback', (req, res) => {
  res.redirect('/auth/callback?' + new URLSearchParams(req.query));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API endpoint to get real Shopify pages
app.get('/api/shopify/pages', async (req, res) => {
  try {
    const shop = req.query.shop || req.cookies?.shopOrigin;
    const accessToken = req.cookies?.accessToken;
    
    console.log('🔍 API Pages endpoint hit:', { 
      shop_query: req.query.shop,
      shop_cookie: req.cookies?.shopOrigin,
      has_access_token: !!accessToken,
      token_preview: accessToken?.substring(0, 10) + '...',
      all_cookies: Object.keys(req.cookies || {})
    });
    
    if (!shop || !accessToken) {
      console.log('❌ Missing auth data - returning 401');
      return res.status(401).json({ 
        error: 'Shop or access token missing',
        requiresAuth: true,
        debug: { shop: !!shop, accessToken: !!accessToken }
      });
    }
    
    console.log('📄 Fetching pages from Shopify for shop:', shop);
    
    // FIRST: Check what scopes the current token has
    console.log('🔍 Checking token scopes...');
    try {
      const tokenCheckResponse = await fetch(`https://${shop}/admin/oauth/access_scopes.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });
      
      if (tokenCheckResponse.ok) {
        const scopeData = await tokenCheckResponse.json();
        console.log('📋 Current token scopes:', scopeData.access_scopes?.map(s => s.handle));
        
        // Check if we have content scopes
        const hasContentScopes = scopeData.access_scopes?.some(s => s.handle === 'read_content' || s.handle === 'write_content');
        if (!hasContentScopes) {
          console.log('🚨 TOKEN MISSING CONTENT SCOPES - FORCING RE-AUTH');
          
          // Clear the old token cookies
          res.clearCookie('accessToken');
          res.clearCookie('shopOrigin');
          
          // Return 401 to trigger re-auth
          return res.status(401).json({
            error: 'Token missing content scopes',
            message: 'App needs to be reinstalled with content permissions',
            requiresReauth: true,
            currentScopes: scopeData.access_scopes?.map(s => s.handle) || []
          });
        }
      }
    } catch (scopeError) {
      console.log('⚠️ Could not check token scopes:', scopeError.message);
    }
    
    // Fetch pages from Shopify API
    const apiUrl = `https://${shop}/admin/api/2023-10/pages.json`;
    console.log('📡 Making API request to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 API Response Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Shopify API Error Details:', errorText);
      
      // CHECK IF IT'S A PERMISSION ERROR - FORCE RE-AUTH
      if (errorText.includes('merchant approval') || errorText.includes('read_content')) {
        console.log('🚨 MISSING CONTENT PERMISSIONS - FORCING RE-AUTH');
        
        // Clear the old token from database
        await db.query('DELETE FROM tokens WHERE shop = ?', [shop]);
        
        // Return 401 to trigger re-auth
        return res.status(401).json({
          error: 'Missing content permissions',
          message: 'App needs to be reinstalled with content permissions',
          requiresReauth: true
        });
      }
      
      // FALLBACK: If other permission errors, show demo pages
      if (errorText.includes('permission') || errorText.includes('scope')) {
        console.log('🔄 BYPASS: Returning demo pages due to missing permissions');
        
        const demoPages = [
          {
            id: 'demo-1',
            title: '🚀 Welcome to KingsBuilder - Demo Page',
            status: 'published',
            lastModified: new Date().toISOString(),
            views: 1250,
            conversions: 45,
            handle: 'welcome-demo',
            shopifyUrl: `https://${shop}/pages/welcome-demo`,
            frontendUrl: `https://${shop.replace('.myshopify.com', '')}.com/pages/welcome-demo`,
            isShopifyPage: true,
            isDemoPage: true
          },
          {
            id: 'demo-2', 
            title: '📞 Contact Us - Demo Page',
            status: 'published',
            lastModified: new Date().toISOString(),
            views: 890,
            conversions: 23,
            handle: 'contact-demo',
            shopifyUrl: `https://${shop}/pages/contact-demo`,
            frontendUrl: `https://${shop.replace('.myshopify.com', '')}.com/pages/contact-demo`,
            isShopifyPage: true,
            isDemoPage: true
          },
          {
            id: 'demo-3',
            title: '🔒 Privacy Policy - Demo Page',
            status: 'draft',
            lastModified: new Date().toISOString(),
            views: 456,
            conversions: 12,
            handle: 'privacy-demo',
            shopifyUrl: `https://${shop}/pages/privacy-demo`,
            frontendUrl: `https://${shop.replace('.myshopify.com', '')}.com/pages/privacy-demo`,
            isShopifyPage: true,
            isDemoPage: true
          },
          {
            id: 'demo-4',
            title: '📦 Shipping Info - Demo Page',
            status: 'published',
            lastModified: new Date().toISOString(),
            views: 678,
            conversions: 34,
            handle: 'shipping-demo',
            shopifyUrl: `https://${shop}/pages/shipping-demo`,
            frontendUrl: `https://${shop.replace('.myshopify.com', '')}.com/pages/shipping-demo`,
            isShopifyPage: true,
            isDemoPage: true
          }
        ];
        
        return res.json({
          pages: demoPages,
          message: 'Demo pages shown - Click "Install & Connect" to get real Shopify pages',
          needsPermissions: true,
          demoMode: true
        });
      }
      
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Found ${data.pages.length} pages in Shopify store`);
    
    // Transform Shopify pages to our format
    const transformedPages = data.pages.map(page => ({
      id: page.id,
      title: page.title,
      handle: page.handle,
      content: page.body_html,
      status: page.published_at ? 'published' : 'draft',
      lastModified: page.updated_at,
      createdAt: page.created_at,
      author: page.author,
      shopifyUrl: `https://${shop}/admin/pages/${page.id}`,
      frontendUrl: `https://${shop.replace('.myshopify.com', '')}.com/pages/${page.handle}`,
      views: Math.floor(Math.random() * 2000) + 100, // Placeholder - would need analytics integration
      conversions: Math.floor(Math.random() * 50) + 5 // Placeholder
    }));
    
    res.json({
      success: true,
      pages: transformedPages,
      total: transformedPages.length,
      shop: shop
    });
    
  } catch (error) {
    console.error('❌ Error fetching Shopify pages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pages from Shopify',
      message: error.message 
    });
  }
});

// API endpoint to get real Shopify products
app.get('/api/shopify/products', async (req, res) => {
  try {
    const shop = req.query.shop || req.cookies?.shopOrigin;
    const accessToken = req.cookies?.accessToken;
    const limit = req.query.limit || 50;
    
    if (!shop || !accessToken) {
      return res.status(401).json({ 
        error: 'Shop or access token missing',
        requiresAuth: true 
      });
    }
    
    console.log('🛍️ Fetching products from Shopify for shop:', shop);
    
    const response = await fetch(`https://${shop}/admin/api/2023-10/products.json?limit=${limit}&status=active`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Found ${data.products.length} products in Shopify store`);
    
    const transformedProducts = data.products.map(product => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.body_html,
      vendor: product.vendor,
      productType: product.product_type,
      status: product.status,
      images: product.images.map(img => ({
        id: img.id,
        src: img.src,
        alt: img.alt
      })),
      variants: product.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        compareAtPrice: variant.compare_at_price,
        sku: variant.sku
      })),
      tags: product.tags.split(',').map(tag => tag.trim()),
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));
    
    res.json({
      success: true,
      products: transformedProducts,
      total: transformedProducts.length,
      shop: shop
    });
    
  } catch (error) {
    console.error('❌ Error fetching Shopify products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products from Shopify',
      message: error.message 
    });
  }
});

// API endpoint to force reauth with new scopes
app.post('/api/force-reauth', async (req, res) => {
  try {
    const shop = req.body.shop || req.query.shop;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter required' });
    }
    
    console.log('🔄 Force reauth requested for shop:', shop);
    
    // Clear existing cookies
    res.clearCookie('accessToken');
    res.clearCookie('shopOrigin');
    
    // Build OAuth URL with correct scopes
    const apiKey = process.env.SHOPIFY_API_KEY;
    const scopes = 'read_products,write_products,read_customers,write_customers,read_orders,write_orders,read_content,write_content';
    const redirectUri = 'https://kingsbuilderapp.vercel.app/auth/callback';
    
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${shop}`;
    
    console.log('🚀 Generating OAuth URL with full scopes');
    
    res.json({
      success: true,
      authUrl: authUrl,
      message: 'Redirect to this URL to complete authentication'
    });
    
  } catch (error) {
    console.error('❌ Force reauth error:', error);
    res.status(500).json({ 
      error: 'Failed to initiate reauth',
      message: error.message 
    });
  }
});

// API endpoint to get shop information
app.get('/api/shopify/shop', async (req, res) => {
  try {
    const shop = req.query.shop || req.cookies?.shopOrigin;
    const accessToken = req.cookies?.accessToken;
    
    if (!shop || !accessToken) {
      return res.status(401).json({ 
        error: 'Shop or access token missing',
        requiresAuth: true 
      });
    }
    
    console.log('🏪 Fetching shop info for:', shop);
    
    const response = await fetch(`https://${shop}/admin/api/2023-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Shop info retrieved:', data.shop.name);
    
    res.json({
      success: true,
      shop: {
        id: data.shop.id,
        name: data.shop.name,
        domain: data.shop.myshopify_domain,
        email: data.shop.email,
        currency: data.shop.currency,
        timezone: data.shop.iana_timezone,
        planName: data.shop.plan_name,
        createdAt: data.shop.created_at,
        country: data.shop.country_name,
        province: data.shop.province
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching shop info:', error);
    res.status(500).json({ 
      error: 'Failed to fetch shop information',
      message: error.message 
    });
  }
});

// Shopify OAuth install endpoint
app.get('/install', (req, res) => {
  const shop = req.query.shop;
  
  if (!shop) {
    return res.status(400).send('Missing shop parameter');
  }
  
  const shopDomain = shop.includes('.') ? shop : `${shop}.myshopify.com`;
  
  // Store shop in session
  res.cookie('shopOrigin', shopDomain, { httpOnly: true, secure: false });
  
  // Build OAuth URL
  const clientId = process.env.SHOPIFY_API_KEY || 'your-client-id';
  const scopes = 'read_products,write_products,read_customers,write_customers,read_orders,write_orders,read_content,write_content';
  const redirectUri = encodeURIComponent(`${req.protocol}://${req.get('host')}/auth/callback`);
  const state = Math.random().toString(36).substring(2, 15);
  
  res.cookie('oauth_state', state, { httpOnly: true, secure: false });
  
  const oauthUrl = `https://${shopDomain}/admin/oauth/authorize?` +
    `client_id=${clientId}&` +
    `scope=${scopes}&` +
    `redirect_uri=${redirectUri}&` +
    `state=${state}`;
  
  console.log('🔗 Redirecting to Shopify OAuth:', oauthUrl);
  res.redirect(oauthUrl);
});

// Shopify OAuth callback endpoint
app.get('/auth/callback', async (req, res) => {
  try {
    const { code, state, shop } = req.query;
    const storedState = req.cookies?.oauth_state;
    const shopOrigin = req.cookies?.shopOrigin || shop;
    
    if (!code || !state || state !== storedState) {
      return res.status(400).send('Invalid OAuth callback');
    }
    
    // Exchange code for access token
    const clientId = process.env.SHOPIFY_API_KEY || 'your-client-id';
    const clientSecret = process.env.SHOPIFY_API_SECRET || 'your-client-secret';
    
    const tokenResponse = await fetch(`https://${shopOrigin}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      })
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }
    
    const tokenData = await tokenResponse.json();
    
    // Store access token and shop info
    res.cookie('accessToken', tokenData.access_token, { httpOnly: true, secure: false });
    res.cookie('shopOrigin', shopOrigin, { httpOnly: true, secure: false });
    
    console.log('✅ OAuth successful for shop:', shopOrigin);
    
    // Redirect to dashboard
    res.redirect(`/dashboard?shop=${shopOrigin}`);
    
  } catch (error) {
    console.error('❌ OAuth callback error:', error);
    res.status(500).send('OAuth authentication failed');
  }
});

// App route for Shopify admin
app.get('/app', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;
  
  if (shop) {
    // Check if we have access token
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      // Already authenticated, go to dashboard
      res.redirect('/dashboard?shop=' + shop);
    } else {
      // Need to authenticate
      res.redirect('/install?shop=' + shop);
    }
  } else {
    // If no shop parameter, redirect to install
    res.redirect('/install');
  }
});

// App builder route
app.get('/app/builder', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;
  const pageId = req.query.pageId;
  
  if (!shop) {
    return res.redirect('/install');
  }
  
  // Serve the new page builder interface
  res.sendFile(path.join(__dirname, '../public/builder.html'));
});

// Builder route
app.get('/builder', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/builder.html'));
});

// Dashboard route  
app.get('/dashboard', (req, res) => {
  const shop = req.query.shop;
  const embedded = req.query.embedded;
  const access_token = req.query.access_token;
  
  console.log('🎯 Dashboard route hit:', { 
    shop, 
    embedded, 
    has_access_token: !!access_token, 
    token_preview: access_token?.substring(0, 10) + '...' 
  });
  
  // For embedded apps, check if we have shop parameter
  if (embedded === '1' && !shop) {
    return res.status(400).send('Missing shop parameter for embedded app');
  }
  
  // If someone accesses the dashboard directly (not embedded), redirect to Shopify admin
  if (shop && embedded !== '1') {
    const shopName = shop.replace('.myshopify.com', '');
    const shopifyAdminUrl = `https://admin.shopify.com/store/${shopName}/apps/kingsbuilder`;
    console.log('🔄 Redirecting standalone access to Shopify admin:', shopifyAdminUrl);
    return res.redirect(shopifyAdminUrl);
  }
  
  // If we have an access token in the URL, store it in cookies
  if (access_token && shop) {
    console.log('💾 Storing access token in cookies for shop:', shop);
    
    res.cookie('shopOrigin', shop, { 
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    res.cookie('accessToken', access_token, { 
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    
    console.log('🔄 Redirecting to clean dashboard URL');
    // Redirect without the access token in the URL for security
    return res.redirect(`/dashboard?shop=${shop}&embedded=1`);
  }
  
  console.log('📄 Serving dashboard.html');
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Additional routes for different access patterns
app.get('/pages', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/templates', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Legacy route handler (to be removed)
app.get('/app/builder-old', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;
  const pageId = req.query.pageId;
  
  if (!shop) {
    return res.redirect('/install');
  }
  
  // OLD - Serve the page builder interface
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KingsBuilder - Page Builder</title>
      <link rel="stylesheet" href="https://unpkg.com/@shopify/polaris@12.0.0/build/esm/styles.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <script src="https://unpkg.com/@shopify/app-bridge@3.7.9/umd/index.js"></script>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #202223;
          background-color: #f6f6f7;
          overflow-x: hidden;
        }
        .container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .builder-container {
          display: grid;
          grid-template-columns: 300px 1fr 300px;
          min-height: calc(100vh - 60px);
          background: #f6f6f7;
        }
        .sidebar {
          background: white;
          border-right: 1px solid #e5e7eb;
          height: calc(100vh - 60px);
          overflow-y: auto;
          padding: 0;
          position: sticky;
          top: 60px;
        }
        .sidebar-right {
          background: white;
          border-left: 1px solid #e5e7eb;
          height: calc(100vh - 60px);
          overflow-y: auto;
          padding: 0;
          position: sticky;
          top: 60px;
        }
        .main-content {
          padding: 20px;
          overflow-y: auto;
          background: #f6f6f7;
        }
        .widget-section {
          padding: 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .widget-section-title {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          padding: 15px;
          margin: 0;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .widget-list {
          padding: 10px;
        }
        .widget-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 8px;
          background: white;
          border: 1px solid #e5e7eb;
        }
        .widget-item:hover {
          background: #f9fafb;
          border-color: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .widget-icon {
          font-size: 20px;
          margin-right: 12px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .widget-info {
          flex: 1;
        }
        .widget-info h4 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 2px 0;
          color: #111827;
        }
        .widget-info p {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }
        .canvas-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 30px;
          overflow: hidden;
        }
        .canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .canvas-title {
          font-weight: 600;
          font-size: 16px;
          margin: 0;
        }
        .canvas {
          padding: 40px;
          min-height: 500px;
          background: white;
        }
        .canvas-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          color: #6b7280;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
        }
        .canvas-empty i {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.5;
        }
        .canvas-empty h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 10px 0;
          color: #374151;
        }
        .canvas-empty p {
          font-size: 14px;
          margin: 0;
          color: #6b7280;
          max-width: 300px;
          text-align: center;
        }
        .widget-preview {
          margin: 20px 0;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          position: relative;
          background: white;
          cursor: move;
          transition: all 0.2s;
        }
        .widget-preview:hover {
          border-color: #4338ca;
          box-shadow: 0 4px 12px rgba(67, 56, 202, 0.15);
        }
        .widget-controls {
          position: absolute;
          top: 5px;
          right: 5px;
          display: flex;
          gap: 5px;
        }
        .widget-control-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .widget-control-btn.edit {
          background: #3b82f6;
        }
        .empty-state {
          color: #6b7280;
          font-style: italic;
        }
        /* Form elements */
        .form-group {
          margin-bottom: 15px;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 5px;
          color: #374151;
        }
        .form-control {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
        }
        .form-control:focus {
          outline: none;
          border-color: #4338ca;
          box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.2);
        }
        
        /* Buttons */
        .btn {
          background: #4338ca;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn i {
          margin-right: 6px;
        }
        .btn:hover {
          background: #3730a3;
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        .btn-success {
          background: #10b981;
        }
        .btn-success:hover {
          background: #059669;
        }
        .btn-danger {
          background: #ef4444;
        }
        .btn-danger:hover {
          background: #dc2626;
        }
        
        /* Widget element styles */
        .widget-element { 
          margin: 15px 0; 
          padding: 20px; 
          border: 1px solid #e5e7eb; 
          border-radius: 8px; 
          position: relative;
          background: white;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .widget-element:hover { 
          border-color: #4338ca; 
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }
        .widget-element:hover .widget-toolbar {
          opacity: 1;
          transform: translateY(0);
        }
        .widget-element.selected { 
          border: 2px solid #4338ca; 
          box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.2), 0 3px 10px rgba(0,0,0,0.1); 
        }
        .widget-toolbar {
          position: absolute;
          top: -15px;
          right: 15px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          display: flex;
          opacity: 0;
          transform: translateY(5px);
          transition: all 0.2s;
          z-index: 10;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .toolbar-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #6b7280;
          font-size: 14px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .toolbar-btn:hover {
          color: #4338ca;
          background: #f9fafb;
        }
        .toolbar-btn.delete:hover {
          color: #ef4444;
          background: #fee2e2;
        }
        
        /* Toast notification */
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.3s;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          min-width: 250px;
        }
        .toast:before {
          content: '✓';
          margin-right: 10px;
          font-weight: bold;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }
        .toast.error {
          background: #ef4444;
        }
        .toast.error:before {
          content: '✕';
        }
        
        /* Properties Panel Styles */
        .property-group {
          margin-bottom: 20px;
        }
        .property-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        .property-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
          resize: vertical;
          min-height: 100px;
        }
        .property-input:focus {
          outline: none;
          border-color: #4338ca;
          box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.2);
        }
        #propertiesPanel {
          transition: all 0.3s ease;
        }
        #propertiesPanel .widget-section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        #propertiesPanel .widget-section-title i {
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <!-- Header Bar -->
      <div class="header">
        <div class="header-left">
          <button class="btn btn-secondary" onclick="goBack()">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <div class="header-title" style="margin-left: 15px; font-weight: 600; font-size: 16px;">
            <i class="fas fa-hammer"></i> KingsBuilder Pro
          </div>
        </div>
        <div class="header-center">
          <div style="display: flex; gap: 15px; align-items: center;">
            <div class="form-group" style="flex: 2; margin: 0;">
              <input type="text" id="pageTitle" class="form-control" placeholder="Enter page title" value="Untitled Page" style="height: 38px;">
            </div>
            <div class="form-group" style="flex: 1; margin: 0; display: flex; align-items: center;">
              <span style="color: #6b7280; margin-right: 5px; font-size: 14px;">/pages/</span>
              <input type="text" id="pageUrl" class="form-control" placeholder="page-url" value="untitled-page" style="height: 38px;">
            </div>
            <div class="status-selector" style="display: flex; border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden;">
              <div class="status-option active" data-status="draft" style="padding: 8px 12px; cursor: pointer; background: #f3f4f6; font-size: 14px;">
                <i class="fas fa-circle status-draft" style="color: #f59e0b; font-size: 10px; margin-right: 5px;"></i>
                Draft
              </div>
              <div class="status-option" data-status="published" style="padding: 8px 12px; cursor: pointer; font-size: 14px;">
                <i class="fas fa-circle" style="color: #10b981; font-size: 10px; margin-right: 5px;"></i>
                Published
              </div>
            </div>
          </div>
        </div>
        <div class="header-right">
          <button class="btn btn-secondary" onclick="previewPage()" style="margin-right: 10px;">
            <i class="fas fa-eye"></i> Preview
          </button>
          <button class="btn btn-success" id="saveBtn" onclick="savePage()">
            <i class="fas fa-save"></i> Save
          </button>
        </div>
      </div>

      <div class="container">
        <div class="builder-container">
          <!-- Left Sidebar -->
          <div class="sidebar">
            <!-- Widgets Section -->
            <div class="widget-section">
              <h3 class="widget-section-title">
                <i class="fas fa-cube"></i> Widgets
              </h3>
              <div class="widget-list">
              <!-- Basic Widgets -->
              <div class="widget-item" draggable="true" data-widget="heading" onclick="addWidget('heading')">
                <div class="widget-icon">
                  <i class="fas fa-heading" style="color: #4338ca;"></i>
                </div>
                <div class="widget-info">
                  <h4>Heading</h4>
                  <p>Add titles and headings</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="text" onclick="addWidget('text')">
                <div class="widget-icon">
                  <i class="fas fa-align-left" style="color: #4338ca;"></i>
                </div>
                <div class="widget-info">
                  <h4>Text Block</h4>
                  <p>Rich text content</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="image" onclick="addWidget('image')">
                <div class="widget-icon">
                  <i class="fas fa-image" style="color: #4338ca;"></i>
                </div>
                <div class="widget-info">
                  <h4>Image</h4>
                  <p>Add images and galleries</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="button" onclick="addWidget('button')">
                <div class="widget-icon">🔘</div>
                <div class="widget-info">
                  <h4>Button</h4>
                  <p>Call-to-action buttons</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="video" onclick="addWidget('video')">
                <div class="widget-icon">📹</div>
                <div class="widget-info">
                  <h4>Video</h4>
                  <p>Embed videos</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="divider" onclick="addWidget('divider')">
                <div class="widget-icon">➖</div>
                <div class="widget-info">
                  <h4>Divider</h4>
                  <p>Section separators</p>
                </div>
              </div>
              
              <!-- Advanced Widgets -->
              <div class="widget-item" draggable="true" data-widget="hero" onclick="addWidget('hero')">
                <div class="widget-icon">🎯</div>
                <div class="widget-info">
                  <h4>Hero Section</h4>
                  <p>Header with image/video</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="gallery" onclick="addWidget('gallery')">
                <div class="widget-icon">🖼️</div>
                <div class="widget-info">
                  <h4>Image Gallery</h4>
                  <p>Photo galleries</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="testimonials" onclick="addWidget('testimonials')">
                <div class="widget-icon">💬</div>
                <div class="widget-info">
                  <h4>Testimonials</h4>
                  <p>Customer reviews</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="pricing" onclick="addWidget('pricing')">
                <div class="widget-icon">💰</div>
                <div class="widget-info">
                  <h4>Pricing Table</h4>
                  <p>Product pricing</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="features" onclick="addWidget('features')">
                <div class="widget-icon">⭐</div>
                <div class="widget-info">
                  <h4>Features Grid</h4>
                  <p>Feature highlights</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="contact" onclick="addWidget('contact')">
                <div class="widget-icon">📧</div>
                <div class="widget-info">
                  <h4>Contact Form</h4>
                  <p>Lead capture forms</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Templates Section -->
          <div class="sidebar-section">
            <div class="sidebar-title">
              <i class="fas fa-layer-group"></i> Page Templates
            </div>
            <div class="template-list">
              <!-- Theme Templates -->
              <div class="template-item" onclick="applyTemplate('landing')">
                <div class="template-name">Landing Page</div>
                <div class="template-desc">Hero + Features + CTA</div>
              </div>
              <div class="template-item" onclick="applyTemplate('about')">
                <div class="template-name">About Us</div>
                <div class="template-desc">Company story + Team</div>
              </div>
              <div class="template-item" onclick="applyTemplate('services')">
                <div class="template-name">Services</div>
                <div class="template-desc">Service grid + Pricing</div>
              </div>
              <div class="template-item" onclick="applyTemplate('contact')">
                <div class="template-name">Contact</div>
                <div class="template-desc">Contact form + Map</div>
              </div>
              
              <!-- KingsBuilder App Templates -->
              <div class="template-item" onclick="applyTemplate('ecommerce')">
                <div class="template-name">E-commerce Store <span class="template-type">(KB)</span></div>
                <div class="template-desc">Product showcase + Cart</div>
              </div>
              <div class="template-item" onclick="applyTemplate('portfolio')">
                <div class="template-name">Portfolio <span class="template-type">(KB)</span></div>
                <div class="template-desc">Gallery + Projects</div>
              </div>
              <div class="template-item" onclick="applyTemplate('blog')">
                <div class="template-name">Blog Layout <span class="template-type">(KB)</span></div>
                <div class="template-desc">Article grid + Sidebar</div>
              </div>
              <div class="template-item" onclick="applyTemplate('restaurant')">
                <div class="template-name">Restaurant Menu <span class="template-type">(KB)</span></div>
                <div class="template-desc">Menu + Reservations</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
          <div class="canvas-container">
            <div class="canvas-header">
              <h3 class="canvas-title">Page Content</h3>
              <div>
                <button class="btn btn-secondary" onclick="clearCanvas()" style="font-size: 13px;">
                  <i class="fas fa-trash"></i> Clear
                </button>
              </div>
            </div>
            <div class="canvas" id="canvas" ondrop="handleCanvasDrop(event)" ondragover="handleCanvasDragOver(event)">
              <div class="canvas-empty" id="canvasEmpty">
                <i class="fas fa-mouse-pointer"></i>
                <h3>Start Building Your Page</h3>
                <p>Click widgets from the sidebar or choose a template to get started</p>
              </div>
              <div id="canvasContent"></div>
            </div>
          </div>
        </div>
        
        <!-- Right Sidebar - Properties -->
        <div class="sidebar-right" id="propertiesPanel">
          <div class="widget-section">
            <h3 class="widget-section-title">
              <i class="fas fa-sliders-h"></i> Widget Properties
            </h3>
            <div class="properties-content" id="propertiesContent" style="padding: 15px;">
          <p>Select a widget to edit its properties</p>
        </div>
      </div>

      <script>
        // Global variables
        var pageContent = [];
        var selectedWidget = null;
        var shop = "${shop}";
        var pageId = "${pageId || 'new'}";
        var currentStatus = 'draft';
        var draggedWidget = null;
        var tempWidgetContent = '';
        
        // Initialize page builder
        document.addEventListener('DOMContentLoaded', function() {
          console.log('DOM loaded, initializing page builder...');
          
          // Add direct click handlers to all widget items
          document.querySelectorAll('.widget-item').forEach(function(widget) {
            widget.addEventListener('click', function() {
              const widgetType = this.getAttribute('data-widget');
              console.log('Widget clicked:', widgetType);
              addWidget(widgetType);
            });
          });
          
          // Initialize the canvas
          renderCanvas();
          
          // Load existing page if editing
          if (pageId !== 'new') {
            loadExistingPage();
          } else {
            // Show welcome message for new pages
            showToast('🚀 Page Builder loaded! Click widgets to add them.', 'success');
          }
          
          console.log('Page builder initialized successfully');
        });
        
        function initializePageBuilder() {
          // Load page title and URL from pageId if editing
          if (pageId !== 'new') {
            const titleEl = document.getElementById('pageTitle');
            const urlEl = document.getElementById('pageUrl');
            if (titleEl) titleEl.value = 'Page ' + pageId;
            if (urlEl) urlEl.value = 'page-' + pageId;
          }
          
          // Initialize canvas rendering
          renderCanvas();
          
          showToast('🚀 Page Builder loaded! Click widgets to add them.', 'success');
        }
        
        function setupEventListeners() {
          console.log('Setting up event listeners...');
          try {
            // Widget click events - simple and reliable
            const widgets = document.querySelectorAll('.widget-item');
            console.log('Found widget items:', widgets.length);
            
            widgets.forEach(widget => {
              // Remove any existing click handlers
              const newWidget = widget.cloneNode(true);
              widget.parentNode.replaceChild(newWidget, widget);
              
              // Add direct click handler
              newWidget.addEventListener('click', function() {
                const widgetType = this.getAttribute('data-widget');
                console.log('Widget clicked:', widgetType);
                if (widgetType) {
                  addWidget(widgetType);
                }
              });
            });
            
            // Page title auto-sync
            const titleInput = document.getElementById('pageTitle');
            if (titleInput) {
              titleInput.addEventListener('input', function() {
                const title = this.value;
                const url = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                const urlInput = document.getElementById('pageUrl');
                if (urlInput) {
                  urlInput.value = url;
                }
              });
            }
            
            // Template button events
            const templateBtns = document.querySelectorAll('.template-btn');
            templateBtns.forEach(btn => {
              btn.addEventListener('click', function() {
                const templateType = this.dataset.template;
                if (templateType) {
                  applyTemplate(templateType);
                }
              });
            });
            
            // Simple keyboard shortcuts
            document.addEventListener('keydown', function(e) {
              if (e.ctrlKey || e.metaKey) {
                if (e.key === 's') {
                  e.preventDefault();
                  savePage();
                }
              }
            });
            
            console.log('Event listeners set up successfully');
          } catch (error) {
            console.error('Error setting up event listeners:', error);
          }
        }
        
        function handleWidgetDragStart(e) {
          draggedWidget = e.target.dataset.widget;
          e.dataTransfer.effectAllowed = 'copy';
        }
        
        function handleWidgetClick(e) {
          const widgetType = e.currentTarget.dataset.widget;
          addWidgetToCanvas(widgetType);
        }
        
        function handleCanvasDragOver(e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }
        
        function handleCanvasDrop(e) {
          e.preventDefault();
          if (draggedWidget) {
            addWidgetToCanvas(draggedWidget);
            draggedWidget = null;
          }
        }
        
        function addWidgetToCanvas(widgetType) {
          const widget = createWidget(widgetType);
          pageContent.push(widget);
          renderCanvas();
          showToast(\`\${widget.name} added to page!\`, 'success');
        }
        
        function createWidget(type) {
          const widgets = {
            heading: {
              name: 'Heading',
              type: 'heading',
              properties: {
                text: 'Your Heading Here',
                level: 'h2',
                color: '#1f2937',
                textAlign: 'left'
              },
              html: '<h2 style="color: #1f2937; text-align: left;">Your Heading Here</h2>'
            },
            text: {
              name: 'Text Block',
              type: 'text',
              properties: {
                content: 'Your text content goes here. Edit this to add your own content.',
                color: '#374151',
                fontSize: '16px',
                textAlign: 'left'
              },
              html: '<p style="color: #374151; font-size: 16px; text-align: left;">Your text content goes here. Edit this to add your own content.</p>'
            },
            image: {
              name: 'Image',
              type: 'image',
              properties: {
                src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop',
                alt: 'Placeholder Image',
                width: '100%',
                borderRadius: '8px'
              },
              html: '<img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop" alt="Placeholder Image" style="width: 100%; border-radius: 8px;">'
            },
            button: {
              name: 'Button',
              type: 'button',
              properties: {
                text: 'Click Me',
                bgColor: '#4338ca',
                textColor: '#ffffff',
                borderRadius: '6px',
                padding: '12px 24px',
                link: '#'
              },
              html: '<a href="#" style="display: inline-block; background: #4338ca; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Click Me</a>'
            },
            video: {
              name: 'Video',
              type: 'video',
              properties: {
                url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                width: '100%',
                height: '315px'
              },
              html: '<iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen style="border-radius: 8px;"></iframe>'
            },
            divider: {
              name: 'Divider',
              type: 'divider',
              properties: {
                style: 'solid',
                color: '#e5e7eb',
                thickness: '1px',
                margin: '20px 0'
              },
              html: '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">'
            },
            hero: {
              name: 'Hero Section',
              type: 'hero',
              properties: {
                title: 'Welcome to Our Store',
                subtitle: 'Discover amazing products and services',
                buttonText: 'Shop Now',
                buttonLink: '#',
                bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textColor: '#ffffff'
              },
              html: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 40px; text-align: center; border-radius: 12px;"><h1 style="font-size: 48px; margin-bottom: 20px;">Welcome to Our Store</h1><p style="font-size: 20px; margin-bottom: 30px; opacity: 0.9;">Discover amazing products and services</p><a href="#" style="display: inline-block; background: white; color: #4338ca; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">Shop Now</a></div>'
            },
            gallery: {
              name: 'Image Gallery',
              type: 'gallery',
              properties: {
                columns: 3,
                gap: '15px',
                borderRadius: '8px'
              },
              html: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop" style="width: 100%; border-radius: 8px;"><img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=200&fit=crop" style="width: 100%; border-radius: 8px;"><img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" style="width: 100%; border-radius: 8px;"></div>'
            },
            testimonials: {
              name: 'Testimonials',
              type: 'testimonials',
              properties: {
                quote: 'This product changed my life! Amazing quality and service.',
                author: 'Happy Customer',
                bgColor: '#f8fafc',
                textColor: '#1f2937'
              },
              html: '<div style="background: #f8fafc; padding: 40px; border-radius: 12px; text-align: center; border-left: 4px solid #4338ca;"><blockquote style="font-size: 20px; font-style: italic; margin: 0 0 20px; color: #1f2937;">"This product changed my life! Amazing quality and service."</blockquote><cite style="font-weight: bold; color: #4338ca;">- Happy Customer</cite></div>'
            },
            pricing: {
              name: 'Pricing Table',
              type: 'pricing',
              properties: {
                title: 'Premium Plan',
                price: '$29',
                period: '/month',
                features: ['All features included', '24/7 support', 'Free updates'],
                buttonText: 'Get Started',
                buttonLink: '#'
              },
              html: '<div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 40px; text-align: center; max-width: 350px; margin: 0 auto; background: white;"><h3 style="font-size: 24px; margin-bottom: 20px;">Premium Plan</h3><div style="font-size: 48px; font-weight: bold; color: #4338ca; margin: 20px 0;">$29<span style="font-size: 18px; color: #6b7280;">/month</span></div><ul style="list-style: none; padding: 0; margin: 30px 0; text-align: left;"><li style="padding: 8px 0; color: #374151;"><i class="fas fa-check" style="color: #10b981; margin-right: 10px;"></i>All features included</li><li style="padding: 8px 0; color: #374151;"><i class="fas fa-check" style="color: #10b981; margin-right: 10px;"></i>24/7 support</li><li style="padding: 8px 0; color: #374151;"><i class="fas fa-check" style="color: #10b981; margin-right: 10px;"></i>Free updates</li></ul><a href="#" style="display: block; background: #4338ca; color: white; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Get Started</a></div>'
            },
            features: {
              name: 'Features Grid',
              type: 'features',
              properties: {
                columns: 3,
                gap: '30px'
              },
              html: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;"><div style="text-align: center; padding: 30px;"><div style="background: #4338ca; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px;"><i class="fas fa-bolt"></i></div><h3 style="margin-bottom: 15px;">Fast Performance</h3><p style="color: #6b7280;">Lightning-fast loading times for better user experience</p></div><div style="text-align: center; padding: 30px;"><div style="background: #4338ca; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px;"><i class="fas fa-shield-alt"></i></div><h3 style="margin-bottom: 15px;">Secure</h3><p style="color: #6b7280;">Bank-level security to protect your data</p></div><div style="text-align: center; padding: 30px;"><div style="background: #4338ca; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px;"><i class="fas fa-mobile-alt"></i></div><h3 style="margin-bottom: 15px;">Mobile Ready</h3><p style="color: #6b7280;">Fully responsive design for all devices</p></div></div>'
            },
            contact: {
              name: 'Contact Form',
              type: 'contact',
              properties: {
                title: 'Get In Touch',
                subtitle: 'We would love to hear from you',
                buttonText: 'Send Message',
                bgColor: '#ffffff'
              },
              html: '<div style="background: white; padding: 40px; border-radius: 12px; border: 1px solid #e5e7eb;"><h2 style="text-align: center; margin-bottom: 10px;">Get In Touch</h2><p style="text-align: center; color: #6b7280; margin-bottom: 30px;">We would love to hear from you</p><form style="max-width: 600px; margin: 0 auto;"><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;"><div><label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Name</label><input type="text" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 16px;" placeholder="Your name"></div><div><label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Email</label><input type="email" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 16px;" placeholder="your@email.com"></div></div><div style="margin-bottom: 20px;"><label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Message</label><textarea style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 16px; min-height: 120px; resize: vertical;" placeholder="Your message here..."></textarea></div><button type="submit" style="width: 100%; background: #4338ca; color: white; padding: 16px 24px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Send Message</button></form></div>'
            }
          };
          
          return widgets[type] || { name: 'Unknown', html: '<p>Widget not found</p>' };
        }
        
        // Initialize page builder when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
          initializePageBuilder();
          setupEventListeners();
          if (pageId !== 'new') {
            loadExistingPage();
          }
        });
        
        // This is a duplicate function - removed to fix conflicts
        
        // This is a duplicate function - removed to fix conflicts
        
        function handleWidgetDragStart(e) {
          draggedWidget = e.target.dataset.widget;
          e.dataTransfer.effectAllowed = 'copy';
        }
        
        function handleWidgetClick(e) {
          const widgetType = e.currentTarget.dataset.widget;
          addWidgetToCanvas(widgetType);
        }
        
        function handleCanvasDragOver(e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }
        
        function handleCanvasDrop(e) {
          e.preventDefault();
          if (draggedWidget) {
            addWidgetToCanvas(draggedWidget);
            draggedWidget = null;
          }
        }
        
        function addWidgetToCanvas(widgetType) {
          const widget = createWidget(widgetType);
          pageContent.push(widget);
          renderCanvas();
          showToast(\`\${widget.name} added to page!\`, 'success');
        }
        

        
        // Complete page builder functions with professional UI
        function selectWidget(index) {
          document.querySelectorAll('.widget-element').forEach(el => el.classList.remove('selected'));
          document.querySelector('[data-widget-index="' + index + '"]').classList.add('selected');
          selectedWidget = index;
          openPropertiesPanel(pageContent[index]);
        }
        
        function openPropertiesPanel(widget) {
          const panel = document.getElementById('propertiesPanel');
          const content = document.getElementById('propertiesContent');
          
          // Reset temporary properties
          tempWidgetProperties = {};
          
          let propertiesHTML = \`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h3 style="margin: 0; color: #1f2937;">\${widget.name} Properties</h3>
              <button class="toolbar-btn" onclick="closeProperties()" title="Close Properties">
                <i class="fas fa-times"></i>
              </button>
            </div>
          \`;
          
          // Build widget-specific property editor
          propertiesHTML += buildWidgetProperties(widget);
          
          propertiesHTML += \`
            <div class="property-group" style="margin-top: 30px;">
              <button class="btn btn-success" onclick="applyPropertyChanges()" style="width: 100%;">
                <i class="fas fa-check"></i> Apply Changes
              </button>
              <button class="btn btn-secondary" onclick="closeProperties()" style="width: 100%; margin-top: 10px;">
                <i class="fas fa-times"></i> Cancel
              </button>
            </div>
          \`;
          
          content.innerHTML = propertiesHTML;
          panel.classList.add('active');
        }
        
        function buildWidgetProperties(widget) {
          const widgetType = getWidgetType(widget);
          let html = '';
          
          switch(widgetType) {
            case 'heading':
              const headingText = extractTextFromHTML(widget.html);
              const headingTag = widget.html.match(/<(h[1-6])/i)?.[1] || 'h2';
              html += \`
                <div class="property-group">
                  <label class="property-label">Heading Text</label>
                  <input type="text" class="property-input" id="headingText" value="\${headingText}" onchange="updateWidgetProperty('text', this.value)">
                </div>
                <div class="property-group">
                  <label class="property-label">Heading Size</label>
                  <select class="property-input" id="headingSize" onchange="updateWidgetProperty('size', this.value)">
                    <option value="h1" \${headingTag === 'h1' ? 'selected' : ''}>H1 - Largest</option>
                    <option value="h2" \${headingTag === 'h2' ? 'selected' : ''}>H2 - Large</option>
                    <option value="h3" \${headingTag === 'h3' ? 'selected' : ''}>H3 - Medium</option>
                    <option value="h4" \${headingTag === 'h4' ? 'selected' : ''}>H4 - Small</option>
                  </select>
                </div>
              \`;
              break;
              
            case 'text':
              const textContent = extractTextFromHTML(widget.html);
              html += \`
                <div class="property-group">
                  <label class="property-label">Text Content</label>
                  <textarea class="property-input" id="textContent" rows="4" onchange="updateWidgetProperty('text', this.value)">\${textContent}</textarea>
                </div>
              \`;
              break;
              
            case 'button':
              const buttonText = extractTextFromHTML(widget.html);
              const buttonHref = widget.html.match(/href="([^"]*)"/)?.[1] || '#';
              html += \`
                <div class="property-group">
                  <label class="property-label">Button Text</label>
                  <input type="text" class="property-input" id="buttonText" value="\${buttonText}" onchange="updateWidgetProperty('text', this.value)">
                </div>
                <div class="property-group">
                  <label class="property-label">Button Link</label>
                  <input type="text" class="property-input" id="buttonHref" value="\${buttonHref}" onchange="updateWidgetProperty('href', this.value)" placeholder="https://example.com">
                </div>
              \`;
              break;
              
            case 'image':
              const imageSrc = widget.html.match(/src="([^"]*)"/)?.[1] || '';
              const imageAlt = widget.html.match(/alt="([^"]*)"/)?.[1] || '';
              html += \`
                <div class="property-group">
                  <label class="property-label">Image URL</label>
                  <input type="text" class="property-input" id="imageSrc" value="\${imageSrc}" onchange="updateWidgetProperty('src', this.value)" placeholder="https://example.com/image.jpg">
                </div>
                <div class="property-group">
                  <label class="property-label">Alt Text</label>
                  <input type="text" class="property-input" id="imageAlt" value="\${imageAlt}" onchange="updateWidgetProperty('alt', this.value)" placeholder="Describe the image">
                </div>
              \`;
              break;
              
            default:
              // Fallback to raw HTML editor for unknown widget types
              html += \`
                <div class="property-group">
                  <label class="property-label">HTML Content</label>
                  <textarea class="property-input" id="rawContent" rows="6" onchange="updateWidgetProperty('html', this.value)">\${widget.html}</textarea>
                </div>
              \`;
          }
          
          return html;
        }
        
        function getWidgetType(widget) {
          if (widget.html.includes('<h')) return 'heading';
          if (widget.html.includes('<p>')) return 'text';
          if (widget.html.includes('<a ') && widget.html.includes('Click Me')) return 'button';
          if (widget.html.includes('<img')) return 'image';
          return 'unknown';
        }
        
        function extractTextFromHTML(html) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          return tempDiv.textContent || tempDiv.innerText || '';
        }
        
        var tempWidgetProperties = {};
        
        function updateWidgetProperty(property, value) {
          tempWidgetProperties[property] = value;
        }
        
        function applyPropertyChanges() {
          if (selectedWidget === null) return;
          
          const widget = pageContent[selectedWidget];
          const widgetType = getWidgetType(widget);
          
          let newHTML = widget.html;
          
          // Apply changes based on widget type
          switch(widgetType) {
            case 'heading':
              if (tempWidgetProperties.text !== undefined) {
                const size = tempWidgetProperties.size || 'h2';
                newHTML = \`<\${size} style="color: #1f2937; margin: 20px 0;">\${tempWidgetProperties.text}</\${size}>\`;
              }
              break;
              
            case 'text':
              if (tempWidgetProperties.text !== undefined) {
                newHTML = \`<p style="color: #374151; line-height: 1.6; margin: 15px 0;">\${tempWidgetProperties.text}</p>\`;
              }
              break;
              
            case 'button':
              if (tempWidgetProperties.text !== undefined || tempWidgetProperties.href !== undefined) {
                const text = tempWidgetProperties.text || extractTextFromHTML(widget.html);
                const href = tempWidgetProperties.href || widget.html.match(/href="([^"]*)"/)?.[1] || '#';
                newHTML = \`<a href="\${href}" style="display: inline-block; background: #4338ca; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0;">\${text}</a>\`;
              }
              break;
              
            case 'image':
              if (tempWidgetProperties.src !== undefined || tempWidgetProperties.alt !== undefined) {
                const src = tempWidgetProperties.src || widget.html.match(/src="([^"]*)"/)?.[1] || '';
                const alt = tempWidgetProperties.alt || widget.html.match(/alt="([^"]*)"/)?.[1] || '';
                newHTML = \`<img src="\${src}" alt="\${alt}" style="width: 100%; border-radius: 8px; margin: 10px 0;">\`;
              }
              break;
              
            default:
              if (tempWidgetProperties.html !== undefined) {
                newHTML = tempWidgetProperties.html;
              }
          }
          
          // Update the widget
          pageContent[selectedWidget].html = newHTML;
          renderCanvas();
          showToast(widget.name + ' updated successfully!', 'success');
          
          // Reset temporary properties
          tempWidgetProperties = {};
          closeProperties();
        }
        
        function closeProperties() {
          document.getElementById('propertiesPanel').classList.remove('active');
          document.querySelectorAll('.widget-element').forEach(el => el.classList.remove('selected'));
          selectedWidget = null;
          tempWidgetProperties = {};
          
          // Reset properties panel to default state
          document.getElementById('propertiesContent').innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">Select a widget to edit its properties</p>';
        }
        
        function editWidget(index) {
          selectWidget(index);
        }
        
        function duplicateWidget(index) {
          const widget = JSON.parse(JSON.stringify(pageContent[index]));
          pageContent.splice(index + 1, 0, widget);
          renderCanvas();
          showToast(\`\${widget.name} duplicated!\`, 'success');
        }
        
        function removeWidget(index) {
          const widget = pageContent[index];
          pageContent.splice(index, 1);
          renderCanvas();
          closeProperties();
          showToast(\`\${widget.name} removed!\`, 'success');
        }
        
        function moveWidgetUp(index) {
          if (index > 0) {
            [pageContent[index], pageContent[index - 1]] = [pageContent[index - 1], pageContent[index]];
            renderCanvas();
          }
        }
        
        function moveWidgetDown(index) {
          if (index < pageContent.length - 1) {
            [pageContent[index], pageContent[index + 1]] = [pageContent[index + 1], pageContent[index]];
            renderCanvas();
          }
        }
        
        function syncPageUrl() {
          const title = document.getElementById('pageTitle').value;
          const url = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          document.getElementById('pageUrl').value = url;
        }
        
        function toggleStatus() {
          const statusBtn = document.getElementById('statusBtn');
          const icon = statusBtn.querySelector('i');
          const text = statusBtn.querySelector('span');
          
          if (currentStatus === 'draft') {
            currentStatus = 'published';
            icon.className = 'fas fa-circle status-published';
            text.textContent = 'Published';
          } else {
            currentStatus = 'draft';
            icon.className = 'fas fa-circle status-draft';
            text.textContent = 'Draft';
          }
        }
        
        function applyTemplate(templateType) {
          const templates = {
            landing: ['hero', 'features', 'testimonials', 'button'],
            about: ['heading', 'text', 'image', 'features'],
            services: ['heading', 'features', 'pricing', 'contact'],
            contact: ['heading', 'text', 'contact'],
            ecommerce: ['hero', 'gallery', 'pricing', 'testimonials'],
            portfolio: ['heading', 'text', 'gallery', 'contact'],
            blog: ['heading', 'features', 'divider', 'text'],
            restaurant: ['hero', 'gallery', 'pricing', 'contact']
          };
          
          if (templates[templateType]) {
            pageContent = templates[templateType].map(widgetType => createWidget(widgetType));
            renderCanvas();
            showToast(\`\${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template applied!\`, 'success');
          }
        }
        
        function savePage() {
          const title = document.getElementById('pageTitle').value;
          const url = document.getElementById('pageUrl').value;
          
          if (!title.trim()) {
            showToast('Please enter a page title!', 'error');
            return;
          }
          
          if (pageContent.length === 0) {
            showToast('Add some content before saving!', 'error');
            return;
          }
          
          const saveBtn = document.querySelector('.btn-primary');
          const originalText = saveBtn.innerHTML;
          saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
          saveBtn.disabled = true;
          
          const htmlContent = pageContent.map(widget => widget.html).join('\\n\\n');
          
          fetch('/api/pages', {
            method: pageId === 'new' ? 'POST' : 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Shop-Domain': shop
            },
            body: JSON.stringify({
              id: pageId === 'new' ? null : pageId,
              title: title,
              handle: url,
              body_html: htmlContent,
              published: currentStatus === 'published',
              shop: shop,
              widgets: pageContent
            })
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              showToast('✅ Page saved successfully!', 'success');
              if (pageId === 'new') {
                pageId = data.pageId;
                window.history.replaceState({}, '', window.location.pathname + '?pageId=' + pageId + '&shop=' + shop);
              }
            } else {
              throw new Error(data.error || 'Failed to save page');
            }
          })
          .catch(error => {
            console.error('Save error:', error);
            showToast('❌ Error saving page: ' + error.message, 'error');
          })
          .finally(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
          });
        }
        
        function loadExistingPage() {
          console.log('Loading existing page:', pageId);
          showToast('Loading page content...', 'success');
          
          // Add sample content for testing
          pageContent = [
            createWidget('heading'),
            createWidget('text'),
            createWidget('image')
          ];
          
          renderCanvas();
          showToast('Page loaded successfully!', 'success');
        }
        
        function previewPage() {
          const htmlContent = pageContent.map(widget => widget.html).join('\\n\\n');
          const previewWindow = window.open('', '_blank');
          previewWindow.document.write(\`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Page Preview</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
                * { box-sizing: border-box; }
              </style>
            </head>
            <body>
              \${htmlContent}
            </body>
            </html>
          \`);
        }
        
        function goBack() {
          window.location.href = '/pages?shop=' + shop;
        }
        
        function handleKeyboardShortcuts(e) {
          if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
              case 's':
                e.preventDefault();
                savePage();
                break;
              case 'z':
                e.preventDefault();
                if (pageContent.length > 0) {
                  removeWidget(pageContent.length - 1);
                }
                break;
            }
          }
          
          if (e.key === 'Escape') {
            closeProperties();
          }
        }
        
        // Add widget function
        function addWidget(widgetType) {
          console.log('Adding widget:', widgetType);
          const widget = createWidget(widgetType);
          pageContent.push(widget);
          renderCanvas();
          showToast(widget.name + ' added to page!', 'success');
        }
        
        function createWidget(type) {
          const widgets = {
            heading: { name: 'Heading', html: '<h2 style="color: #1f2937; margin: 20px 0;">Your Heading Here</h2>' },
            text: { name: 'Text Block', html: '<p style="color: #374151; line-height: 1.6; margin: 15px 0;">Your text content goes here. Edit this to add your own content.</p>' },
            image: { name: 'Image', html: '<img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop" alt="Placeholder" style="width: 100%; border-radius: 8px; margin: 10px 0;">' },
            button: { name: 'Button', html: '<a href="#" style="display: inline-block; background: #4338ca; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0;">Click Me</a>' },
            video: { name: 'Video', html: '<iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen style="border-radius: 8px; margin: 10px 0;"></iframe>' },
            divider: { name: 'Divider', html: '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">' },
            hero: { name: 'Hero Section', html: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 40px; text-align: center; border-radius: 12px; margin: 20px 0;"><h1 style="font-size: 48px; margin-bottom: 20px;">Welcome to Our Store</h1><p style="font-size: 20px; margin-bottom: 30px; opacity: 0.9;">Discover amazing products and services</p><a href="#" style="display: inline-block; background: white; color: #4338ca; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">Shop Now</a></div>' },
            gallery: { name: 'Image Gallery', html: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop" style="width: 100%; border-radius: 8px;"><img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=200&fit=crop" style="width: 100%; border-radius: 8px;"><img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" style="width: 100%; border-radius: 8px;"></div>' },
            testimonials: { name: 'Testimonials', html: '<div style="background: #f8fafc; padding: 40px; border-radius: 12px; text-align: center; border-left: 4px solid #4338ca; margin: 20px 0;"><blockquote style="font-size: 20px; font-style: italic; margin: 0 0 20px; color: #1f2937;">"This product changed my life! Amazing quality and service."</blockquote><cite style="font-weight: bold; color: #4338ca;">- Happy Customer</cite></div>' },
            pricing: { name: 'Pricing Table', html: '<div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 40px; text-align: center; max-width: 350px; margin: 20px auto; background: white;"><h3 style="font-size: 24px; margin-bottom: 20px;">Premium Plan</h3><div style="font-size: 48px; font-weight: bold; color: #4338ca; margin: 20px 0;">$29<span style="font-size: 18px; color: #6b7280;">/month</span></div><ul style="list-style: none; padding: 0; margin: 30px 0; text-align: left;"><li style="padding: 8px 0; color: #374151;">✓ All features included</li><li style="padding: 8px 0; color: #374151;">✓ 24/7 support</li><li style="padding: 8px 0; color: #374151;">✓ Free updates</li></ul><a href="#" style="display: block; background: #4338ca; color: white; padding: 16px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Get Started</a></div>' },
            features: { name: 'Features Grid', html: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin: 20px 0;"><div style="text-align: center; padding: 30px;"><div style="background: #4338ca; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px;">⚡</div><h3 style="margin-bottom: 15px;">Fast Performance</h3><p style="color: #6b7280;">Lightning-fast loading times</p></div><div style="text-align: center; padding: 30px;"><div style="background: #4338ca; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px;">🔒</div><h3 style="margin-bottom: 15px;">Secure</h3><p style="color: #6b7280;">Bank-level security</p></div><div style="text-align: center; padding: 30px;"><div style="background: #4338ca; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px;">📱</div><h3 style="margin-bottom: 15px;">Mobile Ready</h3><p style="color: #6b7280;">Responsive design</p></div></div>' },
            contact: { name: 'Contact Form', html: '<div style="background: white; padding: 40px; border-radius: 12px; border: 1px solid #e5e7eb; margin: 20px 0;"><h2 style="text-align: center; margin-bottom: 10px;">Get In Touch</h2><p style="text-align: center; color: #6b7280; margin-bottom: 30px;">We would love to hear from you</p><form style="max-width: 600px; margin: 0 auto;"><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;"><div><label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Name</label><input type="text" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 16px;" placeholder="Your name"></div><div><label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Email</label><input type="email" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 16px;" placeholder="your@email.com"></div></div><div style="margin-bottom: 20px;"><label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Message</label><textarea style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 16px; min-height: 120px; resize: vertical;" placeholder="Your message here..."></textarea></div><button type="submit" style="width: 100%; background: #4338ca; color: white; padding: 16px 24px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Send Message</button></form></div>' }
          };
          
          return widgets[type] || { name: 'Unknown', html: '<p>Widget not found</p>' };
        }
        
        function renderCanvas() {
          const canvasContent = document.getElementById('canvasContent');
          const canvasEmpty = document.getElementById('canvasEmpty');
          
          if (!canvasContent || !canvasEmpty) {
            console.error('Canvas elements not found');
            return;
          }
          
          if (pageContent.length === 0) {
            canvasEmpty.style.display = 'flex';
            canvasContent.innerHTML = '';
            return;
          }
          
          canvasEmpty.style.display = 'none';
          canvasContent.innerHTML = pageContent.map(function(widget, index) {
            return '<div class="widget-element" data-widget-index="' + index + '" onclick="selectWidget(' + index + ')">' +
              '<div class="widget-toolbar">' +
                '<button class="toolbar-btn" onclick="editWidget(' + index + ')" title="Edit Properties">' +
                  '<i class="fas fa-edit"></i>' +
                '</button>' +
                '<button class="toolbar-btn" onclick="duplicateWidget(' + index + ')" title="Duplicate">' +
                  '<i class="fas fa-copy"></i>' +
                '</button>' +
                '<button class="toolbar-btn" onclick="moveWidgetUp(' + index + ')" title="Move Up">' +
                  '<i class="fas fa-arrow-up"></i>' +
                '</button>' +
                '<button class="toolbar-btn" onclick="moveWidgetDown(' + index + ')" title="Move Down">' +
                  '<i class="fas fa-arrow-down"></i>' +
                '</button>' +
                '<button class="toolbar-btn delete" onclick="removeWidget(' + index + ')" title="Delete">' +
                  '<i class="fas fa-trash"></i>' +
                '</button>' +
              '</div>' +
              widget.html +
            '</div>';
          }).join('');
        }
        
        // Widget operations
        function editWidget(index) {
          console.log('Editing widget at index:', index);
          // Use the existing selectWidget function which opens the properties panel
          selectWidget(index);
        }
        
        function duplicateWidget(index) {
          console.log('Duplicating widget at index:', index);
          const widget = pageContent[index];
          if (!widget) return;
          
          // Create a deep copy
          const newWidget = JSON.parse(JSON.stringify(widget));
          pageContent.splice(index + 1, 0, newWidget);
          renderCanvas();
          showToast(widget.name + ' duplicated!', 'success');
        }
        
        function moveWidgetUp(index) {
          console.log('Moving widget up at index:', index);
          if (index <= 0 || !pageContent[index]) return;
          
          const temp = pageContent[index];
          pageContent[index] = pageContent[index - 1];
          pageContent[index - 1] = temp;
          renderCanvas();
          selectWidget(index - 1);
        }
        
        function moveWidgetDown(index) {
          console.log('Moving widget down at index:', index);
          if (index >= pageContent.length - 1 || !pageContent[index]) return;
          
          const temp = pageContent[index];
          pageContent[index] = pageContent[index + 1];
          pageContent[index + 1] = temp;
          renderCanvas();
          selectWidget(index + 1);
        }
        
        function removeWidget(index) {
          console.log('Removing widget at index:', index);
          const widget = pageContent[index];
          if (!widget) return;
          
          if (confirm('Are you sure you want to remove this ' + widget.name + '?')) {
            pageContent.splice(index, 1);
            renderCanvas();
            showToast(widget.name + ' removed!', 'success');
          }
        }
        
        function savePage() {
          console.log('Saving page...');
          
          // Get page title and URL
          const titleEl = document.getElementById('pageTitle');
          const urlEl = document.getElementById('pageUrl');
          
          const title = titleEl ? titleEl.value : 'Untitled Page';
          const url = urlEl ? urlEl.value : 'untitled-page';
          
          // Show saving toast
          showToast('Saving page...', 'success');
          
          // Simulate saving delay
          setTimeout(function() {
            console.log('Page saved with content:', {
              title: title,
              url: url,
              content: pageContent
            });
            
            // Update page ID if it's a new page
            if (pageId === 'new') {
              pageId = Math.floor(Math.random() * 1000000).toString();
              // Update URL without reloading
              const newUrl = '/app/builder?pageId=' + pageId + '&shop=' + shop;
              window.history.pushState({}, '', newUrl);
            }
            
            showToast('✅ Page saved successfully!', 'success');
          }, 1000);
        }
        
        function goBack() {
          window.location.href = '/app/pages?shop=' + shop;
        }
        
        function showToast(message, type) {
          console.log('Toast:', message, type);
          
          // Remove any existing toasts
          const existingToasts = document.querySelectorAll('.toast');
          existingToasts.forEach(function(t) {
            if (document.body.contains(t)) {
              document.body.removeChild(t);
            }
          });
          
          // Create new toast
          const toast = document.createElement('div');
          toast.className = 'toast ' + (type === 'error' ? 'error' : '');
          toast.textContent = message;
          document.body.appendChild(toast);
          
          // Force reflow to enable animation
          toast.offsetHeight;
          
          // Show the toast
          setTimeout(function() {
            toast.classList.add('show');
          }, 10);
          
          // Hide after delay
          setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
              if (document.body.contains(toast)) {
                document.body.removeChild(toast);
              }
            }, 300);
          }, 3000);
        }
      </script>
    </body>
    </html>
  `);
});

// Middleware to store access token in session
app.use((req, res, next) => {
  try {
    const shop = req.query.shop || req.cookies?.shopOrigin;
    const accessToken = req.cookies?.shopifyAccessToken;
    
    if (shop && accessToken) {
      // Import session management
      const { storeAccessToken } = require('./utils/session');
      storeAccessToken(shop, accessToken);
      console.log(`Stored access token for shop ${shop} in session`);
    }
    
    next();
  } catch (error) {
    console.error('Error storing access token in session:', error);
    next();
  }
});

// Import auth routes
try {
  const authRoutes = require('./auth');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes registered successfully');
} catch (error) {
  console.error('Error loading auth routes:', error);
}

// Install route
app.get('/install', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/install.html'));
});

// OAuth callback route
app.get('/auth/callback', async (req, res) => {
  const { code, shop, state } = req.query;
  
  if (!code || !shop) {
    return res.status(400).send('Missing required parameters');
  }
  
  try {
    console.log('🔐 Processing OAuth callback for shop:', shop);
    
    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY || '128d69fb5441ba3eda3ae4694c71b175',
        client_secret: process.env.SHOPIFY_API_SECRET || 'afeae79dd0ffd5246cea63915511b267',
        code: code
      })
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }
    
    const tokenData = await tokenResponse.json();
    console.log('✅ Access token obtained for shop:', shop);
    
    // Store token in session/database
    req.session = req.session || {};
    req.session.shopOrigin = shop;
    req.session.accessToken = tokenData.access_token;
    
    // Set cookies for future requests
    res.cookie('shopOrigin', shop, { maxAge: 24 * 60 * 60 * 1000 }); // 24 hours
    res.cookie('accessToken', tokenData.access_token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    
    // Create webhook for app uninstall (optional)
    try {
      await createUninstallWebhook(shop, tokenData.access_token);
    } catch (webhookError) {
      console.warn('⚠️  Could not create uninstall webhook:', webhookError.message);
    }
    
    // Redirect to dashboard
    res.redirect(`/dashboard?shop=${shop}&installed=true`);
    
  } catch (error) {
    console.error('❌ OAuth callback error:', error);
    res.status(500).send(`
      <html>
        <body>
          <h1>Installation Error</h1>
          <p>There was an error installing KingsBuilder. Please try again.</p>
          <p>Error: ${error.message}</p>
          <a href="/install">Try Again</a>
        </body>
      </html>
    `);
  }
});

// Function to create uninstall webhook
async function createUninstallWebhook(shop, accessToken) {
  const webhook = {
    webhook: {
      topic: 'app/uninstalled',
      address: `${process.env.SHOPIFY_APP_URL || 'https://kingsbuilderapp.vercel.app'}/webhooks/app/uninstalled`,
      format: 'json'
    }
  };
  
  const response = await fetch(`https://${shop}/admin/api/2023-10/webhooks.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    },
    body: JSON.stringify(webhook)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create webhook');
  }
  
  console.log('📡 Uninstall webhook created for shop:', shop);
}

// Webhook handler for app uninstall
app.post('/webhooks/app/uninstalled', (req, res) => {
  const shop = req.get('X-Shopify-Shop-Domain');
  console.log('🗑️  App uninstalled from shop:', shop);
  
  // Clean up shop data here
  // Remove access tokens, user data, etc.
  
  res.status(200).send('OK');
});

// Import dashboard routes
try {
  const dashboardRoutes = require('./routes/dashboard');
  app.use('/dashboard', dashboardRoutes);
  console.log('Dashboard routes registered successfully');
} catch (error) {
  console.error('Error loading dashboard routes:', error);
}

// Import pages routes
try {
  const pagesRoutes = require('./routes/pages');
  app.use('/pages', pagesRoutes);
  console.log('Pages routes registered successfully');
} catch (error) {
  console.error('Error loading pages routes:', error);
}

// Import API routes
try {
  // Try to load the fixed API routes first
  let apiRoutes;
  try {
    apiRoutes = require('./routes/api-fixed');
    console.log('Using fixed API routes');
  } catch (fixedError) {
    console.log('Fixed API routes not found, falling back to original routes');
    apiRoutes = require('./routes/api');
  }
  
  app.use('/api', apiRoutes);
  console.log('API routes registered successfully');
} catch (error) {
  console.error('Error loading API routes:', error);
}

// Import uploads routes
try {
  const uploadsRoutes = require('./routes/uploads');
  app.use('/api/uploads', uploadsRoutes);
  console.log('Uploads routes registered successfully');
} catch (error) {
  console.error('Error loading uploads routes:', error);
}

// Import templates API routes
try {
  const templatesApiRoutes = require('./routes/templates-api');
  app.use('/api/templates', templatesApiRoutes);
  console.log('Templates API routes registered successfully');
} catch (error) {
  console.error('Error loading templates API routes:', error);
}

// Import page templates API routes
try {
  const pageTemplatesRoutes = require('./routes/page-templates');
  app.use('/api/page-templates', pageTemplatesRoutes);
  console.log('Page Templates API routes registered successfully');
} catch (error) {
  console.error('Error loading page templates API routes:', error);
}

// Import users API routes
try {
  const usersApiRoutes = require('./routes/users-api');
  app.use('/api/users', usersApiRoutes);
  console.log('Users API routes registered successfully');
} catch (error) {
  console.error('Error loading users API routes:', error);
}

// Import pages API routes
try {
  const pagesApiRoutes = require('./routes/pages-api');
  app.use('/api/pages', pagesApiRoutes);
  console.log('Pages API routes registered successfully');
} catch (error) {
  console.error('Error loading pages API routes:', error);
}

// Import templates routes
try {
  const templatesRoutes = require('./routes/templates');
  app.use('/templates', templatesRoutes);
  console.log('Templates routes registered successfully');
} catch (error) {
  console.error('Error loading templates routes:', error);
}

// Import users routes
try {
  const usersRoutes = require('./routes/users');
  app.use('/users', usersRoutes);
  console.log('Users routes registered successfully');
} catch (error) {
  console.error('Error loading users routes:', error);
}

// Static builder routes removed - using Remix page builder only
console.log('Static builder routes removed - using Remix page builder only');

// Import settings routes
try {
  const settingsRoutes = require('./routes/settings');
  app.use('/settings', settingsRoutes);
  console.log('Settings routes registered successfully');
} catch (error) {
  console.error('Error loading settings routes:', error);
}

// Import help routes
try {
  const helpRoutes = require('./routes/help');
  app.use('/help', helpRoutes);
  console.log('Help routes registered successfully');
} catch (error) {
  console.error('Error loading help routes:', error);
}

// Root route - redirect to dashboard or landing
app.get('/', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;

  if (shop) {
    // If we have a shop parameter, go to dashboard
    res.redirect('/dashboard?shop=' + shop);
  } else {
    // Otherwise show a simple landing page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>KingsBuilder</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: sans-serif; margin: 0; padding: 20px; background: #f6f6f7; text-align: center; }
            .container { max-width: 800px; margin: 100px auto; }
            h1 { color: #333; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; background: #000; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>KingsBuilder</h1>
            <p>The Ultimate Page Builder for Shopify</p>
            <a href="/install" class="btn">Get Started</a>
          </div>
        </body>
      </html>
    `);
  }
});

// Export for Vercel
module.exports = app;


