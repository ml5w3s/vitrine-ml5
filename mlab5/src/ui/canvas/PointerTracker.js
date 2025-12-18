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
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);

        this._addEventListeners();
    }

    _addEventListeners() {
        this.canvas.addEventListener('mousedown', this._onMouseDown);
        this.canvas.addEventListener('mousemove', this._onMouseMove);
        this.canvas.addEventListener('mouseup', this._onMouseUp);
        this.canvas.addEventListener('mouseleave', this._onMouseLeave);

        this.canvas.addEventListener('touchstart', this._onTouchStart);
        this.canvas.addEventListener('touchmove', this._onTouchMove);
        this.canvas.addEventListener('touchend', this._onTouchEnd);
    }

    _removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this._onMouseDown);
        this.canvas.removeEventListener('mousemove', this._onMouseMove);
        this.canvas.removeEventListener('mouseup', this._onMouseUp);
        this.canvas.removeEventListener('mouseleave', this._onMouseLeave);

        this.canvas.removeEventListener('touchstart', this._onTouchStart);
        this.canvas.removeEventListener('touchmove', this._onTouchMove);
        this.canvas.removeEventListener('touchend', this._onTouchEnd);
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

    _onTouchStart(event) {
        event.preventDefault(); // Prevent scrolling
        this.painting = true;
        const coords = this._getCoordinates(event.touches[0]);
        this.callbacks.start.forEach(callback => callback(coords));
    }

    _onTouchMove(event) {
        if (!this.painting) return;
        event.preventDefault(); // Prevent scrolling
        const coords = this._getCoordinates(event.touches[0]);
        this.callbacks.move.forEach(callback => callback(coords));
    }

    _onTouchEnd(event) {
        if (this.painting) {
            this.painting = false;
            // No coordinates on touchend
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
