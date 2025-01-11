import { setupShip } from "./aliens.js";
import { moveShip } from './aliens.js'
import { setupAliens } from "./aliens.js";
import { spawnBullet } from "./bullet.js";
import { startFPSCounter } from "./fps.js";
//import { scoreAndlives } from "./bullet.js";
import { boming } from "./bomb.js";



// let pause = true 
// document.addEventListener("keydown", (e)=>{
//   if ((e.code).toLowerCase() === 'p'){
//     if (!pause) pause = true
//     else pause =false
//   } 
// })

// function spaceInvaders(){
// }


document.addEventListener("DOMContentLoaded", () => {
  setupShip();
  moveShip()
  setupAliens("container", 2, 5, "./style/img/alien.png");
  spawnBullet();
  boming("container");
  startFPSCounter("container");

});

