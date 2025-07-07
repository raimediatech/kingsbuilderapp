const { getAccessToken } = require('./utils/shop-session');

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
    let accessToken = req.body.accessToken;

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
    let accessToken = req.body.accessToken;

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

module.exports = router;
