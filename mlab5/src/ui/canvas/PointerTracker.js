// mlab5/src/js/ui/canvas/PointerTracker.js

export class PointerTracker {
    constructor(canvas) {
        this.canvas = canvas;
        this.painting = false;
        this.callbacks = {
            start: [],
            move: [],
            end: []
        };

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);

        this._addEventListeners();
    }

    _addEventListeners() {
        this.canvas.addEventListener('mousedown', this._onMouseDown);
        this.canvas.addEventListener('mousemove', this._onMouseMove);
        this.canvas.addEventListener('mouseup', this._onMouseUp);
        this.canvas.addEventListener('mouseleave', this._onMouseLeave);
    }

    _removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this._onMouseDown);
        this.canvas.removeEventListener('mousemove', this._onMouseMove);
        this.canvas.removeEventListener('mouseup', this._onMouseUp);
        this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    }

    _getCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();

        // escala entre tamanho real do canvas e tamanho exibido
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }

    _onMouseDown(event) {
        this.painting = true;
        const coords = this._getCoordinates(event);
        this.callbacks.start.forEach(callback => callback(coords));
    }

    _onMouseMove(event) {
        if (!this.painting) return;
        const coords = this._getCoordinates(event);
        this.callbacks.move.forEach(callback => callback(coords));
    }

    _onMouseUp(event) {
        if (this.painting) {
            this.painting = false;
            const coords = this._getCoordinates(event);
            this.callbacks.end.forEach(callback => callback(coords));
        }
    }

    _onMouseLeave(event) {
        if (this.painting) {
            this.painting = false;
            const coords = this._getCoordinates(event);
            this.callbacks.end.forEach(callback => callback(coords));
        }
    }

    on(eventType, callback) {
        if (this.callbacks[eventType]) {
            this.callbacks[eventType].push(callback);
        } else {
            console.warn(`Event type "${eventType}" not supported by PointerTracker.`);
        }
    }

    isPainting() {
        return this.painting;
    }

    destroy() {
        this._removeEventListeners();
    }
}
