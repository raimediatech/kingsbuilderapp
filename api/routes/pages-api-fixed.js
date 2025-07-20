// api/routes/pages-api-fixed.js - Enhanced Pages API routes with better error handling
const express = require('express');
const router = express.Router();
const shopifyApi = require('../shopify');
const { getAccessToken } = require('../utils/session');

// Enhanced logging function
function logRequest(req, message) {
    const shop = req.query.shop || req.body.shop;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 📄 Pages API - ${message} (Shop: ${shop})`);
}

// Get all pages with enhanced error handling
router.get('/', async (req, res) => {
    try {
        const shop = req.query.shop;
        logRequest(req, `GET /api/pages - Fetching pages for shop: ${shop}`);
        
        if (!shop) {
            console.error('❌ No shop parameter provided');
            return res.status(400).json({ 
                success: false, 
                error: 'Shop parameter is required',
                pages: []
            });
        }

        // Get access token with multiple fallback methods
        let accessToken = null;
        
        // Method 1: From cookies
        accessToken = req.cookies?.shopifyAccessToken;
        if (accessToken) {
            console.log('✅ Access token found in cookies');
        }
        
        // Method 2: From session
        if (!accessToken) {
            accessToken = getAccessToken(shop, req);
            if (accessToken) {
                console.log('✅ Access token found in session');
            }
        }
        
        // Method 3: From environment variables (for development)
        if (!accessToken) {
            accessToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || process.env.SHOPIFY_API_PASSWORD;
            if (accessToken) {
                console.log('✅ Access token found in environment variables');
            }
        }

        if (!accessToken) {
            console.error('❌ No access token available');
            return res.status(401).json({ 
                success: false, 
                error: 'Authentication required. Please reconnect your store.',
                pages: [],
                needsAuth: true
            });
        }

        // Fetch pages from Shopify
        console.log('📡 Fetching pages from Shopify API...');
        const result = await shopifyApi.getShopifyPages(shop, accessToken, req);
        
        if (result && result.pages) {
            console.log(`✅ Successfully fetched ${result.pages.length} pages`);
            
            // Enhance page data with additional fields
            const enhancedPages = result.pages.map(page => ({
                ...page,
                // Add computed fields
                hasContent: page.body_html && page.body_html.trim().length > 0,
                contentPreview: page.body_html ? 
                    page.body_html.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 
                    'No content',
                editUrl: `/builder?shop=${encodeURIComponent(shop)}&page=${page.id}`,
                frontendUrl: `https://${shop}/pages/${page.handle}`,
                lastModified: page.updated_at || page.created_at
            }));
            
            return res.json({
                success: true,
                pages: enhancedPages,
                count: enhancedPages.length,
                shop: shop
            });
        } else {
            console.warn('⚠️ No pages returned from Shopify API');
            return res.json({
                success: true,
                pages: [],
                count: 0,
                shop: shop,
                message: 'No pages found in your store'
            });
        }

    } catch (error) {
        console.error('❌ Error in GET /api/pages:', error);
        
        // Return user-friendly error response
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch pages from your store',
            details: error.message,
            pages: [],
            shop: req.query.shop
        });
    }
});

// Get single page by ID with enhanced error handling
router.get('/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params;
        const shop = req.query.shop;
        
        logRequest(req, `GET /api/pages/${pageId} - Fetching page for shop: ${shop}`);
        
        if (!shop) {
            return res.status(400).json({ 
                success: false, 
                error: 'Shop parameter is required' 
            });
        }

        if (!pageId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Page ID is required' 
            });
        }

        // Get access token
        let accessToken = req.cookies?.shopifyAccessToken || 
                         getAccessToken(shop, req) || 
                         process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(401).json({ 
                success: false, 
                error: 'Authentication required',
                needsAuth: true
            });
        }

        // Fetch specific page from Shopify
        console.log(`📡 Fetching page ${pageId} from Shopify API...`);
        const apiResponse = await shopifyApi.getShopifyPageById(shop, accessToken, pageId, req);
        
        // Handle Shopify API response structure
        let page = null;
        if (apiResponse && apiResponse.page) {
            page = apiResponse.page;
        } else if (apiResponse && apiResponse.id) {
            page = apiResponse;
        }
        
        if (page) {
            console.log(`✅ Successfully fetched page: ${page.title || 'Untitled'}`);
            console.log(`📄 Page content length: ${page.body_html ? page.body_html.length : 0} characters`);
            
            // Enhance page data
            const enhancedPage = {
                ...page,
                hasContent: page.body_html && page.body_html.trim().length > 0,
                contentPreview: page.body_html ? 
                    page.body_html.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : 
                    'No content',
                editUrl: `/builder?shop=${encodeURIComponent(shop)}&page=${page.id}`,
                frontendUrl: `https://${shop}/pages/${page.handle}`,
                lastModified: page.updated_at || page.created_at
            };
            
            return res.json({
                success: true,
                page: enhancedPage,
                shop: shop
            });
        } else {
            return res.status(404).json({
                success: false,
                error: 'Page not found',
                pageId: pageId,
                shop: shop
            });
        }

    } catch (error) {
        console.error(`❌ Error in GET /api/pages/${req.params.pageId}:`, error);
        
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch page',
            details: error.message,
            pageId: req.params.pageId,
            shop: req.query.shop
        });
    }
});

// Update page content with enhanced error handling
router.put('/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params;
        const { shop, content, title } = req.body;
        
        logRequest(req, `PUT /api/pages/${pageId} - Updating page for shop: ${shop}`);
        
        if (!shop || !pageId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Shop and page ID are required' 
            });
        }

        // Get access token
        let accessToken = req.cookies?.shopifyAccessToken || 
                         getAccessToken(shop, req) || 
                         process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(401).json({ 
                success: false, 
                error: 'Authentication required',
                needsAuth: true
            });
        }

        // Prepare update data
        const updateData = {
            page: {
                id: pageId,
                body_html: content || '',
                ...(title && { title: title })
            }
        };

        console.log(`📡 Updating page ${pageId} in Shopify...`);
        const updatedPage = await shopifyApi.updateShopifyPage(shop, accessToken, pageId, updateData);
        
        if (updatedPage) {
            console.log(`✅ Successfully updated page: ${updatedPage.title}`);
            
            return res.json({
                success: true,
                page: updatedPage,
                message: 'Page updated successfully',
                shop: shop
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Failed to update page in Shopify',
                pageId: pageId,
                shop: shop
            });
        }

    } catch (error) {
        console.error(`❌ Error in PUT /api/pages/${req.params.pageId}:`, error);
        
        return res.status(500).json({
            success: false,
            error: 'Failed to update page',
            details: error.message,
            pageId: req.params.pageId,
            shop: req.body.shop
        });
    }
});

// Create new page with enhanced error handling
router.post('/', async (req, res) => {
    try {
        const { shop, title, content = '', handle } = req.body;
        
        logRequest(req, `POST /api/pages - Creating new page for shop: ${shop}`);
        
        if (!shop || !title) {
            return res.status(400).json({ 
                success: false, 
                error: 'Shop and title are required' 
            });
        }

        // Get access token
        let accessToken = req.cookies?.shopifyAccessToken || 
                         getAccessToken(shop, req) || 
                         process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(401).json({ 
                success: false, 
                error: 'Authentication required',
                needsAuth: true
            });
        }

        // Prepare page data
        const pageData = {
            page: {
                title: title,
                body_html: content,
                ...(handle && { handle: handle })
            }
        };

        console.log(`📡 Creating new page "${title}" in Shopify...`);
        const newPage = await shopifyApi.createShopifyPage(shop, accessToken, pageData);
        
        if (newPage) {
            console.log(`✅ Successfully created page: ${newPage.title} (ID: ${newPage.id})`);
            
            return res.json({
                success: true,
                page: newPage,
                message: 'Page created successfully',
                shop: shop
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Failed to create page in Shopify',
                shop: shop
            });
        }

    } catch (error) {
        console.error('❌ Error in POST /api/pages:', error);
        
        return res.status(500).json({
            success: false,
            error: 'Failed to create page',
            details: error.message,
            shop: req.body.shop
        });
    }
});

// Delete page with enhanced error handling
router.delete('/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params;
        const shop = req.query.shop;
        
        logRequest(req, `DELETE /api/pages/${pageId} - Deleting page for shop: ${shop}`);
        
        if (!shop || !pageId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Shop and page ID are required' 
            });
        }

        // Get access token
        let accessToken = req.cookies?.shopifyAccessToken || 
                         getAccessToken(shop, req) || 
                         process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

        if (!accessToken) {
            return res.status(401).json({ 
                success: false, 
                error: 'Authentication required',
                needsAuth: true
            });
        }

        console.log(`📡 Deleting page ${pageId} from Shopify...`);
        const result = await shopifyApi.deleteShopifyPage(shop, accessToken, pageId);
        
        if (result) {
            console.log(`✅ Successfully deleted page ${pageId}`);
            
            return res.json({
                success: true,
                message: 'Page deleted successfully',
                pageId: pageId,
                shop: shop
            });
        } else {
            return res.status(500).json({
                success: false,
                error: 'Failed to delete page from Shopify',
                pageId: pageId,
                shop: shop
            });
        }

    } catch (error) {
        console.error(`❌ Error in DELETE /api/pages/${req.params.pageId}:`, error);
        
        return res.status(500).json({
            success: false,
            error: 'Failed to delete page',
            details: error.message,
            pageId: req.params.pageId,
            shop: req.query.shop
        });
    }
});

// Health check endpoint
router.get('/health/check', (req, res) => {
    res.json({
        success: true,
        message: 'Pages API is healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;