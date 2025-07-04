// api/routes/uploads.js - File upload routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const shopifyApi = require('../shopify');

// Create uploads directory if it doesn't exist (skip on Vercel)
const uploadsDir = path.join(__dirname, '../../public/uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  console.warn('Cannot create uploads directory (probably on Vercel):', error.message);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create shop-specific directory
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    const shopDir = path.join(uploadsDir, shop ? shop.replace(/[^a-z0-9]/gi, '_') : 'default');
    
    try {
      if (!fs.existsSync(shopDir)) {
        fs.mkdirSync(shopDir, { recursive: true });
      }
    } catch (error) {
      console.warn('Cannot create shop directory (probably on Vercel):', error.message);
    }
    
    cb(null, shopDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload image endpoint
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    const shopPath = shop ? shop.replace(/[^a-z0-9]/gi, '_') : 'default';
    
    // Generate URL for the uploaded file
    const fileUrl = `/uploads/${shopPath}/${req.file.filename}`;
    
    res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

// Upload to Shopify CDN (for production use)
router.post('/shopify-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session or environment
    const accessToken = req.session?.accessToken || process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token is required' });
    }
    
    // Read file data
    const fileData = fs.readFileSync(req.file.path);
    
    // Upload to Shopify
    const response = await shopifyApi.uploadFileToShopify(shop, accessToken, {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      data: fileData,
      alt: req.body.alt || req.file.originalname
    });
    
    // Delete local file after upload to Shopify
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: response.image.src
      }
    });
  } catch (error) {
    console.error('Error uploading image to Shopify:', error);
    res.status(500).json({ error: 'Failed to upload image to Shopify', details: error.message });
  }
});

// Delete uploaded image
router.delete('/image/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    const shopPath = shop ? shop.replace(/[^a-z0-9]/gi, '_') : 'default';
    
    // Prevent directory traversal attacks
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    const filePath = path.join(uploadsDir, shopPath, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Delete file
    fs.unlinkSync(filePath);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

module.exports = router;