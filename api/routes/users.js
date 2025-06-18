// api/routes/users.js - Users management UI routes
const express = require('express');
const router = express.Router();
const { getShopUsers, requirePermission } = require('../services/auth');
const { PERMISSIONS, ROLES } = require('../models/user');

// Users management page
router.get('/', async (req, res) => {
  try {
    // Get shop from query parameter
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    const userEmail = req.query.email || req.headers['x-user-email'];
    
    if (!shop) {
      return res.redirect('/install');
    }
    
    // Set security headers for Shopify iframe embedding
    res.setHeader(
      "Content-Security-Policy",
      "frame-ancestors 'self' https://*.myshopify.com https://*.shopify.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com;"
    );

    // Remove X-Frame-Options as it's deprecated and causing issues
    res.removeHeader('X-Frame-Options');
    
    // Get users for the shop
    let users = [];
    let currentUser = null;
    
    try {
      users = await getShopUsers(shop);
      
      if (userEmail) {
        currentUser = users.find(user => user.email === userEmail);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    
    // Check if current user has permission to manage users
    const canManageUsers = currentUser && currentUser.hasPermission(PERMISSIONS.MANAGE_USERS);

    // Render the users management page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KingsBuilder - Team Management</title>
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
          }

          [data-theme="dark"] {
            --primary-color: #000000;
            --primary-hover: #333333;
            --text-color: #e5e5e5;
            --bg-color: #121212;
            --card-bg: #1e1e1e;
            --border-color: #333333;
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

          .btn-secondary {
            background-color: transparent;
            color: var(--text-color);
            border: 1px solid var(--border-color);
          }

          .btn-secondary:hover {
            background-color: var(--card-bg);
          }

          .btn-danger {
            background-color: #dc3545;
          }

          .btn-danger:hover {
            background-color: #bd2130;
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

          .table {
            width: 100%;
            border-collapse: collapse;
          }

          .table th,
          .table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
          }

          .table th {
            font-weight: 600;
            color: var(--text-color);
            opacity: 0.7;
          }

          .table tr:last-child td {
            border-bottom: none;
          }

          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
          }

          .badge-admin {
            background-color: #007bff;
            color: white;
          }

          .badge-editor {
            background-color: #28a745;
            color: white;
          }

          .badge-viewer {
            background-color: #6c757d;
            color: white;
          }

          .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
          }

          .modal-content {
            background-color: var(--bg-color);
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 100%;
            max-width: 500px;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .modal-title {
            font-size: 20px;
            font-weight: 600;
          }

          .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-color);
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
          }

          .form-control {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background-color: var(--bg-color);
            color: var(--text-color);
            font-size: 14px;
          }

          .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
          }

          .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
          }

          .loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
          }

          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .alert {
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: none;
          }

          .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }

          .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
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
                <a href="/dashboard?shop=${shop}" class="nav-link">
                  <i class="fas fa-home"></i>
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a href="/pages?shop=${shop}" class="nav-link">
                  <i class="fas fa-file"></i>
                  Pages
                </a>
              </li>
              <li class="nav-item">
                <a href="/templates?shop=${shop}" class="nav-link">
                  <i class="fas fa-palette"></i>
                  Templates
                </a>
              </li>
              <li class="nav-item">
                <a href="/users?shop=${shop}" class="nav-link active">
                  <i class="fas fa-users"></i>
                  Team
                </a>
              </li>
              <li class="nav-item">
                <a href="/settings?shop=${shop}" class="nav-link">
                  <i class="fas fa-cog"></i>
                  Settings
                </a>
              </li>
              <li class="nav-item">
                <a href="/help?shop=${shop}" class="nav-link">
                  <i class="fas fa-question-circle"></i>
                  Help
                </a>
              </li>
            </ul>
          </aside>

          <main class="main-content">
            <div class="header">
              <h2>Team Management</h2>
              <div style="display: flex; align-items: center;">
                <button id="theme-toggle" class="theme-toggle">
                  <i class="fas fa-moon"></i>
                </button>
                ${canManageUsers ? `
                <button id="invite-user-btn" class="btn">
                  <i class="fas fa-user-plus"></i> Invite Team Member
                </button>
                ` : ''}
              </div>
            </div>

            <div id="alert-success" class="alert alert-success"></div>
            <div id="alert-danger" class="alert alert-danger"></div>

            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Team Members</h3>
              </div>

              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    ${canManageUsers ? '<th>Actions</th>' : ''}
                  </tr>
                </thead>
                <tbody id="users-table-body">
                  ${users.map(user => `
                    <tr data-user-id="${user._id}">
                      <td>${user.name}</td>
                      <td>${user.email}</td>
                      <td>
                        <span class="badge badge-${user.role}">
                          ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td>${user.active ? 'Active' : 'Pending'}</td>
                      ${canManageUsers ? `
                        <td>
                          <button class="btn btn-secondary btn-sm edit-user-btn" data-user-id="${user._id}">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-danger btn-sm delete-user-btn" data-user-id="${user._id}">
                            <i class="fas fa-trash"></i>
                          </button>
                        </td>
                      ` : ''}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </main>
        </div>

        <!-- Invite User Modal -->
        <div id="invite-modal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Invite Team Member</h3>
              <button class="modal-close">&times;</button>
            </div>
            <form id="invite-form">
              <div class="form-group">
                <label for="invite-email" class="form-label">Email</label>
                <input type="email" id="invite-email" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="invite-name" class="form-label">Name</label>
                <input type="text" id="invite-name" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="invite-role" class="form-label">Role</label>
                <select id="invite-role" class="form-control" required>
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                <button type="submit" class="btn">Send Invite</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Edit User Modal -->
        <div id="edit-modal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Edit Team Member</h3>
              <button class="modal-close">&times;</button>
            </div>
            <form id="edit-form">
              <input type="hidden" id="edit-user-id">
              <div class="form-group">
                <label for="edit-email" class="form-label">Email</label>
                <input type="email" id="edit-email" class="form-control" disabled>
              </div>
              <div class="form-group">
                <label for="edit-name" class="form-label">Name</label>
                <input type="text" id="edit-name" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="edit-role" class="form-label">Role</label>
                <select id="edit-role" class="form-control" required>
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                <button type="submit" class="btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Delete User Modal -->
        <div id="delete-modal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Delete Team Member</h3>
              <button class="modal-close">&times;</button>
            </div>
            <p>Are you sure you want to delete this team member? This action cannot be undone.</p>
            <form id="delete-form">
              <input type="hidden" id="delete-user-id">
              <div class="form-actions">
                <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                <button type="submit" class="btn btn-danger">Delete</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Loading Spinner -->
        <div id="loading" class="loading" style="display: none;">
          <div class="spinner"></div>
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

          // Modal functionality
          const modals = document.querySelectorAll('.modal');
          const modalCloseButtons = document.querySelectorAll('.modal-close, .cancel-btn');
          const inviteUserBtn = document.getElementById('invite-user-btn');
          const editUserBtns = document.querySelectorAll('.edit-user-btn');
          const deleteUserBtns = document.querySelectorAll('.delete-user-btn');

          // Open invite modal
          if (inviteUserBtn) {
            inviteUserBtn.addEventListener('click', () => {
              document.getElementById('invite-modal').style.display = 'flex';
            });
          }

          // Close modals
          modalCloseButtons.forEach(button => {
            button.addEventListener('click', () => {
              modals.forEach(modal => {
                modal.style.display = 'none';
              });
            });
          });

          // Close modal when clicking outside
          window.addEventListener('click', (e) => {
            modals.forEach(modal => {
              if (e.target === modal) {
                modal.style.display = 'none';
              }
            });
          });

          // Edit user
          editUserBtns.forEach(button => {
            button.addEventListener('click', () => {
              const userId = button.getAttribute('data-user-id');
              const userRow = document.querySelector(\`tr[data-user-id="\${userId}"]\`);
              
              document.getElementById('edit-user-id').value = userId;
              document.getElementById('edit-email').value = userRow.cells[1].textContent;
              document.getElementById('edit-name').value = userRow.cells[0].textContent;
              
              const roleBadge = userRow.cells[2].querySelector('.badge');
              const role = roleBadge.textContent.trim().toLowerCase();
              document.getElementById('edit-role').value = role;
              
              document.getElementById('edit-modal').style.display = 'flex';
            });
          });

          // Delete user
          deleteUserBtns.forEach(button => {
            button.addEventListener('click', () => {
              const userId = button.getAttribute('data-user-id');
              document.getElementById('delete-user-id').value = userId;
              document.getElementById('delete-modal').style.display = 'flex';
            });
          });

          // Form submissions
          const inviteForm = document.getElementById('invite-form');
          const editForm = document.getElementById('edit-form');
          const deleteForm = document.getElementById('delete-form');
          const loading = document.getElementById('loading');
          const alertSuccess = document.getElementById('alert-success');
          const alertDanger = document.getElementById('alert-danger');

          // Show alert
          function showAlert(type, message) {
            const alert = document.getElementById(\`alert-\${type}\`);
            alert.textContent = message;
            alert.style.display = 'block';
            
            setTimeout(() => {
              alert.style.display = 'none';
            }, 5000);
          }

          // Invite user form submission
          if (inviteForm) {
            inviteForm.addEventListener('submit', async (e) => {
              e.preventDefault();
              
              const email = document.getElementById('invite-email').value;
              const name = document.getElementById('invite-name').value;
              const role = document.getElementById('invite-role').value;
              
              loading.style.display = 'flex';
              
              try {
                const response = await fetch(\`/api/users/invite?shop=\${encodeURIComponent('${shop}')}\`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': '${userEmail || ''}'
                  },
                  body: JSON.stringify({ email, name, role })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                  throw new Error(data.error || 'Failed to invite user');
                }
                
                // Close modal and reset form
                document.getElementById('invite-modal').style.display = 'none';
                inviteForm.reset();
                
                // Show success message
                showAlert('success', 'Team member invited successfully');
                
                // Reload page after a short delay
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              } catch (error) {
                console.error('Error inviting user:', error);
                showAlert('danger', error.message);
              } finally {
                loading.style.display = 'none';
              }
            });
          }

          // Edit user form submission
          if (editForm) {
            editForm.addEventListener('submit', async (e) => {
              e.preventDefault();
              
              const userId = document.getElementById('edit-user-id').value;
              const name = document.getElementById('edit-name').value;
              const role = document.getElementById('edit-role').value;
              
              loading.style.display = 'flex';
              
              try {
                const response = await fetch(\`/api/users/\${userId}?shop=\${encodeURIComponent('${shop}')}\`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': '${userEmail || ''}'
                  },
                  body: JSON.stringify({ name, role })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                  throw new Error(data.error || 'Failed to update user');
                }
                
                // Close modal
                document.getElementById('edit-modal').style.display = 'none';
                
                // Show success message
                showAlert('success', 'Team member updated successfully');
                
                // Reload page after a short delay
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              } catch (error) {
                console.error('Error updating user:', error);
                showAlert('danger', error.message);
              } finally {
                loading.style.display = 'none';
              }
            });
          }

          // Delete user form submission
          if (deleteForm) {
            deleteForm.addEventListener('submit', async (e) => {
              e.preventDefault();
              
              const userId = document.getElementById('delete-user-id').value;
              
              loading.style.display = 'flex';
              
              try {
                const response = await fetch(\`/api/users/\${userId}?shop=\${encodeURIComponent('${shop}')}\`, {
                  method: 'DELETE',
                  headers: {
                    'x-user-email': '${userEmail || ''}'
                  }
                });
                
                if (!response.ok) {
                  const data = await response.json();
                  throw new Error(data.error || 'Failed to delete user');
                }
                
                // Close modal
                document.getElementById('delete-modal').style.display = 'none';
                
                // Show success message
                showAlert('success', 'Team member deleted successfully');
                
                // Reload page after a short delay
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              } catch (error) {
                console.error('Error deleting user:', error);
                showAlert('danger', error.message);
              } finally {
                loading.style.display = 'none';
              }
            });
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Users management error:', error);
    res.status(500).send(`
      <h1>Error</h1>
      <p>An error occurred while loading the users management page: ${error.message}</p>
    `);
  }
});

// Accept invite page
router.get('/accept-invite', (req, res) => {
  try {
    const { token, shop } = req.query;
    
    if (!token || !shop) {
      return res.status(400).send(`
        <h1>Invalid Invite</h1>
        <p>The invite link is invalid or expired.</p>
      `);
    }
    
    // Render the accept invite page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KingsBuilder - Accept Invite</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', sans-serif;
            background-color: #f5f5f5;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }

          .container {
            max-width: 500px;
            width: 100%;
          }

          .card {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 30px;
          }

          .logo {
            text-align: center;
            margin-bottom: 30px;
          }

          .logo h1 {
            font-size: 24px;
            font-weight: 700;
            color: #000;
          }

          h2 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
          }

          .form-control {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
          }

          .form-control:focus {
            outline: none;
            border-color: #000;
          }

          .btn {
            display: inline-block;
            width: 100%;
            padding: 12px 20px;
            background-color: #000;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
          }

          .btn:hover {
            background-color: #333;
          }

          .alert {
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: none;
          }

          .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }

          .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }

          .loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="logo">
              <h1>KingsBuilder</h1>
            </div>
            
            <h2>Accept Team Invitation</h2>
            
            <div id="alert-success" class="alert alert-success"></div>
            <div id="alert-danger" class="alert alert-danger"></div>
            
            <form id="accept-form">
              <div class="form-group">
                <label for="name" class="form-label">Your Name</label>
                <input type="text" id="name" class="form-control" required>
              </div>
              
              <button type="submit" class="btn">Accept Invitation</button>
            </form>
          </div>
        </div>
        
        <!-- Loading Spinner -->
        <div id="loading" class="loading" style="display: none;">
          <div class="spinner"></div>
        </div>
        
        <script>
          // Form submission
          const acceptForm = document.getElementById('accept-form');
          const loading = document.getElementById('loading');
          const alertSuccess = document.getElementById('alert-success');
          const alertDanger = document.getElementById('alert-danger');
          
          // Show alert
          function showAlert(type, message) {
            const alert = document.getElementById(\`alert-\${type}\`);
            alert.textContent = message;
            alert.style.display = 'block';
            
            setTimeout(() => {
              alert.style.display = 'none';
            }, 5000);
          }
          
          // Accept invite form submission
          acceptForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            
            loading.style.display = 'flex';
            
            try {
              const response = await fetch('/api/users/accept-invite', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                  token: '${token}',
                  name
                })
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.error || 'Failed to accept invitation');
              }
              
              // Show success message
              showAlert('success', 'Invitation accepted successfully! Redirecting to dashboard...');
              
              // Redirect to dashboard after a short delay
              setTimeout(() => {
                window.location.href = '/dashboard?shop=${shop}';
              }, 3000);
            } catch (error) {
              console.error('Error accepting invitation:', error);
              showAlert('danger', error.message);
            } finally {
              loading.style.display = 'none';
            }
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Accept invite error:', error);
    res.status(500).send(`
      <h1>Error</h1>
      <p>An error occurred while loading the accept invite page: ${error.message}</p>
    `);
  }
});

module.exports = router;