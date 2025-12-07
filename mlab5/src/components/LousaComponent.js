// mlab5/src/js/components/LousaComponent.js
import { CanvasManager } from '../ui/canvas/CanvasManager.js';
import { PointerTracker } from '../ui/canvas/PointerTracker.js';
import { ToolManager } from '../ui/canvas/ToolManager.js';

export class LousaComponent {
    constructor(canvas, options = {}) {
        if (!canvas) throw new Error("Canvas não informado para LousaComponent");

        this.canvasManager = new CanvasManager(canvas);
        this.pointerTracker = new PointerTracker(canvas);
        this.toolManager = new ToolManager(this.canvasManager, this.pointerTracker);

        // Initial setup for tool properties
        this.toolManager.setStrokeStyle(options.brushColor || 'black');
        this.toolManager.setLineWidth(options.brushSize || 1);
        this.toolManager.setTool(options.currentTool || 'brush');
    }

    // ==============================
    // API Pública
    // ==============================

    handleResize() {
        this.canvasManager.resizeCanvas();
    }

    setBrushColor(c) {
        this.toolManager.setStrokeStyle(c);
    }

    setBrushSize(s) {
        this.toolManager.setLineWidth(parseInt(s, 10));
    }

    setTool(toolName) {
        this.toolManager.setTool(toolName);
    }

    clear() {
        this.canvasManager.clear();
    }

    destroy() {
        this.canvasManager.destroy();
        this.pointerTracker.destroy();
        this.toolManager.destroy();
    }
}
