const mongoose = require('mongoose');
const AgentSuggestionSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  predictedCategory: String,
  articleIds: [String],
  draftReply: String,
  confidence: Number,
  autoClosed: Boolean,
  modelInfo: Object,
  createdAt: { type: Date, default: () => new Date().toISOString() }
});
module.exports = mongoose.model('AgentSuggestion', AgentSuggestionSchema);
