(function() {
  // Tenta encontrar o caminho base do script atual
  let scriptPath = '';
  const scripts = document.getElementsByTagName('script');
  for (let s of scripts) {
    if (s.src.includes('cursor.js')) {
      scriptPath = s.src.replace('cursor.js', '');
      break;
    }
  }
  
  const BASE_PATH = scriptPath + 'patas/';
  
  const style = document.createElement('style');
  style.textContent = `
    * { cursor: none !important; }
    #custom-cursor {
      width: 50px; 
      height: 50px;
      background-image: url('${BASE_PATH}u_01.svg');
      background-size: contain;
      background-repeat: no-repeat;
      position: fixed;
      pointer-events: none;
      left: 0;
      top: 0;
      margin-left: -25px;
      margin-top: -25px;
      z-index: 999999;
      transition: background-image 0.1s ease, transform 0.05s linear, width 0.2s, height 0.2s;
    }
    #custom-cursor.hovering {
      width: 60px;
      height: 60px;
      margin-left: -30px;
      margin-top: -30px;
      background-image: url('${BASE_PATH}over.svg') !important;
    }
    a, button, input, select, textarea, .btn, .card { cursor: none !important; }
  `;
  document.head.appendChild(style);

  let cursorEl = document.getElementById('custom-cursor');
  if (!cursorEl) {
    cursorEl = document.createElement('div');
    cursorEl.id = 'custom-cursor';
    document.body.appendChild(cursorEl);
  }

  let x = 0, y = 0;
  let mouseX = 0, mouseY = 0;
  let distance = 0;
  let step = 1;
  const stepThreshold = 30; 
  let isHovering = false;

  window.addEventListener("mouseover", (e) => {
    if (e.target.closest('a, button, input, select, textarea, .btn, .card')) {
      isHovering = true;
      cursorEl.classList.add('hovering');
    }
  });

  window.addEventListener("mouseout", (e) => {
    if (e.target.closest('a, button, input, select, textarea, .btn, .card')) {
      isHovering = false;
      cursorEl.classList.remove('hovering');
    }
  });

  window.addEventListener("mousemove", (e) => {
    const dx = e.clientX - mouseX;
    const dy = e.clientY - mouseY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    distance += Math.sqrt(dx * dx + dy * dy);

    if (distance > stepThreshold && !isHovering) {
      let direction = 'u';
      if (absDx > absDy) {
        direction = dx > 0 ? 'r' : 'l';
      } else {
        direction = dy > 0 ? 'd' : 'u';
      }

      step = (step === 1) ? 2 : 1;
      const extension = (direction === 'l' && step === 1) ? 'png' : 'svg';
      const fileName = `${direction}_0${step}.${extension}`;
      cursorEl.style.backgroundImage = `url('${BASE_PATH}${fileName}')`;
      distance = 0;
    }

    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Atualização imediata para evitar lag visual
    if (cursorEl.style.transform === '') {
       cursorEl.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
       x = e.clientX;
       y = e.clientY;
    }
  });

  function animate() {
    x += (mouseX - x) * 0.2;
    y += (mouseY - y) * 0.2;
    cursorEl.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(animate);
  }

  animate();
})();