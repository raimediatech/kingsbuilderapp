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
    "frame-ancestors 'self' https://*.myshopify.com https://*.shopify.com https://admin.shopify.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://cdnjs.cloudflare.com; connect-src 'self' https://*.myshopify.com https://*.shopify.com https://admin.shopify.com;"
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

// Simple test route to check if the server is working
app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is working!',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
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

// App builder route
app.get('/app/builder', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;
  const pageId = req.query.pageId;
  
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
      <script src="https://unpkg.com/@shopify/app-bridge@3.7.9/umd/index.js"></script>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #202223;
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
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .builder-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          min-height: 600px;
          padding: 20px;
        }
        .widget-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }
        .widget-card {
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .widget-card:hover {
          border-color: #4338ca;
          box-shadow: 0 4px 12px rgba(67, 56, 202, 0.15);
        }
        .widget-icon {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .widget-title {
          font-weight: 600;
          margin-bottom: 5px;
        }
        .widget-desc {
          font-size: 14px;
          color: #6b7280;
        }
        .preview-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          min-height: 300px;
          margin-top: 20px;
        }
        .btn {
          background: #4338ca;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn:hover {
          background: #3730a3;
        }
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        .btn-secondary:hover {
          background: #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1>🏗️ KingsBuilder - Page Builder</h1>
            <p>Build beautiful pages with drag-and-drop widgets</p>
          </div>
          <div>
            <button class="btn btn-secondary" onclick="goBack()">← Back to Pages</button>
            <button class="btn" onclick="savePage()">💾 Save Page</button>
          </div>
        </div>
        
        <div class="builder-container">
          <h2>Available Widgets</h2>
          <div class="widget-grid">
            <!-- Basic Widgets -->
            <div class="widget-card" onclick="addWidget('heading')">
              <div class="widget-icon">📝</div>
              <div class="widget-title">Heading</div>
              <div class="widget-desc">Add titles and headings</div>
            </div>
            <div class="widget-card" onclick="addWidget('text')">
              <div class="widget-icon">📄</div>
              <div class="widget-title">Text Block</div>
              <div class="widget-desc">Rich text content</div>
            </div>
            <div class="widget-card" onclick="addWidget('image')">
              <div class="widget-icon">🖼️</div>
              <div class="widget-title">Image</div>
              <div class="widget-desc">Add images and galleries</div>
            </div>
            <div class="widget-card" onclick="addWidget('button')">
              <div class="widget-icon">🔘</div>
              <div class="widget-title">Button</div>
              <div class="widget-desc">Call-to-action buttons</div>
            </div>
            <div class="widget-card" onclick="addWidget('video')">
              <div class="widget-icon">📹</div>
              <div class="widget-title">Video</div>
              <div class="widget-desc">Embed videos</div>
            </div>
            <div class="widget-card" onclick="addWidget('divider')">
              <div class="widget-icon">➖</div>
              <div class="widget-title">Divider</div>
              <div class="widget-desc">Section separators</div>
            </div>
            
            <!-- Advanced Widgets -->
            <div class="widget-card" onclick="addWidget('hero')">
              <div class="widget-icon">🎯</div>
              <div class="widget-title">Hero Section</div>
              <div class="widget-desc">Header with image/video</div>
            </div>
            <div class="widget-card" onclick="addWidget('gallery')">
              <div class="widget-icon">🖼️</div>
              <div class="widget-title">Image Gallery</div>
              <div class="widget-desc">Photo galleries</div>
            </div>
            <div class="widget-card" onclick="addWidget('testimonials')">
              <div class="widget-icon">💬</div>
              <div class="widget-title">Testimonials</div>
              <div class="widget-desc">Customer reviews</div>
            </div>
            <div class="widget-card" onclick="addWidget('pricing')">
              <div class="widget-icon">💰</div>
              <div class="widget-title">Pricing Table</div>
              <div class="widget-desc">Product pricing</div>
            </div>
            <div class="widget-card" onclick="addWidget('features')">
              <div class="widget-icon">⭐</div>
              <div class="widget-title">Features Grid</div>
              <div class="widget-desc">Feature highlights</div>
            </div>
            <div class="widget-card" onclick="addWidget('contact')">
              <div class="widget-icon">📧</div>
              <div class="widget-title">Contact Form</div>
              <div class="widget-desc">Lead capture forms</div>
            </div>
          </div>
          
          <div class="preview-area" id="preview">
            <h3>🎨 Page Preview</h3>
            <p>Click on widgets above to add them to your page</p>
            <div id="page-content"></div>
          </div>
        </div>
      </div>
      
      <script>
        // Initialize App Bridge
        const AppBridge = window['app-bridge'];
        const { createApp } = AppBridge;
        const { TitleBar } = AppBridge.actions;
        
        const app = createApp({
          apiKey: 'your-api-key',
          host: new URLSearchParams(window.location.search).get('host'),
          forceRedirect: true,
        });
        
        // Store current state
        let pageContent = [];
        const shop = "${shop}";
        const pageId = "${pageId || 'new'}";
        
        // Load existing page content if editing
        if (pageId !== 'new') {
          loadPageContent();
        }
        
        function addWidget(type) {
          const widget = createWidget(type);
          pageContent.push(widget);
          renderPreview();
          
          // Show success message
          showToast(\`\${widget.name} widget added!\`);
        }
        
        function createWidget(type) {
          const widgets = {
            heading: { name: 'Heading', html: '<h2>Your Heading Here</h2>' },
            text: { name: 'Text Block', html: '<p>Your text content goes here. Edit this to add your own content.</p>' },
            image: { name: 'Image', html: '<img src="https://via.placeholder.com/600x300" alt="Placeholder" style="max-width: 100%; height: auto;">' },
            button: { name: 'Button', html: '<button style="background: #4338ca; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">Click Me</button>' },
            video: { name: 'Video', html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>' },
            divider: { name: 'Divider', html: '<hr style="border: 1px solid #e5e7eb; margin: 20px 0;">' },
            hero: { name: 'Hero Section', html: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 20px; text-align: center; border-radius: 8px;"><h1>Welcome to Our Store</h1><p style="font-size: 18px; margin: 20px 0;">Discover amazing products and services</p><button style="background: white; color: #4338ca; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Shop Now</button></div>' },
            gallery: { name: 'Image Gallery', html: '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;"><img src="https://via.placeholder.com/200x200" style="width: 100%; border-radius: 8px;"><img src="https://via.placeholder.com/200x200" style="width: 100%; border-radius: 8px;"><img src="https://via.placeholder.com/200x200" style="width: 100%; border-radius: 8px;"><img src="https://via.placeholder.com/200x200" style="width: 100%; border-radius: 8px;"></div>' },
            testimonials: { name: 'Testimonials', html: '<div style="background: #f9fafb; padding: 40px 20px; border-radius: 8px; text-align: center;"><blockquote style="font-size: 18px; font-style: italic; margin: 0 0 20px;">"This product changed my life! Amazing quality and service."</blockquote><cite style="font-weight: bold;">- Happy Customer</cite></div>' },
            pricing: { name: 'Pricing Table', html: '<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; text-align: center; max-width: 300px; margin: 0 auto;"><h3>Premium Plan</h3><div style="font-size: 36px; font-weight: bold; color: #4338ca; margin: 20px 0;">$29<span style="font-size: 18px; color: #6b7280;">/month</span></div><ul style="list-style: none; padding: 0; margin: 20px 0;"><li>✓ All features included</li><li>✓ 24/7 support</li><li>✓ Free updates</li></ul><button style="background: #4338ca; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; width: 100%;">Get Started</button></div>' },
            features: { name: 'Features Grid', html: '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;"><div style="text-align: center;"><div style="background: #4338ca; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 15px;">⚡</div><h3>Fast Performance</h3><p>Lightning-fast loading times</p></div><div style="text-align: center;"><div style="background: #4338ca; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 15px;">🔒</div><h3>Secure</h3><p>Bank-level security</p></div><div style="text-align: center;"><div style="background: #4338ca; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 15px;">📱</div><h3>Mobile Ready</h3><p>Responsive on all devices</p></div></div>' },
            contact: { name: 'Contact Form', html: '<form style="max-width: 500px; margin: 0 auto;"><div style="margin-bottom: 20px;"><label style="display: block; margin-bottom: 5px; font-weight: bold;">Name</label><input type="text" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;"></div><div style="margin-bottom: 20px;"><label style="display: block; margin-bottom: 5px; font-weight: bold;">Email</label><input type="email" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;"></div><div style="margin-bottom: 20px;"><label style="display: block; margin-bottom: 5px; font-weight: bold;">Message</label><textarea style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; min-height: 100px;"></textarea></div><button type="submit" style="background: #4338ca; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">Send Message</button></form>' }
          };
          
          return widgets[type] || { name: 'Unknown', html: '<p>Widget not found</p>' };
        }
        
        function renderPreview() {
          const previewContent = document.getElementById('page-content');
          previewContent.innerHTML = pageContent.map(widget => 
            \`<div style="margin: 20px 0; padding: 20px; border: 1px dashed #d1d5db; border-radius: 8px; position: relative;">
              <div style="position: absolute; top: 5px; right: 5px; background: #ef4444; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;" onclick="removeWidget(\${pageContent.indexOf(widget)})">✕</div>
              \${widget.html}
            </div>\`
          ).join('');
        }
        
        function removeWidget(index) {
          pageContent.splice(index, 1);
          renderPreview();
          showToast('Widget removed');
        }
        
        function loadPageContent() {
          // In a real implementation, this would fetch the page content from the API
          showToast('Loading page content...');
        }
        
        function savePage() {
          const htmlContent = pageContent.map(widget => widget.html).join('\\n');
          
          // In a real implementation, this would save to Shopify
          fetch('/api/pages/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pageId: pageId,
              shop: shop,
              content: htmlContent,
              widgets: pageContent
            })
          })
          .then(response => response.json())
          .then(data => {
            showToast('Page saved successfully! 🎉');
          })
          .catch(error => {
            showToast('Error saving page: ' + error.message);
          });
        }
        
        function goBack() {
          window.location.href = '/pages?shop=' + shop;
        }
        
        function showToast(message) {
          // Simple toast notification
          const toast = document.createElement('div');
          toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 12px 20px; border-radius: 6px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
          toast.textContent = message;
          document.body.appendChild(toast);
          
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 3000);
        }
        
        // Initialize with welcome message
        showToast('Page Builder loaded! 🚀');
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



