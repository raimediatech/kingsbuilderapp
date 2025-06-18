// api/models/pageVersion.js - Page version model
const mongoose = require('mongoose');

const pageVersionSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
    index: true
  },
  shop: {
    type: String,
    required: true,
    index: true
  },
  version: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  comment: {
    type: String,
    default: ''
  }
});

// Create a compound index for pageId and version
pageVersionSchema.index({ pageId: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('PageVersion', pageVersionSchema);