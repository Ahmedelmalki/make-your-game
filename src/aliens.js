/************************* global vars ****************************/
const ship = document.getElementById('ship')
const game_over = document.getElementById('game-over-container')
const game_won = document.getElementById('game-won-container')
const fire = document.getElementById("fire");
ship.style.display = 'none'
game_over.style.display = 'none'
game_won.style.display = 'none';
const score = document.getElementById('score')
const hearts = document.getElementById('heartsCount')

var varScore = 0;
let heartsCount = 3;
var Fire = 500;
let gameRunning = false;
let gamePaused = false;
let gameEnded = false;
let Continue = false;


const start = document.getElementById('start')

let alienAnimationId = null;
let bulletAnimationIds = new Set();

let lastBulletTime = 0;
const BULLET_COOLDOWN = 100;

const shootSound = document.getElementById('shoot')
const storyElement = document.getElementById('story');

const bestScoreDisplay = document.getElementById('best-score')
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
bestScoreDisplay.textContent = `Best Score: ${bestScore}`;


/************** Audio Handling **************/
const backgroundAudio = document.getElementById('background-audio');

const austartTime = 5;
const endTime = 20; 

backgroundAudio.currentTime = austartTime;

function playBackgroundAudio() {
  backgroundAudio.volume = 0.2; 
  backgroundAudio.play().catch((err) => {
    console.warn("Audio playback failed:", err);
  });

  backgroundAudio.addEventListener('timeupdate', () => {
    if (backgroundAudio.currentTime >= endTime) {
      backgroundAudio.currentTime = austartTime; 
      backgroundAudio.play();
    }
  });
}

function pauseBackgroundAudio() {
  backgroundAudio.pause();
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseBackgroundAudio(); 
  } else {
    if (gameRunning && !gamePaused && !gameEnded) {
      playBackgroundAudio();
    }
  }
});

startGame = function () {
  if (gameRunning) return;

  playBackgroundAudio(); 
  const container = document.getElementById('container');

  const menu = document.getElementById('menu');
  gameRunning = true;
  gamePaused = false;

  startTime = Date.now();
  elapsedTime = 0;
  requestAnimationFrame(timer);

  moveShip(container);
  setupAliens(6, 5);
  spawnBullet();
  ship.style.display = 'block';
  start.style.display = 'none';
  game_over.style.display = 'none';
  menu.style.display = 'none';
};

/**************best score logic*************/
function updateBestScore() {
  if (varScore > bestScore) {
    bestScore = varScore;
    localStorage.setItem('bestScore', bestScore);
    bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
  }
}

/*****************best time logic***************/
const bestTimeDisplay = document.getElementById('best-time')
const displayTime = document.getElementById('timer')

let bestTime = parseInt(localStorage.getItem('bestTime')) || Infinity;
bestTimeDisplay.textContent = `Best Time: ${bestTime}`

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;

function updateBestTime() {
  const currentTime = Math.floor(elapsedTime / 1000);
  if (currentTime < bestTime) {
    bestTime = currentTime;
    localStorage.setItem('bestTime', bestTime);
    bestTimeDisplay.textContent = `Best Time: ${formatTime(bestTime)}`;
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function timer() {
  if (!gamePaused && gameRunning) {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    displayTime.textContent = `${formatTime(Math.floor(elapsedTime / 1000))}`;
  }
  requestAnimationFrame(timer);
}

/************************************ pause menu logic ***********************************/
function restartGame() {
  Continue = false;

  bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
  bestTimeDisplay.textContent = `Best Time: ${formatTime(bestTime)}`;

  ship.style.left = '50%';
  ship.style.transform = 'translateX(-50%)';
  ship.style.display = 'none';
  game_over.style.display = 'none'
  game_won.style.display = 'none';


  varScore = 0;
  heartsCount = 3;
  Fire = 500;
  UPdateFire();

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

  startTime = Date.now();
  elapsedTime = 0;
  requestAnimationFrame(timer);

  moveShip(container);
  setupAliens(6, 5);
  spawnBullet();
  ship.style.display = 'block'
  start.style.display = 'none';
  game_over.style.display = 'none'
  menu.style.display = 'none'
}

function togglePause() {
  Continue = !Continue; 
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  if (gamePaused) {
    Continue = true; 
    menu.style.display = 'block';
  } else {
    Continue = false;
    menu.style.display = 'none';
  }
  console.log(gamePaused ? 'Game Paused' : 'Game Resumed');
}
function toggleResume() {
  if (!gamePaused || !gameRunning) return;
  
  gamePaused = false;
  menu.style.display = 'none';

  requestAnimationFrame(timer);
  moveShip(document.getElementById('container')); 

  console.log("Game Resumed");
}

function cleanEventListeners() {
  document.removeEventListener("keydown", handleKeyDown);
}
document.addEventListener("DOMContentLoaded", () => {
  updateStory("Hello, Player! Your mission is to protect the galaxy from an alien invasion. Survive and kill the monsters!");
});
let isMuted = false;
function handleKeyDown(e) {
  if ((e.key === "s" || e.key === "S") &&
  (!game_won.style.display || game_won.style.display === 'none') && 
  (!game_over.style.display || game_over.style.display === 'none')
) {
  hideStory(); 
  startGame();
}  
if ((e.key === "p" || e.key === "P") && gameRunning && !gamePaused) {
  
  togglePause();
}

if (e.key === "Escape") {
  toggleResume();
}
if ((e.key === "r" || e.key === "R") &&
(gamePaused || 
 game_won.style.display && game_won.style.display !== 'none' ||
 game_over.style.display && game_over.style.display !== 'none')) {
Continue = false;
restartGame();
startGame();
}

if (e.key === "m" || e.key === "M") {
  isMuted = !isMuted; 
  muteMusic(isMuted);
}
}
function muteMusic(mute) {
  if (backgroundAudio) {
    backgroundAudio.muted = mute; 
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
  Continue = true;
  updateBestScore();
  updateBestTime();
  gameRunning = false;
  gamePaused = false;
  gameEnded = true;
  game_over.style.display = 'block';
  ship.style.display = 'none';
  hearts.innerText = `hearts : 0`;
  
  pauseBackgroundAudio();
  
  const gameOverSound = document.getElementById('game-over-sound');
  gameOverSound.currentTime = 0; 
  gameOverSound.play();
  gameOverSound.volume = 0.2
  
  Clean();
}

function gameWon() {
  if (varScore >= 3000) {
    updateBestScore();
    updateBestTime();
    gameRunning = false;
    gamePaused = false;
    gameEnded = true;
    game_won.style.display = 'flex';
    ship.style.display = 'none';
    
    pauseBackgroundAudio();
    
    const gameOverSound = document.getElementById('game-won-sound');
    gameOverSound.currentTime = 0; 
    gameOverSound.play();
    gameOverSound.volume = 0.2;
    Clean();
  }
}
let storyDeveloped = false;

function checkAliensRemaining() {
  if (document.querySelectorAll('.alien').length === 0) {
    if (varScore >= 2000) {
      gameWon();
    } else {
      setupAliens(6, 5); // Respawn aliens
    }
  }
}
function updateStory(text, pauseGame = false) {
  storyElement.innerText = text;
  storyElement.style.display = "block";
  if (pauseGame) {
    gamePaused = true;
    pauseBackgroundAudio();
  }
}
function hideStory() {
  const storyElement = document.getElementById("story");
  if (storyElement) {
    storyElement.style.display = "none";
  }
}

function checkStoryProgress(score) {
  if (score >= 500 && !storyDeveloped) {
    storyDeveloped = true;
    showStoryDevelopment();
  } 
  if (score >= 1000) {
    updateStory("You have saved the galaxy!");
  }
}

function showStoryDevelopment() {
  if (storyElement) {
    storyElement.innerText = "A new wave of enemies is approaching... Prepare for battle!";
    storyElement.classList.add("show");

    setTimeout(() => {
      storyElement.classList.remove("show");
    }, 5000); // Keep for 5 seconds
  }
}





let canDecrement = true; 

function checkCollisions() {
  let aliens = document.querySelectorAll('.alien');
  let positionShips = ship.getBoundingClientRect();

  if (!positionShips) return;

  aliens.forEach((alien) => {
    let positionAliens = alien.getBoundingClientRect();

    if (
      positionAliens.bottom >= positionShips.top &&
      positionAliens.top <= positionShips.bottom &&
      positionAliens.right >= positionShips.left &&
      positionAliens.left <= positionShips.right
    ) {
      if (canDecrement) {
        decrementHeartsCount();
        canDecrement = false; 
        setTimeout(() => {
          canDecrement = true;
        }, 1000);
      }
    }
  });
}

function decrementHeartsCount() {

  if (heartsCount > 1) {
    heartsCount--;

    updateScore();
    updateBestScore();
    const aliens = document.querySelectorAll('.alien');
    aliens.forEach(alien => alien.remove());
    setupAliens(6, 5);
   
    

  } else if (heartsCount === 1) {
    console.log("warah sf khserti");
    cancelAnimationFrame(alienAnimationId);
    alienAnimationId = null;
     gameOver();
  }
}

setInterval(checkCollisions, 100); 




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
        alienImageSrc = './style/img/enemy3.png';
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

  const speed = 10;
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
     

      for (let i = 0; i < aliens.length; i++) {
        const row = Math.floor(i / aliensPerRow);
        const column = i % aliensPerRow;
        const left = position + column * (alienWidth + 10);
        const top = topOffset + row * verticalStep;

        aliens[i].style.left = `${left}px`;
        aliens[i].style.top = `${top}px`;
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
    if (keys.ArrowRight && shipPosition < containerWidth - ship.offsetWidth+150) {
      shipPosition += 15;
    }
    if (keys[" "]) {
      const currentTime = Date.now();
      if ((currentTime - lastBulletTime >= BULLET_COOLDOWN * 2.5 ) && Fire>0) {
       shootSound.currentTime = 0; 
       shootSound.play();    

       
       setTimeout(() => {
         shootSound.pause();
       }, 1000);
        spawnBullet();
        Fire--
        UPdateFire();
        console.log(Fire);

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
  varScore += 10; 
  score.textContent = varScore;
  checkStoryProgress();
  checkAliensRemaining();

  if (varScore === 100) {
    setupAliens(7, 5);
  }
  if (varScore === 1200) {
    pauseForWarning();
  }
  if (varScore === 1600) {
    setupAliens(7, 5);
  }
  if (varScore === 2100) {
    setupAliens(3, 5);
  }
  if (varScore === 2600) {
    setupAliens(5, 5);
  }

  
}
function pauseForWarning() {
  if (!gamePaused) {
    togglePause();
    setTimeout(() => {
      updateStory("careful more monsters are joining the battle!");
      setupAliens(7, 8);

      document.addEventListener("keydown", function handleEscape(e) {
        if (e.key === "Escape") {
          hideStory(); 
          toggleResume();
          document.removeEventListener("keydown", handleEscape);
        }
      });
    }, 100);
  }
}


function UPdateFire() {
  fire.innerHTML =`Fire : ${ Fire}`;
}