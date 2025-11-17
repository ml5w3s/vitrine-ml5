const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const toolbar = document.querySelector('.toolbar');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let painting = false;
let brushSize = 5;
let brushColor = 'black';
let tool = 'pen';
let startX, startY;
let canvasData;

function startPosition(e) {
    painting = true;
    if (tool === 'rectangle') {
        startX = e.clientX;
        startY = e.clientY;
        canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    draw(e);
}

function endPosition(e) {
    painting = false;
    if (tool === 'rectangle') {
        ctx.putImageData(canvasData, 0, 0);
        ctx.strokeRect(startX, startY, e.clientX - startX, e.clientY - startY);
    }
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;

    if (tool === 'pen' || tool === 'eraser') {
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = tool === 'pen' ? brushColor : 'white';

        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    } else if (tool === 'rectangle') {
        ctx.putImageData(canvasData, 0, 0);
        ctx.strokeRect(startX, startY, e.clientX - startX, e.clientY - startY);
    }
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

document.getElementById('pen').addEventListener('click', () => {
    tool = 'pen';
});

document.getElementById('eraser').addEventListener('click', () => {
    tool = 'eraser';
});

document.getElementById('rectangle').addEventListener('click', () => {
    tool = 'rectangle';
});

document.getElementById('colorPicker').addEventListener('change', (e) => {
    brushColor = e.target.value;
});

document.getElementById('brushSize').addEventListener('change', (e) => {
    brushSize = e.target.value;
});

document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

const stickyNoteButton = document.getElementById('stickyNote');

stickyNoteButton.addEventListener('click', createStickyNote);

function createStickyNote() {
    const stickyNote = document.createElement('div');
    stickyNote.classList.add('sticky-note');
    stickyNote.innerHTML = '<textarea></textarea>';
    document.body.appendChild(stickyNote);

    let isDragging = false;
    let offsetX, offsetY;

    stickyNote.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - stickyNote.offsetLeft;
        offsetY = e.clientY - stickyNote.offsetTop;
        e.stopPropagation(); // Prevent canvas drawing when dragging sticky note
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            stickyNote.style.left = (e.clientX - offsetX) + 'px';
            stickyNote.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}