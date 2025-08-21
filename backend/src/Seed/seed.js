// connect to db and insert sample users, kb, tickets
const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User');
const Article = require('../models/Article');
const Ticket = require('../models/Ticket');

async function run() {
  await mongoose.connect(config.mongoUri);
  await User.deleteMany({});
  await Article.deleteMany({});
  await Ticket.deleteMany({});

  const admin = await User.create({ name: 'Admin', email: 'admin@local', passwordHash: 'x', role: 'admin' });
  const agent = await User.create({ name: 'Agent', email: 'agent@local', passwordHash: 'x', role: 'agent' });
  const user = await User.create({ name: 'User', email: 'user@local', passwordHash: 'x', role: 'user' });

  await Article.create([
    { title: 'How to update payment method', body: 'To update payment method go to account->payments', tags: ['billing','payments'], status:'published' },
    { title: 'Troubleshooting 500 errors', body: 'If you see 500 check logs, stack trace shows module', tags: ['tech','errors'], status:'published' },
    { title: 'Tracking your shipment', body: 'Use the tracking tab and contact carrier', tags: ['shipping','delivery'], status:'published' }
  ]);

  await Ticket.create([
    { title: 'Refund for double charge', description: 'I was charged twice for order #1234', category: 'billing', createdBy: user._id },
    { title: 'App shows 500 on login', description: 'Stack trace mentions auth module', category: 'tech', createdBy: user._id },
    { title: 'Where is my package?', description: 'Shipment delayed 5 days', category: 'shipping', createdBy: user._id }
  ]);

  console.log('Seeded');
  process.exit(0);
}
run();