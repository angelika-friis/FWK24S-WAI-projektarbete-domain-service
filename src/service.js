const app = require('./app');
const https = require("https");
const fs = require('fs');
const connectDB = require('./config/connectDB');
require('dotenv').config();

const PORT = process.env.PORT || 3002;

connectDB();

const key  = fs.readFileSync('./certs/localhost+2-key.pem');
const cert = fs.readFileSync('./certs/localhost+2.pem');
https.createServer({ key, cert }, app).listen(PORT, () => {
  console.log(`Listening on port (HTTPS): ${PORT}`);
});
