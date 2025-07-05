// api/routes/pages-api.js - Pages API routes
const express = require('express');
const router = express.Router();
const { requirePermission, PERMISSIONS } = require('../models/user');
const shopifyApi = require('../shopify');

// Mock database for pages (replace with actual database in production)
let pages = [
  {
    id: '1',
    title: 'Home Page',
    slug: 'home',
    status: 'published',
    content: {
      elements: [
        {
          id: 'header1',
          type: 'header',
          content: 'Welcome to our store',
          styles: {
            fontSize: '32px',
            color: '#333',
            textAlign: 'center'
          }
        },
        {
          id: 'paragraph1',
          type: 'paragraph',
          content: 'This is a sample page built with KingsBuilder.',
          styles: {
            fontSize: '16px',
            color: '#666',
            textAlign: 'center'
          }
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'About Us',
    slug: 'about',
    status: 'published',
    content: {
      elements: [
        {
          id: 'header1',
          type: 'header',
          content: 'About Our Store',
          styles: {
            fontSize: '32px',
            color: '#333',
            textAlign: 'center'
          }
        },
        {
          id: 'paragraph1',
          type: 'paragraph',
          content: 'We are a premium Shopify store offering the best products.',
          styles: {
            fontSize: '16px',
            color: '#666',
            textAlign: 'center'
          }
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Contact Us',
    slug: 'contact',
    status: 'draft',
    content: {
      elements: [
        {
          id: 'header1',
          type: 'header',
          content: 'Contact Us',
          styles: {
            fontSize: '32px',
            color: '#333',
            textAlign: 'center'
          }
        },
        {
          id: 'paragraph1',
          type: 'paragraph',
          content: 'Get in touch with our team.',
          styles: {
            fontSize: '16px',
            color: '#666',
            textAlign: 'center'
          }
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'FAQ',
    slug: 'faq',
    status: 'published',
    content: {
      elements: [
        {
          id: 'header1',
          type: 'header',
          content: 'Frequently Asked Questions',
          styles: {
            fontSize: '32px',
            color: '#333',
            textAlign: 'center'
          }
        },
        {
          id: 'paragraph1',
          type: 'paragraph',
          content: 'Find answers to common questions here.',
          styles: {
            fontSize: '16px',
            color: '#666',
            textAlign: 'center'
          }
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all pages
router.get('/', async (req, res) => {
  try {
    const shop = req.query.shop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    console.log('Fetching pages for shop:', shop);
    
    // In a real implementation, you would filter pages by shop
    // For now, we'll just return all pages from our mock database
    
    // Return pages
    console.log('Successfully fetched', pages.length, 'pages');
    res.json({ pages });
  } catch (error) {
    console.error('Error getting pages:', error);
    res.status(500).json({ error: 'Failed to get pages', details: error.message });
  }
});

// Get a single page by ID
router.get('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const shop = req.query.shop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Find page by ID
    let page = pages.find(p => p.id === pageId);
    
    if (!page) {
      // Create a new page if it doesn't exist (fallback for missing pages)
      console.log(`Page ${pageId} not found, creating new page...`);
      page = {
        id: pageId,
        title: 'New Page',
        slug: 'new-page',
        content: '',
        template: 'default',
        shop: shop,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      pages.push(page);
      console.log(`Created new page with ID: ${pageId}`);
    }
    
    res.json({ page });
  } catch (error) {
    console.error('Error getting page:', error);
    res.status(500).json({ error: 'Failed to get page', details: error.message });
  }
});

// Create a new page
router.post('/', async (req, res) => {
  try {
    const { title, slug, content, template, shop: bodyShop } = req.body;
    const shop = bodyShop || req.query.shop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    console.log('🚀 Creating page:', { title, shop });
    
    if (!shop || shop === 'unknown.myshopify.com') {
      return res.status(400).json({ error: 'Valid shop parameter is required' });
    }
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Try to create a real Shopify page first
    const shopifyApi = require('../shopify');
    let shopifyPage = null;
    
    try {
      const pageData = {
        page: {
          title: title,
          handle: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          body_html: content?.html || `<div class="page-content"><h1>${title}</h1><p>Start building your page...</p></div>`,
          published: false
        }
      };
      
      shopifyPage = await shopifyApi.createShopifyPage(shop, pageData);
      console.log('✅ Created Shopify page:', shopifyPage);
      
      // Return the real Shopify page
      res.status(201).json({ 
        page: {
          id: shopifyPage.id,
          title: shopifyPage.title,
          handle: shopifyPage.handle,
          status: shopifyPage.published_at ? 'published' : 'draft',
          shopifyUrl: `https://${shop}/admin/pages/${shopifyPage.id}`,
          frontendUrl: `https://${shop}/pages/${shopifyPage.handle}`,
          isShopifyPage: true,
          createdAt: shopifyPage.created_at,
          updatedAt: shopifyPage.updated_at
        }
      });
      
    } catch (shopifyError) {
      console.error('❌ Failed to create Shopify page:', shopifyError);
      
      // Fallback to mock page
      const pageId = Date.now().toString();
      const newPage = {
        id: pageId,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: 'draft',
        content: content || { elements: [] },
        template: template || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isShopifyPage: false
      };
      
      pages.push(newPage);
      res.status(201).json({ page: newPage });
    }
    
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page', details: error.message });
  }
});

// Create a new page
router.post('/', async (req, res) => {
  try {
    const { title, content, template } = req.body;
    const shop = req.query.shop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin || 'default';
    
    // Generate new page ID
    const pageId = Date.now().toString();
    
    // Create new page object
    const newPage = {
      id: pageId,
      title: title || 'New Page',
      slug: (title || 'new-page').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      content: content || '',
      template: template || 'default',
      shop: shop,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to pages array
    pages.push(newPage);
    
    console.log(`Created new page: ${newPage.title} (ID: ${pageId})`);
    
    res.status(201).json({ page: newPage });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page', details: error.message });
  }
});

// Update a page
router.put('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { title, slug, content, template } = req.body;
    const shop = req.query.shop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Find page index
    const pageIndex = pages.findIndex(p => p.id === pageId);
    
    if (pageIndex === -1) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Update page
    const updatedPage = {
      ...pages[pageIndex],
      title: title || pages[pageIndex].title,
      slug: slug || pages[pageIndex].slug,
      content: content || pages[pageIndex].content,
      template: template !== undefined ? template : pages[pageIndex].template,
      updatedAt: new Date().toISOString()
    };
    
    // Replace page in array
    pages[pageIndex] = updatedPage;
    
    res.json({ page: updatedPage });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page', details: error.message });
  }
});

// Publish a page
router.post('/:pageId/publish', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { content } = req.body;
    const shop = req.query.shop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Find page index
    const pageIndex = pages.findIndex(p => p.id === pageId);
    
    if (pageIndex === -1) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    const pageData = pages[pageIndex];
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token is required' });
    }
    
    // Generate the final HTML for the page
    const bodyHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${pageData.title || 'KingsBuilder Page'}</title>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .page-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
            .builder-element { margin-bottom: 20px; }
            .builder-element h1, .builder-element h2, .builder-element h3 { margin: 0 0 10px 0; }
            .builder-element p { margin: 0 0 15px 0; line-height: 1.6; }
            .builder-element img { max-width: 100%; height: auto; }
            @media (max-width: 768px) {
              .page-container { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="page-container">
            ${content || pageData.content || ''}
          </div>
        </body>
      </html>
    `;
    
    // Generate unique handle to avoid conflicts
    let baseHandle = (pageData.title || 'new-page').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (baseHandle.length === 0) baseHandle = 'new-page';
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const uniqueHandle = `${baseHandle}-${timestamp}`;
    
    // Prepare data for Shopify API
    const shopifyPageData = {
      title: pageData.title || 'New Page',
      body_html: bodyHtml,
      handle: uniqueHandle,
      published: true // Publish the page
    };
    
    console.log('Publishing page to Shopify:', {
      shop,
      title: shopifyPageData.title,
      handle: shopifyPageData.handle
    });
    
    // Create page in Shopify using existing API
    const shopifyResult = await shopifyApi.createShopifyPage(shop, accessToken, shopifyPageData, req);
    console.log('Page created in Shopify:', shopifyResult.id);
    
    // Update local page
    const updatedPage = {
      ...pageData,
      status: 'published',
      content: content || pageData.content,
      shopifyId: shopifyResult.id,
      shopifyHandle: shopifyResult.handle,
      updatedAt: new Date().toISOString()
    };
    
    // Replace page in array
    pages[pageIndex] = updatedPage;
    
    res.json({ 
      page: updatedPage,
      shopifyPage: shopifyResult,
      message: 'Page published successfully to Shopify'
    });
  } catch (error) {
    console.error('Error publishing page:', error);
    res.status(500).json({ error: 'Failed to publish page', details: error.message });
  }
});

// Delete a page
router.delete('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const shop = req.query.shop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Find page index
    const pageIndex = pages.findIndex(p => p.id === pageId);
    
    if (pageIndex === -1) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Remove page from array
    pages.splice(pageIndex, 1);
    
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page', details: error.message });
  }
});

// Export pages array so other modules can access it
router.getPages = () => pages;

module.exports = router;