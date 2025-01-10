export function boming(containerId) {
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
    bomb.src = "/style/img/newLaserBomb.png";
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
          let lifes = document.querySelectorAll(".heart");
          console.log(lifes.length);
          lifes[0].remove();
          bomb.remove();
          return;
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
  function isColliding(rect1, rect2) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }
  setInterval(() => {
    if (Math.random() < 1) {
      spawnBomb();
    }
  }, 1000);
}
