const Ticket = require('../models/Ticket');
const { enqueueTriage } = require('../services/agentService');
const uuid = require('uuid').v4;

async function createTicket(req, res) {
  const user = req.user; // middleware sets
  const { title, description, category } = req.body;
  const t = await Ticket.create({ title, description, category, createdBy: user._id });
  // log and enqueue triage
  await enqueueTriage(t._id, user._id);
  res.status(201).json(t);
}

module.exports = { createTicket };
