export function setupAliens(containerId, rows, aliensPerRow, alienImageSrc) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  const aliens = createAliens(container, rows, aliensPerRow, alienImageSrc);
  animateAliens(container, aliens, aliensPerRow);
}

export function createAliens(container, rows, aliensPerRow, alienImageSrc) {
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
      alien.style.top = row * (alienHeight + 20) + "px";

      container.appendChild(alien);
      aliens.push(alien);
    }
  }

  return aliens;
}

export function animateAliens(container, aliens, aliensPerRow) {
  const alienWidth = 32;
  const alienHeight = 32;
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const speed = 3;
  const verticalStep = alienHeight + 20;

  let position = 0;
  let direction = 1;
  let topOffset = 0;

  function animate() {
    position += speed * direction;

    // Check if the group hits the walls
    const rightmost = position + aliensPerRow * (alienWidth + 10) - 10;
    if (rightmost >= containerWidth || position <= 0) {
      direction *= -1;
      topOffset += verticalStep;
    }

    // Stop if aliens exceed container height
    if (topOffset + verticalStep > containerHeight) {
      console.log("Aliens have reached the bottom!");
      gameOver(container);
      return;
    }

    // Update the position of all aliens
    for (let i = 0; i < aliens.length; i++) {
      const row = Math.floor(i / aliensPerRow);
      const column = i % aliensPerRow;
      const left = position + column * (alienWidth + 10);
      const top = topOffset + row * verticalStep;

      aliens[i].style.left = `${left}px`;
      aliens[i].style.top = `${top}px`;
    }

    // Call animate again for the next frame
    requestAnimationFrame(animate);
  }

  animate();
}

// Main function to set up aliens


function gameOver(container) {
  const game_over = document.createElement('div')
  game_over.className = 'game_over'
  game_over.style.position = 'absolute';
  game_over.style.top = '50%';
  game_over.style.left = '50%';
  game_over.style.transform = 'translate(-50%, -50%)';
  game_over.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  game_over.style.color = 'white';
  game_over.style.fontSize = '2em';
  game_over.style.padding = '20px';
  game_over.style.borderRadius = '10px';
  game_over.style.textAlign = 'center';
  game_over.style.zIndex = '1000';
  game_over.textContent = 'Game Over';
  container.appendChild(game_over);
}

function won(container) {
  const WON = document.createElement('div')
  WON.className = 'WON'
  WON.style.position = 'absolute';
  WON.style.top = '50%';
  WON.style.left = '50%';
  WON.style.transform = 'translate(-50%, -50%)';
  WON.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  WON.style.color = 'white';
  WON.style.fontSize = '2em';
  WON.style.padding = '20px';
  WON.style.borderRadius = '10px';
  WON.style.textAlign = 'center';
  WON.style.zIndex = '1000';
  WON.textContent = 'WON';
  container.appendChild(WON);
}