const express = require('express');
const path = require('path');

const server = express();

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

server.use(express.static(publicDirectoryPath));

server.get('/', (req, res) => {
  res.send('Chat App');
});

server.listen(port, err => {
  if (err) console.error('Server could not start');

  console.info(`Server listening on port ${port}`);
});
