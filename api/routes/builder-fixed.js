// api/routes/builder.js - Page builder routes
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// GET /builder/:pageId - Page builder interface
router.get('/:pageId', (req, res) => {
  try {
    // Get parameters
    const { pageId } = req.params;
    const shop = req.query.shop || req.cookies?.shopOrigin;
    const userEmail = req.query.email || req.headers['x-user-email'];
    
    // Set security headers for Shopify iframe embedding
    res.setHeader(
      "Content-Security-Policy",
      "frame-ancestors 'self' https://*.myshopify.com https://*.shopify.com https://admin.shopify.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://cdnjs.cloudflare.com; connect-src 'self' https://*.myshopify.com https://*.shopify.com https://admin.shopify.com;"
    );
    
    // Set Access-Control-Allow headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-email, x-shopify-shop-domain');
    
    // Remove X-Frame-Options as it's deprecated and causing issues
    res.removeHeader('X-Frame-Options');
    
    if (!shop) {
      return res.status(400).send('Shop parameter is required');
    }
    
    // Mock user permissions (in a real app, this would come from a database)
    const canEdit = true;
    const canPublish = true;
    
    // Render the builder interface
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="shopify-api-key" content="${process.env.SHOPIFY_API_KEY}">
        <title>KingsBuilder - Page Builder</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
        <script src="/builder/save-menu-fix.js"></script>
        <script src="/builder/shopify-bridge.js"></script>
        <style>
          /* Reset and base styles */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
          }
          
          /* Builder layout */
          .builder-container {
            display: flex;
            height: 100vh;
            overflow: hidden;
          }
          
          .sidebar {
            width: 300px;
            background-color: #fff;
            border-right: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          
          .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          
          /* Header */
          .builder-header {
            padding: 15px;
            background-color: #fff;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .builder-title {
            font-size: 18px;
            font-weight: 600;
          }
          
          .builder-actions {
            display: flex;
            gap: 10px;
          }
          
          /* Sidebar sections */
          .sidebar-section {
            border-bottom: 1px solid #e0e0e0;
          }
          
          .sidebar-section-header {
            padding: 12px 15px;
            font-weight: 600;
            font-size: 14px;
            background-color: #f5f5f5;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .sidebar-section-content {
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
          }
          
          /* Widgets */
          .widget-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          
          .widget {
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .widget:hover {
            background-color: #f0f0f0;
            border-color: #ccc;
          }
          
          .widget-icon {
            font-size: 20px;
            margin-bottom: 5px;
          }
          
          .widget-label {
            font-size: 12px;
            font-weight: 500;
          }
          
          /* Canvas */
          .canvas-container {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background-color: #f0f0f0;
          }
          
          #canvas {
            background-color: #fff;
            min-height: 800px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          
          /* Element styles */
          .element {
            position: relative;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px dashed transparent;
            border-radius: 4px;
            transition: all 0.2s ease;
          }
          
          .element:hover {
            border-color: #ccc;
          }
          
          .element.selected {
            border: 2px solid #0066ff;
            box-shadow: 0 0 10px rgba(0, 102, 255, 0.2);
          }
          
          .element-actions {
            position: absolute;
            top: 5px;
            right: 5px;
            display: none;
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
          }
          
          .element:hover .element-actions {
            display: flex;
          }
          
          .element-action {
            padding: 5px;
            cursor: pointer;
            font-size: 12px;
            background-color: #fff;
            border: none;
          }
          
          .element-action:hover {
            background-color: #f5f5f5;
          }
          
          /* Properties panel */
          .properties-panel {
            padding: 15px;
            background-color: #fff;
            border-top: 1px solid #e0e0e0;
            max-height: 300px;
            overflow-y: auto;
          }
          
          .property-group {
            margin-bottom: 15px;
          }
          
          .property-group-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          
          .property-row {
            display: flex;
            margin-bottom: 8px;
            align-items: center;
          }
          
          .property-label {
            width: 100px;
            font-size: 12px;
          }
          
          .property-input {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 12px;
          }
          
          /* Buttons */
          .btn {
            padding: 8px 16px;
            border-radius: 4px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .btn-primary {
            background-color: #0066ff;
            color: white;
          }
          
          .btn-primary:hover {
            background-color: #0052cc;
          }
          
          .btn-secondary {
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #e0e0e0;
          }
          
          .btn-secondary:hover {
            background-color: #e0e0e0;
          }
          
          /* Loading indicator */
          .loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #0066ff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Element actions styling */
          .element-actions {
            position: absolute;
            top: 5px;
            right: 5px;
            display: none;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 10;
          }
          
          .element:hover .element-actions {
            display: flex;
          }
          
          .element-action {
            padding: 5px 10px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 12px;
            color: #333;
          }
          
          .element-action:hover {
            background-color: #f0f0f0;
          }
          
          /* Edit dialog styling */
          .edit-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          
          .edit-dialog-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
          }
          
          .edit-dialog-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            gap: 10px;
          }
          
          .edit-dialog-actions button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          #save-edit {
            background-color: #0066ff;
            color: white;
          }
          
          #cancel-edit {
            background-color: #f0f0f0;
            color: #333;
          }
          
          /* Shopify REST widgets section */
          .shopify-widgets {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          
          .shopify-widget {
            background-color: #f0f7ff;
            border: 1px solid #cce5ff;
            border-radius: 4px;
            padding: 10px;
            text-align: center;
            cursor: grab;
            transition: all 0.2s;
            user-select: none;
          }
          
          .shopify-widget:hover {
            background-color: #e0f0ff;
            border-color: #99caff;
          }
          
          .shopify-widget-icon {
            font-size: 20px;
            margin-bottom: 5px;
            color: #0066ff;
          }
          
          .shopify-widget-label {
            font-size: 12px;
            font-weight: 500;
            color: #0066ff;
          }
          
          /* Template widgets */
          .template-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          
          .template-widget {
            background-color: #f0f7ff;
            border: 1px solid #cce5ff;
            transition: all 0.2s;
          }
          
          .template-widget:hover {
            background-color: #e0f0ff;
            border-color: #99caff;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 102, 255, 0.1);
          }
          
          /* Preview styles */
          .preview-btn {
            background-color: #000;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 5px;
          }
          
          .preview-btn.secondary {
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <div class="builder-container">
          <div class="sidebar">
            <div class="sidebar-section">
              <div class="sidebar-section-header">
                Basic Widgets
                <span>+</span>
              </div>
              <div class="sidebar-section-content">
                <div class="widget-list">
                  <div class="widget" data-widget-type="header">
                    <div class="widget-icon">H</div>
                    <div class="widget-label">Header</div>
                  </div>
                  <div class="widget" data-widget-type="paragraph">
                    <div class="widget-icon">¶</div>
                    <div class="widget-label">Paragraph</div>
                  </div>
                  <div class="widget" data-widget-type="image">
                    <div class="widget-icon">🖼️</div>
                    <div class="widget-label">Image</div>
                  </div>
                  <div class="widget" data-widget-type="button">
                    <div class="widget-icon">🔘</div>
                    <div class="widget-label">Button</div>
                  </div>
                  <div class="widget" data-widget-type="divider">
                    <div class="widget-icon">—</div>
                    <div class="widget-label">Divider</div>
                  </div>
                  <div class="widget" data-widget-type="spacer">
                    <div class="widget-icon">↕️</div>
                    <div class="widget-label">Spacer</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="sidebar-section">
              <div class="sidebar-section-header">
                Layout Widgets
                <span>+</span>
              </div>
              <div class="sidebar-section-content">
                <div class="widget-list">
                  <div class="widget" data-widget-type="container">
                    <div class="widget-icon">□</div>
                    <div class="widget-label">Container</div>
                  </div>
                  <div class="widget" data-widget-type="columns">
                    <div class="widget-icon">⫴</div>
                    <div class="widget-label">Columns</div>
                  </div>
                  <div class="widget" data-widget-type="card">
                    <div class="widget-icon">🃏</div>
                    <div class="widget-label">Card</div>
                  </div>
                  <div class="widget" data-widget-type="tabs">
                    <div class="widget-icon">📑</div>
                    <div class="widget-label">Tabs</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="sidebar-section">
              <div class="sidebar-section-header">
                Shopify REST Widgets
                <span>+</span>
              </div>
              <div class="sidebar-section-content">
                <div class="shopify-widgets">
                  <div class="shopify-widget" data-widget-type="product">
                    <div class="shopify-widget-icon">🛍️</div>
                    <div class="shopify-widget-label">Product</div>
                  </div>
                  <div class="shopify-widget" data-widget-type="collection">
                    <div class="shopify-widget-icon">📦</div>
                    <div class="shopify-widget-label">Collection</div>
                  </div>
                  <div class="shopify-widget" data-widget-type="cart">
                    <div class="shopify-widget-icon">🛒</div>
                    <div class="shopify-widget-label">Cart</div>
                  </div>
                  <div class="shopify-widget" data-widget-type="blog">
                    <div class="shopify-widget-icon">📝</div>
                    <div class="shopify-widget-label">Blog</div>
                  </div>
                  <div class="shopify-widget" data-widget-type="menu">
                    <div class="shopify-widget-icon">📋</div>
                    <div class="shopify-widget-label">Menu</div>
                  </div>
                  <div class="shopify-widget" data-widget-type="customer">
                    <div class="shopify-widget-icon">👤</div>
                    <div class="shopify-widget-label">Customer</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="sidebar-section">
              <div class="sidebar-section-header" style="background-color: #f0f7ff; color: #0066ff;">
                Page Templates
                <span>-</span>
              </div>
              <div class="sidebar-section-content" style="display: block;">
                <p style="margin: 10px 0; font-size: 12px; color: #666;">Drag and drop these pre-designed sections to quickly build your page:</p>
                <div class="widget-list template-list">
                  <div class="widget template-widget" data-template-id="hero">
                    <div class="widget-icon">🏆</div>
                    <div class="widget-label">Hero Section</div>
                  </div>
                  <div class="widget template-widget" data-template-id="features">
                    <div class="widget-icon">✨</div>
                    <div class="widget-label">Features</div>
                  </div>
                  <div class="widget template-widget" data-template-id="testimonials">
                    <div class="widget-icon">💬</div>
                    <div class="widget-label">Testimonials</div>
                  </div>
                  <div class="widget template-widget" data-template-id="cta">
                    <div class="widget-icon">📣</div>
                    <div class="widget-label">Call to Action</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="main-content">
            <div class="builder-header">
              <div class="builder-title">Page Builder: ${pageId}</div>
              <div class="builder-actions">
                ${canEdit ? `<button class="btn btn-secondary" id="preview-btn">Preview</button>` : ''}
                ${canEdit ? `<button class="btn btn-secondary" id="save-btn">Save</button>` : ''}
                ${canPublish ? `<button class="btn btn-primary" id="publish-btn">Publish</button>` : ''}
              </div>
            </div>
            
            <div class="notification" style="background-color: #f0f7ff; border: 1px solid #cce5ff; padding: 10px 15px; margin-bottom: 15px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <p style="margin: 0; font-weight: 500; color: #0066ff;">✨ New Page Templates Available!</p>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #555;">Drag and drop pre-designed sections from the templates panel to quickly build your page.</p>
              </div>
              <button class="close-notification" style="background: none; border: none; cursor: pointer; font-size: 16px; color: #999;">×</button>
            </div>
            
            <div class="canvas-container">
              <div id="canvas">
                <!-- Canvas content will be here -->
                <div class="element" data-element-type="header" id="header-1">
                  <h1>Welcome to our store</h1>
                  <div class="element-actions">
                    <button class="element-action">Edit</button>
                    <button class="element-action">Delete</button>
                  </div>
                </div>
                
                <div class="element" data-element-type="paragraph" id="paragraph-1">
                  <p>This is a sample paragraph. You can edit this text by clicking on it.</p>
                  <div class="element-actions">
                    <button class="element-action">Edit</button>
                    <button class="element-action">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="properties-panel">
              <div class="property-group">
                <div class="property-group-title">Element Properties</div>
                <div class="property-row">
                  <div class="property-label">Background</div>
                  <input type="color" class="property-input" id="bg-color">
                </div>
                <div class="property-row">
                  <div class="property-label">Text Color</div>
                  <input type="color" class="property-input" id="text-color">
                </div>
                <div class="property-row">
                  <div class="property-label">Padding</div>
                  <input type="text" class="property-input" id="padding" placeholder="10px">
                </div>
                <div class="property-row">
                  <div class="property-label">Margin</div>
                  <input type="text" class="property-input" id="margin" placeholder="10px">
                </div>
              </div>
            </div>
          </div>
        </div>

        <script>
          // Page data
          const pageId = '${pageId}';
          const shop = '${shop}';
          const userEmail = '${userEmail || ''}';

          // Save button functionality
          ${canEdit ? `
          document.getElementById('save-btn').addEventListener('click', function() {
            // Get all elements from the canvas
            const elements = Array.from(document.querySelectorAll('#canvas [data-element-type]'));
            
            // Create page data object
            const pageTitle = document.querySelector('.builder-title').textContent.trim().replace('Page Builder:', '').trim();
            const pageData = {
              id: pageId,
              title: pageTitle,
              handle: pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              content: {
                elements: elements.map(el => {
                  // Get element content (excluding the actions div)
                  let content = el.innerHTML;
                  const actionsDiv = el.querySelector('.element-actions');
                  if (actionsDiv) {
                    content = content.replace(actionsDiv.outerHTML, '');
                  }
                  
                  return {
                    id: el.id,
                    type: el.getAttribute('data-element-type'),
                    content: content,
                    styles: {
                      backgroundColor: el.style.backgroundColor,
                      color: el.style.color,
                      padding: el.style.padding,
                      margin: el.style.margin,
                      border: el.style.border,
                      fontSize: el.style.fontSize,
                      fontWeight: el.style.fontWeight,
                      textAlign: el.style.textAlign
                    }
                  };
                })
              }
            };
            
            // Show loading indicator
            const loadingEl = document.createElement('div');
            loadingEl.className = 'loading';
            loadingEl.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loadingEl);
            
            console.log('Saving page data:', JSON.stringify(pageData));
            
            // Send data to server
            fetch(\`/api/pages/\${pageId}?shop=\${shop}\`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Shop-Domain': shop,
                'x-user-email': userEmail || ''
              },
              body: JSON.stringify(pageData)
            })
            .then(response => {
              if (!response.ok) {
                console.error('Server response not OK:', response.status, response.statusText);
                throw new Error('Failed to save page: ' + response.status);
              }
              return response.json();
            })
            .then(data => {
              console.log('Page saved successfully:', data);
              // Remove loading indicator
              document.body.removeChild(loadingEl);
              
              // Create a hidden save-page menu item if it doesn't exist
              if (!document.getElementById('save-page')) {
                const menuItem = document.createElement('div');
                menuItem.id = 'save-page';
                menuItem.style.display = 'none';
                document.body.appendChild(menuItem);
              }
              
              alert('Page saved successfully!');
            })
            .catch(error => {
              console.error('Error saving page:', error);
              // Remove loading indicator
              document.body.removeChild(loadingEl);
              alert('Failed to save page: ' + error.message);
              
              // Fallback to local storage
              localStorage.setItem('page_' + pageId, JSON.stringify(pageData));
              alert('Page saved to local storage as a backup.');
            });
          });
          ` : ''}

          // Publish button functionality
          ${canPublish ? `
          document.getElementById('publish-btn').addEventListener('click', function() {
            // Get all elements from the canvas
            const elements = Array.from(document.querySelectorAll('#canvas [data-element-type]'));
            
            // Create page data object
            const pageTitle = document.querySelector('.builder-title').textContent.trim().replace('Page Builder:', '').trim();
            const pageData = {
              id: pageId,
              title: pageTitle,
              handle: pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              published: true,
              content: {
                elements: elements.map(el => {
                  // Get element content (excluding the actions div)
                  let content = el.innerHTML;
                  const actionsDiv = el.querySelector('.element-actions');
                  if (actionsDiv) {
                    content = content.replace(actionsDiv.outerHTML, '');
                  }
                  
                  return {
                    id: el.id,
                    type: el.getAttribute('data-element-type'),
                    content: content,
                    styles: {
                      backgroundColor: el.style.backgroundColor,
                      color: el.style.color,
                      padding: el.style.padding,
                      margin: el.style.margin,
                      border: el.style.border,
                      fontSize: el.style.fontSize,
                      fontWeight: el.style.fontWeight,
                      textAlign: el.style.textAlign
                    }
                  };
                })
              }
            };
            
            // Show loading indicator
            const loadingEl = document.createElement('div');
            loadingEl.className = 'loading';
            loadingEl.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loadingEl);
            
            console.log('Publishing page data:', JSON.stringify(pageData));
            
            // Send data to server
            fetch(\`/api/pages/\${pageId}/publish?shop=\${shop}\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Shop-Domain': shop,
                'x-user-email': userEmail || ''
              },
              body: JSON.stringify(pageData)
            })
            .then(response => {
              if (!response.ok) {
                console.error('Server response not OK:', response.status, response.statusText);
                throw new Error('Failed to publish page: ' + response.status);
              }
              return response.json();
            })
            .then(data => {
              console.log('Page published successfully:', data);
              // Remove loading indicator
              document.body.removeChild(loadingEl);
              alert('Page published successfully!');
              
              // Open the published page in a new tab
              if (data.page && data.page.handle) {
                const shopUrl = shop.includes('.myshopify.com') ? shop : shop + '.myshopify.com';
                window.open(\`https://\${shopUrl}/pages/\${data.page.handle}\`, '_blank');
              }
            })
            .catch(error => {
              console.error('Error publishing page:', error);
              // Remove loading indicator
              document.body.removeChild(loadingEl);
              alert('Failed to publish page: ' + error.message);
            });
          });
          ` : ''}

          // Preview button functionality
          document.getElementById('preview-btn').addEventListener('click', function() {
            // Show loading indicator
            const loadingEl = document.createElement('div');
            loadingEl.className = 'loading';
            loadingEl.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loadingEl);
            
            try {
              // Get all elements from the canvas
              const elements = Array.from(document.querySelectorAll('#canvas [data-element-type]'));
              
              // Create page data object
              const pageData = {
                id: pageId,
                title: document.querySelector('.builder-title').textContent.trim().replace('Page Builder:', '').trim() || 'Untitled Page',
                content: {
                  elements: elements.map(el => {
                    return {
                      id: el.id || 'element-' + Math.random().toString(36).substring(2, 9),
                      type: el.getAttribute('data-element-type'),
                      content: el.innerHTML,
                      styles: {
                        backgroundColor: el.style.backgroundColor,
                        color: el.style.color,
                        padding: el.style.padding,
                        margin: el.style.margin,
                        border: el.style.border,
                        fontSize: el.style.fontSize,
                        fontWeight: el.style.fontWeight,
                        textAlign: el.style.textAlign,
                        width: el.style.width,
                        height: el.style.height,
                        borderRadius: el.style.borderRadius
                      }
                    };
                  })
                }
              };
              
              // Open preview in new window
              const previewWindow = window.open('', '_blank');
              
              // Generate HTML for preview
              const previewHTML = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>${pageData.title} - Preview</title>
                  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                  <style>
                    body {
                      font-family: 'Inter', sans-serif;
                      margin: 0;
                      padding: 0;
                      color: #333;
                    }
                    .preview-header {
                      background-color: #f5f5f5;
                      padding: 10px;
                      text-align: center;
                      border-bottom: 1px solid #ddd;
                      position: sticky;
                      top: 0;
                      z-index: 100;
                    }
                    .preview-container {
                      max-width: 1200px;
                      margin: 0 auto;
                      padding: 20px;
                    }
                    .preview-element {
                      margin-bottom: 15px;
                    }
                    .preview-actions {
                      margin-top: 10px;
                    }
                    .preview-btn {
                      background-color: #000;
                      color: white;
                      border: none;
                      padding: 8px 16px;
                      border-radius: 4px;
                      cursor: pointer;
                      margin-right: 10px;
                    }
                    .preview-btn:hover {
                      background-color: #333;
                    }
                    .preview-btn.secondary {
                      background-color: #f5f5f5;
                      color: #333;
                      border: 1px solid #ddd;
                    }
                    
                    /* Responsive preview */
                    .desktop-view {
                      width: 100%;
                    }
                    .tablet-view {
                      width: 768px;
                      margin: 0 auto;
                      border: 1px solid #ddd;
                      border-radius: 8px;
                      padding: 10px;
                    }
                    .mobile-view {
                      width: 375px;
                      margin: 0 auto;
                      border: 1px solid #ddd;
                      border-radius: 8px;
                      padding: 10px;
                    }
                  </style>
                </head>
                <body>
                  <div class="preview-header">
                    <h2>${pageData.title} - Preview</h2>
                    <p>This is a preview of your page. Close this window to return to the editor.</p>
                    <div class="preview-actions">
                      <button class="preview-btn" onclick="setView('desktop')">Desktop</button>
                      <button class="preview-btn" onclick="setView('tablet')">Tablet</button>
                      <button class="preview-btn" onclick="setView('mobile')">Mobile</button>
                      <button class="preview-btn secondary" onclick="window.close()">Close Preview</button>
                      <button class="preview-btn" onclick="window.print()">Print</button>
                    </div>
                  </div>
                  <div id="preview-container" class="preview-container desktop-view">
                    ${pageData.content.elements.map(element => {
                      const styles = Object.entries(element.styles)
                        .filter(([_, value]) => value) // Filter out empty styles
                        .map(([key, value]) => \`\${key}: \${value}\`)
                        .join('; ');
                      
                      return \`<div class="preview-element" style="\${styles}">\${element.content}</div>\`;
                    }).join('')}
                  </div>
                  
                  <script>
                    function setView(viewType) {
                      const container = document.getElementById('preview-container');
                      container.className = 'preview-container ' + viewType + '-view';
                    }
                  </script>
                </body>
                </html>
              `;
              
              // Write HTML to preview window
              previewWindow.document.write(previewHTML);
              previewWindow.document.close();
            } catch (error) {
              console.error('Error generating preview:', error);
              alert('Error generating preview: ' + error.message);
            } finally {
              // Remove loading indicator
              document.body.removeChild(loadingEl);
            }
          });

          // Widget drag and drop functionality
          const widgets = document.querySelectorAll('.widget, .shopify-widget');
          const canvas = document.getElementById('canvas');
          
          // Make widgets draggable
          widgets.forEach(widget => {
            widget.addEventListener('dragstart', function(e) {
              e.dataTransfer.setData('text/plain', widget.getAttribute('data-widget-type') || widget.getAttribute('data-template-id'));
              console.log('Drag started:', widget.getAttribute('data-widget-type') || widget.getAttribute('data-template-id'));
            });
            
            // Make widgets clickable as fallback for mobile or when drag doesn't work
            widget.addEventListener('click', function() {
              const type = widget.getAttribute('data-widget-type') || widget.getAttribute('data-template-id');
              console.log('Widget clicked:', type);
              
              // Create and add the element
              const newElement = createNewElement(type);
              if (newElement) {
                canvas.appendChild(newElement);
                
                // Add event listeners for element actions
                setupElementActions(newElement);
              }
            });
            
            widget.setAttribute('draggable', true);
          });
          
          canvas.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          });
          
          canvas.addEventListener('drop', function(e) {
            e.preventDefault();
            const type = e.dataTransfer.getData('text/plain');
            console.log('Element dropped:', type);
            
            // Create new element based on widget type
            const newElement = createNewElement(type);
            if (newElement) {
              canvas.appendChild(newElement);
              
              // Add event listeners for element actions
              setupElementActions(newElement);
            }
          });
          
          // Function to convert RGB to HEX
          function rgbToHex(rgb) {
            if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') {
              return '#ffffff';
            }
            
            // Extract RGB values
            const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (rgbMatch) {
              const r = parseInt(rgbMatch[1]);
              const g = parseInt(rgbMatch[2]);
              const b = parseInt(rgbMatch[3]);
              
              return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            }
            
            // If it's already a hex value or can't be parsed
            return rgb;
          }
          
          // Function to select an element
          function selectElement(element) {
            // Deselect all elements
            document.querySelectorAll('.element').forEach(el => {
              el.classList.remove('selected');
            });
            
            // Select the clicked element
            element.classList.add('selected');
            
            // Show properties panel
            document.getElementById('properties-panel').style.display = 'block';
            
            // Update properties panel with element values
            const elementType = element.getAttribute('data-element-type');
            document.getElementById('element-type').textContent = elementType;
            document.getElementById('element-id').textContent = element.id;
            
            // Set current values in inputs
            const computedStyle = window.getComputedStyle(element);
            document.getElementById('background-color').value = rgbToHex(computedStyle.backgroundColor) || '#ffffff';
            document.getElementById('text-color').value = rgbToHex(computedStyle.color) || '#000000';
            document.getElementById('padding').value = computedStyle.padding || '10px';
            document.getElementById('margin').value = computedStyle.margin || '10px';
          }
          
          // Function to create a new element
          function createNewElement(type) {
            console.log('Creating new element of type:', type);
            const newElement = document.createElement('div');
            newElement.className = 'element';
            newElement.id = type + '-' + Date.now();
            newElement.setAttribute('data-element-type', type);
            
            // Add click handler to select the element
            newElement.addEventListener('click', function(e) {
              if (e.target.closest('.element-actions')) {
                return; // Don't select when clicking on actions
              }
              selectElement(this);
            });
            
            // Add element content based on type
            switch(type) {
              case 'header':
                newElement.innerHTML = '<h2>New Header</h2>';
                break;
              case 'paragraph':
                newElement.innerHTML = '<p>New paragraph text. Click to edit.</p>';
                break;
              case 'image':
                newElement.innerHTML = '<img src="https://via.placeholder.com/300x200" alt="Placeholder Image" style="max-width: 100%;">';
                break;
              case 'button':
                newElement.innerHTML = '<button style="padding: 10px 20px; background-color: #0066ff; color: white; border: none; border-radius: 4px; cursor: pointer;">Click Me</button>';
                break;
              case 'divider':
                newElement.innerHTML = '<hr style="border: 1px solid #e0e0e0; margin: 20px 0;">';
                break;
              case 'spacer':
                newElement.innerHTML = '<div style="height: 50px;"></div>';
                break;
              case 'container':
                newElement.innerHTML = '<div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;"><p>Container element. Drag widgets here.</p></div>';
                break;
              case 'columns':
                newElement.innerHTML = '<div style="display: flex; gap: 20px;"><div style="flex: 1; padding: 10px; border: 1px solid #e0e0e0;">Column 1</div><div style="flex: 1; padding: 10px; border: 1px solid #e0e0e0;">Column 2</div></div>';
                break;
              case 'card':
                newElement.innerHTML = '<div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><h3>Card Title</h3><p>Card content goes here.</p></div>';
                break;
              case 'product':
                // Create a more interactive product widget
                newElement.innerHTML = `
                  <div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px; background-color: #f9f9f9;">
                    <h3 style="margin-top: 0;">Product Widget</h3>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                      <div style="width: 80px; height: 80px; background-color: #eee; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">🛍️</span>
                      </div>
                      <div>
                        <p style="margin: 0 0 5px 0; font-weight: bold;">Product Name</p>
                        <p style="margin: 0; color: #0066ff;">$19.99</p>
                      </div>
                    </div>
                    <button style="background-color: #0066ff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; width: 100%;">Add to Cart</button>
                    <p style="margin-top: 15px; font-size: 12px; color: #666;">This is a Shopify product widget. In the live store, this will display an actual product.</p>
                    <div style="margin-top: 10px;">
                      <label style="display: block; margin-bottom: 5px; font-size: 12px;">Select a product:</label>
                      <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <option>Loading products...</option>
                      </select>
                    </div>
                  </div>
                `;
                
                // Fetch products from Shopify (simulated)
                setTimeout(() => {
                  const select = newElement.querySelector('select');
                  if (select) {
                    select.innerHTML = `
                      <option value="">Select a product...</option>
                      <option value="1">Sample Product 1</option>
                      <option value="2">Sample Product 2</option>
                      <option value="3">Sample Product 3</option>
                    `;
                  }
                }, 1000);
                break;
              case 'collection':
                // Create a more interactive collection widget
                newElement.innerHTML = `
                  <div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px; background-color: #f9f9f9;">
                    <h3 style="margin-top: 0;">Collection Widget</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                      <div style="border: 1px solid #eee; padding: 10px; text-align: center; background-color: white;">
                        <div style="height: 60px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                          <span style="font-size: 20px;">📦</span>
                        </div>
                        <p style="margin: 0; font-size: 12px;">Product 1</p>
                      </div>
                      <div style="border: 1px solid #eee; padding: 10px; text-align: center; background-color: white;">
                        <div style="height: 60px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                          <span style="font-size: 20px;">📦</span>
                        </div>
                        <p style="margin: 0; font-size: 12px;">Product 2</p>
                      </div>
                    </div>
                    <p style="margin-top: 15px; font-size: 12px; color: #666;">This is a Shopify collection widget. In the live store, this will display products from a collection.</p>
                    <div style="margin-top: 10px;">
                      <label style="display: block; margin-bottom: 5px; font-size: 12px;">Select a collection:</label>
                      <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <option>Loading collections...</option>
                      </select>
                    </div>
                  </div>
                `;
                
                // Fetch collections from Shopify (simulated)
                setTimeout(() => {
                  const select = newElement.querySelector('select');
                  if (select) {
                    select.innerHTML = `
                      <option value="">Select a collection...</option>
                      <option value="1">Featured Products</option>
                      <option value="2">New Arrivals</option>
                      <option value="3">Best Sellers</option>
                    `;
                  }
                }, 1000);
                break;
              case 'cart':
                newElement.innerHTML = '<div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;"><h3>Cart Widget</h3><p>This will display the shopping cart.</p></div>';
                break;
              case 'blog':
                newElement.innerHTML = '<div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;"><h3>Blog Widget</h3><p>This will display blog posts.</p><select style="width: 100%; padding: 8px;"><option>Select a blog...</option></select></div>';
                break;
              case 'menu':
                newElement.innerHTML = '<div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;"><h3>Menu Widget</h3><p>This will display a navigation menu.</p><select style="width: 100%; padding: 8px;"><option>Select a menu...</option></select></div>';
                break;
              case 'customer':
                newElement.innerHTML = '<div style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;"><h3>Customer Widget</h3><p>This will display customer information.</p></div>';
                break;
              case 'hero':
                newElement.innerHTML = '<div style="padding: 40px; text-align: center; background-color: #f5f5f5;"><h1>Hero Title</h1><p>Hero description text goes here.</p><button style="padding: 10px 20px; background-color: #0066ff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">Call to Action</button></div>';
                break;
              case 'features':
                newElement.innerHTML = '<div style="padding: 20px;"><h2 style="text-align: center;">Features</h2><div style="display: flex; gap: 20px; margin-top: 20px;"><div style="flex: 1; text-align: center; padding: 20px;"><div style="font-size: 40px;">✨</div><h3>Feature 1</h3><p>Description of feature 1.</p></div><div style="flex: 1; text-align: center; padding: 20px;"><div style="font-size: 40px;">🚀</div><h3>Feature 2</h3><p>Description of feature 2.</p></div><div style="flex: 1; text-align: center; padding: 20px;"><div style="font-size: 40px;">🔒</div><h3>Feature 3</h3><p>Description of feature 3.</p></div></div></div>';
                break;
              case 'testimonials':
                newElement.innerHTML = '<div style="padding: 20px;"><h2 style="text-align: center;">Testimonials</h2><div style="display: flex; gap: 20px; margin-top: 20px;"><div style="flex: 1; padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;"><p>"This product is amazing! I highly recommend it."</p><p style="font-weight: bold;">- John Doe</p></div><div style="flex: 1; padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;"><p>"The best service I have ever experienced."</p><p style="font-weight: bold;">- Jane Smith</p></div></div></div>';
                break;
              case 'cta':
                newElement.innerHTML = '<div style="padding: 40px; text-align: center; background-color: #f5f5f5;"><h2>Ready to get started?</h2><p>Join thousands of satisfied customers today.</p><button style="padding: 10px 20px; background-color: #0066ff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">Sign Up Now</button></div>';
                break;
              default:
                newElement.innerHTML = '<p>New element</p>';
            }
            
            // Add element actions
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'element-actions';
            actionsDiv.innerHTML = '<button class="element-action">Edit</button><button class="element-action">Delete</button>';
            newElement.appendChild(actionsDiv);
            
            return newElement;
          }
          
          // Function to set up element action buttons
          function setupElementActions(element) {
            const actionsDiv = element.querySelector('.element-actions');
            if (!actionsDiv) return;
            
            // Set up delete button
            const deleteBtn = actionsDiv.querySelector('.element-action:nth-child(2)');
            if (deleteBtn) {
              deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent element selection
                if (confirm('Are you sure you want to delete this element?')) {
                  element.parentNode.removeChild(element);
                }
              });
            }
            
            // Set up edit button
            const editBtn = actionsDiv.querySelector('.element-action:nth-child(1)');
            if (editBtn) {
              editBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent element selection
                
                // Select the element
                selectElement(element);
                
                // Get current content (excluding the actions div)
                let content = element.innerHTML;
                const actionsHtml = actionsDiv.outerHTML;
                content = content.replace(actionsHtml, '');
                
                // Create edit dialog
                const dialog = document.createElement('div');
                dialog.className = 'edit-dialog';
                dialog.innerHTML = \`
                  <div class="edit-dialog-content">
                    <h3>Edit Element</h3>
                    <textarea id="element-content" rows="10" style="width: 100%;">\${content}</textarea>
                    <div class="edit-dialog-actions">
                      <button id="cancel-edit">Cancel</button>
                      <button id="save-edit">Save</button>
                    </div>
                  </div>
                \`;
                
                document.body.appendChild(dialog);
                
                // Set up dialog buttons
                document.getElementById('cancel-edit').addEventListener('click', function() {
                  document.body.removeChild(dialog);
                });
                
                document.getElementById('save-edit').addEventListener('click', function() {
                  const newContent = document.getElementById('element-content').value;
                  element.innerHTML = newContent + actionsHtml;
                  document.body.removeChild(dialog);
                });
              });
            }
          }
          
          // Make elements selectable
          canvas.addEventListener('click', function(e) {
            const element = e.target.closest('.element');
            if (element) {
              // Deselect all elements
              document.querySelectorAll('.element').forEach(el => {
                el.classList.remove('selected');
              });
              
              // Select clicked element
              element.classList.add('selected');
              
              // Update properties panel
              document.getElementById('bg-color').value = element.style.backgroundColor || '#ffffff';
              document.getElementById('text-color').value = element.style.color || '#000000';
              document.getElementById('padding').value = element.style.padding || '';
              document.getElementById('margin').value = element.style.margin || '';
              
              // Show element actions
              const actionsDiv = element.querySelector('.element-actions');
              if (actionsDiv) {
                actionsDiv.style.display = 'flex';
              }
            }
          });
          
          // Add double-click to edit content
          canvas.addEventListener('dblclick', function(e) {
            const element = e.target.closest('.element');
            if (element) {
              // Get current content (excluding the actions div)
              let content = element.innerHTML;
              const actionsDiv = element.querySelector('.element-actions');
              if (actionsDiv) {
                content = content.replace(actionsDiv.outerHTML, '');
              }
              
              // Create edit dialog
              const dialog = document.createElement('div');
              dialog.className = 'edit-dialog';
              dialog.innerHTML = \`
                <div class="edit-dialog-content">
                  <h3>Edit Element</h3>
                  <textarea id="element-content" rows="10" style="width: 100%;">\${content}</textarea>
                  <div class="edit-dialog-actions">
                    <button id="cancel-edit">Cancel</button>
                    <button id="save-edit">Save</button>
                  </div>
                </div>
              \`;
              
              document.body.appendChild(dialog);
              
              // Set up dialog buttons
              document.getElementById('cancel-edit').addEventListener('click', function() {
                document.body.removeChild(dialog);
              });
              
              document.getElementById('save-edit').addEventListener('click', function() {
                const newContent = document.getElementById('element-content').value;
                
                // Preserve the actions div
                if (actionsDiv) {
                  element.innerHTML = newContent + actionsDiv.outerHTML;
                } else {
                  element.innerHTML = newContent;
                  
                  // Re-add actions div if it was removed
                  const newActionsDiv = document.createElement('div');
                  newActionsDiv.className = 'element-actions';
                  newActionsDiv.innerHTML = '<button class="element-action">Edit</button><button class="element-action">Delete</button>';
                  element.appendChild(newActionsDiv);
                  
                  // Set up the new actions
                  setupElementActions(element);
                }
                
                document.body.removeChild(dialog);
              });
            }
          });
          
          // Update element styles from properties panel
          document.getElementById('bg-color').addEventListener('input', function(e) {
            const selectedElement = document.querySelector('.element.selected');
            if (selectedElement) {
              selectedElement.style.backgroundColor = e.target.value;
            }
          });
          
          document.getElementById('text-color').addEventListener('input', function(e) {
            const selectedElement = document.querySelector('.element.selected');
            if (selectedElement) {
              selectedElement.style.color = e.target.value;
            }
          });
          
          document.getElementById('padding').addEventListener('input', function(e) {
            const selectedElement = document.querySelector('.element.selected');
            if (selectedElement) {
              selectedElement.style.padding = e.target.value;
            }
          });
          
          document.getElementById('margin').addEventListener('input', function(e) {
            const selectedElement = document.querySelector('.element.selected');
            if (selectedElement) {
              selectedElement.style.margin = e.target.value;
            }
          });
          
          // Toggle sidebar sections
          const sectionHeaders = document.querySelectorAll('.sidebar-section-header');
          sectionHeaders.forEach(header => {
            // Make sure all sections are visible by default
            const content = header.nextElementSibling;
            content.style.display = 'block';
            header.querySelector('span').textContent = '-';
            
            // Add click handler to toggle
            header.addEventListener('click', function() {
              const content = this.nextElementSibling;
              content.style.display = content.style.display === 'none' ? 'block' : 'none';
              this.querySelector('span').textContent = content.style.display === 'none' ? '+' : '-';
            });
          });
          
          // Handle notification close button
          const closeNotificationBtn = document.querySelector('.close-notification');
          if (closeNotificationBtn) {
            closeNotificationBtn.addEventListener('click', function() {
              const notification = this.closest('.notification');
              if (notification) {
                notification.style.display = 'none';
                
                // Remember that the user closed the notification
                localStorage.setItem('templateNotificationClosed', 'true');
              }
            });
            
            // Check if notification was previously closed
            if (localStorage.getItem('templateNotificationClosed') === 'true') {
              const notification = document.querySelector('.notification');
              if (notification) {
                notification.style.display = 'none';
              }
            }
          }
          
          // Function to load page templates from the server
          function loadPageTemplates() {
            fetch(\`/api/page-templates?shop=\${shop}\`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to load page templates');
                }
                return response.json();
              })
              .then(data => {
                console.log('Loaded page templates:', data);
                
                // If we have templates, update the templates section
                if (data && data.templates && data.templates.length > 0) {
                  const templateList = document.querySelector('.template-list');
                  if (templateList) {
                    // Add server templates
                    data.templates.forEach(template => {
                      const templateWidget = document.createElement('div');
                      templateWidget.className = 'widget template-widget';
                      templateWidget.setAttribute('data-template-id', template.id);
                      
                      templateWidget.innerHTML = \`
                        <div class="widget-icon">\${template.icon || '📄'}</div>
                        <div class="widget-label">\${template.name}</div>
                      \`;
                      
                      // Make the template draggable
                      templateWidget.setAttribute('draggable', true);
                      templateWidget.addEventListener('dragstart', function(e) {
                        e.dataTransfer.setData('text/plain', template.id);
                      });
                      
                      // Add click handler
                      templateWidget.addEventListener('click', function() {
                        const newElement = createNewElement(template.id);
                        if (newElement) {
                          canvas.appendChild(newElement);
                          setupElementActions(newElement);
                        }
                      });
                      
                      templateList.appendChild(templateWidget);
                    });
                  }
                }
              })
              .catch(error => {
                console.error('Error loading page templates:', error);
              });
          }
          
          // Try to load page templates
          try {
            loadPageTemplates();
          } catch (error) {
            console.error('Error in loadPageTemplates:', error);
          }
          
          // Load saved page data if available
          fetch(\`/api/pages/\${pageId}?shop=\${shop}\`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to load page data');
              }
              return response.json();
            })
            .then(data => {
              if (data.page && data.page.content && data.page.content.elements) {
                // Clear canvas
                canvas.innerHTML = '';
                
                // Add elements to canvas
                data.page.content.elements.forEach(element => {
                  const newElement = document.createElement('div');
                  newElement.className = 'element';
                  newElement.id = element.id;
                  newElement.setAttribute('data-element-type', element.type);
                  newElement.innerHTML = element.content;
                  
                  // Apply styles
                  Object.entries(element.styles).forEach(([key, value]) => {
                    if (value) {
                      newElement.style[key] = value;
                    }
                  });
                  
                  // Add element actions
                  const actionsDiv = document.createElement('div');
                  actionsDiv.className = 'element-actions';
                  actionsDiv.innerHTML = '<button class="element-action">Edit</button><button class="element-action">Delete</button>';
                  newElement.appendChild(actionsDiv);
                  
                  // Add element to canvas
                  canvas.appendChild(newElement);
                  
                  // Add event listener for delete button
                  const deleteBtn = actionsDiv.querySelector('.element-action:nth-child(2)');
                  deleteBtn.addEventListener('click', function() {
                    canvas.removeChild(newElement);
                  });
                });
                
                // Update page title
                if (data.page.title) {
                  document.querySelector('.builder-title').textContent = 'Page Builder: ' + data.page.title;
                }
              }
            })
            .catch(error => {
              console.error('Error loading page data:', error);
              
              // Try to load from local storage as fallback
              const savedData = localStorage.getItem('page_' + pageId);
              if (savedData) {
                try {
                  const pageData = JSON.parse(savedData);
                  
                  // Clear canvas
                  canvas.innerHTML = '';
                  
                  // Add elements to canvas
                  pageData.elements.forEach(element => {
                    const newElement = document.createElement('div');
                    newElement.className = 'element';
                    newElement.id = element.id;
                    newElement.setAttribute('data-element-type', element.type);
                    newElement.innerHTML = element.content;
                    
                    // Apply styles
                    Object.entries(element.styles).forEach(([key, value]) => {
                      if (value) {
                        newElement.style[key] = value;
                      }
                    });
                    
                    // Add element actions
                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'element-actions';
                    actionsDiv.innerHTML = '<button class="element-action">Edit</button><button class="element-action">Delete</button>';
                    newElement.appendChild(actionsDiv);
                    
                    // Add element to canvas
                    canvas.appendChild(newElement);
                    
                    // Add event listener for delete button
                    const deleteBtn = actionsDiv.querySelector('.element-action:nth-child(2)');
                    deleteBtn.addEventListener('click', function() {
                      canvas.removeChild(newElement);
                    });
                  });
                  
                  // Update page title
                  if (pageData.title) {
                    document.querySelector('.builder-title').textContent = 'Page Builder: ' + pageData.title;
                  }
                  
                  alert('Loaded page data from local storage.');
                } catch (e) {
                  console.error('Error loading from local storage:', e);
                }
              }
            });
        </script>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    console.error('Error rendering builder:', error);
    res.status(500).send('Error rendering builder: ' + error.message);
  }
});

module.exports = router;