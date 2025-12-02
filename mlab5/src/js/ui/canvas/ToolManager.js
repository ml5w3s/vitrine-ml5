// mlab5/src/js/ui/canvas/ToolManager.js
import { BaseTool } from './BaseTool.js';
import { EraserTool } from './tools/EraserTool.js';
import { RectangleTool } from './tools/RectangleTool.js';
import { TextTool } from './tools/TextTool.js';
import { EllipseTool } from './tools/EllipseTool.js';

export class ToolManager {
    constructor(canvasManager, pointerTracker) {
        this.canvasManager = canvasManager;
        this.pointerTracker = pointerTracker;
        this.ctx = canvasManager.getContext();

        this.currentTool = null;
        this.tools = {};

        // Default tool (brush) - A simple brush tool that draws lines
        this.registerTool('brush', new (class extends BaseTool {
            constructor(ctx) {
                super(ctx);
                this.drawing = false;
                this.lastX = 0;
                this.lastY = 0;
                this.currentStrokeStyle = 'black';
                this.currentLineWidth = 5;
            }

            onPointerStart(coords) {
                this.drawing = true;
                this.lastX = coords.x;
                this.lastY = coords.y;
                this.ctx.strokeStyle = this.currentStrokeStyle;
                this.ctx.lineWidth = this.currentLineWidth;
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
            }

            onPointerMove(coords) {
                if (!this.drawing) return;
                this.ctx.lineTo(coords.x, coords.y);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(coords.x, coords.y);
            }

            onPointerEnd() {
                this.drawing = false;
                this.ctx.closePath();
            }

            setStrokeStyle(style) {
                this.currentStrokeStyle = style;
            }

            setLineWidth(width) {
                this.currentLineWidth = width;
            }
        })(this.ctx));


        this.registerTool('eraser', new EraserTool(this.ctx, canvasManager));
        this.registerTool('rectangle', new RectangleTool(this.ctx, canvasManager));
        this.registerTool('ellipse', new EllipseTool(this.ctx, canvasManager));
        this.registerTool('text', new TextTool(this.ctx, canvasManager.getCanvas())); // Pass the canvas element to TextTool

        this.pointerTracker.on('start', (coords, event) => this.currentTool?.onPointerStart(coords, event));
        this.pointerTracker.on('move', (coords, event) => this.currentTool?.onPointerMove(coords, event));
        this.pointerTracker.on('end', (coords, event) => this.currentTool?.onPointerEnd(coords, event));

        this.setTool('brush'); // Set default tool
    }


    registerTool(name, toolInstance) {
        if (!(toolInstance instanceof BaseTool)) {
            console.warn(`Tool "${name}" does not extend BaseTool.`);
        }
        this.tools[name] = toolInstance;
    }

    setTool(name) {
        if (this.currentTool) {
            this.currentTool.deactivate();
        }
        const tool = this.tools[name];
        if (tool) {
            this.currentTool = tool;
            this.currentTool.activate();
            console.log(`Tool set to: ${name}`);
        } else {
            console.warn(`Tool "${name}" not found.`);
        }
    }

    // Pass properties to the current tool if it supports them
    setStrokeStyle(style) {
        if (this.currentTool) {
            if (typeof this.currentTool.setStrokeStyle === 'function') {
                this.currentTool.setStrokeStyle(style);
            }
            if (this.currentTool instanceof TextTool && typeof this.currentTool.setFillColor === 'function') {
                this.currentTool.setFillColor(style);
            }
        }
    }

    setLineWidth(width) {
        if (this.currentTool) {
            if (typeof this.currentTool.setLineWidth === 'function') {
                this.currentTool.setLineWidth(width);
            }
            // For TextTool, line width can influence font size
            if (this.currentTool instanceof TextTool && typeof this.currentTool.setFont === 'function') {
                this.currentTool.setFont(`${width * 4}px Arial`); // Assuming a relationship for font size
            }
        }
    }

    destroy() {
        // No explicit destroy needed for tools unless they have internal event listeners
        // ToolManager's event listeners are handled by PointerTracker's destroy
    }
}
