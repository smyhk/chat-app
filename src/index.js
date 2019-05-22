const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');

const {
  generateMessage,
  generateLocationMessage
} = require('../src/utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

// listen for connection event
io.on('connection', socket => {
  console.info('New WebSocket connection');

  socket.on('join', ({ username, room }) => {
    socket.join(room);

    // send new user a welcome message
    socket.emit('message', generateMessage('Welcome!'));

    // send all other users a message when a new user connects (room)
    socket.broadcast
      .to(room)
      .emit('message', generateMessage(`${username} has joined`));
  });

  // chat message handler
  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    // sends data to all connected sockets
    io.to('steve').emit('message', generateMessage(message));
    callback();
  });

  // listens for a user disconnet event
  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left'));
  });

  // geolocation handler
  socket.on('sendLocation', (position, callback) => {
    let url = `https://google.com/maps?q=${position.latitude},${
      position.longitude
    }`;
    io.emit('locationMessage', generateLocationMessage(url));
    callback();
  });
});

server.listen(port, err => {
  if (err) console.error('Server could not start');

  console.info(`Server listening on port ${port}`);
});
