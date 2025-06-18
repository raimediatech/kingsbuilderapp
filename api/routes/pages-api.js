// api/routes/pages-api.js - Pages API routes
const express = require('express');
const router = express.Router();
const { requirePermission, PERMISSIONS } = require('../models/user');

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
    const page = pages.find(p => p.id === pageId);
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
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
    const { title, slug, content, template } = req.body;
    const shop = req.query.shop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Generate a unique ID
    const pageId = Date.now().toString();
    
    // Create new page
    const newPage = {
      id: pageId,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: 'draft',
      content: content || { elements: [] },
      template: template || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to pages array
    pages.push(newPage);
    
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
    
    // Update page
    const updatedPage = {
      ...pages[pageIndex],
      status: 'published',
      content: content || pages[pageIndex].content,
      updatedAt: new Date().toISOString()
    };
    
    // Replace page in array
    pages[pageIndex] = updatedPage;
    
    res.json({ page: updatedPage });
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

module.exports = router;