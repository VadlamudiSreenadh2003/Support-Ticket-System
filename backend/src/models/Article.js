const mongoose = require('mongoose');
const ArticleSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
  status: { type: String, enum: ['draft','published'], default: 'draft' },
  updatedAt: { type: Date, default: () => new Date().toISOString() }
});
// For search
ArticleSchema.index({ title: 'text', body: 'text', tags: 'text' });
module.exports = mongoose.model('Article', ArticleSchema);
