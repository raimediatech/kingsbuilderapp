const axios = require('axios');
// Import session management
const { getAccessToken } = require('./utils/session');

// Load environment variables
try {
  require('dotenv').config();
  console.log('Environment variables loaded in shopify.js');
} catch (error) {
  console.log('No .env file found in shopify.js, using environment variables from the system');
}

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2023-10';

/**
 * Create a new page in Shopify
 */
async function createShopifyPage(shop, accessToken, pageData, req) {
  try {
    // First try to get token from parameters
    let token = accessToken;
    
    // If no token provided, try to get from session/cookies
    if (!token) {
      token = getAccessToken(shop, req);
      console.log('Got token from session/cookies:', token ? 'Yes' : 'No');
    }
    
    // Use environment token if still not found
    if (!token) {
      token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || process.env.SHOPIFY_API_PASSWORD;
      console.log('Using token from environment variables');
    }
    
    if (!token) {
      throw new Error('No access token available for this shop');
    }
    
    console.log(`Creating page in shop: ${shop}`);
    console.log('Page data:', JSON.stringify(pageData));
    
    const response = await axios({
      method: 'POST',
      url: `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/pages.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      data: {
        page: {
          title: pageData.title,
          body_html: pageData.body_html || pageData.content,
          handle: pageData.handle,
          published: pageData.published === true
        }
      }
    });

    console.log('Shopify API response:', response.status);
    console.log('Created page:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error creating Shopify page:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Update an existing page in Shopify
 */
async function updateShopifyPage(shop, accessToken, pageId, pageData) {
  try {
    // If no access token provided, throw error
    if (!accessToken) {
      throw new Error('No access token available for this shop');
    }
    
    const response = await axios({
      method: 'PUT',
      url: `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/pages/${pageId}.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      data: {
        page: {
          id: pageId,
          title: pageData.title,
          body_html: pageData.content,
          handle: pageData.handle,
          published: pageData.published
        }
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating Shopify page:', error.message);
    throw error;
  }
}

/**
 * Get a list of pages from Shopify
 */
async function getShopifyPages(shop, accessToken, req) {
  try {
    // First try to get token from session
    let token = accessToken;
    
    // If no token provided, try to get from session/cookies
    if (!token) {
      token = getAccessToken(shop, req);
      console.log('Got token from session/cookies:', token ? 'Yes' : 'No');
    }
    
    // If still no token, use environment variables
    if (!token) {
      token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || process.env.SHOPIFY_API_PASSWORD;
      console.log('Using token from environment variables');
    }
    
    if (!token) {
      throw new Error('No access token available for this shop');
    }
    
    console.log(`Fetching pages for shop: ${shop}`);
    
    const response = await axios({
      method: 'GET',
      url: `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/pages.json?fields=id,title,handle,body_html,published_at,created_at,updated_at,template_suffix,summary_on_blog_index,author,author_display_name,tags,metafields`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      }
    });

    console.log(`Successfully fetched ${response.data.pages ? response.data.pages.length : 0} pages`);
    
    // Log sample page to see what fields are available
    if (response.data.pages && response.data.pages.length > 0) {
      console.log('📄 Sample page data from Shopify API:', JSON.stringify(response.data.pages[0], null, 2));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching Shopify pages:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // For testing, return mock data if there's an error
    if (process.env.NODE_ENV !== 'production') {
      console.log('Returning mock data due to error');
      return {
        pages: [
          {
            id: '1',
            title: 'Home Page (Mock)',
            body_html: '<h1>Welcome to our store</h1><p>This is a sample page.</p>',
            handle: 'home',
            published_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'About Us (Mock)',
            body_html: '<h1>About Our Store</h1><p>We are a premium Shopify store.</p>',
            handle: 'about',
            published_at: new Date().toISOString()
          }
        ]
      };
    }
    
    throw error;
  }
}

/**
 * Get a single page from Shopify by ID
 */
async function getShopifyPageById(shop, accessToken, pageId, req) {
  try {
    // First try to get token from session
    let token = accessToken;
    
    // If no token provided, try to get from session/cookies
    if (!token) {
      token = getAccessToken(shop, req);
      console.log('Got token from session/cookies:', token ? 'Yes' : 'No');
    }
    
    // If still no token, use environment variables
    if (!token) {
      token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || process.env.SHOPIFY_API_PASSWORD;
      console.log('Using token from environment variables');
    }
    
    if (!token) {
      throw new Error('No access token available for this shop');
    }
    
    console.log(`Fetching page ${pageId} for shop: ${shop}`);
    
    const response = await axios({
      method: 'GET',
      url: `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/pages/${pageId}.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      }
    });

    console.log('Successfully fetched page from Shopify Admin API');
    return response.data;
  } catch (error) {
    console.error('Error fetching Shopify page:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // For testing, return mock data if there's an error
    if (process.env.NODE_ENV !== 'production') {
      console.log('Returning mock data due to error');
      return {
        page: {
          id: pageId,
          title: 'Mock Page ' + pageId + ' (Error Fallback)',
          body_html: '<h1>Mock Page Content</h1><p>This is a fallback page content for testing when API errors occur.</p>',
          handle: 'mock-page-' + pageId,
          published_at: new Date().toISOString()
        }
      };
    }
    
    throw error;
  }
}

/**
 * Delete a page from Shopify
 */
async function deleteShopifyPage(shop, accessToken, pageId) {
  try {
    // If no access token provided, throw error
    if (!accessToken) {
      throw new Error('No access token available for this shop');
    }
    
    const response = await axios({
      method: 'DELETE',
      url: `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/pages/${pageId}.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting Shopify page:', error.message);
    throw error;
  }
}

/**
 * Upload a file to Shopify
 */
async function uploadFileToShopify(shop, accessToken, fileData) {
  try {
    // If no access token provided, throw error
    if (!accessToken) {
      throw new Error('No access token available for this shop');
    }
    
    // Convert file data to base64
    const base64Data = fileData.data.toString('base64');
    
    // Upload to Shopify
    const response = await axios({
      method: 'POST',
      url: `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/images.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      data: {
        image: {
          attachment: base64Data,
          filename: fileData.filename,
          alt: fileData.alt || fileData.filename
        }
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading file to Shopify:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

module.exports = {
  createShopifyPage,
  updateShopifyPage,
  getShopifyPages,
  getShopifyPageById,
  deleteShopifyPage,
  uploadFileToShopify
};