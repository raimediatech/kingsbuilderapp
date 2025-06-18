// api/routes/builder.js - Builder routes
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { getUserByEmail } = require('../services/auth');
const { PERMISSIONS } = require('../models/user');

// Builder page route
router.get('/:pageId', async (req, res) => {
  try {
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
    
    // Check user permissions if email is provided
    let canEdit = true; // Default to true if no user email provided
    
    if (userEmail) {
      try {
        const user = await getUserByEmail(userEmail, shop);
        
        if (!user) {
          return res.status(403).send('Access denied: User not found');
        }
        
        if (!user.active) {
          return res.status(403).send('Access denied: User account is not active');
        }
        
        // Check if user has permission to edit pages
        canEdit = user.hasPermission(PERMISSIONS.EDIT_PAGE);
        
        if (!canEdit && !user.hasPermission(PERMISSIONS.VIEW_PAGES)) {
          return res.status(403).send('Access denied: Insufficient permissions');
        }
      } catch (error) {
        console.error('Error checking user permissions:', error);
        // Continue with default permissions
      }
    }

    // Send the builder HTML
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KingsBuilder - Page Builder</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          :root {
            --primary-color: #000000;
            --primary-hover: #333333;
            --text-color: #333333;
            --bg-color: #ffffff;
            --card-bg: #f9f9f9;
            --border-color: #e5e5e5;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --danger-color: #ef4444;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .builder-header {
            background-color: #000;
            color: white;
            padding: 10px 20px;
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

          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 16px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
            text-decoration: none;
          }

          .btn:hover {
            background-color: #444;
          }

          .btn-primary {
            background-color: #fff;
            color: #000;
          }

          .btn-primary:hover {
            background-color: #f0f0f0;
          }

          .btn i {
            margin-right: 6px;
          }

          .builder-container {
            display: flex;
            flex: 1;
            overflow: hidden;
          }

          .sidebar {
            width: 300px;
            background-color: #f5f5f5;
            border-right: 1px solid #ddd;
            overflow-y: auto;
            padding: 20px;
          }

          .sidebar-section {
            margin-bottom: 20px;
          }

          .sidebar-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
          }

          .element-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .element-item {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
          }

          .element-item:hover {
            border-color: #000;
            transform: translateY(-2px);
          }

          .element-item i {
            font-size: 20px;
            margin-bottom: 5px;
            display: block;
          }

          .element-item span {
            font-size: 12px;
            display: block;
          }

          .canvas {
            flex: 1;
            background-color: #fff;
            overflow-y: auto;
            padding: 20px;
            position: relative;
          }

          .canvas-content {
            min-height: 100%;
            border: 1px dashed #ddd;
            padding: 20px;
            position: relative;
          }

          .placeholder {
            text-align: center;
            padding: 40px;
            color: #999;
          }

          .placeholder i {
            font-size: 48px;
            margin-bottom: 10px;
          }

          .placeholder h3 {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .placeholder p {
            font-size: 14px;
          }

          .properties-panel {
            width: 300px;
            background-color: #f5f5f5;
            border-left: 1px solid #ddd;
            overflow-y: auto;
            padding: 20px;
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 5px;
          }

          .form-control {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }

          .form-control:focus {
            border-color: #000;
            outline: none;
          }

          .color-picker {
            display: flex;
            gap: 5px;
          }

          .color-option {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid transparent;
          }

          .color-option.active {
            border-color: #000;
          }

          .loading {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #000;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="builder-header">
          <div class="builder-title">
            <i class="fas fa-edit"></i> Page Builder
          </div>
          <div class="device-switcher" style="display: flex; align-items: center; margin-right: 20px;">
            <span style="margin-right: 10px; font-size: 12px; color: #666;">Preview:</span>
            <button class="device-btn active" data-device="desktop" style="background: none; border: none; font-size: 18px; margin: 0 5px; cursor: pointer; color: #000;">
              <i class="fas fa-desktop"></i>
            </button>
            <button class="device-btn" data-device="tablet" style="background: none; border: none; font-size: 18px; margin: 0 5px; cursor: pointer; color: #666;">
              <i class="fas fa-tablet-alt"></i>
            </button>
            <button class="device-btn" data-device="mobile" style="background: none; border: none; font-size: 18px; margin: 0 5px; cursor: pointer; color: #666;">
              <i class="fas fa-mobile-alt"></i>
            </button>
          </div>
          <div class="template-selector" style="display: flex; align-items: center; margin-right: 20px;">
            <span style="margin-right: 10px; font-size: 12px; color: #666;">Template:</span>
            <select id="page-template-select" style="padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
              <option value="">Loading templates...</option>
            </select>
          </div>
          <div class="builder-actions">
            <button class="btn" id="preview-btn">
              <i class="fas fa-eye"></i> Preview
            </button>
            ${canEdit ? `
            <button class="btn" id="save-btn">
              <i class="fas fa-save"></i> Save
            </button>
            <button class="btn btn-primary" id="publish-btn">
              <i class="fas fa-globe"></i> Publish
            </button>
            ` : `
            <button class="btn" disabled title="You don't have permission to edit">
              <i class="fas fa-save"></i> Save
            </button>
            <button class="btn btn-primary" disabled title="You don't have permission to publish">
              <i class="fas fa-globe"></i> Publish
            </button>
            `}
            <a href="/dashboard?shop=${shop}" class="btn">
              <i class="fas fa-times"></i> Exit
            </a>
          </div>
        </div>

        <div class="builder-container">
          <div class="sidebar">
            <div class="sidebar-section">
              <h3 class="sidebar-title">Elements</h3>
              <div class="element-list">
                <div class="element-item" draggable="true" data-type="heading">
                  <i class="fas fa-heading"></i>
                  <span>Heading</span>
                </div>
                <div class="element-item" draggable="true" data-type="text">
                  <i class="fas fa-font"></i>
                  <span>Text</span>
                </div>
                <div class="element-item" draggable="true" data-type="image">
                  <i class="fas fa-image"></i>
                  <span>Image</span>
                </div>
                <div class="element-item" draggable="true" data-type="button">
                  <i class="fas fa-square"></i>
                  <span>Button</span>
                </div>
                <div class="element-item" draggable="true" data-type="divider">
                  <i class="fas fa-minus"></i>
                  <span>Divider</span>
                </div>
                <div class="element-item" draggable="true" data-type="spacer">
                  <i class="fas fa-arrows-alt-v"></i>
                  <span>Spacer</span>
                </div>
              </div>
            </div>

            <div class="sidebar-section">
              <h3 class="sidebar-title">Sections</h3>
              <div class="element-list">
                <div class="element-item" draggable="true" data-type="hero">
                  <i class="fas fa-star"></i>
                  <span>Hero</span>
                </div>
                <div class="element-item" draggable="true" data-type="features">
                  <i class="fas fa-th-large"></i>
                  <span>Features</span>
                </div>
                <div class="element-item" draggable="true" data-type="gallery">
                  <i class="fas fa-images"></i>
                  <span>Gallery</span>
                </div>
                <div class="element-item" draggable="true" data-type="testimonial">
                  <i class="fas fa-quote-right"></i>
                  <span>Testimonial</span>
                </div>
                <div class="element-item" draggable="true" data-type="contact">
                  <i class="fas fa-envelope"></i>
                  <span>Contact</span>
                </div>
                <div class="element-item" draggable="true" data-type="footer">
                  <i class="fas fa-shoe-prints"></i>
                  <span>Footer</span>
                </div>
              </div>
            </div>
            
            <div class="sidebar-section">
              <h3 class="sidebar-title">Templates</h3>
              <div class="templates-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <select id="template-category" style="flex: 1; padding: 5px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px;">
                  <option value="all">All Templates</option>
                  <option value="hero">Hero</option>
                  <option value="features">Features</option>
                  <option value="gallery">Gallery</option>
                  <option value="testimonial">Testimonial</option>
                  <option value="contact">Contact</option>
                  <option value="footer">Footer</option>
                  <option value="custom">Custom</option>
                </select>
                <button id="save-template-btn" style="background-color: #000; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  <i class="fas fa-save"></i>
                </button>
              </div>
              <div id="templates-list" class="templates-list" style="max-height: 300px; overflow-y: auto;">
                <div class="loading-templates" style="text-align: center; padding: 20px;">
                  <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid #000; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                  <p style="margin-top: 10px; color: #666;">Loading templates...</p>
                </div>
              </div>
            </div>
            
            <div class="sidebar-section">
              <h3 class="sidebar-title">Shopify REST Widgets</h3>
              <div class="element-list">
                <div class="element-item" draggable="true" data-type="product">
                  <i class="fas fa-shopping-bag"></i>
                  <span>Product</span>
                </div>
                <div class="element-item" draggable="true" data-type="collection">
                  <i class="fas fa-layer-group"></i>
                  <span>Collection</span>
                </div>
                <div class="element-item" draggable="true" data-type="blog-post">
                  <i class="fas fa-blog"></i>
                  <span>Blog Post</span>
                </div>
                <div class="element-item" draggable="true" data-type="cart">
                  <i class="fas fa-shopping-cart"></i>
                  <span>Cart</span>
                </div>
                <div class="element-item" draggable="true" data-type="customer">
                  <i class="fas fa-user"></i>
                  <span>Customer</span>
                </div>
                <div class="element-item" draggable="true" data-type="order">
                  <i class="fas fa-receipt"></i>
                  <span>Order</span>
                </div>
              </div>
            </div>
            
            <div class="sidebar-section">
              <h3 class="sidebar-title">Custom CSS</h3>
              <div class="css-editor-container">
                <p style="margin-bottom: 10px; font-size: 12px; color: #666;">Add custom CSS to enhance your page styling.</p>
                <textarea id="custom-css-editor" style="width: 100%; height: 200px; font-family: monospace; font-size: 12px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
                <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                  <button id="apply-css-btn" style="background-color: #000; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Apply CSS</button>
                </div>
              </div>
            </div>
          </div>

          <div class="canvas">
            <div class="canvas-content" id="canvas">
              <div class="placeholder">
                <i class="fas fa-plus-circle"></i>
                <h3>Your Canvas is Empty</h3>
                <p>Drag and drop elements from the sidebar to start building your page.</p>
              </div>
            </div>
          </div>

          <div class="properties-panel">
            <h3 class="sidebar-title">Properties</h3>
            <div id="no-selection" style="text-align: center; color: #999; padding: 20px;">
              <i class="fas fa-info-circle" style="font-size: 24px; margin-bottom: 10px;"></i>
              <p>Select an element to edit its properties.</p>
            </div>

            <div id="properties-form" style="display: none;">
              <div class="form-group">
                <label class="form-label">Element Type</label>
                <input type="text" class="form-control" id="element-type" disabled>
              </div>

              <div class="form-group">
                <label class="form-label">Content</label>
                <textarea class="form-control" id="element-content" rows="3"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Font Size</label>
                <select class="form-control" id="element-font-size">
                  <option value="12px">Small (12px)</option>
                  <option value="16px" selected>Medium (16px)</option>
                  <option value="24px">Large (24px)</option>
                  <option value="32px">X-Large (32px)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Text Color</label>
                <div class="color-picker">
                  <div class="color-option active" style="background-color: #000000;" data-color="#000000"></div>
                  <div class="color-option" style="background-color: #ffffff; border: 1px solid #ddd;" data-color="#ffffff"></div>
                  <div class="color-option" style="background-color: #ff0000;" data-color="#ff0000"></div>
                  <div class="color-option" style="background-color: #00ff00;" data-color="#00ff00"></div>
                  <div class="color-option" style="background-color: #0000ff;" data-color="#0000ff"></div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Background Color</label>
                <div class="color-picker">
                  <div class="color-option" style="background-color: #000000;" data-color="#000000"></div>
                  <div class="color-option active" style="background-color: #ffffff; border: 1px solid #ddd;" data-color="#ffffff"></div>
                  <div class="color-option" style="background-color: #ff0000;" data-color="#ff0000"></div>
                  <div class="color-option" style="background-color: #00ff00;" data-color="#00ff00"></div>
                  <div class="color-option" style="background-color: #0000ff;" data-color="#0000ff"></div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Alignment</label>
                <div style="display: flex; gap: 10px;">
                  <button class="btn active" data-align="left"><i class="fas fa-align-left"></i></button>
                  <button class="btn" data-align="center"><i class="fas fa-align-center"></i></button>
                  <button class="btn" data-align="right"><i class="fas fa-align-right"></i></button>
                </div>
              </div>

              <div class="form-group">
                <button class="btn" style="background-color: var(--danger-color); width: 100%;">
                  <i class="fas fa-trash"></i> Delete Element
                </button>
              </div>
            </div>
          </div>
        </div>

        <script>
          // Page data
          const pageId = '${pageId}';
          const shop = '${shop}';
          const userEmail = '${userEmail || ""}';

          // Notification function
          function showNotification(message, type = 'info') {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.kb-notification');
            existingNotifications.forEach(n => n.remove());
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = \`kb-notification kb-notification-\${type}\`;
            notification.innerHTML = \`
              <div class="kb-notification-content">
                <span class="kb-notification-message">\${message}</span>
                <button class="kb-notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
              </div>
            \`;
            
            // Add styles
            notification.style.cssText = \`
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 10000;
              background: \${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
              color: \${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#0c5460'};
              border: 1px solid \${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : type === 'warning' ? '#ffeaa7' : '#bee5eb'};
              border-radius: 4px;
              padding: 12px 16px;
              max-width: 400px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              animation: slideIn 0.3s ease-out;
            \`;
            
            // Add to page
            document.body.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
              if (notification.parentElement) {
                notification.remove();
              }
            }, 5000);
          }
          
          // Add notification styles
          if (!document.getElementById('kb-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'kb-notification-styles';
            style.textContent = \`
              @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
              .kb-notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
              .kb-notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                margin-left: 12px;
                opacity: 0.7;
              }
              .kb-notification-close:hover {
                opacity: 1;
              }
            \`;
            document.head.appendChild(style);
          }

          // Save button functionality
          ${canEdit ? `
          document.getElementById('save-btn').addEventListener('click', function() {
            // Get all elements from the canvas
            const elements = Array.from(document.querySelectorAll('#canvas [data-element-type]'));
          ` : `
          // Save button disabled due to permissions
          if (document.getElementById('save-btn')) {
            document.getElementById('save-btn').addEventListener('click', function() {
              alert('You do not have permission to save changes.');
            });
          }
          `}
          
          ${canEdit ? `
          // Continue with save functionality
          ` : `
          // Disabled functionality placeholder
          function() {
            const elements = [];
          `}
          
          // Create page data object
          const pageData = {
              id: pageId,
              title: document.querySelector('.builder-title').textContent.trim().replace('Page Builder', '').trim() || 'Untitled Page',
              content: elements.map(el => {
                return {
                  type: el.getAttribute('data-element-type'),
                  content: el.textContent,
                  html: el.outerHTML,
                  styles: {
                    backgroundColor: el.style.backgroundColor,
                    color: el.style.color,
                    padding: el.style.padding,
                    margin: el.style.margin,
                    border: el.style.border
                  }
                };
              }),
              published: false
            };
            
            // Show loading indicator
            const loadingEl = document.createElement('div');
            loadingEl.className = 'loading';
            loadingEl.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loadingEl);
            
            // Send data to server
            fetch(`/api/pages/${pageId}?shop=${shop}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'x-user-email': userEmail || ''
              },
              body: JSON.stringify(pageData)
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to save page');
              }
              return response.json();
            })
            .then(data => {
              // Remove loading indicator
              document.body.removeChild(loadingEl);
              showNotification('Page saved successfully!', 'success');
            })
            .catch(error => {
              console.error('Error saving page:', error);
              // Remove loading indicator
              document.body.removeChild(loadingEl);
              
              // Fallback to local storage if API fails
              localStorage.setItem(`page_${pageId}`, JSON.stringify(pageData));
              showNotification('Page saved locally (API unavailable)', 'warning');
            });
          });

          // Publish button functionality
          ${canEdit ? `
          document.getElementById('publish-btn').addEventListener('click', function() {
            // Get all elements from the canvas
            const elements = Array.from(document.querySelectorAll('#canvas [data-element-type]'));
          ` : `
          // Publish button disabled due to permissions
          if (document.getElementById('publish-btn')) {
            document.getElementById('publish-btn').addEventListener('click', function() {
              alert('You do not have permission to publish pages.');
            });
          }
          `}
            
            // Create page data object
            const pageData = {
              id: pageId,
              title: document.querySelector('.builder-title').textContent.trim().replace('Page Builder', '').trim() || 'Untitled Page',
              content: elements.map(el => {
                return {
                  type: el.getAttribute('data-element-type'),
                  content: el.textContent,
                  html: el.outerHTML,
                  styles: {
                    backgroundColor: el.style.backgroundColor,
                    color: el.style.color,
                    padding: el.style.padding,
                    margin: el.style.margin,
                    border: el.style.border
                  }
                };
              }),
              published: true
            };
            
            // Show loading indicator
            const loadingEl = document.createElement('div');
            loadingEl.className = 'loading';
            loadingEl.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loadingEl);
            
            // Send data to server
            fetch(`/api/pages/${pageId}/publish?shop=${shop}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-email': userEmail || ''
              },
              body: JSON.stringify(pageData)
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to publish page');
              }
              return response.json();
            })
            .then(data => {
              // Remove loading indicator
              document.body.removeChild(loadingEl);
              alert('Page published successfully!');
            })
            .catch(error => {
              console.error('Error publishing page:', error);
              // Remove loading indicator
              document.body.removeChild(loadingEl);
              alert('Failed to publish page. Please try again.');
            });
          });

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
                title: document.querySelector('.builder-title').textContent.trim().replace('Page Builder', '').trim() || 'Untitled Page',
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
            
            // Create a new window for preview
            const previewWindow = window.open('', '_blank');
            
            // Generate HTML content for preview
            let previewHtml = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview: ${pageData.title}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <style>
                  body {
                    font-family: 'Inter', sans-serif;
                    margin: 0;
                    padding: 0;
                    line-height: 1.6;
                  }
                  .preview-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                  }
                  .preview-header {
                    background-color: #f5f5f5;
                    padding: 15px 20px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  }
                  .preview-title {
                    margin: 0;
                    font-size: 18px;
                  }
                  .preview-actions {
                    display: flex;
                    gap: 10px;
                  }
                  .preview-btn {
                    padding: 8px 16px;
                    background-color: #000;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                  }
                  .preview-btn.secondary {
                    background-color: #f5f5f5;
                    color: #000;
                    border: 1px solid #ddd;
                  }
                  .preview-device-selector {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                    padding: 10px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                  }
                  .device-btn {
                    padding: 8px 16px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    margin: 0 5px;
                    border-radius: 4px;
                    font-size: 14px;
                  }
                  .device-btn.active {
                    background-color: #e0e0e0;
                    font-weight: bold;
                  }
                  .preview-content {
                    transition: max-width 0.3s ease;
                    margin: 0 auto;
                    border: 1px solid #eee;
                    min-height: 500px;
                  }
                  .preview-content.desktop {
                    max-width: 100%;
                  }
                  .preview-content.tablet {
                    max-width: 768px;
                  }
                  .preview-content.mobile {
                    max-width: 375px;
                  }
                </style>
              </head>
              <body>
                <div class="preview-header">
                  <h1 class="preview-title">Preview: ${pageData.title}</h1>
                  <div class="preview-actions">
                    <button class="preview-btn secondary" onclick="window.close()">Close Preview</button>
                    <button class="preview-btn" onclick="window.print()">Print</button>
                  </div>
                </div>
                
                <div class="preview-device-selector">
                  <button class="device-btn active" data-device="desktop">Desktop</button>
                  <button class="device-btn" data-device="tablet">Tablet</button>
                  <button class="device-btn" data-device="mobile">Mobile</button>
                </div>
                
                <div class="preview-container">
                  <div class="preview-content desktop">
            `;
            
            // Add page content
            pageData.content.forEach(element => {
              if (element.html) {
                previewHtml += element.html;
              }
            });
            
            // Close HTML tags
            previewHtml += `
                  </div>
                </div>
                
                <script>
                  // Device preview functionality
                  document.querySelectorAll('.device-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                      // Remove active class from all buttons
                      document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
                      
                      // Add active class to clicked button
                      this.classList.add('active');
                      
                      // Get device type
                      const device = this.getAttribute('data-device');
                      
                      // Update preview content class
                      const previewContent = document.querySelector('.preview-content');
                      previewContent.className = 'preview-content ' + device;
                    });
                  });
                </script>
              </body>
              </html>
            `;
            
            // Write the HTML to the new window
            previewWindow.document.open();
            previewWindow.document.write(previewHtml);
            previewWindow.document.close();
          });

          // Load templates
          function loadTemplates(category = 'all') {
            const templatesList = document.getElementById('templates-list');
            
            // Show loading state
            templatesList.innerHTML = `
              <div class="loading-templates" style="text-align: center; padding: 20px;">
                <div class="spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid #000; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p style="margin-top: 10px; color: #666;">Loading templates...</p>
              </div>
            `;
            
            // Fetch templates from API
            fetch('/api/templates?shop=${shop}')
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to load templates');
                }
                return response.json();
              })
              .then(data => {
                const templates = data.templates || [];
                
                // Filter templates by category if needed
                const filteredTemplates = category === 'all' 
                  ? templates 
                  : templates.filter(t => t.category === category);
                
                if (filteredTemplates.length === 0) {
                  templatesList.innerHTML = `
                    <div class="empty-templates" style="text-align: center; padding: 20px;">
                      <i class="fas fa-folder-open" style="font-size: 24px; color: #ddd; margin-bottom: 10px;"></i>
                      <p style="color: #666;">No templates found</p>
                    </div>
                  `;
                  return;
                }
                
                // Render templates
                templatesList.innerHTML = '';
                
                filteredTemplates.forEach(template => {
                  const templateEl = document.createElement('div');
                  templateEl.className = 'template-item';
                  templateEl.setAttribute('data-id', template.id || template._id);
                  templateEl.setAttribute('draggable', 'true');
                  templateEl.style.padding = '10px';
                  templateEl.style.marginBottom = '10px';
                  templateEl.style.border = '1px solid #eee';
                  templateEl.style.borderRadius = '4px';
                  templateEl.style.cursor = 'grab';
                  
                  // Template content
                  templateEl.innerHTML = `
                    <div style="display: flex; align-items: center;">
                      <div style="width: 40px; height: 40px; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center; margin-right: 10px; border-radius: 4px;">
                        <i class="fas fa-${getCategoryIcon(template.category)}" style="color: #666;"></i>
                      </div>
                      <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; font-size: 14px;">${template.name}</h4>
                        <p style="margin: 0; font-size: 12px; color: #666;">${template.description || template.category}</p>
                      </div>
                      <button class="template-use-btn" style="background-color: #f5f5f5; color: #000; border: none; padding: 5px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Use</button>
                    </div>
                  `;
                  
                  // Add to list
                  templatesList.appendChild(templateEl);
                  
                  // Add event listener for "Use" button
                  const useBtn = templateEl.querySelector('.template-use-btn');
                  if (useBtn) {
                    useBtn.addEventListener('click', function(e) {
                      e.stopPropagation();
                      useTemplate(template);
                    });
                  }
                  
                  // Add drag event listeners
                  templateEl.addEventListener('dragstart', function(e) {
                    e.dataTransfer.setData('application/json', JSON.stringify(template));
                    e.dataTransfer.setData('text/plain', 'template');
                  });
                });
              })
              .catch(error => {
                console.error('Error loading templates:', error);
                
                templatesList.innerHTML = `
                  <div class="error-templates" style="text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #d9534f; margin-bottom: 10px;"></i>
                    <p style="color: #d9534f;">Failed to load templates</p>
                    <button id="retry-templates-btn" style="background-color: #000; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px; font-size: 12px;">Retry</button>
                  </div>
                `;
                
                // Add event listener for retry button
                const retryBtn = document.getElementById('retry-templates-btn');
                if (retryBtn) {
                  retryBtn.addEventListener('click', function() {
                    loadTemplates(category);
                  });
                }
              });
          }
          
          // Get icon for template category
          function getCategoryIcon(category) {
            switch(category) {
              case 'hero': return 'star';
              case 'features': return 'th-large';
              case 'gallery': return 'images';
              case 'testimonial': return 'quote-right';
              case 'contact': return 'envelope';
              case 'footer': return 'shoe-prints';
              case 'custom': return 'magic';
              default: return 'puzzle-piece';
            }
          }
          
          // Use template
          function useTemplate(template) {
            // Remove placeholder if it exists
            const placeholder = canvas.querySelector('.placeholder');
            if (placeholder) {
              canvas.removeChild(placeholder);
            }
            
            // Create elements from template content
            if (template.content && Array.isArray(template.content)) {
              template.content.forEach(item => {
                let newElement;
                
                if (item.html) {
                  // Create wrapper element
                  newElement = document.createElement('div');
                  newElement.innerHTML = item.html;
                  newElement.setAttribute('data-element-type', item.type || 'section');
                  newElement.style.margin = '10px 0';
                  newElement.style.border = '1px dashed #ccc';
                  newElement.style.cursor = 'pointer';
                  
                  // Make the element selectable
                  newElement.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectElement(this);
                  });

                  // Add to canvas
                  canvas.appendChild(newElement);
                  
                  // Make elements draggable for reordering
                  makeCanvasElementsDraggable();
                }
              });
            }
          }
          
          // Save current selection as template
          function saveAsTemplate() {
            // Check if an element is selected
            if (!selectedElement) {
              alert('Please select an element to save as template');
              return;
            }
            
            // Create modal for template details
            const modal = document.createElement('div');
            modal.className = 'template-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';
            
            // Modal content
            modal.innerHTML = `
              <div style="background-color: #fff; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%;">
                <h3 style="margin-top: 0;">Save as Template</h3>
                <div style="margin-bottom: 15px;">
                  <label for="template-name" style="display: block; margin-bottom: 5px; font-weight: bold;">Name</label>
                  <input type="text" id="template-name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Enter template name">
                </div>
                <div style="margin-bottom: 15px;">
                  <label for="template-description" style="display: block; margin-bottom: 5px; font-weight: bold;">Description</label>
                  <textarea id="template-description" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; min-height: 80px;" placeholder="Enter template description"></textarea>
                </div>
                <div style="margin-bottom: 20px;">
                  <label for="template-category" style="display: block; margin-bottom: 5px; font-weight: bold;">Category</label>
                  <select id="template-category-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="custom">Custom</option>
                    <option value="hero">Hero</option>
                    <option value="features">Features</option>
                    <option value="gallery">Gallery</option>
                    <option value="testimonial">Testimonial</option>
                    <option value="contact">Contact</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                  <button id="cancel-template-btn" style="padding: 8px 16px; background-color: #f5f5f5; color: #000; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Cancel</button>
                  <button id="save-template-confirm-btn" style="padding: 8px 16px; background-color: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                </div>
              </div>
            `;
            
            // Add modal to body
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('cancel-template-btn').addEventListener('click', function() {
              document.body.removeChild(modal);
            });
            
            document.getElementById('save-template-confirm-btn').addEventListener('click', function() {
              const name = document.getElementById('template-name').value.trim();
              const description = document.getElementById('template-description').value.trim();
              const category = document.getElementById('template-category-select').value;
              
              if (!name) {
                alert('Please enter a template name');
                return;
              }
              
              // Create template data
              const templateData = {
                name,
                description,
                category,
                content: [{
                  type: selectedElement.getAttribute('data-element-type') || 'section',
                  html: selectedElement.outerHTML
                }]
              };
              
              // Show loading state
              this.innerHTML = '<div class="spinner" style="border: 2px solid #f3f3f3; border-top: 2px solid #fff; border-radius: 50%; width: 12px; height: 12px; animation: spin 1s linear infinite; display: inline-block; margin-right: 5px;"></div> Saving...';
              this.disabled = true;
              
              // Save template to API
              fetch('/api/templates?shop=${shop}', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(templateData)
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to save template');
                }
                return response.json();
              })
              .then(data => {
                // Close modal
                document.body.removeChild(modal);
                
                // Show success message
                alert('Template saved successfully!');
                
                // Reload templates
                loadTemplates(document.getElementById('template-category').value);
              })
              .catch(error => {
                console.error('Error saving template:', error);
                alert('Failed to save template. Please try again.');
                
                // Reset button
                this.innerHTML = 'Save';
                this.disabled = false;
              });
            });
          }
          
          // Initialize templates
          loadTemplates();
          
          // Add event listener for template category select
          document.getElementById('template-category').addEventListener('change', function() {
            loadTemplates(this.value);
          });
          
          // Add event listener for save template button
          document.getElementById('save-template-btn').addEventListener('click', function() {
            saveAsTemplate();
          });
          
          // Page template functionality
          let pageTemplates = [];
          let selectedTemplate = '';
          
          // Load page templates
          function loadPageTemplates() {
            const templateSelect = document.getElementById('page-template-select');
            
            // Fetch templates from API
            fetch('/api/page-templates?shop=${shop}')
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to load page templates');
                }
                return response.json();
              })
              .then(data => {
                pageTemplates = data.templates || [];
                
                // Clear select options
                templateSelect.innerHTML = '';
                
                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select a template';
                templateSelect.appendChild(defaultOption);
                
                // Add template options
                pageTemplates.forEach(template => {
                  const option = document.createElement('option');
                  option.value = template.key;
                  option.textContent = template.name;
                  templateSelect.appendChild(option);
                });
                
                // Set selected template if available in page data
                if (pageData.template) {
                  templateSelect.value = pageData.template;
                  selectedTemplate = pageData.template;
                }
              })
              .catch(error => {
                console.error('Error loading page templates:', error);
                templateSelect.innerHTML = '<option value="">Error loading templates</option>';
              });
          }
          
          // Handle template selection
          document.getElementById('page-template-select').addEventListener('change', function() {
            selectedTemplate = this.value;
            
            // Update page data
            pageData.template = selectedTemplate;
            
            // Show notification
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '4px';
            notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            notification.style.zIndex = '9999';
            notification.textContent = 'Template selected. Changes will apply when page is published.';
            
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
              document.body.removeChild(notification);
            }, 3000);
          });
          
          // Initialize page templates
          loadPageTemplates();
          
          // Custom CSS functionality
          let customStylesheet = null;
          
          // Create a style element for custom CSS
          function createCustomStylesheet() {
            if (!customStylesheet) {
              customStylesheet = document.createElement('style');
              customStylesheet.id = 'custom-page-css';
              document.head.appendChild(customStylesheet);
            }
            return customStylesheet;
          }
          
          // Apply custom CSS
          document.getElementById('apply-css-btn').addEventListener('click', function() {
            const cssContent = document.getElementById('custom-css-editor').value;
            const stylesheet = createCustomStylesheet();
            
            try {
              // Apply the CSS
              stylesheet.textContent = cssContent;
              
              // Show success message
              this.textContent = 'Applied!';
              this.style.backgroundColor = '#4CAF50';
              
              // Reset button after 2 seconds
              setTimeout(() => {
                this.textContent = 'Apply CSS';
                this.style.backgroundColor = '#000';
              }, 2000);
            } catch (error) {
              console.error('Error applying CSS:', error);
              
              // Show error message
              this.textContent = 'Error!';
              this.style.backgroundColor = '#F44336';
              
              // Reset button after 2 seconds
              setTimeout(() => {
                this.textContent = 'Apply CSS';
                this.style.backgroundColor = '#000';
              }, 2000);
            }
          });
          
          // Save CSS with page data
          const originalSaveFunction = handleSave;
          handleSave = function() {
            // Get custom CSS
            const customCss = document.getElementById('custom-css-editor').value;
            
            // Add CSS to page data
            pageData.customCss = customCss;
            
            // Call original save function
            return originalSaveFunction();
          };
          
          // Enhanced drag and drop functionality with reordering
          const elements = document.querySelectorAll('.element-item');
          const canvas = document.getElementById('canvas');
          
          // Track drag operation type
          let dragOperation = '';
          let draggedElement = null;
          let dropIndicator = null;
          
          // Create drop indicator
          function createDropIndicator() {
            if (!dropIndicator) {
              dropIndicator = document.createElement('div');
              dropIndicator.className = 'drop-indicator';
              dropIndicator.style.height = '3px';
              dropIndicator.style.backgroundColor = '#007bff';
              dropIndicator.style.margin = '0';
              dropIndicator.style.display = 'none';
              dropIndicator.style.position = 'absolute';
              dropIndicator.style.width = '100%';
              dropIndicator.style.zIndex = '999';
              document.body.appendChild(dropIndicator);
            }
            return dropIndicator;
          }
          
          // Show drop indicator at position
          function showDropIndicator(y, targetElement) {
            const indicator = createDropIndicator();
            const rect = targetElement.getBoundingClientRect();
            const middleY = rect.top + rect.height / 2;
            
            if (y < middleY) {
              // Show above
              indicator.style.top = `${rect.top}px`;
            } else {
              // Show below
              indicator.style.top = `${rect.bottom}px`;
            }
            
            indicator.style.left = `${rect.left}px`;
            indicator.style.width = `${rect.width}px`;
            indicator.style.display = 'block';
          }
          
          // Hide drop indicator
          function hideDropIndicator() {
            if (dropIndicator) {
              dropIndicator.style.display = 'none';
            }
          }
          
          // Add draggable attribute to canvas elements
          function makeCanvasElementsDraggable() {
            const canvasElements = canvas.querySelectorAll('[data-element-type]');
            canvasElements.forEach(el => {
              if (!el.hasAttribute('draggable')) {
                el.setAttribute('draggable', 'true');
                
                el.addEventListener('dragstart', function(e) {
                  dragOperation = 'reorder';
                  draggedElement = this;
                  e.dataTransfer.setData('text/plain', 'reorder');
                  
                  // Add visual feedback
                  setTimeout(() => {
                    this.style.opacity = '0.4';
                  }, 0);
                });
                
                el.addEventListener('dragend', function() {
                  this.style.opacity = '1';
                  hideDropIndicator();
                  draggedElement = null;
                  dragOperation = '';
                });
              }
            });
          }

          // Initialize draggable elements from sidebar
          elements.forEach(element => {
            element.addEventListener('dragstart', function(e) {
              dragOperation = 'add';
              e.dataTransfer.setData('text/plain', this.getAttribute('data-type'));
            });
            
            element.addEventListener('dragend', function() {
              dragOperation = '';
              hideDropIndicator();
            });
          });

          // Canvas drag events
          canvas.addEventListener('dragover', function(e) {
            e.preventDefault();
            
            // If we're reordering, show drop indicator
            if (dragOperation === 'reorder' && draggedElement) {
              const targetElement = e.target.closest('[data-element-type]');
              if (targetElement && targetElement !== draggedElement) {
                showDropIndicator(e.clientY, targetElement);
              } else {
                hideDropIndicator();
              }
            }
          });
          
          canvas.addEventListener('dragleave', function(e) {
            hideDropIndicator();
          });

          canvas.addEventListener('drop', function(e) {
            e.preventDefault();
            hideDropIndicator();
            
            const type = e.dataTransfer.getData('text/plain');
            
            // Handle reordering
            if (type === 'reorder' && draggedElement) {
              const targetElement = e.target.closest('[data-element-type]');
              
              if (targetElement && targetElement !== draggedElement) {
                const rect = targetElement.getBoundingClientRect();
                const middleY = rect.top + rect.height / 2;
                
                if (e.clientY < middleY) {
                  // Insert before target
                  canvas.insertBefore(draggedElement, targetElement);
                } else {
                  // Insert after target
                  canvas.insertBefore(draggedElement, targetElement.nextSibling);
                }
              }
              
              return;
            }

            // Remove placeholder if it exists
            const placeholder = canvas.querySelector('.placeholder');
            if (placeholder) {
              canvas.removeChild(placeholder);
            }

            // Create element based on type
            let newElement;

            switch(type) {
              case 'heading':
                newElement = document.createElement('h2');
                newElement.textContent = 'Heading Text';
                newElement.style.padding = '10px';
                newElement.style.margin = '10px 0';
                newElement.style.border = '1px dashed #ccc';
                break;
              case 'text':
                newElement = document.createElement('p');
                newElement.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.';
                newElement.style.padding = '10px';
                newElement.style.margin = '10px 0';
                newElement.style.border = '1px dashed #ccc';
                break;
              case 'image':
                newElement = document.createElement('div');
                newElement.innerHTML = `
                  <div class="image-widget" style="position: relative;">
                    <div style="background-color: #f0f0f0; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                      <i class="fas fa-image" style="font-size: 48px; color: #999; margin-bottom: 15px;"></i>
                      <div class="image-upload-controls">
                        <button class="upload-btn" style="background-color: #000; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-bottom: 10px;">Upload Image</button>
                        <input type="file" class="file-input" style="display: none;" accept="image/*">
                        <div class="or-text" style="margin-bottom: 10px; color: #666;">or</div>
                        <input type="text" class="image-url-input" placeholder="Enter image URL" style="width: 200px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px;">
                        <button class="url-btn" style="background-color: #f5f5f5; color: #000; border: 1px solid #ddd; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Use URL</button>
                      </div>
                    </div>
                  </div>
                `;
                
                // Add event listeners for image upload
                setTimeout(() => {
                  const uploadBtn = newElement.querySelector('.upload-btn');
                  const fileInput = newElement.querySelector('.file-input');
                  const urlBtn = newElement.querySelector('.url-btn');
                  const urlInput = newElement.querySelector('.image-url-input');
                  const imageWidget = newElement.querySelector('.image-widget');
                  
                  if (uploadBtn && fileInput) {
                    uploadBtn.addEventListener('click', function() {
                      fileInput.click();
                    });
                    
                    fileInput.addEventListener('change', function() {
                      if (this.files && this.files[0]) {
                        const file = this.files[0];
                        
                        // Create FormData
                        const formData = new FormData();
                        formData.append('image', file);
                        
                        // Show loading state
                        imageWidget.innerHTML = '<div style="background-color: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center;"><div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #000; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite;"></div></div>';
                        
                        // Add spinner animation
                        const style = document.createElement('style');
                        style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
                        document.head.appendChild(style);
                        
                        // Upload the image
                        fetch('/api/uploads/image?shop=' + shop, {
                          method: 'POST',
                          body: formData
                        })
                        .then(response => {
                          if (!response.ok) {
                            throw new Error('Failed to upload image');
                          }
                          return response.json();
                        })
                        .then(data => {
                          // Update the image widget with the uploaded image
                          imageWidget.innerHTML = `
                            <div style="position: relative;">
                              <img src="${data.file.url}" alt="Uploaded image" style="max-width: 100%; display: block;">
                              <button class="change-image-btn" style="position: absolute; bottom: 10px; right: 10px; background-color: rgba(0,0,0,0.7); color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Change</button>
                            </div>
                          `;
                          
                          // Add event listener to change button
                          const changeBtn = imageWidget.querySelector('.change-image-btn');
                          if (changeBtn) {
                            changeBtn.addEventListener('click', function() {
                              fileInput.click();
                            });
                          }
                        })
                        .catch(error => {
                          console.error('Error uploading image:', error);
                          
                          // Show error state
                          imageWidget.innerHTML = `
                            <div style="background-color: #f0f0f0; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                              <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #d9534f; margin-bottom: 15px;"></i>
                              <p style="color: #d9534f; margin-bottom: 15px;">Failed to upload image</p>
                              <button class="retry-btn" style="background-color: #000; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Try Again</button>
                            </div>
                          `;
                          
                          // Add event listener to retry button
                          const retryBtn = imageWidget.querySelector('.retry-btn');
                          if (retryBtn) {
                            retryBtn.addEventListener('click', function() {
                              fileInput.click();
                            });
                          }
                        });
                      }
                    });
                  }
                  
                  if (urlBtn && urlInput) {
                    urlBtn.addEventListener('click', function() {
                      const imageUrl = urlInput.value.trim();
                      
                      if (imageUrl) {
                        // Update the image widget with the URL
                        imageWidget.innerHTML = `
                          <div style="position: relative;">
                            <img src="${imageUrl}" alt="Image" style="max-width: 100%; display: block;" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23FF0000%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23EE0000%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3EImage%20Load%20Error%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';">
                            <button class="change-image-btn" style="position: absolute; bottom: 10px; right: 10px; background-color: rgba(0,0,0,0.7); color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Change</button>
                          </div>
                        `;
                        
                        // Add event listener to change button
                        const changeBtn = imageWidget.querySelector('.change-image-btn');
                        if (changeBtn) {
                          changeBtn.addEventListener('click', function() {
                            // Restore the upload controls
                            imageWidget.innerHTML = `
                              <div style="background-color: #f0f0f0; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                <i class="fas fa-image" style="font-size: 48px; color: #999; margin-bottom: 15px;"></i>
                                <div class="image-upload-controls">
                                  <button class="upload-btn" style="background-color: #000; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-bottom: 10px;">Upload Image</button>
                                  <input type="file" class="file-input" style="display: none;" accept="image/*">
                                  <div class="or-text" style="margin-bottom: 10px; color: #666;">or</div>
                                  <input type="text" class="image-url-input" placeholder="Enter image URL" style="width: 200px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px;" value="${imageUrl}">
                                  <button class="url-btn" style="background-color: #f5f5f5; color: #000; border: 1px solid #ddd; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Use URL</button>
                                </div>
                              </div>
                            `;
                            
                            // Re-add event listeners
                            const newUploadBtn = imageWidget.querySelector('.upload-btn');
                            const newFileInput = imageWidget.querySelector('.file-input');
                            const newUrlBtn = imageWidget.querySelector('.url-btn');
                            const newUrlInput = imageWidget.querySelector('.image-url-input');
                            
                            if (newUploadBtn && newFileInput) {
                              newUploadBtn.addEventListener('click', function() {
                                newFileInput.click();
                              });
                              
                              // Re-add file input change event
                              newFileInput.addEventListener('change', function() {
                                // ... (same as above)
                              });
                            }
                            
                            if (newUrlBtn && newUrlInput) {
                              newUrlBtn.addEventListener('click', function() {
                                // ... (same as above)
                              });
                            }
                          });
                        }
                      }
                    });
                  }
                }, 0);
                
                newElement.style.padding = '10px';
                newElement.style.margin = '10px 0';
                newElement.style.border = '1px dashed #ccc';
                break;
              case 'button':
                newElement = document.createElement('button');
                newElement.textContent = 'Button Text';
                newElement.className = 'btn';
                newElement.style.display = 'block';
                newElement.style.padding = '10px 20px';
                newElement.style.margin = '10px 0';
                newElement.style.border = '1px dashed #ccc';
                break;
              case 'hero':
                newElement = document.createElement('div');
                newElement.innerHTML = \`
                  <div style="background-color: #f0f0f0; padding: 60px 20px; text-align: center;">
                    <h1>Hero Title</h1>
                    <p style="margin: 20px 0;">Hero subtitle text goes here. This is a sample hero section.</p>
                    <button class="btn" style="background-color: #000; color: #fff; padding: 10px 20px;">Call to Action</button>
                  </div>
                \`;
                newElement.style.margin = '10px 0';
                newElement.style.border = '1px dashed #ccc';
                break;
              // Shopify REST Widgets
              case 'product':
                newElement = document.createElement('div');
                newElement.innerHTML = \`
                  <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; background-color: #fff;">
                    <div style="display: flex; gap: 20px;">
                      <div style="flex: 0 0 120px; background-color: #f0f0f0; height: 120px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-shopping-bag" style="font-size: 36px; color: #999;"></i>
                      </div>
                      <div style="flex: 1;">
                        <h3 style="margin: 0 0 10px 0; font-size: 18px;">Product Title</h3>
                        <p style="margin: 0 0 10px 0; color: #666;">Product description goes here. This is a sample product widget that will display real product data from your Shopify store.</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <span style="font-weight: bold; font-size: 18px;">$99.99</span>
                          <button style="background-color: #000; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Add to Cart</button>
                        </div>
                      </div>
                    </div>
                    <div style="margin-top: 10px; font-size: 12px; color: #999; text-align: center;">
                      This widget will display real product data from your Shopify store
                    </div>
                  </div>
                \`;
                newElement.style.margin = '10px 0';
                break;
              case 'collection':
                newElement = document.createElement('div');
                newElement.innerHTML = \`
                  <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; background-color: #fff;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; text-align: center;">Collection Title</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                      <div style="border: 1px solid #eee; padding: 10px; text-align: center;">
                        <div style="background-color: #f0f0f0; height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                          <i class="fas fa-tshirt" style="font-size: 36px; color: #999;"></i>
                        </div>
                        <h4 style="margin: 0 0 5px 0; font-size: 14px;">Product 1</h4>
                        <p style="margin: 0; font-weight: bold;">$49.99</p>
                      </div>
                      <div style="border: 1px solid #eee; padding: 10px; text-align: center;">
                        <div style="background-color: #f0f0f0; height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                          <i class="fas fa-tshirt" style="font-size: 36px; color: #999;"></i>
                        </div>
                        <h4 style="margin: 0 0 5px 0; font-size: 14px;">Product 2</h4>
                        <p style="margin: 0; font-weight: bold;">$59.99</p>
                      </div>
                      <div style="border: 1px solid #eee; padding: 10px; text-align: center;">
                        <div style="background-color: #f0f0f0; height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                          <i class="fas fa-tshirt" style="font-size: 36px; color: #999;"></i>
                        </div>
                        <h4 style="margin: 0 0 5px 0; font-size: 14px;">Product 3</h4>
                        <p style="margin: 0; font-weight: bold;">$69.99</p>
                      </div>
                    </div>
                    <div style="margin-top: 15px; font-size: 12px; color: #999; text-align: center;">
                      This widget will display real collection data from your Shopify store
                    </div>
                  </div>
                \`;
                newElement.style.margin = '10px 0';
                break;
              case 'blog-post':
                newElement = document.createElement('div');
                newElement.innerHTML = \`
                  <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; background-color: #fff;">
                    <h3 style="margin: 0 0 15px 0; font-size: 20px;">Blog Post Title</h3>
                    <div style="color: #666; margin-bottom: 15px; font-size: 14px;">
                      <span>Posted on: January 1, 2023</span> | <span>Author: Shop Owner</span>
                    </div>
                    <div style="background-color: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                      <i class="fas fa-image" style="font-size: 48px; color: #999;"></i>
                    </div>
                    <p style="margin: 0 0 15px 0; line-height: 1.6;">
                      This is a sample blog post excerpt. Your actual blog content from Shopify will appear here. 
                      The blog widget allows you to display your latest posts or a specific post from your store's blog.
                    </p>
                    <a href="#" style="color: #000; text-decoration: none; font-weight: bold;">Read More →</a>
                    <div style="margin-top: 15px; font-size: 12px; color: #999; text-align: center;">
                      This widget will display real blog data from your Shopify store
                    </div>
                  </div>
                \`;
                newElement.style.margin = '10px 0';
                break;
              case 'cart':
                newElement = document.createElement('div');
                newElement.innerHTML = \`
                  <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; background-color: #fff;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; text-align: center;">Shopping Cart</h3>
                    <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
                      <div style="display: flex; gap: 15px;">
                        <div style="flex: 0 0 80px; background-color: #f0f0f0; height: 80px; display: flex; align-items: center; justify-content: center;">
                          <i class="fas fa-tshirt" style="font-size: 24px; color: #999;"></i>
                        </div>
                        <div style="flex: 1;">
                          <h4 style="margin: 0 0 5px 0; font-size: 16px;">Product Name</h4>
                          <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Variant: Medium / Black</p>
                          <div style="display: flex; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                              <span>Qty: 1</span>
                              <div style="display: flex; gap: 5px;">
                                <button style="width: 24px; height: 24px; background: #f0f0f0; border: none; cursor: pointer;">-</button>
                                <button style="width: 24px; height: 24px; background: #f0f0f0; border: none; cursor: pointer;">+</button>
                              </div>
                            </div>
                            <span style="font-weight: bold;">$49.99</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                      <span>Subtotal:</span>
                      <span style="font-weight: bold;">$49.99</span>
                    </div>
                    <button style="width: 100%; background-color: #000; color: #fff; border: none; padding: 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                      Checkout
                    </button>
                    <div style="margin-top: 15px; font-size: 12px; color: #999; text-align: center;">
                      This widget will display the actual cart from your Shopify store
                    </div>
                  </div>
                \`;
                newElement.style.margin = '10px 0';
                break;
              case 'customer':
                newElement = document.createElement('div');
                newElement.innerHTML = \`
                  <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; background-color: #fff;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; text-align: center;">Customer Account</h3>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                      <div style="display: flex; gap: 10px; align-items: center;">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                          <i class="fas fa-user" style="font-size: 24px; color: #999;"></i>
                        </div>
                        <div>
                          <h4 style="margin: 0; font-size: 16px;">Customer Name</h4>
                          <p style="margin: 0; color: #666; font-size: 14px;">customer@example.com</p>
                        </div>
                      </div>
                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <a href="#" style="text-decoration: none; color: inherit; border: 1px solid #eee; padding: 15px; border-radius: 4px; text-align: center;">
                          <i class="fas fa-box" style="font-size: 24px; margin-bottom: 10px;"></i>
                          <p style="margin: 0; font-weight: bold;">Orders</p>
                        </a>
                        <a href="#" style="text-decoration: none; color: inherit; border: 1px solid #eee; padding: 15px; border-radius: 4px; text-align: center;">
                          <i class="fas fa-heart" style="font-size: 24px; margin-bottom: 10px;"></i>
                          <p style="margin: 0; font-weight: bold;">Wishlist</p>
                        </a>
                        <a href="#" style="text-decoration: none; color: inherit; border: 1px solid #eee; padding: 15px; border-radius: 4px; text-align: center;">
                          <i class="fas fa-map-marker-alt" style="font-size: 24px; margin-bottom: 10px;"></i>
                          <p style="margin: 0; font-weight: bold;">Addresses</p>
                        </a>
                        <a href="#" style="text-decoration: none; color: inherit; border: 1px solid #eee; padding: 15px; border-radius: 4px; text-align: center;">
                          <i class="fas fa-cog" style="font-size: 24px; margin-bottom: 10px;"></i>
                          <p style="margin: 0; font-weight: bold;">Settings</p>
                        </a>
                      </div>
                    </div>
                    <div style="margin-top: 15px; font-size: 12px; color: #999; text-align: center;">
                      This widget will display customer account information
                    </div>
                  </div>
                \`;
                newElement.style.margin = '10px 0';
                break;
              case 'order':
                newElement = document.createElement('div');
                newElement.innerHTML = \`
                  <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; background-color: #fff;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; text-align: center;">Order Details</h3>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-weight: bold;">Order #1001</span>
                        <span>January 1, 2023</span>
                      </div>
                      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <span style="background-color: #e6f7e6; color: #2e7d32; padding: 3px 8px; border-radius: 4px; font-size: 12px;">Paid</span>
                        <span style="background-color: #e3f2fd; color: #1565c0; padding: 3px 8px; border-radius: 4px; font-size: 12px;">Fulfilled</span>
                      </div>
                    </div>
                    <div style="margin-bottom: 20px;">
                      <h4 style="margin: 0 0 10px 0; font-size: 16px;">Items</h4>
                      <div style="border: 1px solid #eee; border-radius: 4px; overflow: hidden;">
                        <div style="display: flex; padding: 10px; border-bottom: 1px solid #eee;">
                          <div style="flex: 3;">Product</div>
                          <div style="flex: 1; text-align: center;">Qty</div>
                          <div style="flex: 1; text-align: right;">Price</div>
                        </div>
                        <div style="display: flex; padding: 10px; align-items: center;">
                          <div style="flex: 3;">Product Name</div>
                          <div style="flex: 1; text-align: center;">1</div>
                          <div style="flex: 1; text-align: right;">$49.99</div>
                        </div>
                      </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid #eee; padding-top: 15px;">
                      <span style="font-weight: bold;">Total:</span>
                      <span style="font-weight: bold;">$49.99</span>
                    </div>
                    <div style="margin-top: 15px; font-size: 12px; color: #999; text-align: center;">
                      This widget will display real order data from your Shopify store
                    </div>
                  </div>
                \`;
                newElement.style.margin = '10px 0';
                break;
              default:
                newElement = document.createElement('div');
                newElement.textContent = type.charAt(0).toUpperCase() + type.slice(1) + ' Element';
                newElement.style.padding = '10px';
                newElement.style.margin = '10px 0';
                newElement.style.border = '1px dashed #ccc';
            }

            // Make the element selectable
            newElement.setAttribute('data-element-type', type);
            newElement.style.cursor = 'pointer';
            newElement.addEventListener('click', function(e) {
              e.stopPropagation();
              selectElement(this);
            });

            canvas.appendChild(newElement);
          });

          // Element selection functionality
          function selectElement(element) {
            // Remove selection from all elements
            document.querySelectorAll('[data-element-type]').forEach(el => {
              el.style.boxShadow = 'none';
            });

            // Add selection to clicked element
            element.style.boxShadow = '0 0 0 2px #000';

            // Show properties panel
            document.getElementById('no-selection').style.display = 'none';
            document.getElementById('properties-form').style.display = 'block';

            // Update properties form
            document.getElementById('element-type').value = element.getAttribute('data-element-type');

            // Set content based on element type
            if (element.getAttribute('data-element-type') === 'heading' ||
                element.getAttribute('data-element-type') === 'text' ||
                element.getAttribute('data-element-type') === 'button') {
              document.getElementById('element-content').value = element.textContent;
            } else {
              document.getElementById('element-content').value = 'Complex element - content editing limited';
            }
          }

          // Deselect when clicking on canvas
          canvas.addEventListener('click', function(e) {
            if (e.target === canvas) {
              document.querySelectorAll('[data-element-type]').forEach(el => {
                el.style.boxShadow = 'none';
              });

              document.getElementById('no-selection').style.display = 'block';
              document.getElementById('properties-form').style.display = 'none';
            }
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Builder error:', error);
    res.status(500).send(`
      <h1>Error</h1>
      <p>An error occurred while loading the builder: ${error.message}</p>
    `);
  }
});

module.exports = router;
