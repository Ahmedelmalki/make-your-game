// scripts/main.js
const TILE_SIZE = 32;
const ROWS = 16;
const COLUMNS = 16;
const BOARD_WIDTH = TILE_SIZE * COLUMNS;
const BOARD_HEIGHT = TILE_SIZE * ROWS;

class Game {
  constructor() {
    this.gameBoard = document.getElementById("game-board");
    this.ship = this.createShip();
    this.lastFrameTime = 0;
    this.isRunning = true;

    this.setupEventListeners();
    this.gameLoop();
  }

  createShip() {
    const ship = document.createElement("div");
    ship.className = "ship";
    ship.style.left = `${BOARD_WIDTH / 2 - TILE_SIZE}px`;
    ship.style.bottom = `${TILE_SIZE * 2}px`;
    this.gameBoard.appendChild(ship);
    return ship;
  }

  setupEventListeners() {
    const keys = new Set();

    document.addEventListener("keydown", (e) => {
      keys.add(e.key);
      if (e.key === "p") this.togglePause();
    });

    document.addEventListener("keyup", (e) => {
      keys.delete(e.key);
    });

    // Store keys state for smooth movement
    this.keys = keys;
  }

  updateShipPosition(deltaTime) {
    const currentLeft = parseFloat(this.ship.style.left);
    const moveSpeed = 300; // pixels per second
    const movement = moveSpeed * deltaTime;

    if (this.keys.has("ArrowLeft")) {
      const newLeft = Math.max(0, currentLeft - movement);
      this.ship.style.left = `${newLeft}px`;
    }
    if (this.keys.has("ArrowRight")) {
      const newLeft = Math.min(
        BOARD_WIDTH - TILE_SIZE * 2,
        currentLeft + movement
      );
      this.ship.style.left = `${newLeft}px`;
    }
  }

  togglePause() {
    this.isRunning = !this.isRunning;
    const pauseMenu = document.getElementById("pause-menu");
    pauseMenu.classList.toggle("hidden");
  }

  gameLoop(currentTime) {
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = currentTime;
    }

    const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
    this.lastFrameTime = currentTime;

    if (this.isRunning) {
      this.updateShipPosition(deltaTime);
      // Add other game updates here
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

// Start game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Game();
});
 