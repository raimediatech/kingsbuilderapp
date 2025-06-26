// server.js - Simple Express server for Shopify app
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = require('./api/index.js');

console.log('Environment variables loaded:');
console.log('SHOPIFY_API_KEY:', process.env.SHOPIFY_API_KEY ? 'Set' : 'Not set');
console.log('SHOPIFY_API_SECRET:', process.env.SHOPIFY_API_SECRET ? 'Set' : 'Not set');
console.log('SHOPIFY_APP_URL:', process.env.SHOPIFY_APP_URL);

// Add security headers middleware
app.use((req, res, next) => {
  // Remove X-Frame-Options to avoid conflicts
  res.removeHeader("X-Frame-Options");
  
  // Set CSP headers to allow Shopify iframe embedding
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://*.myshopify.com https://*.shopify.com https://admin.shopify.com; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://cdnjs.cloudflare.com https://unpkg.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "connect-src 'self' https://*.myshopify.com https://*.shopify.com https://admin.shopify.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' https://fonts.gstatic.com;"
  );
  
  // Add sandbox permissions for iframe
  res.setHeader("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()");
  
  next();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`KingsBuilder Shopify app listening on port ${port}`);
  console.log(`App URL: ${process.env.SHOPIFY_APP_URL || 'http://localhost:' + port}`);
});