import Path from '../Path.js';
import Util from '../Util.js';
class CanvasRenderer {
    constructor() {
        this.resolution = 300;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    getScale() {
        return this.resolution / 72;
    }
    attachToElement(el) {
        if (!Util.isBrowser()) {
            throw new Error('SVG Renderer can only attach to Element if run in browser');
        }
        el.appendChild(this.canvas);
    }
    render(doc) {
        this.canvas.width = doc.width;
        this.canvas.height = doc.height;
        doc.stage.renderChildren(this);
    }
    resetStyles() {
        this.ctx.lineWidth = 0;
        this.ctx.strokeStyle = 'transparent';
        this.ctx.fillStyle = 'transparent';
        this.ctx.filter = 'none';
    }
    applyFilters(obj) {
        const filters = [];
        if (obj.styles.opacity < 1) {
            filters.push(`opacity(${obj.styles.opacity * 100}%)`);
        }
        if (obj.styles.blur > 0) {
            filters.push(`blur(${obj.styles.blur}px)`);
        }
        if (filters.length > 0) {
            this.ctx.filter = filters.join(' ');
        }
    }
    applyStyles(obj) {
        // Reset
        this.resetStyles();
        this.applyFilters(obj);
        if (obj.styles.fill) {
            this.ctx.fillStyle = obj.styles.fill;
            this.ctx.fill();
        }
        if (obj.styles.strokeWidth) {
            this.ctx.lineWidth = obj.styles.strokeWidth;
        }
        if (obj.styles.stroke) {
            this.ctx.strokeStyle = obj.styles.stroke;
            this.ctx.stroke();
        }
    }
    applyTransformation(obj) {
        // Set transforms
        const transformation = obj.parent ? obj.transformation.prepend(obj.parent.transformation) : obj.transformation;
        const { a, b, c, d, tx, ty } = transformation;
        this.ctx.setTransform(a, b, c, d, tx, ty);
    }
    resetTransformation() {
        // Reset transforms as we do not want to conflict with
        // vector elements, that handle their transforms intrinsically
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    group(group) {
        this.applyTransformation(group);
        group.renderChildren(this);
        this.resetTransformation();
    }
    path(path) {
        const instructions = path.toInstruction();
        this.applyTransformation(path);
        this.ctx.beginPath();
        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            switch (instruction.command) {
                case Path.Commands.MOVE:
                    this.ctx.moveTo(...instruction.points);
                    break;
                case Path.Commands.LINE:
                    this.ctx.lineTo(...instruction.points);
                    break;
                case Path.Commands.CURVE:
                    this.ctx.bezierCurveTo(...instruction.points);
                    break;
                case Path.Commands.CLOSE:
                    this.ctx.closePath();
                    break;
                default:
                    this.ctx.moveTo(0, 0);
                    break;
            }
        }
        this.applyStyles(path);
        this.resetTransformation();
    }
    compoundPath(path) {
        path.paths.forEach((p) => {
            this.path(p);
        });
    }
    text(text) {
        // Reset Styles
        this.resetStyles();
        this.applyFilters(text);
        this.ctx.font = `${text.data.fontSize}px ${text.data.font}`;
        this.ctx.textAlign = text.data.textAlign;
        this.ctx.textBaseline = text.data.textBaseline;
        this.applyTransformation(text);
        if (text.styles.fill) {
            this.ctx.fillStyle = text.styles.fill;
            this.ctx.fillText(text.data.text, text.position.x, text.position.y);
        }
        if (text.styles.strokeWidth) {
            this.ctx.lineWidth = text.styles.strokeWidth;
        }
        if (text.styles.stroke) {
            this.ctx.strokeStyle = text.styles.stroke;
            this.ctx.strokeText(text.data.text, text.position.x, text.position.y);
        }
        this.resetTransformation();
    }
}
export default CanvasRenderer;
