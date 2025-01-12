export function startFPSCounter() {
  const container = document.getElementById('container');

  /*const start = performance.now();
  for (let i = 0; i < 100000; i++) { console.log('oh no') };
  const end = performance.now();
  console.log(end - start, 'ms')
  */

  let frames = 0;
  let lastTime = performance.now();
  let fpsHistory = [];
  const historySize = 60;

  const fps = document.createElement("div");
  fps.className = "fps-display";
  container.appendChild(fps);

  function updateFPS() {
    const now = performance.now();
    const deltaTime = now - lastTime;
    frames++;

    if (deltaTime >= 500) {
      const currentFPS = Math.round((frames * 1000) / deltaTime);
      fpsHistory.push(currentFPS);
      if (fpsHistory.length > historySize) fpsHistory.shift();

      const averageFPS = Math.round(
        fpsHistory.reduce((sum, fps) => sum + fps, 0) / fpsHistory.length
      );

      fps.textContent = `FPS: ${currentFPS}, Average: ${averageFPS}`;

      frames = 0;
      lastTime = now;
    }

    requestAnimationFrame(updateFPS);
  }

  updateFPS();
}
