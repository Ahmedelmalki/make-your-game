const container = document.getElementById("container");
const alienWidth = 50; // Width of an alien
const alienHeight = 50; // Height of an alien
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

const aliensPerRow = 5; // Number of aliens per row
const rows = 2; // Number of rows
const speed = 2; // Pixels per frame, lower values slow it down
const verticalStep = alienHeight + 20;

let position = 0; // Current position of the group
let direction = 1; // 1 for moving right, -1 for moving left
let topOffset = 0;

let aliens = []; // Array to hold alien data

// Create multiple aliens in rows
for (let row = 0; row < rows; row++) {
  for (let i = 0; i < aliensPerRow; i++) {
    const alien = document.createElement("img");
    alien.src = "alien.png"; // Path to your alien image
    alien.alt = "Illustration of aliens";
    alien.classList.add("alien");

    alien.style.left = i * (alienWidth + 10) + "px";
    alien.style.top = row * (alienHeight + 20) + "px";

    container.appendChild(alien);
    aliens.push(alien);
  }
}

function animate() {
  position += speed * direction;

  // Check if the group hits the walls
  const rightmost = position + aliensPerRow * (alienWidth + 10) - 10;
  if (rightmost >= containerWidth || position <= 0) {
    direction *= -1; // Reverse direction
    topOffset += verticalStep;
  }
  if (topOffset + verticalStep > containerHeight) {
    return; // Stop if aliens exceed container height
  }

  // Update the position of all aliens
  for (let i = 0; i < aliens.length; i++) {
    const row = Math.floor(i / aliensPerRow);
    const column = i % aliensPerRow;
    const left = position + column * (alienWidth + 10);
    const top = topOffset + row * verticalStep;

    aliens[i].style.left = left + "px";
    aliens[i].style.top = top + "px";
  }

  // Call animate again for the next frame
  requestAnimationFrame(animate);
}

// Start the animation
animate();
