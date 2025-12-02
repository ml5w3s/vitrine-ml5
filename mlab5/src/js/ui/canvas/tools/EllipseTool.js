// mlab5/src/js/ui/canvas/tools/EllipseTool.js
import { BaseTool } from '../BaseTool.js';

export class EllipseTool extends BaseTool {
    constructor(ctx, canvasManager) {
        super(ctx);
        this.canvasManager = canvasManager;
        this.startX = 0;
        this.startY = 0;
        this.drawing = false;
        this.currentStrokeStyle = 'black';
        this.currentLineWidth = 1;
        this.imgBeforeDraw = null;
    }

    onPointerStart(coords) {
        this.drawing = true;
        this.startX = coords.x;
        this.startY = coords.y;
        this.ctx.strokeStyle = this.currentStrokeStyle;
        this.ctx.lineWidth = this.currentLineWidth;
        this.imgBeforeDraw = this.ctx.getImageData(0, 0, this.canvasManager.getCanvas().width, this.canvasManager.getCanvas().height);
    }

    onPointerMove(coords) {
        if (!this.drawing) return;
        this.ctx.putImageData(this.imgBeforeDraw, 0, 0);
        this.ctx.beginPath();
        const radiusX = Math.abs(coords.x - this.startX) / 2;
        const radiusY = Math.abs(coords.y - this.startY) / 2;
        const centerX = Math.min(this.startX, coords.x) + radiusX;
        const centerY = Math.min(this.startY, coords.y) + radiusY;
        this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    onPointerEnd(coords) {
        if (!this.drawing) return;
        this.drawing = false;
        this.ctx.putImageData(this.imgBeforeDraw, 0, 0);
        this.ctx.beginPath();
        const radiusX = Math.abs(coords.x - this.startX) / 2;
        const radiusY = Math.abs(coords.y - this.startY) / 2;
        const centerX = Math.min(this.startX, coords.x) + radiusX;
        const centerY = Math.min(this.startY, coords.y) + radiusY;
        this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    setStrokeStyle(style) {
        this.currentStrokeStyle = style;
    }

    setLineWidth(width) {
        this.currentLineWidth = width;
    }
}
