const express = require('express');

const server = express();

const port = 3000;

server.get('/', (req, res) => {
  res.send('Chat App');
});

server.listen(port, err => {
  if (err) console.error('Server could not start');

  console.info(`Server listening on port ${port}`);
});
