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

// FORCE REMOVE ALL IFRAME BLOCKING HEADERS
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('X-Content-Type-Options');
  res.removeHeader('Referrer-Policy');
  res.removeHeader('Permissions-Policy');
  next();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`KingsBuilder Shopify app listening on port ${port}`);
  console.log(`App URL: ${process.env.SHOPIFY_APP_URL || 'http://localhost:' + port}`);
});