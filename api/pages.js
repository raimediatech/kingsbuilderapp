const { getAccessToken } = require('./utils/session');

const express = require('express');
const { PageModel } = require('./database');
const { getSession } = require('../api/utils/session');
const fetch = require('node-fetch');

const router = express.Router();

// Get all pages
router.get('/', async (req, res) => {
  try {
    const shop = req.query.shop;
    if (!shop) return res.status(400).json({ error: 'Shop is required' });

    const pages = await PageModel.findByShop(shop);
    res.json(pages);
  } catch (err) {
    console.error('Error fetching pages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single page
router.get('/:handle', async (req, res) => {
  try {
    const shop = req.query.shop;
    const { handle } = req.params;
    const page = await PageModel.findOne(shop, handle);
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Update a page and push to Shopify
router.put('/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    const { shop } = req.body;
    let accessToken = req.body.accessToken || getAccessToken(shop, req);

    if (!accessToken && shop) {
      const session = await getSession(req, res, shop);
      accessToken = session?.accessToken;
    }

    if (!accessToken) return res.status(400).json({ error: 'Missing accessToken' });

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.accessToken;

    await PageModel.update(shop, handle, updateData);

    const shopifyRes = await fetch(`https://${shop}/admin/api/2023-10/pages/${updateData.shopifyPageId}.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: {
          id: updateData.shopifyPageId,
          title: updateData.title,
          body_html: updateData.content,
        }
      })
    });

    const result = await shopifyRes.json();
    if (!shopifyRes.ok) {
      console.error('Shopify update failed:', result);
      return res.status(500).json({ error: 'Failed to update on Shopify', details: result });
    }

    res.json(result);
  } catch (err) {
    console.error('Error updating page:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// Publish endpoint
router.post('/:handle/publish', async (req, res) => {
  try {
    const { handle } = req.params;
    const { shop } = req.body;
    let accessToken = req.body.accessToken || getAccessToken(shop, req);

    if (!accessToken && shop) {
      const session = await getSession(req, res, shop);
      accessToken = session?.accessToken;
    }

    if (!accessToken) return res.status(400).json({ error: 'Missing accessToken' });

    const page = await PageModel.findOne(shop, handle);
    if (!page) return res.status(404).json({ error: 'Page not found' });

    const shopifyRes = await fetch(`https://${shop}/admin/api/2023-10/pages/${page.shopifyPageId}.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: {
          id: page.shopifyPageId,
          title: page.title,
          body_html: page.content,
          published: true
        }
      })
    });

    const result = await shopifyRes.json();
    if (!shopifyRes.ok) {
      console.error('Shopify publish failed:', result);
      return res.status(500).json({ error: 'Failed to publish to Shopify', details: result });
    }

    res.json(result);
  } catch (err) {
    console.error('Error publishing page:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});


// Get single page by ID
router.get('/:id', async (req, res) => {
  try {
    const shop = req.query.shop;
    const id = req.params.id;
    if (!shop) return res.status(400).json({ error: 'Shop is required' });
    if (!id) return res.status(400).json({ error: 'Page ID is required' });

    // No local DB lookup implemented

    // Fallback: fetch directly from Shopify if not in our DB
    const accessToken = await getAccessToken(shop);
    if (!accessToken) {
      return res.status(404).json({ error: 'Page not found locally and no token to fetch from Shopify' });
    }

    const shopifyRes = await fetch(`https://${shop}/admin/api/2023-10/pages/${id}.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!shopifyRes.ok) {
      const resJson = await shopifyRes.json();
      return res.status(shopifyRes.status).json({ error: 'Failed to fetch from Shopify', details: resJson });
    }

    const { page: shopifyPage } = await shopifyRes.json();

    res.json({ success: true, page: { ...shopifyPage, content: shopifyPage.body_html } });
  } catch (err) {
    console.error('Error loading page:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});


// Update page by ID
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const shop = req.query.shop || req.body.shop;
    const { title, content } = req.body;
    if (!shop) return res.status(400).json({ error: 'Shop is required' });
    if (!id) return res.status(400).json({ error: 'Page ID is required' });
    if (!title && !content) return res.status(400).json({ error: 'Nothing to update' });

    const accessToken = await getAccessToken(shop);
    if (!accessToken) {
      return res.status(400).json({ error: 'Missing accessToken' });
    }

    const shopifyRes = await fetch(`https://${shop}/admin/api/2023-10/pages/${id}.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: {
          id,
          title,
          body_html: content,
        }
      })
    });

    const result = await shopifyRes.json();
    if (!shopifyRes.ok) {
      return res.status(shopifyRes.status).json({ error: 'Failed to update page in Shopify', details: result });
    }

    res.json({ success: true, page: result.page || result });
  } catch (err) {
    console.error('Error updating page:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
