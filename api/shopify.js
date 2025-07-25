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
    
    console.log(`🔧 Updating page ${pageId} for shop: ${shop}`);
    console.log('📄 Update data:', JSON.stringify(pageData, null, 2));
    
    // Handle both formats: direct pageData or pageData.page
    const pageInfo = pageData.page || pageData;
    
    const requestData = {
      page: {
        id: parseInt(pageId),
        body_html: pageInfo.body_html || pageInfo.content || '',
        ...(pageInfo.title && { title: pageInfo.title }),
        ...(pageInfo.handle && { handle: pageInfo.handle }),
        ...(pageInfo.published !== undefined && { published: pageInfo.published })
      }
    };
    
    console.log('📡 Sending to Shopify:', JSON.stringify(requestData, null, 2));
    
    const response = await axios({
      method: 'PUT',
      url: `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/pages/${pageId}.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      data: requestData
    });

    console.log('✅ Shopify response:', response.status, response.statusText);
    return response.data.page;
  } catch (error) {
    console.error('❌ Error updating Shopify page:', error.message);
    if (error.response) {
      console.error('❌ Shopify API error:', error.response.status, error.response.data);
    }
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
    
    const apiUrl = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/pages.json`;
    console.log(`🔗 API URL: ${apiUrl}`);
    
    const response = await axios({
      method: 'GET',
      url: apiUrl,
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
    console.error('❌ Error fetching Shopify pages:', error.message);
    if (error.response) {
      console.error('📡 API Response Status:', error.response.status);
      console.error('❌ Shopify API Error Details:', error.response.data);
    }
    
    // Log the full API request for debugging
    console.log('📡 Making API request to:', `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/pages.json`);
    
    // Always return empty pages array instead of throwing error
    console.log('📄 Returning empty pages array due to API error');
    return {
      pages: []
    };
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