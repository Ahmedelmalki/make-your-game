import { setupShip } from "./aliens.js";
import { moveShip } from './aliens.js'
import { setupAliens } from "./aliens.js";
import { spawnBullet } from "./bullet.js";
import { startFPSCounter } from "./fps.js";
import { boming } from "./bomb.js";

const start = document.querySelector('.start')
start.style.display = 'none'
const menu = document.querySelector('.menu')
menu.style.display = 'none'


document.addEventListener("DOMContentLoaded", () => {
  setupShip();
  moveShip()
  setupAliens(3, 8, "./style/img/osama.png");
  spawnBullet();
  boming("container");
  startFPSCounter("container");

});

