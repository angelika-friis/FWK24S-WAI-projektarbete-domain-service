const express = require('express');
const helmet = require("helmet");
const config = require('./config.js');
const journalRoutes = require('./routes/journalRoutes');
const gdprRoutes = require('./routes/gdprRoutes');
const meRoutes = require('./routes/meRoutes');
const consentRoutes = require('./routes/consentRoutes');
const consentUUID = require('./middleware/consentUUID');
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    console.log("origin is: ", origin)
    if (!origin && config.ALLOW_EMPTY_ORIGIN) {
      callback(null, true); // tillåt tom origin i dev
    } else if (origin && config.CORS_ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true); // tillåt konfigurerade origins
    } else {
      callback(new Error('Not allowed by CORS 123'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type','Authorization','X-CSRF-Token','X-Requested-With'],
};

if(config.CORS_ENABLED) {
  app.use(cors(corsOptions));
} else {
  app.use(cors());
}

app.use(helmet());
app.use(express.json());

app.use(consentUUID);

app.use('/journal', journalRoutes);
app.use('/gdpr', gdprRoutes);
app.use('/me', meRoutes);
app.use('/consent', consentRoutes);

app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err); // full stack to server console
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;