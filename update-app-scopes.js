// Script to update app scopes via Shopify API
const https = require('https');

const APP_ID = '128d69fb5441ba3eda3ae4694c71b175';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET;

console.log('🔧 Updating app scopes...');

// The scopes we need
const requiredScopes = [
  'read_products',
  'write_products',
  'read_customers',
  'write_customers', 
  'read_orders',
  'write_orders',
  'read_content',
  'write_content'
];

console.log('📋 Required scopes:', requiredScopes.join(', '));

// Check if we have the client secret
if (!CLIENT_SECRET) {
  console.error('❌ SHOPIFY_API_SECRET environment variable is required');
  console.log('💡 You need to add this to your Vercel environment variables');
  process.exit(1);
}

// Create OAuth URL with correct scopes
const shop = 'kingsbuilder.myshopify.com';
const redirectUri = 'https://kingsbuilderapp.vercel.app/auth/callback';
const scopes = requiredScopes.join(',');

const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${APP_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${shop}`;

console.log('\n🚀 MANUAL FIX: Open this URL in your browser:');
console.log('\n' + authUrl);
console.log('\n📝 This will force your app to request the correct permissions');
console.log('\n🔒 Look for "Read and manage your online store pages and blog posts" in the permission list');