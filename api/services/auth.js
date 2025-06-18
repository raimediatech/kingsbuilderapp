// api/services/auth.js - Authentication service
const crypto = require('crypto');
const { User, ROLES } = require('../models/user');
const { getAccessToken } = require('../helpers/tokens');

/**
 * Generate a random token
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Create a new user
 */
async function createUser(userData) {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Get user by email and shop
 */
async function getUserByEmail(email, shop) {
  try {
    return await User.findOne({ email, shop });
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

/**
 * Get all users for a shop
 */
async function getShopUsers(shop) {
  try {
    return await User.find({ shop });
  } catch (error) {
    console.error('Error getting shop users:', error);
    throw error;
  }
}

/**
 * Update user
 */
async function updateUser(userId, userData) {
  try {
    return await User.findByIdAndUpdate(userId, userData, { new: true });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete user
 */
async function deleteUser(userId) {
  try {
    return await User.findByIdAndDelete(userId);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Create invite for a new user
 */
async function createUserInvite(userData) {
  try {
    // Generate invite token
    const inviteToken = generateToken();
    
    // Set expiration date (48 hours from now)
    const inviteExpires = new Date();
    inviteExpires.setHours(inviteExpires.getHours() + 48);
    
    // Create user with invite data
    const user = await createUser({
      ...userData,
      inviteToken,
      inviteExpires,
      active: false
    });
    
    return {
      user,
      inviteToken
    };
  } catch (error) {
    console.error('Error creating user invite:', error);
    throw error;
  }
}

/**
 * Verify and activate user with invite token
 */
async function activateUserWithInvite(inviteToken, userData = {}) {
  try {
    // Find user with the invite token
    const user = await User.findOne({ 
      inviteToken,
      inviteExpires: { $gt: new Date() } // Token must not be expired
    });
    
    if (!user) {
      throw new Error('Invalid or expired invite token');
    }
    
    // Update user data
    user.inviteToken = null;
    user.inviteExpires = null;
    user.active = true;
    user.lastLogin = new Date();
    
    // Update any additional user data
    Object.keys(userData).forEach(key => {
      if (key !== 'email' && key !== 'shop') { // Don't allow changing email or shop
        user[key] = userData[key];
      }
    });
    
    await user.save();
    
    return user;
  } catch (error) {
    console.error('Error activating user with invite:', error);
    throw error;
  }
}

/**
 * Ensure shop owner exists
 * This creates an admin user for the shop owner if one doesn't exist
 */
async function ensureShopOwner(shop, ownerEmail) {
  try {
    // Check if admin user already exists for this shop
    const existingAdmin = await User.findOne({ 
      shop, 
      role: ROLES.ADMIN,
      active: true
    });
    
    if (existingAdmin) {
      return existingAdmin;
    }
    
    // Create admin user for shop owner
    const shopOwner = await createUser({
      email: ownerEmail,
      name: 'Shop Owner',
      shop,
      role: ROLES.ADMIN,
      active: true
    });
    
    return shopOwner;
  } catch (error) {
    console.error('Error ensuring shop owner:', error);
    throw error;
  }
}

/**
 * Middleware to check user permissions
 */
function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      const shop = req.query.shop || req.shopifyShop || req.headers['x-shopify-shop-domain'] || req.cookies?.shopOrigin;
      
      if (!shop) {
        return res.status(401).json({ error: 'Unauthorized - Shop not specified' });
      }
      
      // Get user email from request
      const userEmail = req.query.userEmail || req.body.userEmail || req.headers['x-user-email'];
      
      if (!userEmail) {
        return res.status(401).json({ error: 'Unauthorized - User not specified' });
      }
      
      // Get user
      const user = await getUserByEmail(userEmail, shop);
      
      if (!user || !user.active) {
        return res.status(401).json({ error: 'Unauthorized - User not found or inactive' });
      }
      
      // Check permission
      if (!user.hasPermission(permission)) {
        return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
      }
      
      // Add user to request
      req.user = user;
      
      next();
    } catch (error) {
      console.error('Error in permission middleware:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

module.exports = {
  createUser,
  getUserByEmail,
  getShopUsers,
  updateUser,
  deleteUser,
  createUserInvite,
  activateUserWithInvite,
  ensureShopOwner,
  requirePermission
};