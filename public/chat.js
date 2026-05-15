 //chat.js

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
      // messages.innerHTML += `<li>You: ${input.value}</li>`
      input.value = '';

    }

  });
 socket.on('chat message', (data) => {
  console.log("Server says sender is:", data.senderID, "My ID is:", socket.id);
    const item = document.createElement('li');
    item.innerText= `${data.sender}: ${data.text}`
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});