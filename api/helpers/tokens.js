// Token helpers for authentication and security

/**
 * Generate a secure random token
 */
function generateToken(length = 32) {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate an API key
 */
function generateApiKey() {
  return 'kb_' + generateToken(24);
}

/**
 * Validate token format
 */
function validateToken(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Check for basic token format (hex string)
  return /^[a-f0-9]+$/i.test(token);
}

/**
 * Generate a session token with expiration
 */
function generateSessionToken() {
  return {
    token: generateToken(32),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    created: new Date()
  };
}

/**
 * Check if token is expired
 */
function isTokenExpired(tokenData) {
  if (!tokenData || !tokenData.expires) {
    return true;
  }
  
  return new Date() > new Date(tokenData.expires);
}

module.exports = {
  generateToken,
  generateApiKey,
  validateToken,
  generateSessionToken,
  isTokenExpired
};