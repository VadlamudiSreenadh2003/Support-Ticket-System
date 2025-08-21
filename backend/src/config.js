 module.exports = {
  port: process.env.PORT || 27017,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/helpdesk',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  autoCloseEnabled: process.env.AUTO_CLOSE_ENABLED === 'true',
  confidenceThreshold: parseFloat(process.env.CONFIDENCE_THRESHOLD || '0.78'),
  stubMode: process.env.STUB_MODE === 'true'
};
