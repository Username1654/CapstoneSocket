let gameBoard = document.getElementById("gameBoard")
const colors=["red","green","yellow","blue","brown"]
let player = {
    position: { x: 100, y: 100 },
    health:10,
    styles: {
    color: colors[Math.floor(Math.random() * 5)],
    width: "100px",
    height: "100px",
  },
};
console.log(player.health)
let mx = 0
let my = 0
const Projectiles = []
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
window.addEventListener("click", (x) => {
  console.log("click")
  const uId = Math.random()*10000 +"p"
    
  pDiv = document.createElement('div'); 
  pDiv.id = uId ;
  pDiv.className = "projectile";
  pDiv.style.position = "absolute"; 
  pDiv.style.width = "50px";
  pDiv.style.height = "50px";
  pDiv.style.backgroundColor = "black"

  document.getElementById("gameBoard").appendChild(pDiv);
  const boardRect = gameBoard.getBoundingClientRect();
  const targetX = x.clientX - boardRect.left;
  const targetY = x.clientY - boardRect.top;
  const px = player.position.x + 25;
  const py = player.position.y + 25;
  const angle = Math.atan2(targetY - py, targetX - px);
  const anglex = Math.cos(angle);
  const angley = Math.sin(angle);


  const projectile = {
    anglex,
    angley,
    uId,
    x: px,
    y: py,
    cf: socket.id
  };
  Projectiles.push(projectile);
  
  socket.emit('projectile', projectile)
  ;
  
  
 
 

  


    
  
})
 setInterval(() => {
    for (let i = Projectiles.length - 1; i >= 0; i--) {
      const projectile = Projectiles[i];
      const p = document.getElementById(projectile.uId);
      if (!p) continue;

      projectile.x += 5 * projectile.anglex;
      projectile.y += 5 * projectile.angley;

      p.style.left = projectile.x + "px";
      p.style.top = projectile.y + "px";

      if (projectile.cf === socket.id) continue;

      const playerDiv = document.getElementById(socket.id);
      if (!playerDiv) continue;

      const playerRect = playerDiv.getBoundingClientRect();
      const projectileRect = p.getBoundingClientRect();

      if (
        playerRect.left < projectileRect.right &&
        playerRect.right > projectileRect.left &&
        playerRect.top < projectileRect.bottom &&
        playerRect.bottom > projectileRect.top
      ){
        console.log("projectile hit player:", projectile.uId, "shooter:", projectile.cf)
        p.remove()
        Projectiles.splice(i, 1);
        socket.emit("hit", { projectileId: projectile.uId, projectileOwner: projectile.cf });
        
        player.health  -= 1;
        console.log("Player health:", player.health);
        if(player.health <= 0){
    console.log("you died")
    window.location = "https://www.google.com/imgres?q=you%20lose&imgurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fyou-lose-red-rubber-stamp-over-white-background-86701650.jpg&imgrefurl=https%3A%2F%2Fwww.dreamstime.com%2Fillustration%2Fyou-lose.html&docid=fQ8duyte_Fu2sM&tbnid=gBr7l6ITDLzUIM&vet=12ahUKEwjqpdnf5cCUAxVNDkQIHZ66JtgQnPAOegQIIBAB..i&w=800&h=566&hcb=2&ved=2ahUKEwjqpdnf5cCUAxVNDkQIHZ66JtgQnPAOegQIIBAB"
  }
      }
    }
  }, 16.67)

   window.addEventListener("mousemove", (x) => {
    mx = x.clientX
    my = x.clientY
    

  })
  socket.on("hit", (data) => {
      console.log("someone was hit")
      const p = document.getElementById(data.projectileId);
      if (p) {
        p.remove();
      }
      Projectiles.splice(Projectiles.findIndex(p => p.uId === data.projectileId), 1);
    }

  ); 
  
  socket.on("projectile", (sp) => {
      let p = document.getElementById(sp.uId)
      if (!p) {     
        const newP = document.createElement("div")
        newP.id = sp.uId;
        newP.className = "projectile"
        newP.style.position = "absolute"
        newP.style.width = "50px"
        newP.style.height = "50px"
        newP.style.backgroundColor = "black"
        document.getElementById("gameBoard").appendChild(newP)
        p = newP;
        Projectiles.push(sp)
      }
      
      sp.x += 5 * sp.anglex;
      sp.y += 5 * sp.angley;

      p.style.left = sp.x + "px"
      p.style.top = sp.y + "px"
    })
  

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

