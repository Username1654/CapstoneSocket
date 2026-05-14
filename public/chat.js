 //chat.js
 const socket = io();
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');
  const chat = document.getElementById("chat")
  const openButton = document.getElementById('openChat')
  openButton.addEventListener('click',()=>{
    chat.classList.toggle("open")
      chat.classList.toggle("closed")
       form.classList.toggle("open")
      form.classList.toggle("closed")
        messages.classList.toggle("open")
      messages.classList.toggle("closed")
  })
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';

    }

  });
  socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
