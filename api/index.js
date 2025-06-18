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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
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
        .widget-card, .widget-item {
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          margin-bottom: 10px;
        }
        .widget-card:hover, .widget-item:hover {
          border-color: #4338ca;
          box-shadow: 0 4px 12px rgba(67, 56, 202, 0.15);
          transform: translateY(-2px);
        }
        .widget-item {
          display: flex;
          align-items: center;
          text-align: left;
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
        .preview-area, .canvas {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          min-height: 300px;
          margin-top: 20px;
          background: #fafafa;
        }
        
        .canvas-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: #6b7280;
        }
        
        .canvas-empty i {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.5;
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
        
        /* Widget element styles */
        .widget-element { 
          margin: 10px 0; 
          padding: 15px; 
          border: 1px solid #e5e7eb; 
          border-radius: 8px; 
          position: relative;
          background: white;
        }
        .widget-element:hover { 
          border-color: #4338ca; 
        }
        .widget-element:hover .widget-toolbar {
          opacity: 1;
        }
        .widget-element.selected { 
          border: 2px solid #4338ca; 
          box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.3); 
        }
        .widget-toolbar {
          position: absolute;
          top: -10px;
          right: 10px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          display: flex;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 10;
        }
        .toolbar-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #6b7280;
        }
        .toolbar-btn:hover {
          color: #4338ca;
        }
        .toolbar-btn.delete:hover {
          color: #ef4444;
        }
        
        /* Toast notification */
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.3s;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }
        .toast.error {
          background: #ef4444;
        }
      </style>
    </head>
    <body>
      <!-- Header Bar -->
      <div class="header-bar">
        <div class="header-left">
          <div class="header-title">
            <i class="fas fa-hammer"></i> KingsBuilder Pro
          </div>
          <div class="page-settings">
            <div class="form-group">
              <label>Page Title</label>
              <input type="text" class="form-input" id="pageTitle" value="Untitled Page" placeholder="Enter page title">
            </div>
            <div class="form-group">
              <label>Page URL</label>
              <input type="text" class="form-input" id="pageUrl" value="untitled-page" placeholder="page-url-slug">
            </div>
            <div class="form-group">
              <label>Status</label>
              <div class="status-selector">
                <button class="status-btn" id="statusBtn" onclick="toggleStatus()">
                  <i class="fas fa-circle status-draft"></i>
                  <span>Draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" onclick="goBack()">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <button class="btn btn-secondary" onclick="previewPage()">
            <i class="fas fa-eye"></i> Preview
          </button>
          <button class="btn btn-primary" onclick="savePage()">
            <i class="fas fa-save"></i> Save Page
          </button>
        </div>
      </div>

      <div class="page-builder">
        <!-- Left Sidebar -->
        <div class="sidebar">
          <!-- Widgets Section -->
          <div class="sidebar-section">
            <div class="sidebar-title">
              <i class="fas fa-cube"></i> Widgets
            </div>
            <div class="widget-list">
              <!-- Basic Widgets -->
              <div class="widget-item" draggable="true" data-widget="heading" onclick="addWidget('heading')">
                <div class="widget-icon">📝</div>
                <div class="widget-info">
                  <h4>Heading</h4>
                  <p>Add titles and headings</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="text" onclick="addWidget('text')">
                <div class="widget-icon">📄</div>
                <div class="widget-info">
                  <h4>Text Block</h4>
                  <p>Rich text content</p>
                </div>
              </div>
              <div class="widget-item" draggable="true" data-widget="image" onclick="addWidget('image')">
                <div class="widget-icon">🖼️</div>
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

        <!-- Main Canvas -->
        <div class="canvas-area">
          <div class="canvas-container">
            <div class="canvas" id="canvas" ondrop="handleCanvasDrop(event)" ondragover="handleCanvasDragOver(event)">
              <div class="canvas-empty" id="canvasEmpty">
                <i class="fas fa-mouse-pointer"></i>
                <h3>Start Building Your Page</h3>
                <p>Drag widgets from the sidebar or choose a template to get started</p>
              </div>
              <div id="canvasContent"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Widget Properties Panel -->
      <div class="properties-panel" id="propertiesPanel">
        <div class="properties-header">
          <div class="properties-title">Widget Properties</div>
          <button class="toolbar-btn" onclick="closeProperties()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="properties-content" id="propertiesContent">
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
          
          let propertiesHTML = \`<h3>\${widget.name} Properties</h3>\`;
          
          // Build simple property editor
          propertiesHTML += \`
            <div class="property-group">
              <label class="property-label">Content</label>
              <textarea class="property-input" rows="4" onchange="updateWidgetContent(this.value)">\${widget.html}</textarea>
            </div>
            <div class="property-group">
              <button class="btn btn-primary" onclick="applyPropertyChanges()">Apply Changes</button>
            </div>
          \`;
          
          content.innerHTML = propertiesHTML;
          panel.classList.add('active');
        }
        
        function updateWidgetContent(content) {
          if (selectedWidget !== null) {
            tempWidgetContent = content;
          }
        }
        
        var tempWidgetContent = '';
        
        function applyPropertyChanges() {
          if (selectedWidget !== null && tempWidgetContent) {
            pageContent[selectedWidget].html = tempWidgetContent;
            renderCanvas();
            showToast('Widget updated!', 'success');
            closeProperties();
          }
        }
        
        function closeProperties() {
          document.getElementById('propertiesPanel').classList.remove('active');
          document.querySelectorAll('.widget-element').forEach(el => el.classList.remove('selected'));
          selectedWidget = null;
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
        function selectWidget(index) {
          console.log('Selecting widget at index:', index);
          selectedWidget = index;
          // Highlight the selected widget
          const widgets = document.querySelectorAll('.widget-element');
          widgets.forEach((widget, i) => {
            if (i === index) {
              widget.classList.add('selected');
            } else {
              widget.classList.remove('selected');
            }
          });
        }
        
        function editWidget(index) {
          console.log('Editing widget at index:', index);
          const widget = pageContent[index];
          if (!widget) return;
          
          const newContent = prompt('Edit ' + widget.name + ' content:', widget.html);
          if (newContent !== null) {
            widget.html = newContent;
            renderCanvas();
            showToast(widget.name + ' updated!', 'success');
          }
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



