// client
const socket = io();

socket.on('message', msg => {
  console.log(msg);
});

// socket.on('countUpdated', count => {
//   console.log('count updated', count);
// });

document.querySelector('#message-form').addEventListener('submit', e => {
  e.preventDefault();

  const message = e.target.elements.message.value;
  // document.querySelector('message').value;

  socket.emit('sendMessage', message);
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  });
});
