export function setupShip(containerId) {
  const container = document.getElementById(containerId);
   if (!container) {
     console.error(`Container with id "${containerId}" not found.`);
     return;
   }

  // Create the ship
  const ship = document.createElement("img");
  ship.src = "./style/img/ship.png";
  ship.alt = "Illustration of the ship";
  ship.className = "ship";

  container.appendChild(ship);

  // Initial position of the ship
  let shipPosition = container.offsetWidth / 2 - ship.offsetWidth / 2;

  // Event listener for key presses
  document.addEventListener("keydown", (event) => {
    const containerWidth = container.offsetWidth;

    // Move left or right based on key pressed
    if (event.key === "ArrowLeft" && shipPosition > 0) {
      shipPosition -= 10; // Move left
    } else if (
      event.key === "ArrowRight" &&
      shipPosition < containerWidth - ship.offsetWidth
    ) {
      shipPosition += 10; // Move right
    }

    // Update the ship's position
    ship.style.left = `${shipPosition}px`;
  });
}
