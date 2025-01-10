import { setupShip } from "./aliens.js";
import { setupAliens } from "./aliens.js";
import { spawnBullet } from "./bullet.js";
import { startFPSCounter } from "./fps.js";
import { scoreAndlives } from "./bullet.js";
import { boming } from "./bomb.js";
import { moveShip } from "./aliens.js";

const start_button = document.getElementById('start-btn')

start_button.addEventListener("click", () => {
  setupShip("container");
  moveShip('container')
  setupAliens("container", 2, 5, "./style/img/alien.png"); // Setup aliens
  spawnBullet();
  startFPSCounter("container");
  scoreAndlives("container");
  boming("container");
});
