const express = require('express');

const server = express();
const PORT = process.env.PORT || 9090;

server.get('/', (req, res) => {
  res.json({ status: 1 });
});

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
