const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const path = require("path")
const app = express();
const server = createServer(app);
const io = new Server(server);
const colors = ["red", "green", "yellow", "blue", "brown"];
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const currentPeople = {}

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.username = "Player-" + Math.floor(Math.random() * 10000);
  socket.emit("assign name", socket.username);
  console.log("a user connected: " + socket.username);

  socket.on("player", (playDiv) => {
    currentPeople[socket.id] = {
            ...playDiv,
            id: socket.id 
        };
    socket.emit("player", currentPeople[socket.id]);
    for (const id in currentPeople) {
            if (id !== socket.id) {
                socket.emit("player", currentPeople[id]);
            }
        }
    });
  socket.on("move", (data) => {
        if (currentPeople[socket.id]) {
            currentPeople[socket.id].position = data.position;
          
            socket.broadcast.emit("player moved", {
                id: socket.id,
                position: data.position
            });
        }
    });
  socket.on("disconnect", () => {
    delete currentPeople[socket.id];
    io.emit("remove player", socket.id);
    console.log("user disconnected: " + socket.username);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", {
        sender: socket.username, 
        senderID: socket.id,
        text: msg              
    });
});
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
