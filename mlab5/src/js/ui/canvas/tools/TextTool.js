// mlab5/src/js/ui/canvas/tools/TextTool.js
import { BaseTool } from '../BaseTool.js';

export class TextTool extends BaseTool {
    constructor(ctx, canvas) {
        super(ctx);
        this.canvas = canvas;
        this.currentFont = '20px Arial';
        this.currentFillStyle = 'black';
        this.textInput = null;
        this.x = 0;
        this.y = 0;
    }

    onPointerStart(coords) {
        requestAnimationFrame(() => {
            this.x = coords.x;
            this.y = coords.y;
            this.createTextInput(this.x, this.y);
        });
    }

    createTextInput(x, y) {
        if (this.textInput) {
            this.removeTextInput();
        }

        this.textInput = document.createElement('input');
        this.textInput.type = 'text';
        this.textInput.placeholder = 'Digite o texto...';

        // Style the input to overlay on the canvas
        this.textInput.style.position = 'absolute';

        // Obter as dimensões do canvas no viewport
        const rect = this.canvas.getBoundingClientRect();
        // Obter os fatores de escala entre o buffer e o CSS
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        // Converter as coordenadas do buffer (x, y) para coordenadas CSS
        const cssX = x / scaleX;
        const cssY = y / scaleY;

        // Posicionar o input usando as coordenadas CSS e o offset do canvas no viewport
        this.textInput.style.left = `${rect.left + cssX}px`;
        this.textInput.style.top = `${rect.top + cssY}px`;
        this.textInput.style.font = this.currentFont;
        this.textInput.style.color = this.currentFillStyle;
        this.textInput.style.background = 'rgba(255,255,255,0.8)';
        this.textInput.style.border = '1px solid #333';
        this.textInput.style.padding = '2px';
        this.textInput.style.zIndex = 9999;

        document.body.appendChild(this.textInput); // Append to body or a specific container

        this.textInput.focus();

        this.textInput.addEventListener('keydown', this._handleKeyDown);
        this.textInput.addEventListener('blur', this._handleBlur);
    }

    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.drawText();
            this.removeTextInput();
        }
    }

    _handleBlur = () => {
        this.drawText();
        this.removeTextInput();
    }

    drawText() {
        if (!this.textInput || !this.textInput.value.trim()) return;

        const text = this.textInput.value.trim();
        this.ctx.font = this.currentFont;
        this.ctx.fillStyle = this.currentFillStyle;
        this.ctx.fillText(text, this.x, this.y);
    }

    removeTextInput() {
        if (this.textInput) {
            this.textInput.removeEventListener('keydown', this._handleKeyDown);
            this.textInput.removeEventListener('blur', this._handleBlur);
            this.textInput.remove();
            this.textInput = null;
        }
    }

    setFont(font) {
        this.currentFont = font;
    }

    setFillColor(color) {
        this.currentFillStyle = color;
    }

    deactivate() {
        this.removeTextInput();
    }
}
