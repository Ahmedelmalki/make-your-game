const container = document.getElementById('container');
const ship = document.getElementById('ship')
ship.style.display = 'none'
const score = document.querySelector('.score')
const hearts = document.querySelector('.heartsCount')
var varScore = 0;
let heartsCount = 3

/************************************ pause menu logic ***********************************/
let gameRunning = false;
let gamePaused = false;
const start = document.querySelector('.start')
const menu = document.querySelector('.menu')

function restartGame() {
  const aliens = document.querySelectorAll('.alien');
  const bullets = document.querySelectorAll('.bullet');
  const bombs = document.querySelectorAll('.bomb');

  aliens.forEach(alien => alien.remove());
  bullets.forEach(bullet => bullet.remove());
  bombs.forEach(bomb => bomb.remove());

  ship.style.left = '50%';
  ship.style.transform = 'translateX(-50%)';
  ship.style.display = 'none';
  // why is it not changing
  varScore = 0
  heartsCount = 3

  gameRunning = false;
  gamePaused = false;
}

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  gamePaused = false;

  moveShip();
  setupAliens(3, 8, "./style/img/alien.png");
  spawnBullet();
  boming("container");
  startFPSCounter();
  //updateScore()
  ship.style.display = 'block'
  menu.style.display = 'none';
  start.style.display = 'none';
}

function togglePause() {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  console.log(gamePaused ? 'Game Paused' : 'Game Resumed');
}

document.addEventListener('keydown', (e) => {
  if (e.code === 's' || e.key === 's') {
    startGame();
  } else if (e.code === 'p' || e.key === 'p') {
    togglePause();
  }
  if (e.code === 'r' || e.key === 'r') {
    restartGame()
    startGame();
  }
});

/******************************** Aliens logic *************************************/
function setupAliens(rows, aliensPerRow, alienImageSrc) {

  const aliens = createAliens(rows, aliensPerRow, alienImageSrc);
  animateAliens(aliens, aliensPerRow);
}

function createAliens(rows, aliensPerRow, alienImageSrc) {
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

  const speed = 5;
  const verticalStep = alienHeight + 20;

  let position = 0;
  let direction = 1;
  let topOffset = 0;

  function animate() {
    if (!gamePaused) {
      position += speed * direction;

      const rightmost = position + aliensPerRow * (alienWidth + 10) - 10;
      if (rightmost >= containerWidth || position <= 0) {
        direction *= -1;
        topOffset += verticalStep;
      }

      if (topOffset + verticalStep > containerHeight) {
        console.log("Aliens have reached the bottom!");
        // gameOver(container);
        return;
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
function moveShip() {
  let shipPosition = container.offsetWidth / 2 - ship.offsetWidth / 2;
  document.addEventListener("keydown", (event) => {
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
  const bullet = document.createElement("img");
  bullet.src = "./style/img/bullet.png";
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
          //scoreAndlives();
          varScore += 10;
          updateScore()
          console.log('score ',varScore);
          
          //return;
        }
      });

      const currentTop = parseInt(bullet.style.top, 10);
      if (currentTop <= 0) {
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

let lastBulletTime = 0;
const BULLET_COOLDOWN = 100;
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const currentTime = Date.now();
    if (currentTime - lastBulletTime >= BULLET_COOLDOWN) {
      spawnBullet();
      lastBulletTime = currentTime;
    }
  }
});


/********************************* score and lives logic ******************************************/

function updateScore() {
  score.innerText = `score : ${varScore}`;
  hearts.innerText = `${heartsCount}`
}

/**************************************** bombs logic **********************************/
function boming(containerId) {
  const container = document.getElementById(containerId);
  if (!containerId) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  function spawnBomb() {
    const aliens = document.querySelectorAll(".alien");
    if (aliens.length === 0) {
      return;
    }
    const randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
    const alienRect = randomAlien.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const bomb = document.createElement("img");
    bomb.src = "/style/img/bomb.png";
    bomb.alt = "Bomb";
    bomb.classList.add("bomb");
    bomb.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      left: ${alienRect.left - containerRect.left + alienRect.width / 2}px;
      top: ${alienRect.top - containerRect.top + alienRect.height}px;
    `;
    container.appendChild(bomb);
    animateBomb(bomb);
  }

  function animateBomb(bomb) {
    function move() {
      const bombRect = bomb.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const ship = document.querySelector(".ship");
      if (ship) {
        const shipRect = ship.getBoundingClientRect();
        if (isColliding(bombRect, shipRect)) {
          heartsCount--
          updateScore()
          console.log('hearts count', heartsCount)
          bomb.remove();
        }
      }
      if (bombRect.top >= containerRect.bottom) {
        bomb.remove();
      } else {
        bomb.style.top = `${parseInt(bomb.style.top, 10) + 5}px`;
        requestAnimationFrame(move);
      }
    }
    requestAnimationFrame(move);
  }
  setInterval(() => {
    if (Math.random() < 1 && !gamePaused) {
      spawnBomb();
    }
  }, 1000);
}

/**************************************** fps calculating ********************************************/

function startFPSCounter() {
  let frames = 0;
  let lastTime = performance.now();
  let fpsHistory = [];
  const historySize = 60;

  const fps = document.createElement("div");
  fps.className = "fps-display";
  container.appendChild(fps);

  function updateFPS() {
    const now = performance.now();
    const deltaTime = now - lastTime;
    frames++;

    if (deltaTime >= 500) {
      const currentFPS = Math.round((frames * 1000) / deltaTime);
      fpsHistory.push(currentFPS);
      if (fpsHistory.length > historySize) fpsHistory.shift();

      const averageFPS = Math.round(
        fpsHistory.reduce((sum, fps) => sum + fps, 0) / fpsHistory.length
      );

      fps.textContent = `FPS: ${currentFPS}, Average: ${averageFPS}`;

      frames = 0;
      lastTime = now;
    }

    requestAnimationFrame(updateFPS);
  }

  updateFPS();
}

// function gameOver(container) {
//   const game_over = document.createElement('div')
//   game_over.className = 'game_over'
//   game_over.style.position = 'absolute';
//   game_over.style.top = '50%';
//   game_over.style.left = '50%';
//   game_over.style.transform = 'translate(-50%, -50%)';
//   game_over.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
//   game_over.style.color = 'white';
//   game_over.style.fontSize = '2em';
//   game_over.style.padding = '20px';
//   game_over.style.borderRadius = '10px';
//   game_over.style.textAlign = 'center';
//   game_over.style.zIndex = '1000';
//   game_over.textContent = 'Game Over';
//   container.appendChild(game_over);
// }

// function won(container) {
//   const WON = document.createElement('div')
//   WON.className = 'WON'
//   WON.style.position = 'absolute';
//   WON.style.top = '50%';
//   WON.style.left = '50%';
//   WON.style.transform = 'translate(-50%, -50%)';
//   WON.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
//   WON.style.color = 'white';
//   WON.style.fontSize = '2em';
//   WON.style.padding = '20px';
//   WON.style.borderRadius = '10px';
//   WON.style.textAlign = 'center';
//   WON.style.zIndex = '1000';
//   WON.textContent = 'WON';
//   container.appendChild(WON);
// }