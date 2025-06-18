// api/models/template.js - Template model
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'custom'
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: false
  }
});

// Update the updatedAt field on save
templateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Template', templateSchema);