const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

// Load environment variables
try {
  require('dotenv').config();
  console.log('Environment variables loaded');
} catch (error) {
  console.log('No .env file found, using environment variables from the system');
}

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Shopify-Access-Token', 'X-Shopify-Shop-Domain', 'x-user-email']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET || 'kings-builder-session-secret'));

// Add security headers middleware for Shopify iframe embedding
app.use((req, res, next) => {
  // Set security headers for Shopify iframe embedding
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://*.myshopify.com https://*.shopify.com https://admin.shopify.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://cdnjs.cloudflare.com; connect-src 'self' https://*.myshopify.com https://*.shopify.com https://admin.shopify.com;"
  );
  
  // Set Access-Control-Allow headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-email, x-shopify-shop-domain, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Simple test route to check if the server is working
app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is working!',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// App route for Shopify admin
app.get('/app', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;
  
  if (shop) {
    // Redirect to dashboard with shop parameter
    res.redirect('/dashboard?shop=' + shop);
  } else {
    // If no shop parameter, redirect to install
    res.redirect('/install');
  }
});

// Middleware to store access token in session
app.use((req, res, next) => {
  try {
    const shop = req.query.shop || req.cookies?.shopOrigin;
    const accessToken = req.cookies?.shopifyAccessToken;
    
    if (shop && accessToken) {
      // Import session management
      const { storeAccessToken } = require('./utils/session');
      storeAccessToken(shop, accessToken);
      console.log(`Stored access token for shop ${shop} in session`);
    }
    
    next();
  } catch (error) {
    console.error('Error storing access token in session:', error);
    next();
  }
});

// Import auth routes
try {
  const authRoutes = require('./auth');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes registered successfully');
} catch (error) {
  console.error('Error loading auth routes:', error);
}

// Install route
app.get('/install', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/install.html'));
});

// Import dashboard routes
try {
  const dashboardRoutes = require('./routes/dashboard');
  app.use('/dashboard', dashboardRoutes);
  console.log('Dashboard routes registered successfully');
} catch (error) {
  console.error('Error loading dashboard routes:', error);
}

// Import pages routes
try {
  const pagesRoutes = require('./routes/pages');
  app.use('/pages', pagesRoutes);
  console.log('Pages routes registered successfully');
} catch (error) {
  console.error('Error loading pages routes:', error);
}

// Import API routes
try {
  // Try to load the fixed API routes first
  let apiRoutes;
  try {
    apiRoutes = require('./routes/api-fixed');
    console.log('Using fixed API routes');
  } catch (fixedError) {
    console.log('Fixed API routes not found, falling back to original routes');
    apiRoutes = require('./routes/api');
  }
  
  app.use('/api', apiRoutes);
  console.log('API routes registered successfully');
} catch (error) {
  console.error('Error loading API routes:', error);
}

// Import uploads routes
try {
  const uploadsRoutes = require('./routes/uploads');
  app.use('/api/uploads', uploadsRoutes);
  console.log('Uploads routes registered successfully');
} catch (error) {
  console.error('Error loading uploads routes:', error);
}

// Import templates API routes
try {
  const templatesApiRoutes = require('./routes/templates-api');
  app.use('/api/templates', templatesApiRoutes);
  console.log('Templates API routes registered successfully');
} catch (error) {
  console.error('Error loading templates API routes:', error);
}

// Import page templates API routes
try {
  const pageTemplatesRoutes = require('./routes/page-templates');
  app.use('/api/page-templates', pageTemplatesRoutes);
  console.log('Page Templates API routes registered successfully');
} catch (error) {
  console.error('Error loading page templates API routes:', error);
}

// Import users API routes
try {
  const usersApiRoutes = require('./routes/users-api');
  app.use('/api/users', usersApiRoutes);
  console.log('Users API routes registered successfully');
} catch (error) {
  console.error('Error loading users API routes:', error);
}

// Import pages API routes
try {
  const pagesApiRoutes = require('./routes/pages-api');
  app.use('/api/pages', pagesApiRoutes);
  console.log('Pages API routes registered successfully');
} catch (error) {
  console.error('Error loading pages API routes:', error);
}

// Import templates routes
try {
  const templatesRoutes = require('./routes/templates');
  app.use('/templates', templatesRoutes);
  console.log('Templates routes registered successfully');
} catch (error) {
  console.error('Error loading templates routes:', error);
}

// Import users routes
try {
  const usersRoutes = require('./routes/users');
  app.use('/users', usersRoutes);
  console.log('Users routes registered successfully');
} catch (error) {
  console.error('Error loading users routes:', error);
}

// Import builder routes
try {
  // Try to load the fixed builder routes first
  let builderRoutes;
  try {
    builderRoutes = require('./routes/builder-fixed');
    console.log('Using fixed builder routes');
  } catch (fixedError) {
    console.log('Fixed builder routes not found, falling back to original routes');
    try {
      builderRoutes = require('./routes/builder');
    } catch (originalError) {
      console.error('Error loading original builder routes:', originalError);
      throw originalError;
    }
  }
  
  app.use('/builder', builderRoutes);
  console.log('Builder routes registered successfully');
} catch (error) {
  console.error('Error loading builder routes:', error);
}

// Import settings routes
try {
  const settingsRoutes = require('./routes/settings');
  app.use('/settings', settingsRoutes);
  console.log('Settings routes registered successfully');
} catch (error) {
  console.error('Error loading settings routes:', error);
}

// Import help routes
try {
  const helpRoutes = require('./routes/help');
  app.use('/help', helpRoutes);
  console.log('Help routes registered successfully');
} catch (error) {
  console.error('Error loading help routes:', error);
}

// Root route - redirect to dashboard or landing
app.get('/', (req, res) => {
  const shop = req.query.shop || req.cookies?.shopOrigin;

  if (shop) {
    // If we have a shop parameter, go to dashboard
    res.redirect('/dashboard?shop=' + shop);
  } else {
    // Otherwise show a simple landing page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>KingsBuilder</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: sans-serif; margin: 0; padding: 20px; background: #f6f6f7; text-align: center; }
            .container { max-width: 800px; margin: 100px auto; }
            h1 { color: #333; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; margin-bottom: 20px; }
            .btn { display: inline-block; background: #000; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>KingsBuilder</h1>
            <p>The Ultimate Page Builder for Shopify</p>
            <a href="/install" class="btn">Get Started</a>
          </div>
        </body>
      </html>
    `);
  }
});

// Export for Vercel
module.exports = app;



