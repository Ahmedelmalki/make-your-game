export function pausAndContinue(containerId){
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found.`);
      return;
    }
    const pause = document.createElement('div')
    pause.className = 'pause'
    pause.innerText = 'press P to pause'
    // logic
   

    container.appendChild(pause)
}