// api/routes/users-api.js - Users API routes
const express = require('express');
const router = express.Router();
const { 
  createUser, 
  getUserByEmail, 
  getShopUsers, 
  updateUser, 
  deleteUser, 
  createUserInvite, 
  activateUserWithInvite,
  requirePermission
} = require('../services/auth');
const { PERMISSIONS, ROLES } = require('../models/user');
const { getAccessToken } = require('../helpers/tokens');
const nodemailer = require('nodemailer');

// Get all users for a shop
router.get('/', requirePermission(PERMISSIONS.MANAGE_USERS), async (req, res) => {
  try {
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    const users = await getShopUsers(shop);
    
    res.json({ users });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users', details: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    const email = req.query.email || req.headers['x-user-email'];
    
    if (!shop || !email) {
      return res.status(400).json({ error: 'Shop and email parameters are required' });
    }
    
    const user = await getUserByEmail(email, shop);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Failed to get current user', details: error.message });
  }
});

// Create a new user
router.post('/', requirePermission(PERMISSIONS.MANAGE_USERS), async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop || !email || !name || !role) {
      return res.status(400).json({ error: 'Shop, email, name, and role are required' });
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email, shop);
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Create user
    const user = await createUser({
      email,
      name,
      shop,
      role
    });
    
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

// Invite a new user
router.post('/invite', requirePermission(PERMISSIONS.MANAGE_USERS), async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
    
    if (!shop || !email || !name || !role) {
      return res.status(400).json({ error: 'Shop, email, name, and role are required' });
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email, shop);
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Create user invite
    const { user, inviteToken } = await createUserInvite({
      email,
      name,
      shop,
      role
    });
    
    // Generate invite URL
    const inviteUrl = `https://${shop}/apps/kingsbuilder/accept-invite?token=${inviteToken}&shop=${shop}`;
    
    // Send invite email (mock for now)
    console.log(`Invite URL for ${email}: ${inviteUrl}`);
    
    res.status(201).json({ 
      user,
      inviteUrl,
      message: 'User invited successfully' 
    });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ error: 'Failed to invite user', details: error.message });
  }
});

// Accept user invite
router.post('/accept-invite', async (req, res) => {
  try {
    const { token, name } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Invite token is required' });
    }
    
    // Activate user with invite token
    const user = await activateUserWithInvite(token, { name });
    
    res.json({ 
      user,
      message: 'User activated successfully' 
    });
  } catch (error) {
    console.error('Error accepting invite:', error);
    res.status(500).json({ error: 'Failed to accept invite', details: error.message });
  }
});

// Update a user
router.put('/:userId', requirePermission(PERMISSIONS.MANAGE_USERS), async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, role } = req.body;
    
    if (!name && !role) {
      return res.status(400).json({ error: 'At least one field to update is required' });
    }
    
    // Update user
    const user = await updateUser(userId, { name, role });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Delete a user
router.delete('/:userId', requirePermission(PERMISSIONS.MANAGE_USERS), async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Delete user
    const user = await deleteUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

module.exports = router;