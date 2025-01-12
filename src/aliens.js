import { startFPSCounter } from "./fps.js";
import { boming } from "./bomb.js";
const container = document.getElementById('container');
/************************************ pause menu logic ***********************************/
let gameRunning = false;
let gamePaused = false;

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  gamePaused = false;

  setupShip();
  moveShip();
  setupAliens(3, 8, "./style/img/alien.png");
  spawnBullet();
  boming("container");
  startFPSCounter();

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
});

/******************************** Aliens logic *************************************/
export function setupAliens(rows, aliensPerRow, alienImageSrc) {

  const aliens = createAliens(rows, aliensPerRow, alienImageSrc);
  animateAliens(aliens, aliensPerRow);
}

export function createAliens(rows, aliensPerRow, alienImageSrc) {
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

export function animateAliens(aliens, aliensPerRow) {
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

export function setupShip() {
  const ship = document.createElement("img");
  ship.src = "./style/img/ship.png";
  ship.id = 'ship'
  ship.alt = "Illustration of the ship";
  ship.className = "ship";

  container.appendChild(ship);
}

// only move the ship if the game ain't over
export function moveShip() {
  const ship = document.getElementById('ship')

  let shipPosition = container.offsetWidth / 2 - ship.offsetWidth / 2;
  document.addEventListener("keydown", (event) => {
    const containerWidth = container.offsetWidth;

    if (event.key === "ArrowLeft" && shipPosition > 0) {
      shipPosition -= 15;
    } else if (
      event.key === "ArrowRight" &&
      shipPosition < containerWidth - ship.offsetWidth
    ) {
      shipPosition += 15;
    }

    ship.style.left = `${shipPosition}px`;
  });
}
/*********************************** bullet logic ************************************/

export function spawnBullet() {
  const ship = document.querySelector(".ship");
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

let varScore = 0;
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
          scoreAndlives();
          return;
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
export function scoreAndlives() {
  const score = document.createElement("div");
  score.className = "score";
  score.innerText = `score : ${varScore}`;

  const livesContainer = document.createElement("div");
  livesContainer.className = "lives-container";


  for (let i = 0; i < 3; i++) {
    const heart = document.createElement("img");
    heart.src = "./style/img/heart.png";
    heart.alt = "Heart";
    heart.classList.add("heart");

    livesContainer.appendChild(heart);
  }

  container.appendChild(score);
  container.appendChild(livesContainer);
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