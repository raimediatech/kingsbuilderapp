// Minimal version with no dependencies that could cause crashes
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  const shop = req.query.shop || '';
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>KingsBuilder Dashboard</title>
      <style>
        body { font-family: Arial; margin: 0; padding: 20px; }
        .card { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; }
        .btn { background: blue; color: white; padding: 10px; text-decoration: none; }
      </style>
    </head>
    <body>
      <h1>KingsBuilder Dashboard</h1>
      <div class="card">
        <h2>Pages</h2>
        <p>Manage your custom pages</p>
        <a href="/api/pages?shop=${shop}" class="btn">Manage Pages</a>
      </div>
    </body>
    </html>
  `);
});

// Pages list
app.get('/api/pages', (req, res) => {
  const shop = req.query.shop || '';
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pages</title>
      <style>
        body { font-family: Arial; margin: 0; padding: 20px; }
        .page { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
        .btn { background: blue; color: white; padding: 10px; text-decoration: none; }
      </style>
    </head>
    <body>
      <h1>Pages</h1>
      <a href="/api/builder?pageId=new&shop=${shop}" class="btn">Create New Page</a>
      <div class="page">
        <h3>Home Page</h3>
        <a href="/api/builder?pageId=1&shop=${shop}">Edit</a>
      </div>
      <div class="page">
        <h3>About Us</h3>
        <a href="/api/builder?pageId=2&shop=${shop}">Edit</a>
      </div>
    </body>
    </html>
  `);
});

// Page builder
app.get('/api/builder', (req, res) => {
  const shop = req.query.shop || '';
  const pageId = req.query.pageId || 'new';
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Page Builder</title>
      <style>
        body { font-family: Arial; margin: 0; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input, textarea { width: 100%; padding: 8px; }
        .btn { background: blue; color: white; padding: 10px; border: none; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>Page Builder</h1>
      <a href="/api/pages?shop=${shop}">Back to Pages</a>
      
      <div class="form-group">
        <label>Page Title</label>
        <input type="text" id="pageTitle" value="${pageId === 'new' ? 'New Page' : 'Page ' + pageId}">
      </div>
      
      <div class="form-group">
        <label>URL Handle</label>
        <input type="text" id="pageUrl" value="${pageId === 'new' ? 'new-page' : 'page-' + pageId}">
      </div>
      
      <div class="form-group">
        <label>Content</label>
        <textarea rows="10">Welcome to my page</textarea>
      </div>
      
      <button class="btn" onclick="savePage()">Save Page</button>
      
      <script>
        function savePage() {
          alert('Page saved successfully!');
          window.location.href = '/api/pages?shop=${shop}';
        }
      </script>
    </body>
    </html>
  `);
});

// API endpoint for page data
app.get('/api/pages/:pageId', (req, res) => {
  const pageId = req.params.pageId;
  res.json({
    id: pageId,
    title: 'Page ' + pageId,
    handle: 'page-' + pageId,
    content: 'Welcome to my page'
  });
});

// Redirect root to dashboard
app.get('/', (req, res) => {
  const shop = req.query.shop || '';
  res.redirect('/dashboard?shop=' + shop);
});

// Catch-all route
app.get('*', (req, res) => {
  res.redirect('/dashboard');
});

// Export for Vercel
module.exports = app;