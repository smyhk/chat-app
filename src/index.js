const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('../src/utils/users');

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

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    // send new user a welcome message
    socket.emit('message', generateMessage('Admin', 'Welcome!'));

    // send all other users a message when a new user connects (room)
    socket.broadcast
      .to(user.room)
      .emit('message', generateMessage('Admin', `${user.username} has joined`));

    // user joined with no errors
    callback();
  });

  // chat message handler
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    // sends data to all connected sockets
    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback();
  });

  // listens for a user disconnet event
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage('Admin', `${user.username} has left`)
      );
    }
  });

  // geolocation handler
  socket.on('sendLocation', (position, callback) => {
    const user = getUser(socket.id);

    let url = `https://google.com/maps?q=${position.latitude},${
      position.longitude
    }`;
    io.to(user.room).emit(
      'locationMessage',
      generateLocationMessage(user.username, url)
    );
    callback();
  });
});

server.listen(port, err => {
  if (err) console.error('Server could not start');

  console.info(`Server listening on port ${port}`);
});
