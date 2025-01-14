/************************* global vars ****************************/

const container = document.getElementById('container');
const ship = document.getElementById('ship')
const game_over = document.getElementById('game-over-container')
const game_won = document.getElementById('game-won-container')
ship.style.display = 'none'
game_over.style.display = 'none'
const score = document.querySelector('.score')
const hearts = document.querySelector('.heartsCount')
var varScore = 0;
let heartsCount = 3
let gameRunning = false;
let gamePaused = false;
const start = document.querySelector('.start')
const menu = document.querySelector('.menu')

/************************************ pause menu logic ***********************************/

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
  game_over.style.display = 'none'

  // why is it not changing
  varScore = 0
  heartsCount = 3

  score.textContent = varScore;
  hearts.textContent = heartsCount;

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
  ship.style.display = 'block'
  menu.style.display = 'none';
  start.style.display = 'none';
  game_over.style.display = 'none'
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




/**************************** game over logic *****************************/
function gameOver() {
  if (heartsCount === 0) {
    const aliens = document.querySelectorAll('.alien');
    const bullets = document.querySelectorAll('.bullet');
    const bombs = document.querySelectorAll('.bomb');
    gameRunning = false;
    gamePaused = false;

    game_over.style.display = 'block';


    aliens.forEach(alien => alien.remove());
    bullets.forEach(bullet => bullet.remove());
    bombs.forEach(bomb => bomb.remove());

    ship.style.display = 'none';
  }
}

function gameWon() {
  if (aliens.length === 0) {
    const aliens = document.querySelectorAll('.alien');
    const bullets = document.querySelectorAll('.bullet');
    const bombs = document.querySelectorAll('.bomb');
    gameRunning = false;
    gamePaused = false;

    game_won.style.display = 'block';


    aliens.forEach(alien => alien.remove());
    bullets.forEach(bullet => bullet.remove());
    bombs.forEach(bomb => bomb.remove());

    ship.style.display = 'none';
  }
}

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
        heartsCount--
        gameOver()
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
const BULLET_COOLDOWN = 270;
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

// xrandr --output HDMI-1 --mode 1920x1080 --rate 50.00