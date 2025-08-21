const AuditLog = require("../models/AuditLog");
const { v4: uuidv4 } = require("uuid");

async function triageTicket(ticket) {
  const traceId = uuidv4();

  // Step 1: classify category (mock logic)
  ticket.category = ticket.description.includes("bill") ? "billing" : "technical";
  await AuditLog.create({ traceId, step: "classification", details: { category: ticket.category } });

  // Step 2: fetch KB (stubbed)
  const kb = [{ title: "Sample KB", content: "Try restarting your system." }];
  await AuditLog.create({ traceId, step: "kb_fetch", details: { articles: kb } });

  // Step 3: draft reply
  ticket.reply = `AI Suggestion: ${kb[0].content}`;
  await AuditLog.create({ traceId, step: "draft_reply", details: { reply: ticket.reply } });

  // Step 4: auto-resolve if confident
  ticket.status = "resolved";
  await AuditLog.create({ traceId, step: "auto_resolve", details: { status: ticket.status } });

  return ticket;
}

module.exports = { triageTicket };
