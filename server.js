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
    currentPeople[socket.id] = playDiv;
    socket.emit("player", playDiv);
    for (const id in currentPeople) {
      if (id !== socket.id) {
        socket.emit("player", currentPeople[id]);
      }
    }
  });
  socket.on("move", (data) => {
    socket.emit("player moved", data);
  });
  socket.on("disconnect", () => {
    delete currentPeople[socket.id];
    io.emit("remove player", socket.id);
    console.log("user disconnected: " + socket.username);
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    socket.broadcast.emit("chat message", socket.username + ": " + msg);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
