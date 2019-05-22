// client
const socket = io();

// elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('message', msg => {
  console.log(msg);
  const html = Mustache.render(messageTemplate, {
    message: msg
  });
  $messages.insertAdjacentHTML('beforeend', html)
});

socket.on('locationMessage', locationUrl => {
  console.log(locationUrl)
})

$messageForm.addEventListener('submit', e => {
  e.preventDefault();

  // disable send button
  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;
  // document.querySelector('message').value;

  // event ack
  socket.emit('sendMessage', message, error => {
    // enable button, clear input field, focus input field
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if (error) {
      return console.error(error);
    }

    console.info('Message delivered');
  });
});

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }

  // disable button while fetching geolocation
  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        console.info('Location shared!');
        // enable send button after geolcation has been received
        $sendLocationButton.removeAttribute('disabled');
      }
    );
  });
});
