# KingsBuilder Fix Roadmap

## 1. Fix API Response Format

### Problem:
The client-side code expects API responses in format `{ success: true, pages: [...] }` but the API returns raw Shopify data.

### Solution:
Update the `/api/pages` endpoint in `api/index.js` to wrap the Shopify response in the expected format:

```javascript
// In api/index.js
app.get('/api/pages', async (req, res) => {
  try {
    // Existing code...
    
    const result = await shopifyApi.getShopifyPages(shop, accessToken);
    return res.json({
      success: true,
      pages: result.pages || []
    });
  } catch (error) {
    // Error handling...
  }
});
```

## 2. Fix Access Token Handling

### Problem:
The app requires a Shopify access token but isn't handling cases where it's missing.

### Solution:
Implement proper access token storage and retrieval:

1. Update middleware to properly store access token in session/cookies
2. Add fallback mechanism for when token isn't available
3. Update client-side code to include token in requests

## 3. Fix Navigation

### Problem:
Tab navigation isn't working properly as event handlers aren't being attached.

### Solution:
Update the navigation code in `app.js`:

```javascript
// Update navigation code
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const destination = this.getAttribute('data-dest');
      if (destination) {
        window.location.href = destination + '?shop=' + (window.shopOrigin || '');
      }
    });
  });
});
```

## 4. Fix Pages Loading

### Problem:
The `/api/pages` endpoint is failing or returning data in an unexpected format.

### Solution:
1. Update the client-side code to handle the actual API response format
2. Add better error handling and fallback content
3. Add logging to trace the exact response

```javascript
// Update loadPages function
async function loadPages() {
  try {
    const response = await fetch('/api/pages?shop=' + window.shopOrigin);
    console.log('API Response:', response);
    
    const result = await response.json();
    console.log('Page data:', result);
    
    const pagesContainer = document.getElementById('pages-container');
    pagesContainer.innerHTML = '';
    
    // Handle various response formats
    const pages = result.pages || result.data || (Array.isArray(result) ? result : []);
    
    if (pages && pages.length > 0) {
      // Display pages...
    } else {
      pagesContainer.innerHTML = '<div class="app-card"><p>No pages found. Create your first page to get started.</p></div>';
    }
  } catch (error) {
    console.error('Error loading pages:', error);
    document.getElementById('pages-container').innerHTML = '<div class="app-card"><p>Error loading pages. Please refresh to try again.</p></div>';
  }
}
```

## 5. Implement Mock Data for Development

### Problem:
Development and testing are difficult when dependent on Shopify API.

### Solution:
Add mock data functionality that's enabled in development:

```javascript
// Add to api/index.js
app.get('/api/pages', async (req, res) => {
  // For development/testing, return mock data if no shop/token
  if (process.env.NODE_ENV !== 'production' && (!req.query.shop || !req.headers['x-shopify-access-token'])) {
    return res.json({
      success: true,
      pages: [
        { id: '1', title: 'Homepage', body_html: '<p>Welcome to our store</p>', handle: 'home' },
        { id: '2', title: 'About Us', body_html: '<p>Our company story</p>', handle: 'about' },
        { id: '3', title: 'Contact', body_html: '<p>Get in touch</p>', handle: 'contact' }
      ]
    });
  }
  
  // Existing code for actual API call
  // ...
});
```

## 6. Create Complete End-to-End Test

### Problem:
No way to verify all components are working together properly.

### Solution:
Create a test flow that verifies:
1. Authentication flow
2. Page loading
3. Page creation
4. Navigation between sections
5. Error handling

## 7. Update Error Handling and User Feedback

### Problem:
Silent failures with poor user feedback.

### Solution:
1. Add toast notifications for errors
2. Improve error messages
3. Add retry mechanisms
4. Implement proper loading states

## Implementation Priority:

1. Fix API Response Format (#1)
2. Fix Access Token Handling (#2) 
3. Fix Navigation (#3)
4. Fix Pages Loading (#4)
5. Implement Mock Data (#5)
6. Update Error Handling (#7)
7. Create End-to-End Test (#6)