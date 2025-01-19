/************************* global vars and page start ****************************/
const menu = document.getElementById('menu');
const ship = document.getElementById('ship');
const game_over = document.getElementById('game-over-container');
const game_won = document.getElementById('game-won-container');
const start_game = document.getElementById('start_game');
const score = document.getElementById('score');
const hearts = document.getElementById('heartsCount');
const gameAudio = document.getElementById('gameAudio');
var varScore = 0;
let heartsCount = 3;
let gameRunning = false;
let gamePaused = false;
let gameEnded = false;
let Continue = false;
start_game.display= 'flex';
ship.style.display = 'none';
game_over.style.display = 'none';
game_won.style.display = 'none';
menu.style.display = 'none';


/************************************ pause menu logic ***********************************/
function restartGame() {
  Clean()
  Continue = false;
  ship.style.left = '50%';
  ship.style.transform = 'translateX(-50%)';
  ship.style.display = 'none';
  game_over.style.display = 'none'
  game_won.style.display = 'none';
  menu.style.display = 'none'; 
  start_game.style.display = 'none';


  varScore = 0
  heartsCount = 3

  score.textContent = varScore;
  hearts.textContent = heartsCount;

  gameRunning = false;
  gamePaused = false;
  gameEnded = false;
}

function startGame() {
  
  if (gameRunning) return;

  gameAudio.play();

  const container = document.getElementById('container');
  gameRunning = true;
  gamePaused = false;
  

  moveShip(container);
  setupAliens(2, 22, "./style/img/alien.png");
  spawnBullet();
  ship.style.display = 'block';
  start_game.style.display = 'none';
  game_over.style.display = 'none';
  menu.style.display = 'none';
}

function togglePause() {

  if (!gameRunning) return;
  gamePaused = !gamePaused;
  if (gamePaused) {
    Continue = !Continue;     /////////////////    p(click)=>continue = false        
    menu.style.display = 'block';
    gameAudio.pause();
  } else {
    Continue = false;
   
    menu.style.display = 'none';
    gameAudio.play();
  }
}

let lastBulletTime = 0;
const BULLET_COOLDOWN = 50;


function cleanEventListeners() {
  document.removeEventListener("keydown", handleKeyDown);
}
///////////////////////////kyborde
function handleKeyDown(e) {
  if (e.key === "s") startGame();
  if (e.key === "p") togglePause(); //pause game
  if (e.key === "r" && Continue) {
    Continue = false;
    restartGame();
    startGame();

  }
  if (e.key === " ") {
    if (gamePaused || !gameRunning) return;
    const currentTime = Date.now();
    if (currentTime - lastBulletTime >= BULLET_COOLDOWN) {
      spawnBullet();
      lastBulletTime = currentTime;
    }
  }
}

document.addEventListener("keydown", handleKeyDown);

/**************************** game over logic *****************************/
function Clean() {
  const aliens = document.querySelectorAll('.alien');
  const bullets = document.querySelectorAll('.bullet');
  const bombs = document.querySelectorAll('.bomb');
  aliens.forEach(alien => alien.remove());
  bullets.forEach(bullet => bullet.remove());
  bombs.forEach(bomb => bomb.remove());
}

function gameOver() {
  //if (heartsCount === 0) {
   // Clean()
    gameRunning = false;
    gamePaused = false;
    gameEnded = true;
    game_over.style.display = 'block';
    ship.style.display = 'none';
    Continue = true;
  //}
}

function decrimentheartsCount() {
  let aliens = document.querySelectorAll('.alien');
  let positionships = ship.getBoundingClientRect();
  
  // Vérifie si la position du vaisseau est valide
  if (!positionships) return;

  aliens.forEach((e) => {
    let positionaliens = e.getBoundingClientRect();
    
    if (positionaliens.bottom >= positionships.top && 
        positionaliens.top <= positionships.bottom && 
        positionaliens.right >= positionships.left && 
        positionaliens.left <= positionships.right) {
      
     
      gameOver();
      
      
      
      
     
    }
  });

}

setInterval(decrimentheartsCount, 100); // Exécute la fonction toutes les 100 ms


/**********************game won logic **************************************/

function gameWon() {
  Continue = true;
  if (document.querySelectorAll('.alien').length === 0) {
    Clean()
    gameRunning = false;
    gamePaused = false;
    gameEnded = true;
    game_won.style.display = 'block';
    ship.style.display = 'none';
  }
}

/******************************** Aliens logic *************************************/
function setupAliens(rows, aliensPerRow, alienImageSrc) {

  const aliens = createAliens(rows, aliensPerRow, alienImageSrc);
  animateAliens(aliens, aliensPerRow);
}

function createAliens(rows, aliensPerRow, alienImageSrc) {
  const container = document.getElementById('container');
  const alienWidth = 32;
  const alienHeight = 32;
  const aliens = [];

  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < aliensPerRow; i++) {
      const alien = document.createElement("img");
      alien.src = alienImageSrc;
      alien.alt = "Illustration of aliens";
      alien.classList.add("alien");

      alien.style.left = i * (alienWidth + 10) + "px";
      alien.style.top = row * (alienHeight + 10) + "px";

      container.appendChild(alien);
      aliens.push(alien);
    }
  }

  return aliens;
}

function animateAliens(aliens, aliensPerRow) {
  const alienWidth = 32;
  const alienHeight = 32;
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const speed = 8;
  const verticalStep = alienHeight + 20;

  let position = 0;
  let direction = 1;
  let topOffset = 0;

  function animate() {
    if (!gamePaused && gameRunning && !gameEnded) {
      position += speed * direction;

      const rightmost = position + aliensPerRow * (alienWidth + 10) - 10;
      if (rightmost >= containerWidth || position <= 0) {
        direction *= -1;
        topOffset += verticalStep;
      }

      if (topOffset + verticalStep > containerHeight) {
        console.log("Aliens have reached the bottom!");
        if (heartsCount > 0) {
          heartsCount--;
          updateScore();
          topOffset = 0;
        }
        if (heartsCount === 0) {
          gameOver();
          return;
        }
      }

      for (let i = 0; i < aliens.length; i++) {
        const row = Math.floor(i / aliensPerRow);
        const column = i % aliensPerRow;
        const left = position + column * (alienWidth + 10);
        const top = topOffset + row * verticalStep;

        aliens[i].style.left = `${left}px`;
        aliens[i].style.top = `${top}px`;
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/********************************* ship logic ****************************************/

// only move the ship if the game ain't over
function moveShip(container) {
  let shipPosition = container.offsetWidth / 2 - ship.offsetWidth / 2;
  document.addEventListener("keydown", (event) => {
    if (gamePaused || !gameRunning) return;
    const containerWidth = container.offsetWidth;

    if (event.key === "ArrowLeft" && shipPosition > 0) {
      shipPosition -= 15;
    } else if (event.key === "ArrowRight" && shipPosition < containerWidth - ship.offsetWidth) {
      shipPosition += 15;
    }

    ship.style.left = `${shipPosition}px`;
  });
}

/*********************************** bullet logic ************************************/
function spawnBullet() {
  const container = document.getElementById('container');
  const bullet = document.createElement("img");
  bullet.src = "./style/img/Laser.png";
  bullet.alt = "Bullet";
  bullet.classList.add("bullet");

  const shipRect = ship.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const bulletX = shipRect.left + shipRect.width / 2 - containerRect.left - 5;
  const bulletY = shipRect.top - containerRect.top - 10;

  bullet.style.left = `${bulletX}px`;
  bullet.style.top = `${bulletY}px`;
  container.appendChild(bullet);

  animateBullet(bullet);
}

function animateBullet(bullet) {
  function move() {
    if (!gamePaused) {
      const bulletRect = bullet.getBoundingClientRect();
      const aliens = document.querySelectorAll(".alien");

      aliens.forEach((alien) => {
        const alienRect = alien.getBoundingClientRect();
        if (isColliding(bulletRect, alienRect)) {
          alien.remove();
          bullet.remove();
          varScore += 10;
          updateScore()
        }
      });

      const remainingAliens = document.querySelectorAll(".alien");
      if (remainingAliens.length === 0) {
        gameWon();
      }

      const currentTop = parseInt(bullet.style.top, 10);
      if (currentTop <= 0 || !bullet.parentNode) {
        console.log(bullet);

        bullet.remove();
      } else {
        bullet.style.top = `${currentTop - 5}px`;
      }
    }
    if (bullet.parentNode) {
      requestAnimationFrame(move);
    }
  }
  requestAnimationFrame(move);
}

function isColliding(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

/********************************* score and lives logic ******************************************/

function updateScore() {
  score.innerText = `score : ${varScore}`;
  hearts.innerText = `hearts : ${heartsCount}`
}


