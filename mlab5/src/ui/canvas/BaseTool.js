// mlab5/src/js/ui/canvas/BaseTool.js

export class BaseTool {
    constructor(ctx) {
        this.ctx = ctx;
    }

    // Methods to be overridden by specific tools
    onPointerStart(coords, event) {}
    onPointerMove(coords, event) {}
    onPointerEnd(coords, event) {}

    // Common properties or methods that all tools might use
    setStrokeStyle(style) {
        this.ctx.strokeStyle = style;
    }

    setLineWidth(width) {
        this.ctx.lineWidth = width;
    }

    // Can be used to activate/deactivate a tool
    activate() {}
    deactivate() {}
}
