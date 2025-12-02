// mlab5/src/js/ui/canvas/CanvasManager.js

export class CanvasManager {
    constructor(canvas) {
        if (!canvas instanceof HTMLCanvasElement) {
            throw new Error("Provided element is not a valid canvas.");
        }
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    /**
     * Adjusts canvas size to fit parent element.
     */
    resizeCanvas() {
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = parent.offsetWidth;
            this.canvas.height = parent.offsetHeight;
        }
    }

    /**
     * Clears the entire canvas.
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Returns the canvas rendering context.
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
        return this.ctx;
    }

    /**
     * Returns the canvas element.
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * Gets canvas dimensions relative to its parent.
     * @returns {{width: number, height: number}}
     */
    getDimensions() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    destroy() {
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
    }
}
