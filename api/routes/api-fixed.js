// api/routes/api-fixed.js - Fixed API routes for the builder
const express = require('express');
const router = express.Router();
const axios = require('axios');
const shopifyApi = require('../shopify');

// Import models if mongoose is available
let PageVersion;
try {
  PageVersion = require('../models/pageVersion');
} catch (error) {
  console.log('MongoDB models not available, version history will be disabled');
}

// Get all pages from Shopify
router.get('/shopify-pages', async (req, res) => {
  try {
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    console.log('Fetching Shopify pages for shop:', shop);
    console.log('Using access token:', accessToken ? 'Token available' : 'No token');
    
    // Get pages from Shopify
    const result = await shopifyApi.getShopifyPages(shop, accessToken);
    
    console.log('Shopify pages result:', JSON.stringify(result).substring(0, 200) + '...');
    
    res.json({
      success: true,
      pages: result.pages || []
    });
  } catch (error) {
    console.error('Error fetching Shopify pages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Shopify pages', 
      details: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    });
  }
});

// Test Shopify API connection
router.get('/test-shopify', async (req, res) => {
  try {
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    // Log environment variables
    console.log('Environment variables:');
    console.log('SHOPIFY_API_KEY:', process.env.SHOPIFY_API_KEY ? 'Set' : 'Not set');
    console.log('SHOPIFY_API_SECRET:', process.env.SHOPIFY_API_SECRET ? 'Set' : 'Not set');
    console.log('SHOPIFY_API_VERSION:', process.env.SHOPIFY_API_VERSION);
    console.log('SHOPIFY_ADMIN_API_ACCESS_TOKEN:', process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN ? 'Set' : 'Not set');
    console.log('SHOPIFY_SHOP_DOMAIN:', process.env.SHOPIFY_SHOP_DOMAIN);
    
    // Test connection to Shopify API
    const apiUrl = `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION || '2023-10'}/shop.json`;
    console.log('Testing connection to:', apiUrl);
    
    const response = await axios({
      method: 'GET',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      }
    });
    
    res.json({
      success: true,
      shop: response.data.shop,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION,
        SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ? 'Set' : 'Not set',
        SHOPIFY_ADMIN_API_ACCESS_TOKEN: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN ? 'Set' : 'Not set'
      }
    });
  } catch (error) {
    console.error('Error testing Shopify API:', error);
    res.status(500).json({ 
      error: 'Failed to connect to Shopify API', 
      details: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    });
  }
});

// Get all pages
router.get('/pages', async (req, res) => {
  try {
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    // Get pages from Shopify
    const result = await shopifyApi.getShopifyPages(shop, accessToken);
    
    res.json({
      success: true,
      pages: result.pages || []
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch pages', 
      details: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    });
  }
});

// Get page by ID
router.get('/pages/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    // Get page from Shopify
    const pageData = await shopifyApi.getShopifyPageById(shop, accessToken, pageId);
    
    res.json({
      success: true,
      page: pageData.page
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch page', 
      details: error.message 
    });
  }
});

// Update page
router.put('/pages/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const pageData = req.body;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    console.log('Updating page with data:', JSON.stringify(pageData).substring(0, 500) + '...');
    
    // Convert page content to HTML
    let bodyHtml = '';
    
    if (pageData.content && pageData.content.elements && Array.isArray(pageData.content.elements)) {
      // If content has elements array (new format from builder-fixed.js)
      bodyHtml = '<div class="kings-builder-page">';
      
      pageData.content.elements.forEach(element => {
        // Create a wrapper div with the element type as a class
        bodyHtml += `<div class="kings-builder-element kings-builder-${element.type}">`;
        
        // Add the content
        if (element.content) {
          bodyHtml += element.content;
        }
        
        // Close the wrapper div
        bodyHtml += '</div>';
      });
      
      bodyHtml += '</div>';
      
      // Add CSS for the page
      bodyHtml += `
        <style>
          .kings-builder-page {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          .kings-builder-element {
            margin-bottom: 20px;
          }
        </style>
      `;
    } else if (pageData.content && Array.isArray(pageData.content)) {
      // If content is an array of elements (old format), convert to HTML
      pageData.content.forEach(element => {
        if (element.html) {
          bodyHtml += element.html;
        } else if (element.content) {
          // Simple fallback if HTML is not available
          switch (element.type) {
            case 'heading':
              bodyHtml += `<h2>${element.content}</h2>`;
              break;
            case 'text':
              bodyHtml += `<p>${element.content}</p>`;
              break;
            case 'button':
              bodyHtml += `<button class="btn">${element.content}</button>`;
              break;
            default:
              bodyHtml += element.content;
          }
        }
      });
    } else if (typeof pageData.content === 'string') {
      // If content is already HTML string
      bodyHtml = pageData.content;
    }
    
    console.log('Generated HTML for update:', bodyHtml.substring(0, 200) + '... (truncated)');
    
    // Prepare data for Shopify API
    const shopifyPageData = {
      title: pageData.title || 'Untitled Page',
      body_html: bodyHtml,
      handle: pageData.handle,
      published: false // Save as draft
    };
    
    // Update page in Shopify
    const result = await shopifyApi.updateShopifyPage(shop, accessToken, pageId, shopifyPageData);
    
    // Save version history if MongoDB is available
    if (PageVersion) {
      try {
        // Get the latest version number
        const latestVersion = await PageVersion.findOne({ pageId, shop }).sort({ version: -1 });
        const versionNumber = latestVersion ? latestVersion.version + 1 : 1;
        
        // Create a new version
        await PageVersion.create({
          pageId,
          shop,
          version: versionNumber,
          title: pageData.title || 'Untitled Page',
          content: pageData.content,
          comment: pageData.comment || `Version ${versionNumber}`,
          createdBy: req.session?.user?.email || 'system'
        });
        
        console.log(`Created version ${versionNumber} for page ${pageId}`);
      } catch (versionError) {
        console.error('Error saving page version:', versionError);
        // Continue even if version saving fails
      }
    }
    
    res.json({ success: true, page: result.page });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page', details: error.message });
  }
});

// Publish page
router.post('/pages/:pageId/publish', async (req, res) => {
  try {
    const { pageId } = req.params;
    const pageData = req.body;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    console.log('Publishing page with data:', JSON.stringify(pageData).substring(0, 500) + '...');
    
    // Convert page content to HTML
    let bodyHtml = '';
    
    if (pageData.content && pageData.content.elements && Array.isArray(pageData.content.elements)) {
      // If content has elements array (new format from builder-fixed.js)
      bodyHtml = '<div class="kings-builder-page">';
      
      pageData.content.elements.forEach(element => {
        // Create a wrapper div with the element type as a class
        bodyHtml += `<div class="kings-builder-element kings-builder-${element.type}">`;
        
        // Add the content
        if (element.content) {
          bodyHtml += element.content;
        }
        
        // Close the wrapper div
        bodyHtml += '</div>';
      });
      
      bodyHtml += '</div>';
      
      // Add CSS for the page
      bodyHtml += `
        <style>
          .kings-builder-page {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          .kings-builder-element {
            margin-bottom: 20px;
          }
        </style>
      `;
    } else if (pageData.content && Array.isArray(pageData.content)) {
      // If content is an array of elements (old format), convert to HTML
      pageData.content.forEach(element => {
        if (element.html) {
          bodyHtml += element.html;
        } else if (element.content) {
          // Simple fallback if HTML is not available
          switch (element.type) {
            case 'heading':
              bodyHtml += `<h2>${element.content}</h2>`;
              break;
            case 'text':
              bodyHtml += `<p>${element.content}</p>`;
              break;
            case 'button':
              bodyHtml += `<button class="btn">${element.content}</button>`;
              break;
            default:
              bodyHtml += element.content;
          }
        }
      });
    } else if (typeof pageData.content === 'string') {
      // If content is already HTML string
      bodyHtml = pageData.content;
    }
    
    console.log('Generated HTML for publish:', bodyHtml.substring(0, 200) + '... (truncated)');
    
    // Prepare data for Shopify API
    const shopifyPageData = {
      title: pageData.title || 'Untitled Page',
      body_html: bodyHtml,
      handle: pageData.handle,
      published: true // Publish the page
    };
    
    // Update page in Shopify
    const result = await shopifyApi.updateShopifyPage(shop, accessToken, pageId, shopifyPageData);
    
    // Save version history if MongoDB is available
    if (PageVersion) {
      try {
        // Get the latest version number
        const latestVersion = await PageVersion.findOne({ pageId, shop }).sort({ version: -1 });
        const versionNumber = latestVersion ? latestVersion.version + 1 : 1;
        
        // Create a new version
        await PageVersion.create({
          pageId,
          shop,
          version: versionNumber,
          title: pageData.title || 'Untitled Page',
          content: pageData.content,
          comment: pageData.comment || `Published version ${versionNumber}`,
          createdBy: req.session?.user?.email || 'system'
        });
        
        console.log(`Created published version ${versionNumber} for page ${pageId}`);
      } catch (versionError) {
        console.error('Error saving published page version:', versionError);
        // Continue even if version saving fails
      }
    }
    
    res.json({ success: true, page: result.page });
  } catch (error) {
    console.error('Error publishing page:', error);
    res.status(500).json({ error: 'Failed to publish page', details: error.message });
  }
});

// Create a new page
router.post('/pages', async (req, res) => {
  try {
    const pageData = req.body;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    // Create a basic HTML template for the new page
    const bodyHtml = `
      <div class="kings-builder-page">
        <div class="kings-builder-element kings-builder-header">
          <h1>${pageData.title || 'New Page'}</h1>
        </div>
        <div class="kings-builder-element kings-builder-paragraph">
          <p>This is a new page created with KingsBuilder. Edit this page in the page builder.</p>
        </div>
      </div>
      <style>
        .kings-builder-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .kings-builder-element {
          margin-bottom: 20px;
        }
      </style>
    `;
    
    // Prepare data for Shopify API
    const shopifyPageData = {
      title: pageData.title || 'New Page',
      body_html: bodyHtml,
      handle: pageData.handle || (pageData.title || 'new-page').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      published: false // Save as draft
    };
    
    // Create page in Shopify
    const result = await shopifyApi.createShopifyPage(shop, accessToken, shopifyPageData);
    
    // Save version history if MongoDB is available
    if (PageVersion) {
      try {
        await PageVersion.create({
          pageId: result.page.id,
          shop,
          version: 1,
          title: pageData.title || 'New Page',
          content: {
            elements: [
              {
                id: 'header-' + Date.now(),
                type: 'header',
                content: `<h1>${pageData.title || 'New Page'}</h1>`,
                styles: {}
              },
              {
                id: 'paragraph-' + Date.now(),
                type: 'paragraph',
                content: '<p>This is a new page created with KingsBuilder. Edit this page in the page builder.</p>',
                styles: {}
              }
            ]
          },
          comment: 'Initial version',
          createdBy: req.session?.user?.email || 'system'
        });
        
        console.log(`Created initial version for page ${result.page.id}`);
      } catch (versionError) {
        console.error('Error saving initial page version:', versionError);
        // Continue even if version saving fails
      }
    }
    
    res.json({ success: true, page: result.page });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page', details: error.message });
  }
});

// Delete a page
router.delete('/pages/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    // Delete page from Shopify
    await shopifyApi.deleteShopifyPage(shop, accessToken, pageId);
    
    // Delete version history if MongoDB is available
    if (PageVersion) {
      try {
        await PageVersion.deleteMany({ pageId, shop });
        console.log(`Deleted version history for page ${pageId}`);
      } catch (versionError) {
        console.error('Error deleting page versions:', versionError);
        // Continue even if version deletion fails
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page', details: error.message });
  }
});

module.exports = router;