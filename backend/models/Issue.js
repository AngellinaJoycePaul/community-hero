const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Uncategorized' },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Reported', 'In Progress', 'Resolved'], default: 'Reported' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  imageUrl: { type: String },
  aiAnalysis: { type: String },
  upvotes: { type: Number, default: 0 },
  reportedBy: { type: String, default: 'Anonymous' },
}, { timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);