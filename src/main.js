import { setupShip } from "./ship.js";
import { setupAliens } from "./aliens.js";

document.addEventListener("DOMContentLoaded", () => {
  setupShip("container"); // Setup the ship
  setupAliens("container", 2, 5, "./style/img/alien.png"); // Setup aliens
});
