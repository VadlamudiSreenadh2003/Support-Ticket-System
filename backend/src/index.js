// app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// const authRoutes = require('./routes/auth');
// const kbRoutes = require('./routes/kb');
const ticketRoutes = require('./routes/tickets');

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

app.get('/healthz', (_, res) => res.send({ ok: true }));
app.get('/readyz', (_, res) => res.send({ ok: true }));

// app.use('/api/auth', authRoutes);
// app.use('/api/kb', kbRoutes);
app.use('/api/tickets', ticketRoutes);

module.exports = app;
