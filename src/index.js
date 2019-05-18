const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {
  console.info('New WebSocket connection');

  socket.emit('message', 'Welcome!');
  socket.broadcast.emit('message', 'A new user has joined');

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    io.emit('message', message);
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');
  });

  socket.on('sendLocation', (position, callback) => {
    let message = `https://google.com/maps?q=${position.latitude},${
      position.longitude
    }`;
    io.emit('message', message);
    callback();
  });
});

server.listen(port, err => {
  if (err) console.error('Server could not start');

  console.info(`Server listening on port ${port}`);
});
