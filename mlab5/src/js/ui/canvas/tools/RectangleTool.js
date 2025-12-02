// mlab5/src/js/ui/canvas/tools/RectangleTool.js
import { BaseTool } from '../BaseTool.js';

export class RectangleTool extends BaseTool {
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
        this.ctx.rect(this.startX, this.startY, coords.x - this.startX, coords.y - this.startY);
        this.ctx.stroke();
    }

    onPointerEnd(coords) {
        if (!this.drawing) return;
        this.drawing = false;
        this.ctx.putImageData(this.imgBeforeDraw, 0, 0);
        this.ctx.beginPath();
        this.ctx.rect(this.startX, this.startY, coords.x - this.startX, coords.y - this.startY);
        this.ctx.stroke();
    }

    setStrokeStyle(style) {
        this.currentStrokeStyle = style;
    }

    setLineWidth(width) {
        this.currentLineWidth = width;
    }
}
