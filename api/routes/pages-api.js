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
    
    // Get access token from multiple sources
    const accessToken = req.headers['x-shopify-access-token'] || 
                      req.session?.accessToken || 
                      req.cookies?.shopifyAccessToken || 
                      req.cookies?.accessToken ||
                      process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    console.log('🔍 Authentication check:', {
      hasAccessToken: !!accessToken,
      tokenSource: accessToken ? 'found' : 'missing',
      shop: shop
    });
    
    if (!accessToken) {
      console.log('❌ No access token found - returning 401');
      return res.status(401).json({ 
        error: 'Access token not found',
        debug: {
          shop: shop,
          hasHeaders: !!req.headers['x-shopify-access-token'],
          hasSession: !!req.session?.accessToken,
          hasCookies: !!req.cookies?.shopifyAccessToken,
          hasEnvToken: !!process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN
        }
      });
    }
    
    console.log(`📄 Fetching page ${pageId} from Shopify for shop: ${shop}`);
    
    try {
      // Fetch page from Shopify API
      const shopifyResponse = await fetch(`https://${shop}/admin/api/2023-10/pages/${pageId}.json`, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });
      
      if (shopifyResponse.ok) {
        const shopifyData = await shopifyResponse.json();
        const shopifyPage = shopifyData.page;
        
        // Find page in local array to get KingsBuilder content
        let localPage = pages.find(p => p.id == pageId || p.id === parseInt(pageId, 10));
        
        // Merge Shopify page with local KingsBuilder content
        const page = {
          id: shopifyPage.id,
          title: shopifyPage.title,
          slug: shopifyPage.handle,
          content: localPage ? localPage.content : null, // KingsBuilder content
          body_html: shopifyPage.body_html, // Shopify content
          template: 'default',
          shop: shop,
          status: shopifyPage.published_at ? 'published' : 'draft',
          isShopifyPage: true,
          handle: shopifyPage.handle,
          published_at: shopifyPage.published_at,
          createdAt: shopifyPage.created_at,
          updatedAt: shopifyPage.updated_at
        };
        
        console.log(`✅ Found Shopify page: ${shopifyPage.title}`);
        console.log(`📄 KingsBuilder content available: ${localPage ? 'Yes' : 'No'}`);
        
        res.json({ page });
      } else {
        console.log(`❌ Shopify page ${pageId} not found`);
        res.status(404).json({ error: 'Page not found' });
      }
    } catch (error) {
      console.error('Error fetching page from Shopify:', error);
      res.status(500).json({ error: 'Failed to fetch page from Shopify' });
    }
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
        title: title,
        handle: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        body_html: content?.html || `<div class="page-content"><h1>${title}</h1><p>Start building your page...</p></div>`,
        published: false
      };
      
      // Get access token from session/cookies
      const accessToken = req.cookies?.shopifyAccessToken || req.cookies?.accessToken || req.headers['x-shopify-access-token'];
      
      shopifyPage = await shopifyApi.createShopifyPage(shop, accessToken, pageData, req);
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

// This duplicate route is removed - we already have a create route above

// Update a page
router.put('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { title, slug, content, template } = req.body;
    const shop = req.query.shop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    console.log(`🔄 Updating page ${pageId} for shop: ${shop}`);
    console.log('Update data:', { title, slug, content: content ? 'provided' : 'not provided', template });
    
    // Find page index (handle both string and number comparison)
    const pageIndex = pages.findIndex(p => p.id == pageId || p.id === parseInt(pageId, 10));
    
    if (pageIndex === -1) {
      console.log(`❌ Page ${pageId} not found in local pages. Creating new page.`);
      
      // Create new page if it doesn't exist
      const newPage = {
        id: pageId,
        title: title || 'New Page',
        slug: slug || 'new-page',
        content: content || '',
        template: template || 'default',
        shop: shop,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      pages.push(newPage);
      console.log(`✅ Created new page: ${newPage.title}`);
      return res.json({ page: newPage });
    }
    
    // Store access token in session for future requests
    const accessToken = req.cookies?.shopifyAccessToken || req.cookies?.accessToken || req.headers['x-shopify-access-token'];
    if (accessToken && shop) {
      const { storeAccessToken } = require('../utils/session');
      storeAccessToken(shop, accessToken);
      console.log(`Stored access token for shop ${shop} in session`);
    }
    
    // Update existing page
    const updatedPage = {
      ...pages[pageIndex],
      title: title || pages[pageIndex].title,
      slug: slug || pages[pageIndex].slug,
      content: content || pages[pageIndex].content,
      template: template !== undefined ? template : pages[pageIndex].template,
      updatedAt: new Date().toISOString(),
      isShopifyPage: true // Force this to be true for all Shopify pages
    };
    
    // Replace page in array
    pages[pageIndex] = updatedPage;
    
    // CRITICAL FIX: Also update the Shopify page if it's a Shopify page
    console.log(`🔍 Checking Shopify update: isShopifyPage=${updatedPage.isShopifyPage}, hasContent=${!!content}`);
    
    if (updatedPage.isShopifyPage && content) {
      try {
        console.log(`🔄 Updating Shopify page ${pageId} with new content`);
        console.log(`📝 Content type: ${typeof content}, length: ${content.length || 'N/A'}`);
        
        // Get access token from multiple sources
        const accessToken = req.headers['x-shopify-access-token'] || 
                          req.session?.accessToken || 
                          req.cookies?.shopifyAccessToken || 
                          req.cookies?.accessToken ||
                          process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
        
        if (accessToken) {
          console.log('🔑 Using access token for Shopify API update');
          
          // Convert content to HTML
          const bodyHtml = typeof content === 'string' ? content : (content.html || JSON.stringify(content));
          
          // Update Shopify page
          const shopifyResponse = await fetch(`https://${shop}/admin/api/2023-10/pages/${pageId}.json`, {
            method: 'PUT',
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              page: {
                id: pageId,
                title: title || updatedPage.title,
                body_html: bodyHtml
              }
            })
          });
          
          if (shopifyResponse.ok) {
            console.log(`✅ Successfully updated Shopify page ${pageId}`);
          } else {
            console.error(`❌ Failed to update Shopify page ${pageId}:`, await shopifyResponse.text());
          }
        } else {
          console.warn('⚠️  No access token available - page updated locally only');
        }
      } catch (error) {
        console.error('Error updating Shopify page:', error);
      }
    }
    
    console.log(`✅ Updated page: ${updatedPage.title}`);
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
    
    // Find page index (handle both string and number comparison)
    const pageIndex = pages.findIndex(p => p.id == pageId || p.id === parseInt(pageId, 10));
    
    if (pageIndex === -1) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    const pageData = pages[pageIndex];
    
    // Get access token from session or environment
    const accessToken = req.headers['x-shopify-access-token'] || req.session?.accessToken || req.cookies?.shopifyAccessToken || req.cookies?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
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
    const randomSuffix = Math.random().toString(36).substring(2, 8); const uniqueHandle = `${baseHandle}-${timestamp}-${randomSuffix}`;
    
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
    
    // Find page index (handle both string and number comparison)
    const pageIndex = pages.findIndex(p => p.id == pageId || p.id === parseInt(pageId, 10));
    
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

