// api/routes/templates-api.js - Templates API routes
const express = require('express');
const router = express.Router();

// Import models if mongoose is available
let Template;
try {
  Template = require('../models/template');
} catch (error) {
  console.log('MongoDB models not available, templates will use local storage');
}

// In-memory templates storage as fallback
const localTemplates = {
  // Default templates
  default: [
    {
      id: 'hero-1',
      name: 'Hero Section 1',
      description: 'A simple hero section with heading, text and button',
      category: 'hero',
      content: [
        {
          type: 'hero',
          html: `
            <div style="background-color: #f0f0f0; padding: 60px 20px; text-align: center;">
              <h1>Hero Title</h1>
              <p style="margin: 20px 0;">Hero subtitle text goes here. This is a sample hero section.</p>
              <button class="btn" style="background-color: #000; color: #fff; padding: 10px 20px;">Call to Action</button>
            </div>
          `
        }
      ],
      thumbnail: '/assets/templates/hero-1.jpg',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: true
    },
    {
      id: 'features-1',
      name: 'Features Section',
      description: 'A 3-column features section',
      category: 'features',
      content: [
        {
          type: 'features',
          html: `
            <div style="padding: 60px 20px; text-align: center;">
              <h2 style="margin-bottom: 40px;">Our Features</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
                <div style="flex: 1; min-width: 250px; padding: 20px;">
                  <div style="font-size: 48px; margin-bottom: 20px;">🚀</div>
                  <h3 style="margin-bottom: 15px;">Feature 1</h3>
                  <p>Description of feature 1 goes here. Keep it short and sweet.</p>
                </div>
                <div style="flex: 1; min-width: 250px; padding: 20px;">
                  <div style="font-size: 48px; margin-bottom: 20px;">⚡</div>
                  <h3 style="margin-bottom: 15px;">Feature 2</h3>
                  <p>Description of feature 2 goes here. Keep it short and sweet.</p>
                </div>
                <div style="flex: 1; min-width: 250px; padding: 20px;">
                  <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
                  <h3 style="margin-bottom: 15px;">Feature 3</h3>
                  <p>Description of feature 3 goes here. Keep it short and sweet.</p>
                </div>
              </div>
            </div>
          `
        }
      ],
      thumbnail: '/assets/templates/features-1.jpg',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: true
    }
  ]
};

// Get all templates
router.get('/', async (req, res) => {
  try {
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    let templates = [];
    
    // If MongoDB is available, get templates from database
    if (Template) {
      // Get shop-specific templates and public templates
      templates = await Template.find({
        $or: [
          { shop },
          { isPublic: true }
        ]
      }).sort({ updatedAt: -1 });
    } else {
      // Use local templates as fallback
      templates = localTemplates.default || [];
      
      // Add shop-specific templates from local storage if available
      if (localTemplates[shop]) {
        templates = [...templates, ...localTemplates[shop]];
      }
    }
    
    res.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates', details: error.message });
  }
});

// Get template by ID
router.get('/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    let template;
    
    // If MongoDB is available, get template from database
    if (Template) {
      template = await Template.findOne({
        _id: templateId,
        $or: [
          { shop },
          { isPublic: true }
        ]
      });
    } else {
      // Use local templates as fallback
      template = localTemplates.default.find(t => t.id === templateId);
      
      // Check shop-specific templates if not found in default templates
      if (!template && localTemplates[shop]) {
        template = localTemplates[shop].find(t => t.id === templateId);
      }
    }
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({ template });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template', details: error.message });
  }
});

// Create template
router.post('/', async (req, res) => {
  try {
    const templateData = req.body;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    if (!templateData.name || !templateData.content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }
    
    let template;
    
    // If MongoDB is available, create template in database
    if (Template) {
      template = await Template.create({
        ...templateData,
        shop,
        createdBy: req.session?.user?.email || 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Use local templates as fallback
      const newTemplate = {
        id: `template-${Date.now()}`,
        ...templateData,
        shop,
        createdBy: req.session?.user?.email || 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Initialize shop-specific templates if not exists
      if (!localTemplates[shop]) {
        localTemplates[shop] = [];
      }
      
      // Add new template
      localTemplates[shop].push(newTemplate);
      template = newTemplate;
    }
    
    res.json({ success: true, template });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template', details: error.message });
  }
});

// Update template
router.put('/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    const templateData = req.body;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    let template;
    
    // If MongoDB is available, update template in database
    if (Template) {
      template = await Template.findOneAndUpdate(
        { _id: templateId, shop },
        {
          ...templateData,
          updatedAt: new Date()
        },
        { new: true }
      );
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found or you do not have permission to update it' });
      }
    } else {
      // Use local templates as fallback
      if (!localTemplates[shop]) {
        return res.status(404).json({ error: 'No templates found for this shop' });
      }
      
      const templateIndex = localTemplates[shop].findIndex(t => t.id === templateId);
      
      if (templateIndex === -1) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      // Update template
      localTemplates[shop][templateIndex] = {
        ...localTemplates[shop][templateIndex],
        ...templateData,
        updatedAt: new Date().toISOString()
      };
      
      template = localTemplates[shop][templateIndex];
    }
    
    res.json({ success: true, template });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template', details: error.message });
  }
});

// Delete template
router.delete('/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // If MongoDB is available, delete template from database
    if (Template) {
      const result = await Template.deleteOne({ _id: templateId, shop });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Template not found or you do not have permission to delete it' });
      }
    } else {
      // Use local templates as fallback
      if (!localTemplates[shop]) {
        return res.status(404).json({ error: 'No templates found for this shop' });
      }
      
      const templateIndex = localTemplates[shop].findIndex(t => t.id === templateId);
      
      if (templateIndex === -1) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      // Remove template
      localTemplates[shop].splice(templateIndex, 1);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template', details: error.message });
  }
});

module.exports = router;