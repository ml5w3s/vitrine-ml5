// mlab5/src/js/ui/canvas/tools/LineTool.js
import { BaseTool } from '../BaseTool.js';

export class LineTool extends BaseTool {
    constructor(ctx, canvasManager) {
        super(ctx);
        this.canvasManager = canvasManager;
        this.Drawing = false;
        this.startX = 0;
        this.startY = 0;
        this.imgBeforeDraw = null;
        // Inicializa as propriedades de estilo
        this.currentStrokeStyle = 'black';
        this.currentLineWidth = 1;
    }

onPointerStart(pointer) {
    this.Drawing = true;
    this.startX = pointer.x;
    this.startY = pointer.y;

    this.ctx.strokeStyle = this.currentStrokeStyle;
    this.ctx.lineWidth = this.currentLineWidth;

    this.imgBeforeDraw = this.ctx.getImageData(
        0, 0,
        this.canvasManager.getCanvas().width,
        this.canvasManager.getCanvas().height
    );
}

onPointerMove(pointer) {
    if (!this.Drawing) return;

    this.ctx.putImageData(this.imgBeforeDraw, 0, 0);

    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(pointer.x, pointer.y);
    this.ctx.stroke();
}

onPointerEnd(pointer) {
    if (!this.Drawing) return;
    this.Drawing = false;

    this.ctx.putImageData(this.imgBeforeDraw, 0, 0);

    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(pointer.x, pointer.y);
    this.ctx.stroke();
}

    // Métodos para receber atualizações da UI
    setStrokeStyle(style) {
        this.currentStrokeStyle = style;
    }

    setLineWidth(width) {
        this.currentLineWidth = width;
    }
}
