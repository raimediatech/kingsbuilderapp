// api/routes/dashboard-modern.js - Modern Dashboard routes
const express = require('express');
const router = express.Router();
const shopifyApi = require('../shopify');
const { PageModel } = require('../database');
const axios = require('axios');

// Dashboard home page
router.get('/', async (req, res) => {
  try {
    // Get shop from various possible sources - prioritize cookie over query to avoid mismatch
    const shop = req.cookies?.shopOrigin || req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'];
    
    // Get access token from various possible sources
    const accessToken = req.cookies?.shopifyAccessToken || req.cookies?.accessToken || req.headers['x-shopify-access-token'] || req.shopifyAccessToken;
    
    // Debug logging
    console.log('🎯 Dashboard route hit:', {
      shop_query: req.query.shop,
      shop_cookie: req.cookies?.shopOrigin,
      has_access_token: !!accessToken,
      token_preview: accessToken ? `${accessToken.substring(0, 10)}...` : 'undefined...',
      all_cookies: req.cookies ? Object.keys(req.cookies) : []
    });
    
    // If no shop parameter but we have shop in cookies, redirect with shop parameter
    if (!req.query.shop && req.cookies?.shopOrigin) {
      const shopFromCookie = req.cookies.shopOrigin;
      console.log(`📍 Redirecting to include shop parameter: ${shopFromCookie}`);
      return res.redirect(`/dashboard?shop=${encodeURIComponent(shopFromCookie)}`);
    }
    
    // If we have a shop mismatch, use the cookie value and redirect
    if (req.query.shop && req.cookies?.shopOrigin && req.query.shop !== req.cookies.shopOrigin) {
      console.log(`🔄 Shop mismatch detected. Query: ${req.query.shop}, Cookie: ${req.cookies.shopOrigin}. Using cookie value.`);
      return res.redirect(`/dashboard?shop=${encodeURIComponent(req.cookies.shopOrigin)}`);
    }
    
    // If no shop at all, redirect to install
    if (!shop || shop === 'unknown.myshopify.com') {
      console.log('❌ No valid shop parameter found, redirecting to install');
      return res.redirect('/install');
    }

    // Set security headers for Shopify iframe embedding
    res.setHeader(
      "Content-Security-Policy",
      "frame-ancestors 'self' https://*.myshopify.com https://*.shopify.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com;"
    );

    // Remove X-Frame-Options as it's deprecated and causing issues
    res.removeHeader('X-Frame-Options');

    // Get pages from KingsBuilder pages-api (where pages are actually saved)
    let pages = [];

    try {
      // Load pages from our pages-api directly
      const pagesApi = require('./pages-api');
      const kingsBuilderPages = pagesApi.getPages ? pagesApi.getPages() : [];
      console.log(`📄 Retrieved ${kingsBuilderPages.length} pages from KingsBuilder`);
      
      // Log page details for debugging
      if (kingsBuilderPages.length > 0) {
        console.log('📋 KingsBuilder pages:', kingsBuilderPages.map(p => ({ id: p.id, title: p.title, status: p.status })));
      }
      
      // Also try to get Shopify pages if we have access
      if (shop && accessToken) {
        try {
          const result = await shopifyApi.getShopifyPages(shop, accessToken);
          const shopifyPages = result.pages || [];
          console.log(`Retrieved ${shopifyPages.length} pages from Shopify`);
          
          // Combine both sources, prioritizing KingsBuilder pages
          pages = [...kingsBuilderPages, ...shopifyPages];
        } catch (error) {
          console.error('❌ Error fetching pages from Shopify:', error);
          // Use only KingsBuilder pages
          pages = kingsBuilderPages;
        }
      } else {
        // Use only KingsBuilder pages
        pages = kingsBuilderPages;
      }
    } catch (error) {
      console.error('❌ Error fetching pages from KingsBuilder:', error);
      // Fall back to mock data
      console.log('📄 Using mock data as fallback');
      pages = [
        { id: '1', title: 'Homepage', body_html: '<p>Welcome to our store</p>', handle: 'home', published: true },
        { id: '2', title: 'About Us', body_html: '<p>Our company story</p>', handle: 'about', published: true },
        { id: '3', title: 'Contact', body_html: '<p>Get in touch</p>', handle: 'contact', published: true }
      ];
    }
    
    // Log final page count
    console.log(`📊 Total pages to display: ${pages.length}`);
    if (pages.length > 0) {
      console.log('📋 Final page list:', pages.map(p => ({ id: p.id, title: p.title, status: p.status || (p.published ? 'published' : 'draft') })));
    }

    // Render the dashboard
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KingsBuilder Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          :root {
            --primary-color: #000000;
            --primary-hover: #333333;
            --text-color: #333333;
            --bg-color: #ffffff;
            --card-bg: #f9f9f9;
            --border-color: #e5e5e5;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --danger-color: #ef4444;
          }
          
          [data-theme="dark"] {
            --primary-color: #000000;
            --primary-hover: #333333;
            --text-color: #e5e5e5;
            --bg-color: #121212;
            --card-bg: #1e1e1e;
            --border-color: #333333;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --danger-color: #ef4444;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .dashboard {
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
          }
          
          .sidebar {
            background-color: var(--card-bg);
            border-right: 1px solid var(--border-color);
            padding: 30px 0;
            position: sticky;
            top: 0;
            height: 100vh;
            overflow-y: auto;
          }
          
          .logo {
            padding: 0 20px 30px;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 20px;
          }
          
          .logo h1 {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-color);
          }
          
          .nav-menu {
            list-style: none;
          }
          
          .nav-item {
            margin-bottom: 5px;
          }
          
          .nav-link {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: var(--text-color);
            text-decoration: none;
            border-radius: 6px;
            margin: 0 10px;
            transition: all 0.2s;
          }
          
          .nav-link:hover, .nav-link.active {
            background-color: var(--primary-color);
            color: white;
          }
          
          .nav-link i {
            margin-right: 10px;
            width: 20px;
            text-align: center;
          }
          
          .main-content {
            padding: 30px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .header h2 {
            font-size: 24px;
            font-weight: 600;
          }
          
          .theme-toggle {
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
            margin-right: 15px;
          }
          
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 20px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
            text-decoration: none;
          }
          
          .btn:hover {
            background-color: var(--primary-hover);
          }
          
          .btn i {
            margin-right: 8px;
          }
          
          .btn-outline {
            background-color: transparent;
            border: 1px solid var(--primary-color);
            color: var(--primary-color);
          }
          
          .btn-outline:hover {
            background-color: var(--primary-color);
            color: white;
          }
          
          .btn-success {
            background-color: var(--success-color);
          }
          
          .btn-warning {
            background-color: var(--warning-color);
          }
          
          .btn-danger {
            background-color: var(--danger-color);
          }
          
          .card {
            background-color: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            padding: 25px;
            margin-bottom: 30px;
          }
          
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          
          .card-title {
            font-size: 18px;
            font-weight: 600;
          }
          
          .search-box {
            position: relative;
            margin-bottom: 20px;
          }
          
          .search-box input {
            width: 100%;
            padding: 12px 20px;
            padding-left: 40px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 14px;
            background-color: var(--bg-color);
            color: var(--text-color);
          }
          
          .search-box i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #888;
          }
          
          .table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .table th, .table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
          }
          
          .table th {
            font-weight: 600;
            color: var(--text-color);
            background-color: var(--card-bg);
          }
          
          .table tr:last-child td {
            border-bottom: none;
          }
          
          .table tr:hover td {
            background-color: rgba(0, 0, 0, 0.02);
          }
          
          .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }
          
          .status-published {
            background-color: rgba(16, 185, 129, 0.1);
            color: var(--success-color);
          }
          
          .status-draft {
            background-color: rgba(245, 158, 11, 0.1);
            color: var(--warning-color);
          }
          
          .actions {
            display: flex;
            gap: 10px;
          }
          
          .action-btn {
            background: none;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            font-size: 16px;
            transition: color 0.2s;
          }
          
          .action-btn:hover {
            color: var(--primary-color);
          }
          
          .empty-state {
            text-align: center;
            padding: 50px 0;
          }
          
          .empty-state i {
            font-size: 50px;
            color: #ccc;
            margin-bottom: 20px;
          }
          
          .empty-state h3 {
            font-size: 20px;
            margin-bottom: 10px;
          }
          
          .empty-state p {
            color: #888;
            margin-bottom: 20px;
          }
          
          @media (max-width: 768px) {
            .dashboard {
              grid-template-columns: 1fr;
            }
            
            .sidebar {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="dashboard">
          <aside class="sidebar">
            <div class="logo">
              <h1>KingsBuilder</h1>
            </div>
            <ul class="nav-menu">
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="fas fa-home"></i>
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="fas fa-file"></i>
                  Pages
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="fas fa-palette"></i>
                  Templates
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="fas fa-cog"></i>
                  Settings
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="fas fa-question-circle"></i>
                  Help
                </a>
              </li>
            </ul>
          </aside>
          
          <main class="main-content">
            <div class="header">
              <h2>Pages</h2>
              <div style="display: flex; align-items: center;">
                <button id="theme-toggle" class="theme-toggle">
                  <i class="fas fa-moon"></i>
                </button>
                <a href="/pages/new?shop=${shop}" class="btn">
                  <i class="fas fa-plus"></i>
                  Create Page
                </a>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">All Pages</h3>
              </div>
              
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="search-input" placeholder="Search pages...">
              </div>
              
              ${pages.length > 0 ? `
                <table class="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Handle</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="pages-table-body">
                    ${pages.map(page => `
                      <tr>
                        <td>${page.title}</td>
                        <td>${page.handle || page.slug || 'N/A'}</td>
                        <td>
                          <span class="status ${(page.published || page.status === 'published') ? 'status-published' : 'status-draft'}">
                            ${(page.published || page.status === 'published') ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td class="actions">
                          <a href="/app/builder?pageId=${page.id}&shop=${shop}" class="action-btn" title="Edit">
                            <i class="fas fa-edit"></i>
                          </a>
                          <button class="action-btn" title="Delete" onclick="deletePage('${page.id}')">
                            <i class="fas fa-trash"></i>
                          </button>
                          ${page.handle || page.slug ? `
                            <a href="https://${shop}/pages/${page.handle || page.slug}" target="_blank" class="action-btn" title="View">
                              <i class="fas fa-external-link-alt"></i>
                            </a>
                          ` : ''}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : `
                <div class="empty-state">
                  <i class="fas fa-file-alt"></i>
                  <h3>No pages found</h3>
                  <p>Create your first page to get started</p>
                  <a href="/pages/new?shop=${shop}" class="btn">
                    <i class="fas fa-plus"></i>
                    Create Page
                  </a>
                </div>
              `}
            </div>
          </main>
        </div>
        
        <script>
          // Theme toggle functionality
          const themeToggle = document.getElementById('theme-toggle');
          const themeIcon = themeToggle.querySelector('i');
          
          // Check for saved theme preference or use device preference
          const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          
          // Apply the theme
          document.documentElement.setAttribute('data-theme', savedTheme);
          updateThemeIcon(savedTheme);
          
          // Toggle theme when button is clicked
          themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
          });
          
          function updateThemeIcon(theme) {
            if (theme === 'dark') {
              themeIcon.classList.remove('fa-moon');
              themeIcon.classList.add('fa-sun');
            } else {
              themeIcon.classList.remove('fa-sun');
              themeIcon.classList.add('fa-moon');
            }
          }
          
          // Search functionality
          const searchInput = document.getElementById('search-input');
          const pagesTableBody = document.getElementById('pages-table-body');
          
          if (searchInput && pagesTableBody) {
            searchInput.addEventListener('input', () => {
              const searchTerm = searchInput.value.toLowerCase();
              const rows = pagesTableBody.querySelectorAll('tr');
              
              rows.forEach(row => {
                const title = row.cells[0].textContent.toLowerCase();
                const handle = row.cells[1].textContent.toLowerCase();
                
                if (title.includes(searchTerm) || handle.includes(searchTerm)) {
                  row.style.display = '';
                } else {
                  row.style.display = 'none';
                }
              });
            });
          }
          
          // Delete page functionality
          function deletePage(pageId) {
            if (confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
              fetch(\`/pages/\${pageId}\`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  alert('Page deleted successfully');
                  window.location.reload();
                } else {
                  alert('Error deleting page: ' + data.error);
                }
              })
              .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the page');
              });
            }
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send(`
      <h1>Error</h1>
      <p>An error occurred while loading the dashboard: ${error.message}</p>
      <pre>${error.stack}</pre>
    `);
  }
});

module.exports = router;



