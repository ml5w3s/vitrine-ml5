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
        this.toolManager.setLineWidth(options.brushSize || 5);
        this.toolManager.setTool(options.currentTool || 'brush');

        // Undo / Redo stacks - Temporarily commented out for future refactoring
        // this.undoStack = [];
        // this.redoStack = [];

        this.init();
    }

    /**
     * Inicializa o canvas e eventos
     */
    init() {
        // this.saveState(); // Temporarily commented out for future refactoring
    }

    // ==============================
    // 🎨 Ferramenta Brush (desenho) - Handled by ToolManager
    // ==============================

    // ==============================
    // 🔤 Ferramenta de Texto - Temporarily commented out for future refactoring into TextTool
    // ==============================

    // handleCanvasClick(e) { /* ... */ }
    // createTextInput(x, y) { /* ... */ }
    // drawText(text, x, y) { /* ... */ }

    // ==============================
    // ↩ Undo / ↪ Redo - Temporarily commented out for future refactoring
    // ==============================

    // saveState() { /* ... */ }
    // undo() { /* ... */ }
    // redo() { /* ... */ }

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
        // this.saveState(); // Temporarily commented out for future refactoring
    }

    destroy() {
        this.canvasManager.destroy();
        this.pointerTracker.destroy();
        this.toolManager.destroy();
    }
}
