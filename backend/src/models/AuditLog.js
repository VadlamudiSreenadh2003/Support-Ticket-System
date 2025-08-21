const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  traceId: String,
  step: String,
  details: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", AuditLogSchema);
