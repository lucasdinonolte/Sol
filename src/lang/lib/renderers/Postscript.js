import Path from '../Path.js';
class PostscriptRenderer {
    constructor() {
        this.commands = [];
    }
    render(doc) {
        this._addCommand('%!PS-Adobe-3.0 EPSF-3.0');
        this._addCommand('%%BoundingBox:', 0, 0, doc.width, doc.height);
        doc.stage.renderChildren(this);
        this._addCommand('showpage');
        console.log(this.commands.join('\n'));
    }
    applyStyles(obj) {
        // Reset
        if (obj.styles.fill) {
            this._addCommand('fill');
        }
        if (obj.styles.strokeWidth) {
            this._addCommand(obj.styles.strokeWidth, 'setlinewidth');
        }
        if (obj.styles.stroke) {
            this._addCommand('stroke');
        }
    }
    group(group) {
        group.renderChildren(this);
    }
    path(path) {
        const instructions = path.toInstruction();
        this._addCommand('newpath');
        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            switch (instruction.command) {
                case Path.Commands.MOVE:
                    this._addCommand(...instruction.points, 'moveto');
                    break;
                case Path.Commands.LINE:
                    this._addCommand(...instruction.points, 'lineto');
                    break;
                case Path.Commands.CURVE:
                    this._addCommand(...instruction.points, 'curveto');
                    break;
                case Path.Commands.CLOSE:
                    this._addCommand('closepath');
                    break;
            }
        }
        this.applyStyles(path);
    }
    compoundPath(path) {
        path.paths.forEach((p) => {
            this.path(p);
        });
    }
    _addCommand(...args) {
        this.commands.push(Array.from(args).join(' '));
    }
}
export default PostscriptRenderer;
