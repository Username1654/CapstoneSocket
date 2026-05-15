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
function createOrUpdatePlayer(id, data) {
    let pDiv = document.getElementById(id);
    
    // If the div doesn't exist, CREATE it
    if (!pDiv) {
        pDiv = document.createElement('div');
        pDiv.id = id;
        pDiv.className = "player-square";
        pDiv.style.position = "absolute"; 
        pDiv.style.width = "50px";
        pDiv.style.height = "50px";
        document.getElementById("gameBoard").appendChild(pDiv);
        console.log("Created new square for:", id);
    }
    
    // Always update the position and color
    pDiv.style.backgroundColor = colors[Math.floor(Math.random()*10)];
    pDiv.style.left = data.position.x + "px";
    pDiv.style.top = data.position.y + "px";
}
socket.on("connect", () => {
    console.log(player)
    // let boxPlayer = `<div id="${socket.id}" style="background-color:${player.styles.color}; height:${player.styles.height}; width:${player.styles.width}; position: absolute; left:${player.position.x}px; top:${player.position.y}px;"></div>`;
        socket.emit("player", player);
});

socket.on("player", (playerData) => {
    // 1. Check if the player already exists (prevents duplicates)
    createOrUpdatePlayer(playerData.id, playerData);
    if (document.getElementById(playerData.id)) {
        return; 
    }

    // 2. Create the element piece by piece
    if (document.getElementById(playerData.id)) return;
    const newDiv = document.createElement("div");
    
    // 3. Set the properties
    newDiv.id = playerData.id;
    newDiv.style.position = "absolute";
    newDiv.style.width = "50px";
    newDiv.style.height = "50px";
    newDiv.style.backgroundColor = playerData.styles.color;
    newDiv.style.left = playerData.position.x + "px";
    newDiv.style.top = playerData.position.y + "px";
    newDiv.className = "player-square"; // Use a class for CSS styling

    // 4. Add it to the board without refreshing anything else
    document.getElementById("gameBoard").appendChild(newDiv);
});


  socket.on("player moved", (data) => {
    const targetDiv = document.getElementById(data.id);
    createOrUpdatePlayer(data.id, data);
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

