// Simple version of the app without MongoDB dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Shopify-Access-Token', 'X-Shopify-Shop-Domain', 'x-user-email']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET || 'kings-builder-session-secret'));

// Add security headers middleware for Shopify iframe embedding
app.use((req, res, next) => {
  // Set security headers for Shopify iframe embedding
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://*.myshopify.com https://*.shopify.com https://admin.shopify.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://cdnjs.cloudflare.com https://unpkg.com; connect-src 'self' https://*.myshopify.com https://*.shopify.com https://admin.shopify.com;"
  );
  
  // Set Access-Control-Allow headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-email, x-shopify-shop-domain, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// App route for Shopify admin
app.get('/app', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;
  
  if (shop) {
    // Redirect to dashboard with shop parameter
    res.redirect('/dashboard?shop=' + shop);
  } else {
    // If no shop parameter, redirect to install
    res.redirect('/install');
  }
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;
  
  if (!shop) {
    return res.redirect('/install');
  }
  
  // Serve a simple dashboard
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KingsBuilder Dashboard</title>
      <link rel="stylesheet" href="https://unpkg.com/@shopify/polaris@12.0.0/build/esm/styles.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f6f6f7;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        .btn {
          background: #4338ca;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .btn i {
          margin-right: 6px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>KingsBuilder Dashboard</h1>
        </div>
        
        <div class="card">
          <h2>Pages</h2>
          <p>Create and manage custom pages for your Shopify store.</p>
          <a href="/api/pages?shop=${shop}" class="btn">
            <i class="fas fa-file"></i> Manage Pages
          </a>
        </div>
        
        <div class="card">
          <h2>Templates</h2>
          <p>Use pre-built templates to quickly create beautiful pages.</p>
          <a href="#" class="btn">
            <i class="fas fa-palette"></i> Browse Templates
          </a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Pages list route
app.get('/api/pages', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;
  
  if (!shop) {
    return res.redirect('/install');
  }
  
  // Serve the pages list interface
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KingsBuilder - Pages</title>
      <link rel="stylesheet" href="https://unpkg.com/@shopify/polaris@12.0.0/build/esm/styles.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f6f6f7;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .btn {
          background: #4338ca;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .btn i {
          margin-right: 6px;
        }
        .pages-list {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .page-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        .page-item:last-child {
          border-bottom: none;
        }
        .page-info h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
        }
        .page-url {
          color: #6b7280;
          font-size: 14px;
        }
        .page-actions {
          display: flex;
          gap: 10px;
        }
        .action-btn {
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .action-btn i {
          margin-right: 4px;
        }
        .action-btn:hover {
          background: #f9fafb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pages</h1>
          <a href="/api/builder?pageId=new&shop=${shop}" class="btn">
            <i class="fas fa-plus"></i> Create Page
          </a>
        </div>
        
        <div class="pages-list">
          <div class="page-item">
            <div class="page-info">
              <h3>Home Page</h3>
              <div class="page-url">/pages/home</div>
            </div>
            <div class="page-actions">
              <a href="/api/builder?pageId=1&shop=${shop}" class="action-btn">
                <i class="fas fa-edit"></i> Edit
              </a>
              <button class="action-btn">
                <i class="fas fa-eye"></i> View
              </button>
            </div>
          </div>
          
          <div class="page-item">
            <div class="page-info">
              <h3>About Us</h3>
              <div class="page-url">/pages/about</div>
            </div>
            <div class="page-actions">
              <a href="/api/builder?pageId=2&shop=${shop}" class="action-btn">
                <i class="fas fa-edit"></i> Edit
              </a>
              <button class="action-btn">
                <i class="fas fa-eye"></i> View
              </button>
            </div>
          </div>
          
          <div class="page-item">
            <div class="page-info">
              <h3>Contact Us</h3>
              <div class="page-url">/pages/contact</div>
            </div>
            <div class="page-actions">
              <a href="/api/builder?pageId=3&shop=${shop}" class="action-btn">
                <i class="fas fa-edit"></i> Edit
              </a>
              <button class="action-btn">
                <i class="fas fa-eye"></i> View
              </button>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// App builder route
app.get('/api/builder', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;
  const pageId = req.query.pageId || 'new';
  
  if (!shop) {
    return res.redirect('/install');
  }
  
  // Serve the page builder interface
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KingsBuilder - Page Builder</title>
      <link rel="stylesheet" href="https://unpkg.com/@shopify/polaris@12.0.0/build/esm/styles.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f6f6f7;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .btn {
          background: #4338ca;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .btn i {
          margin-right: 6px;
        }
        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .form-control {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Page Builder</h1>
          <a href="/api/pages?shop=${shop}" class="btn">
            <i class="fas fa-arrow-left"></i> Back to Pages
          </a>
        </div>
        
        <div class="card">
          <h2>Page Settings</h2>
          <div class="form-group">
            <label class="form-label">Page Title</label>
            <input type="text" class="form-control" value="${pageId === 'new' ? 'New Page' : 'Page ' + pageId}">
          </div>
          <div class="form-group">
            <label class="form-label">URL Handle</label>
            <input type="text" class="form-control" value="${pageId === 'new' ? 'new-page' : 'page-' + pageId}">
          </div>
        </div>
        
        <div class="card">
          <h2>Content</h2>
          <p>This is a simplified version of the page builder. The full version includes drag-and-drop functionality and more widgets.</p>
          <div class="form-group">
            <label class="form-label">Page Content</label>
            <textarea class="form-control" rows="10">
<h1>Welcome to my page</h1>
<p>This is a sample page built with KingsBuilder.</p>
            </textarea>
          </div>
          <button class="btn">
            <i class="fas fa-save"></i> Save Page
          </button>
        </div>
      </div>
    </body>
    </html>
  `);
});

// API endpoints for pages
app.get('/api/pages/:pageId', (req, res) => {
  const { pageId } = req.params;
  const shop = req.query.shop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
  
  if (!shop) {
    return res.status(400).json({ error: 'Shop parameter is required' });
  }
  
  // Return mock page data
  res.json({
    page: {
      id: pageId,
      title: 'Page ' + pageId,
      handle: 'page-' + pageId,
      content: '<h1>Welcome to my page</h1><p>This is a sample page built with KingsBuilder.</p>'
    }
  });
});

// Catch-all route for any other requests
app.get('*', (req, res) => {
  res.redirect('/dashboard');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;