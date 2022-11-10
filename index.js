const express = require('express');
const dotenv = require('dotenv');
const databaseConnect = require('./config/database');

const server = express();
const PORT = process.env.PORT || 9090;

dotenv.config({ path: 'config/config.env' });

server.get('/', (req, res) => {
  res.json({ status: 1 });
});

databaseConnect();

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
