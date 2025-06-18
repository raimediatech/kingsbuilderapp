// api/routes/page-templates.js - Page Templates API routes
const express = require('express');
const router = express.Router();
const { getShopifyPageTemplates } = require('../shopify');
const { getAccessToken } = require('../helpers/tokens');

// Get all page templates (both Shopify and KingsBuilder)
router.get('/', async (req, res) => {
  try {
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token for the shop
    const accessToken = await getAccessToken(shop);
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token available for this shop' });
    }
    
    // Get Shopify page templates
    let shopifyTemplates = [];
    try {
      shopifyTemplates = await getShopifyPageTemplates(shop, accessToken);
    } catch (error) {
      console.error('Error fetching Shopify page templates:', error);
      // Continue with empty Shopify templates
    }
    
    // Get KingsBuilder templates (from templates-api)
    let kingsBuilderTemplates = [];
    try {
      // Import the templates API router
      const templatesApi = require('./templates-api');
      
      // Create a mock request and response to get templates
      const mockReq = { 
        query: { shop },
        shopifyShop: shop,
        cookies: { shopOrigin: shop }
      };
      
      const mockRes = {
        json: (data) => {
          kingsBuilderTemplates = data.templates || [];
        },
        status: () => ({ json: () => {} })
      };
      
      // Call the templates API get method
      await new Promise((resolve) => {
        templatesApi.stack.forEach(layer => {
          if (layer.route && layer.route.path === '/' && layer.route.methods.get) {
            layer.handle(mockReq, mockRes, resolve);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching KingsBuilder templates:', error);
      // Continue with empty KingsBuilder templates
    }
    
    // Format KingsBuilder templates to match Shopify templates format
    const formattedKBTemplates = kingsBuilderTemplates.map(template => ({
      id: template.id || template._id,
      name: `${template.name} (KB)`,
      key: `kb_template_${template.id || template._id}`,
      description: template.description,
      category: template.category,
      isKingsBuilder: true
    }));
    
    // Combine templates
    const allTemplates = [
      ...shopifyTemplates,
      ...formattedKBTemplates
    ];
    
    res.json({ templates: allTemplates });
  } catch (error) {
    console.error('Error fetching page templates:', error);
    res.status(500).json({ error: 'Failed to fetch page templates', details: error.message });
  }
});

module.exports = router;