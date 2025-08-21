// create ticket, wait for triage worker to run (call runTriage synchronously or check suggestion)
const { runTriage } = require('../services/agentService');
const Ticket = require('../models/Ticket');
test('triage creates suggestion and audit logs', async ()=> {
  const t = await Ticket.create({ title: 'refund double', description: 'charged twice #123' });
  await runTriage(t._id);
  const suggestion = await require('../models/AgentSuggestion').findOne({ ticketId: t._id });
  expect(suggestion).not.toBeNull();
  expect(suggestion.predictedCategory).toBe('billing');
});
