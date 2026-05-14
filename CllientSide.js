const { io } = require("socket.io-client");
const socket = io("https://localhost:3000");
let playerId= null
socket.on("connect", () => {
    playerId=socket.id
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });



