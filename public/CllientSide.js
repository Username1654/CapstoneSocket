let gameBoard = document.getElementById("gameBoard")
const colors=["red","green","yellow","blue","brown"]
let player = {
    position: { x: 100, y: 100 },
    styles: {
    color: colors[Math.floor(Math.random() * 5)],
    width: "100px",
    height: "100px",
  },
};
window.addEventListener("keydown", (event) => {
  if (!socket.id || !document.getElementById(socket.id)) return;
  let moved = false;
  const speed = 15;
  if (event.key === "w" || event.key === "ArrowUp") {
    player.position.y -= speed;
    moved = true;
  }
  if (event.key === "s" || event.key === "ArrowDown") {
    player.position.y += speed;
    moved = true;
  }
  if (event.key === "a" || event.key === "ArrowLeft") {
    player.position.x -= speed;
    moved = true;
  }
  if (event.key === "d" || event.key === "ArrowRight") {
    player.position.x += speed;
    moved = true;
  }

  if (moved) {
    const myDiv = document.getElementById(socket.id);
    if (myDiv) {
      myDiv.style.top = `${player.position.y}px`;
      myDiv.style.left = `${player.position.x}px`;
    }
    socket.emit("move", { id: socket.id, position: player.position });
  }
});
socket.on("connect", () => {
    console.log(player)
    // let boxPlayer = `<div id="${socket.id}" style="background-color:${player.styles.color}; height:${player.styles.height}; width:${player.styles.width}; position: absolute; left:${player.position.x}px; top:${player.position.y}px;"></div>`;
        socket.emit("player", player);
});

socket.on("player", (player) => {
    gameBoard.innerHTML += player
})


  socket.on("player moved", (data) => {
    const targetDiv = document.getElementById(data.id);
    if (targetDiv) {
      targetDiv.style.top = `${data.position.y}px`;
      targetDiv.style.left = `${data.position.x}px`;
    }
  });
socket.on("remove player", (id) => {
  const playerDiv = document.getElementById(id);
  if (playerDiv) {
    playerDiv.remove();
  }
});

