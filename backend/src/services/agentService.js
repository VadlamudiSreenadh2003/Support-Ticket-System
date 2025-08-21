const { v4: uuidv4 } = require('uuid');
const LLMProvider = require('./llmProvider');
const Article = require('../models/Article');
const AgentSuggestion = require('../models/AgentSuggestion');
const Ticket = require('../models/Ticket');
const AuditLog = require('../models/AuditLog');
const config = require('../config');

const llm = new LLMProvider({stubMode: config.stubMode});

// In-process job queue
const queue = [];
let processing = false;

async function enqueueTriage(ticketId, actor='system') {
  queue.push({ ticketId, actor });
  processQueue();
}

async function processQueue() {
  if (processing) return;
  processing = true;
  while (queue.length) {
    const job = queue.shift();
    try {
      await runTriage(job.ticketId);
    } catch (err) {
      console.error('Triage error', err);
    }
  }
  processing = false;
}

async function appendAudit(ticketId, traceId, actor, action, meta) {
  await AuditLog.create({ ticketId, traceId, actor, action, meta });
}

async function runTriage(ticketId) {
  const traceId = uuidv4();
  const ticket = await Ticket.findById(ticketId);
  if(!ticket) throw new Error('ticket not found');
  await appendAudit(ticketId, traceId, 'system', 'TICKET_CREATED', { ticketId: ticket._id });

  // 1. classify
  const { predictedCategory, confidence: classifyConfidence, modelInfo: classModelInfo } = await llm.classify(ticket.description || ticket.title);
  await appendAudit(ticketId, traceId, 'system', 'AGENT_CLASSIFIED', { predictedCategory, confidence: classifyConfidence });

  // 2. retrieve top kb (simple text search)
  const matched = await Article.find({ $text: { $search: ticket.title + ' ' + ticket.description }, status: 'published' }).limit(3);
  await appendAudit(ticketId, traceId, 'system', 'KB_RETRIEVED', { articleIds: matched.map(a=>a._id) });

  // 3. draft
  const { draftReply, citations, modelInfo: draftModelInfo } = await llm.draft(ticket.description || ticket.title, matched);
  await appendAudit(ticketId, traceId, 'system', 'DRAFT_GENERATED', { draftReplyPreview: draftReply.slice(0,200), citations });

  // 4. decision
  const suggestion = await AgentSuggestion.create({
    ticketId: ticket._id,
    predictedCategory,
    articleIds: matched.map(a=>String(a._id)),
    draftReply,
    confidence: classifyConfidence,
    autoClosed: false,
    modelInfo: { classify: classModelInfo, draft: draftModelInfo }
  });

  const autoCloseOn = config.autoCloseEnabled;
  const threshold = config.confidenceThreshold;
  if (autoCloseOn && classifyConfidence >= threshold) {
    // auto reply & close
    suggestion.autoClosed = true;
    await suggestion.save();
    ticket.status = 'resolved';
    ticket.agentSuggestionId = suggestion._id;
    await ticket.save();
    await appendAudit(ticket._id, traceId, 'system', 'AUTO_CLOSED', { suggestionId: suggestion._id });
  } else {
    ticket.status = 'waiting_human';
    ticket.agentSuggestionId = suggestion._id;
    await ticket.save();
    await appendAudit(ticket._id, traceId, 'system', 'ASSIGNED_TO_HUMAN', { suggestionId: suggestion._id });
  }
}

module.exports = { enqueueTriage, runTriage, appendAudit };
