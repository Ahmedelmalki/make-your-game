import { setupShip } from "./aliens.js";
import { setupAliens } from "./aliens.js";
import { spawnBullet } from "./bullet.js";
import { startFPSCounter } from "./fps.js";
import { scoreAndlives } from "./bullet.js";
import { boming } from "./bomb.js";


//createAliens(container, rows, aliensPerRow, alienImageSrc)
//function animateAliens(container, aliens, aliensPerRow)
//function setupAliens(containerId, rows, aliensPerRow, alienImageSrc)
document.addEventListener("DOMContentLoaded", () => {
  setupShip("container"); // Setup the ship
  setupAliens("container", 2, 5, "./style/img/alien.png"); // Setup aliens
  spawnBullet();
  startFPSCounter("container");
  scoreAndlives("container");
  boming("container");
});
