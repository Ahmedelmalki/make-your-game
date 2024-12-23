export function spawnBullet() {
  const container = document.getElementById("container");
  const ship = document.querySelector(".ship");
  const bullet = document.createElement("img");
  bullet.src = "./style/img/bullet.png";
  bullet.alt = "Bullet";
  bullet.classList.add("bullet");

  // Get the ship's current position
  const shipRect = ship.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const bulletX = shipRect.left + shipRect.width / 2 - containerRect.left - 5;
  const bulletY = shipRect.top - containerRect.top - 10;

  bullet.style.left = `${bulletX}px`;
  bullet.style.top = `${bulletY}px`;
  container.appendChild(bullet);

  // Animate the bullet upwards
  animateBullet(bullet);
}

function animateBullet(bullet) {
  const interval = setInterval(() => {
    const currentTop = parseInt(bullet.style.top, 10);
    if (currentTop <= 0) {
      // Remove bullet if it goes out of bounds
      bullet.remove();
      clearInterval(interval);
    } else {
      // Move bullet upwards
      bullet.style.top = `${currentTop - 5}px`; // Adjust the speed by changing -5
    }
  }, 16); // ~60 frames per second
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    spawnBullet();
  }
});
