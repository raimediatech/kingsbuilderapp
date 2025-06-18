// api/models/user.js - User model
const mongoose = require('mongoose');

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

// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  shop: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.VIEWER
  },
  inviteToken: {
    type: String,
    default: null
  },
  inviteExpires: {
    type: Date,
    default: null
  },
  active: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if user has a specific permission
userSchema.methods.hasPermission = function(permission) {
  return ROLE_PERMISSIONS[this.role].includes(permission);
};

// Method to check if user has any of the given permissions
userSchema.methods.hasAnyPermission = function(permissions) {
  const userPermissions = ROLE_PERMISSIONS[this.role];
  return permissions.some(permission => userPermissions.includes(permission));
};

// Method to check if user has all of the given permissions
userSchema.methods.hasAllPermissions = function(permissions) {
  const userPermissions = ROLE_PERMISSIONS[this.role];
  return permissions.every(permission => userPermissions.includes(permission));
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS
};