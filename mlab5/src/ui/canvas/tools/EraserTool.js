// mlab5/src/js/ui/canvas/tools/EraserTool.js
import { BaseTool } from '../BaseTool.js';

export class EraserTool extends BaseTool {
    constructor(ctx, canvasManager) {
        super(ctx);
        this.canvasManager = canvasManager;
        this.lastX = 0;
        this.lastY = 0;
        this.erasing = false;
        this.defaultLineWidth = 10; // Default eraser size
    }

    onPointerStart(coords) {
        this.erasing = true;
        this.lastX = coords.x;
        this.lastY = coords.y;
        this.ctx.save(); // Save current canvas state
        this.ctx.globalCompositeOperation = 'destination-out'; // Erase effect
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineWidth = this.defaultLineWidth;
        this.ctx.lineCap = 'round';
    }

    onPointerMove(coords) {
        if (!this.erasing) return;
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    onPointerEnd() {
        this.erasing = false;
        this.ctx.closePath();
        this.ctx.restore(); // Restore canvas state
    }

    setLineWidth(width) {
        this.defaultLineWidth = width;
        if (this.erasing) {
            this.ctx.lineWidth = this.defaultLineWidth;
        }
    }
}
