// api/routes/api.js - API routes for the builder
const express = require('express');
const router = express.Router();
const shopifyApi = require('../shopify');

// Import models if mongoose is available
let PageVersion;
try {
  PageVersion = require('../models/pageVersion');
} catch (error) {
  console.log('MongoDB models not available, version history will be disabled');
}

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
    
    res.json(pageData);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page', details: error.message });
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
    
    // Convert page content to HTML
    let bodyHtml = '';
    
    if (pageData.content && Array.isArray(pageData.content)) {
      // If content is an array of elements, convert to HTML
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
    
    // Convert page content to HTML
    let bodyHtml = '';
    
    if (pageData.content && Array.isArray(pageData.content)) {
      // If content is an array of elements, convert to HTML
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

// Create new page
router.post('/pages', async (req, res) => {
  try {
    const pageData = req.body;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    // Convert page content to HTML
    let bodyHtml = '';
    
    if (pageData.content && Array.isArray(pageData.content)) {
      // If content is an array of elements, convert to HTML
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
    
    // Prepare data for Shopify API
    const shopifyPageData = {
      title: pageData.title || 'Untitled Page',
      body_html: bodyHtml,
      handle: pageData.handle || pageData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''),
      published: pageData.published || false
    };
    
    // Create page in Shopify
    const result = await shopifyApi.createShopifyPage(shop, accessToken, shopifyPageData);
    
    res.json({ success: true, page: result.page });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page', details: error.message });
  }
});

// Delete page
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
    
    // Delete all versions if MongoDB is available
    if (PageVersion) {
      await PageVersion.deleteMany({ pageId, shop });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page', details: error.message });
  }
});

// Get page versions
router.get('/pages/:pageId/versions', async (req, res) => {
  try {
    const { pageId } = req.params;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Check if MongoDB is available
    if (!PageVersion) {
      return res.status(404).json({ error: 'Version history is not available' });
    }
    
    // Get all versions for this page
    const versions = await PageVersion.find({ pageId, shop }).sort({ version: -1 });
    
    res.json({ versions });
  } catch (error) {
    console.error('Error fetching page versions:', error);
    res.status(500).json({ error: 'Failed to fetch page versions', details: error.message });
  }
});

// Get specific page version
router.get('/pages/:pageId/versions/:versionNumber', async (req, res) => {
  try {
    const { pageId, versionNumber } = req.params;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Check if MongoDB is available
    if (!PageVersion) {
      return res.status(404).json({ error: 'Version history is not available' });
    }
    
    // Get specific version
    const version = await PageVersion.findOne({ 
      pageId, 
      shop, 
      version: parseInt(versionNumber, 10) 
    });
    
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    res.json({ version });
  } catch (error) {
    console.error('Error fetching page version:', error);
    res.status(500).json({ error: 'Failed to fetch page version', details: error.message });
  }
});

// Restore page version
router.post('/pages/:pageId/versions/:versionNumber/restore', async (req, res) => {
  try {
    const { pageId, versionNumber } = req.params;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    // Check if MongoDB is available
    if (!PageVersion) {
      return res.status(404).json({ error: 'Version history is not available' });
    }
    
    // Get specific version
    const version = await PageVersion.findOne({ 
      pageId, 
      shop, 
      version: parseInt(versionNumber, 10) 
    });
    
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    // Convert version content to HTML
    let bodyHtml = '';
    
    if (version.content && Array.isArray(version.content)) {
      // If content is an array of elements, convert to HTML
      version.content.forEach(element => {
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
    } else if (typeof version.content === 'string') {
      // If content is already HTML string
      bodyHtml = version.content;
    }
    
    // Prepare data for Shopify API
    const shopifyPageData = {
      title: version.title,
      body_html: bodyHtml,
      published: false // Save as draft when restoring
    };
    
    // Update page in Shopify
    const result = await shopifyApi.updateShopifyPage(shop, accessToken, pageId, shopifyPageData);
    
    // Create a new version to record the restore action
    const latestVersion = await PageVersion.findOne({ pageId, shop }).sort({ version: -1 });
    const newVersionNumber = latestVersion ? latestVersion.version + 1 : 1;
    
    await PageVersion.create({
      pageId,
      shop,
      version: newVersionNumber,
      title: version.title,
      content: version.content,
      comment: `Restored from version ${versionNumber}`,
      createdBy: req.session?.user?.email || 'system'
    });
    
    res.json({ success: true, page: result.page });
  } catch (error) {
    console.error('Error restoring page version:', error);
    res.status(500).json({ error: 'Failed to restore page version', details: error.message });
  }
});

module.exports = router;