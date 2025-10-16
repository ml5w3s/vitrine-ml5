const lousaContainer = document.getElementById('lousa-container');
const lousaOpenButton = document.getElementById('lousa-open-button');
const lousaToggleButton = document.getElementById('lousa-toggle-button');
const lousaCloseButton = document.getElementById('lousa-close-button');

lousaOpenButton.addEventListener('click', () => {
  lousaContainer.style.display = 'block';
  lousaOpenButton.style.display = 'none';
});

lousaCloseButton.addEventListener('click', () => {
  lousaContainer.style.display = 'none';
  lousaOpenButton.style.display = 'block';
});

lousaToggleButton.addEventListener('click', () => {
  if (lousaContainer.style.height === '40px') {
    lousaContainer.style.height = '40%';
    lousaToggleButton.textContent = '-';
  } else {
    lousaContainer.style.height = '40px';
    lousaToggleButton.textContent = '+';
  }
});

// Make the div draggable
const lousaHeader = document.getElementById('lousa-header');
let isDragging = false;
let offsetX, offsetY;

lousaHeader.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - lousaContainer.offsetLeft;
  offsetY = e.clientY - lousaContainer.offsetTop;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    lousaContainer.style.left = (e.clientX - offsetX) + 'px';
    lousaContainer.style.top = (e.clientY - offsetY) + 'px';
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
