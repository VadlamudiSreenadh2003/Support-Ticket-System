// server.js
const mongoose = require('mongoose');
const config = require('./config');
const app = require('./index');

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Mongo connected');
  app.listen(5000, () => {
    console.log('🚀 Server running on port 5000');
  });
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});
