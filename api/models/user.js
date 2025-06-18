// api/models/user.js - User model (simplified version without MongoDB)

// Define roles and permissions
const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

const PERMISSIONS = {
  CREATE_PAGE: 'create_page',
  EDIT_PAGE: 'edit_page',
  DELETE_PAGE: 'delete_page',
  PUBLISH_PAGE: 'publish_page',
  MANAGE_USERS: 'manage_users',
  VIEW_PAGES: 'view_pages'
};

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_PAGE,
    PERMISSIONS.EDIT_PAGE,
    PERMISSIONS.DELETE_PAGE,
    PERMISSIONS.PUBLISH_PAGE,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_PAGES
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.CREATE_PAGE,
    PERMISSIONS.EDIT_PAGE,
    PERMISSIONS.PUBLISH_PAGE,
    PERMISSIONS.VIEW_PAGES
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_PAGES
  ]
};

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    shop: 'test-shop.myshopify.com',
    role: ROLES.ADMIN,
    active: true,
    hasPermission: function(permission) {
      return ROLE_PERMISSIONS[this.role].includes(permission);
    },
    hasAnyPermission: function(permissions) {
      const userPermissions = ROLE_PERMISSIONS[this.role];
      return permissions.some(permission => userPermissions.includes(permission));
    },
    hasAllPermissions: function(permissions) {
      const userPermissions = ROLE_PERMISSIONS[this.role];
      return permissions.every(permission => userPermissions.includes(permission));
    }
  }
];

// Mock User model
const User = {
  findOne: (query) => Promise.resolve(mockUsers[0]),
  find: () => Promise.resolve(mockUsers),
  findById: (id) => Promise.resolve(mockUsers.find(user => user.id === id) || null)
};

// Helper function to check permissions (for middleware)
const requirePermission = (permission) => {
  return (req, res, next) => {
    // For development, we'll allow all requests
    next();
  };
};

module.exports = {
  User,
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  requirePermission
};