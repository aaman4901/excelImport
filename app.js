// Loading environment variables from .env file into process.env
const dotenv = require('dotenv');
dotenv.config();

// Setting database connection
const getSqlConnection = require('./services/sequelize.js');
global.DATABASE = getSqlConnection();

const config = require('./config/config.js');
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Allowing cross origin access
app.use(cors());

app.use(express.json());

// Attaching html pages
app.use(express.static(path.join(__dirname, 'pages')));

// Enabling routes
app.use('/api/dealer', require('./routers/dealer'));

app.get('/test', (req, res) => {
  return res.json({ status: true, message: 'Server is working' });
});

// Creating uploads folder for media files
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.listen(config.SERVER_PORT, () => {
  console.log(`Server is listening at ${config.SERVER_PORT}`);
});
