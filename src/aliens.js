/************************* global vars ****************************/
const ship = document.getElementById('ship')
const game_over = document.getElementById('game-over-container')
const game_won = document.getElementById('game-won-container')
ship.style.display = 'none'
game_over.style.display = 'none'
game_won.style.display = 'none';
const score = document.getElementById('score')
const hearts = document.getElementById('heartsCount')

var varScore = 0;
let heartsCount = 3
let gameRunning = false;
let gamePaused = false;
let gameEnded = false;
const start = document.getElementById('start')

let alienAnimationId = null;
let bulletAnimationIds = new Set();

let lastBulletTime = 0;
const BULLET_COOLDOWN = 150;

const shootSound = document.getElementById('shoot')

const bestScoreDisplay = document.getElementById('best-score')
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
bestScoreDisplay.textContent = `Best Score: ${bestScore}`;


/**************best score logic*************/
function updateBestScore() {
  if (varScore > bestScore) {
    bestScore = varScore;
    localStorage.setItem('bestScore', bestScore); // Store in localStorage
    bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
  }
}

/************************************ pause menu logic ***********************************/
function restartGame() {
  bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
  ship.style.left = '50%';
  ship.style.transform = 'translateX(-50%)';
  ship.style.display = 'none';
  game_over.style.display = 'none'
  game_won.style.display = 'none';
  
  
  varScore = 0
  heartsCount = 3
  
  score.textContent = varScore;
  hearts.textContent = heartsCount;
  
  gameRunning = false;
  gamePaused = false;
  gameEnded = false;
  Clean()
}

function startGame() {
  if (gameRunning) return;


  const container = document.getElementById('container');
  
  const menu = document.getElementById('menu')
  gameRunning = true;
  gamePaused = false;
  
  moveShip(container);
  setupAliens(6, 5);
  spawnBullet();
  ship.style.display = 'block'
  start.style.display = 'none';
  game_over.style.display = 'none'
  menu.style.display = 'none'
}

function togglePause() {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  if (gamePaused) {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
  console.log(gamePaused ? 'Game Paused' : 'Game Resumed');
}



function cleanEventListeners() {
  document.removeEventListener("keydown", handleKeyDown);
}
function handleKeyDown(e) {
  if (e.key === "s") startGame();
  if (e.key === "p") togglePause();
  if (e.key === "r") {
    restartGame();
    startGame();
  }
}

document.addEventListener("keydown", handleKeyDown);

/**************************** game over logic *****************************/
function Clean() {
  if (alienAnimationId) {
    cancelAnimationFrame(alienAnimationId);
    alienAnimationId = null;
  }

  for (const id of bulletAnimationIds) {
    cancelAnimationFrame(id);
  }
  bulletAnimationIds.clear();

  const aliens = document.querySelectorAll('.alien');
  const bullets = document.querySelectorAll('.bullet');
  aliens.forEach(alien => alien.remove());
  bullets.forEach(bullet => bullet.remove());
}

function gameOver() {
  if (heartsCount === 0) {
    updateBestScore()
    gameRunning = false;
    gamePaused = false;
    gameEnded = true;
    game_over.style.display = 'block';
    ship.style.display = 'none';
    Clean()
  }
}

function gameWon() {
  if (document.querySelectorAll('.alien').length === 0) {
    updateBestScore()
    gameRunning = false;
    gamePaused = false;
    gameEnded = true;
    game_won.style.display = 'flex';
    ship.style.display = 'none';
    Clean()
  }
}

/******************************** Aliens logic *************************************/
function setupAliens(rows, aliensPerRow) {

  const aliens = createAliens(rows, aliensPerRow);
  animateAliens(aliens, aliensPerRow);
}

function createAliens(rows, aliensPerRow) {
  const container = document.getElementById('container');
  const alienWidth = 32;
  const alienHeight = 32;
  const aliens = [];

  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < aliensPerRow; i++) {
      const alien = document.createElement("img");
      let alienImageSrc = null;
      if (row === 0) {
        alienImageSrc = './style/img/enemy1.png';
      } else if (row === 1) {
        alienImageSrc = './style/img/enemy2.png';
      } else if (row === 2) {
        alienImageSrc = './style/img/enemy3.png';
      } else {
        alienImageSrc = './style/img/alien.png';
      }
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
          updateBestScore()
          topOffset = 0;
        }
        if (heartsCount === 0) {
          cancelAnimationFrame(alienAnimationId);
          alienAnimationId = null;
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
        //aliens[i].style.transform = `translate(${left}px, ${top}px)`;
      }
    }

    alienAnimationId = requestAnimationFrame(animate);
  }

  animate();
}

/********************************* ship logic ****************************************/

const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  " ": false
};

function moveShip(container) {
  let shipPosition = container.offsetWidth / 2 - ship.offsetWidth / 2;

  document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });

  function updateShip() {
    if (gamePaused || !gameRunning) return;

    const containerWidth = container.offsetWidth;
    if (keys.ArrowLeft && shipPosition > 0) {
      shipPosition -= 15;
    }
    if (keys.ArrowRight && shipPosition < containerWidth - ship.offsetWidth) {
      shipPosition += 15;
    }
    if (keys[" "]) {
      const currentTime = Date.now();
      if (currentTime - lastBulletTime >= BULLET_COOLDOWN) {
        shootSound.play()
        spawnBullet();
        lastBulletTime = currentTime;
      }
    }

    ship.style.left = `${shipPosition}px`;
    requestAnimationFrame(updateShip);
  }

  requestAnimationFrame(updateShip);
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
  let bulletAnimationId;
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
          updateBestScore()
          cancelAnimationFrame(bulletAnimationId);
          bulletAnimationIds.delete(bulletAnimationId);
          return;
        }
      });

      const remainingAliens = document.querySelectorAll(".alien");
      if (remainingAliens.length === 0) {
        gameWon();
        cancelAnimationFrame(bulletAnimationId);
        bulletAnimationIds.delete(bulletAnimationId);
        return;
      }

      const currentTop = parseInt(bullet.style.top, 10);
      if (currentTop <= 0 || !bullet.parentNode) {
        // console.log(bullet);

        bullet.remove();
      } else {
        bullet.style.top = `${currentTop - 5}px`;
      }
    }
    if (bullet.parentNode) {
      bulletAnimationId = requestAnimationFrame(move);
    }
  }
  bulletAnimationId = requestAnimationFrame(move);
  bulletAnimationIds.add(bulletAnimationId);
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
