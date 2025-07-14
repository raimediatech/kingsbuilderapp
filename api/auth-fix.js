// Enhanced Authentication Fix for KingsBuilder
const crypto = require('crypto');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

// Initialize session store
const sessionStore = new MemoryStore({
  checkPeriod: 86400000 // prune expired entries every 24h
});

// Enhanced session middleware with better error handling
const sessionMiddleware = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'kingsbuilder-secure-session-secret-' + crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // Allow frontend access for debugging
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'none' // Required for Shopify iframe embedding
  },
  name: 'kingsbuilder.sid'
});

// Enhanced access token management
class AccessTokenManager {
  constructor() {
    this.tokens = new Map();
    this.sessions = new Map();
  }

  // Store access token with multiple fallback methods
  storeToken(shop, token, req = null) {
    const key = this.normalizeShop(shop);
    const tokenData = {
      token,
      shop: key,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      sessionId: req?.sessionID || 'no-session'
    };

    // Store in memory
    this.tokens.set(key, tokenData);

    // Store in session if available
    if (req?.session) {
      req.session.accessToken = token;
      req.session.shop = key;
      req.session.tokenTimestamp = tokenData.timestamp;
      
      // Store session reference
      this.sessions.set(req.sessionID, {
        shop: key,
        token,
        timestamp: tokenData.timestamp
      });
      
      console.log(`Stored access token for shop ${key} in session ${req.sessionID}`);
    }

    console.log(`Access token stored for shop: ${key}`);
    return tokenData;
  }

  // Retrieve access token with multiple fallback methods
  getToken(shop, req = null) {
    const key = this.normalizeShop(shop);
    
    // Method 1: Check memory store
    const memoryToken = this.tokens.get(key);
    if (memoryToken && memoryToken.expiresAt > Date.now()) {
      console.log(`Retrieved access token from memory for shop: ${key}`);
      return memoryToken.token;
    }

    // Method 2: Check session
    if (req?.session?.accessToken && req?.session?.shop === key) {
      console.log(`Retrieved access token from session for shop: ${key}`);
      return req.session.accessToken;
    }

    // Method 3: Check cookies
    if (req?.cookies?.shopifyAccessToken) {
      console.log(`Retrieved access token from cookies for shop: ${key}`);
      return req.cookies.shopifyAccessToken;
    }

    // Method 4: Check headers
    if (req?.headers?.['x-shopify-access-token']) {
      console.log(`Retrieved access token from headers for shop: ${key}`);
      return req.headers['x-shopify-access-token'];
    }

    // Method 5: Environment variable (for development)
    if (process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN) {
      console.log(`Using environment access token for shop: ${key}`);
      return process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    }

    console.warn(`No access token found for shop: ${key}`);
    return null;
  }

  // Normalize shop domain
  normalizeShop(shop) {
    if (!shop) return '';
    return shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  // Clean expired tokens
  cleanExpiredTokens() {
    const now = Date.now();
    for (const [key, tokenData] of this.tokens.entries()) {
      if (tokenData.expiresAt < now) {
        this.tokens.delete(key);
        console.log(`Removed expired token for shop: ${key}`);
      }
    }
  }

  // Debug method to list all tokens
  listTokens() {
    console.log('Current tokens:', Array.from(this.tokens.keys()));
    console.log('Current sessions:', Array.from(this.sessions.keys()));
  }
}

// Create global token manager
const tokenManager = new AccessTokenManager();

// Clean expired tokens every hour
setInterval(() => {
  tokenManager.cleanExpiredTokens();
}, 60 * 60 * 1000);

// Enhanced authentication middleware
function enhancedAuth(req, res, next) {
  // Extract shop from various sources
  const shop = req.query.shop || 
               req.headers['x-shopify-shop-domain'] || 
               req.cookies?.shopOrigin ||
               req.session?.shop ||
               req.body?.shop;

  if (shop) {
    req.shopDomain = tokenManager.normalizeShop(shop);
    
    // Try to get access token
    const accessToken = tokenManager.getToken(shop, req);
    if (accessToken) {
      req.accessToken = accessToken;
      req.authenticated = true;
    }
  }

  // Set CORS headers for Shopify
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Shopify-Access-Token, X-Shopify-Shop-Domain');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
}

// Authentication helper for routes
function requireAuth(req, res, next) {
  const shop = req.shopDomain || req.query.shop;
  
  if (!shop) {
    return res.status(400).json({ 
      error: 'Shop parameter is required',
      hint: 'Please provide shop parameter in query string or headers'
    });
  }

  const accessToken = req.accessToken || tokenManager.getToken(shop, req);
  
  if (!accessToken) {
    return res.status(401).json({ 
      error: 'Access token is required',
      hint: 'Please authenticate with Shopify first',
      shop: shop,
      debug: {
        hasSession: !!req.session,
        hasCookies: !!req.cookies?.shopifyAccessToken,
        hasHeaders: !!req.headers['x-shopify-access-token'],
        hasEnvToken: !!process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN
      }
    });
  }

  req.accessToken = accessToken;
  req.authenticated = true;
  next();
}

// Store access token from various sources
function storeAccessToken(shop, token, req = null) {
  return tokenManager.storeToken(shop, token, req);
}

// Get access token with fallbacks
function getAccessToken(shop, req = null) {
  return tokenManager.getToken(shop, req);
}

// Shopify-specific error handler
function handleShopifyError(error, req, res, next) {
  console.error('Shopify API Error:', error);

  if (error.response) {
    const { status, data } = error.response;
    
    // Handle specific Shopify errors
    if (status === 401 || status === 403) {
      return res.status(status).json({
        error: 'Shopify authentication failed',
        message: data?.errors || 'Invalid API key or access token',
        hint: 'Please check your Shopify app configuration and ensure the access token is valid',
        shop: req.shopDomain
      });
    }

    if (status === 404) {
      return res.status(404).json({
        error: 'Resource not found',
        message: 'The requested Shopify resource was not found',
        shop: req.shopDomain
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests to Shopify API',
        retryAfter: error.response.headers['retry-after'] || 60
      });
    }

    return res.status(status).json({
      error: 'Shopify API error',
      message: data?.errors || error.message,
      status: status
    });
  }

  // Network or other errors
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    type: error.name
  });
}

module.exports = {
  sessionMiddleware,
  enhancedAuth,
  requireAuth,
  storeAccessToken,
  getAccessToken,
  handleShopifyError,
  tokenManager
};