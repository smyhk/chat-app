const users = [];

// add user to room
const addUser = ({ id, username, room }) => {
  // clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // validate data
  if (!username || !room) {
    return {
      error: 'Username and room are required!'
    };
  }

  // Check for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: 'Username already in use!'
    };
  }

  // Store user in array
  const user = { id, username, room };
  users.push(user);
  return {
    user
  };
};

// remove a user from room by id
const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index > -1) {
    return users.splice(index, 1)[0];
  }
};

// get a single user
const getUser = id => {
  return users.find(user => user.id === id);
};

// get list of users in a room
const getUsersInRoom = room => {
  room = room.trim().toLowerCase();

  return (usersInRoom = users.filter(user => user.room === room));
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
