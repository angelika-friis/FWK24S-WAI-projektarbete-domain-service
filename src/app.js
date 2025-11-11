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
    if (!origin && config.ALLOW_EMPTY_ORIGIN) {
      callback(null, true); // tillåt tom origin i dev
    } else if (origin && config.CORS_ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true); // tillåt konfigurerade origins
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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

module.exports = app;