import applyMixins from './util/ApplyMixin.js';
import MathUtil from './util/MathUtil.js';
import StylesMixin from './mixins/Styles.js';
import Anchor from './Anchor.js';
import Curve from './Curve.js';
import Item from './Item.js';
import Vector from './Vector.js';

class Path extends Item {
    constructor() {
        super();
        this.anchors = [];
        this.curves = [];
        this.closed = false;
        this.setupState();
    }
    // Static constructors for commonly used shapes
    // usage `const p = Path.Circle()`
    /**
     * Create a rectangular path.
     *
     * @param {number} x coordinate of upper left corner
     * @param {number} y coordinate of upper left corner
     * @param {number} width of the rectangle
     * @param {number} height of the rectangle
     */
    static Rectangle(x, y, w, h) {
        const path = new Path();
        return path.moveTo(x, y).lineTo(x + w, y).lineTo(x + w, y + h).lineTo(x, y + h).close();
    }
    /**
     * Create a path line from point A to point B.
     *
     * @param {number} Point A X
     * @param {number} Point A Y
     * @param {number} Point B X
     * @param {number} Point B Y
     */
    static Line(x1, y1, x2, y2) {
        const path = new Path();
        return path.moveTo(x1, y1).lineTo(x2, y2);
    }
    /**
     * Create a circular path.
     *
     * @param {number} X Coordinate of circle center
     * @param {number} Y Coordinate of cirlce center
     * @param {number} Radius of circle
     */
    static Circle(x, y, r) {
        const kappa = MathUtil.KAPPA, center = new Vector(x, y), ellipseSegments = [
            [new Vector(-1, 0), new Vector(0, kappa), new Vector(0, -kappa)],
            [new Vector(0, -1), new Vector(-kappa, 0), new Vector(kappa, 0)],
            [new Vector(1, 0), new Vector(0, -kappa), new Vector(0, kappa)],
            [new Vector(0, 1), new Vector(kappa, 0), new Vector(-kappa, 0)],
        ], path = new Path();
        for (let i = 0; i < 4; i++) {
            const segment = ellipseSegments[i];
            const point = segment[0].multiply(r).add(center), handleIn = segment[1].multiply(r).add(point), handleOut = segment[2].multiply(r).add(point);
            path.addAnchor(new Anchor(point, handleIn, handleOut));
        }
        return path.close();
    }
    /**
     * Calculates Curves
     */
    update() {
        this._updateBoundingBox();
        this._updateCurves();
        // If the path is part of a compound path trigger move the
        // compound path into its changed state, so the renderer get's
        // notified about the changes made to the subpath of the compound
        // path. This seems like an infinite loop pitfall.
        if (!!this.parentCompoundPath)
            this.parentCompoundPath.changed();
        this.changed();
    }
    _updateBoundingBox() {
        let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
        for (let i = 0; i < this.anchors.length; i++) {
            const p = this.anchors[i].point;
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        }
        this._updateExtrema(minX, maxX, minY, maxY);
    }
    _updateCurves() {
        this.curves = [];
        for (let i = 0; i < this.anchors.length - 1; i++) {
            const a1 = this.anchors[i], a2 = this.anchors[i + 1];
            this.curves.push(new Curve(a1, a2));
        }
        // For a closed path we need to add a curve from
        // the last to the first Anchor
        if (this.closed) {
            this.curves.push(new Curve(this.lastAnchor(), this.firstAnchor()));
        }
    }
    /**
     * Adds an anchor to the path
     *
     * @param {Anchor} Anchor to add
     */
    addAnchor(a) {
        this.anchors.push(a);
        this.update();
    }
    /**
     * Returns a copy of the current path.
     */
    copy() {
        const p = new Path();
        p.anchors = this.anchors;
        p.closed = this.closed;
        p.update();
        return p;
    }
    /**
     * Removes all the curvature from the path.
     */
    straighten() {
        for (let i = 0; i < this.anchors.length; i++) {
            this.anchors[i].removeHandles();
        }
        this.update();
        return this;
    }
    /**
     * Move Path to an absolute position
     *
     * @param {number} x value to move to
     * @param {number} y value to move to
     */
    moveTo(x, y) {
        const point = new Vector(x, y);
        this.addAnchor(new Anchor(point, null, null));
        return this;
    }
    /**
     * Draw a line to an absolute position
     *
     * @param {number} x value to line to
     * @param {number} y value to line to
     */
    lineTo(x, y) {
        this.checkStartMove();
        const point = new Vector(x, y);
        this.addAnchor(new Anchor(point, null, null));
        return this;
    }
    /**
     * Set Path state to closed
     */
    close() {
        this.closed = true;
        this.update();
        return this;
    }
    /**
     * Move relative to the last point
     */
    lineBy(x, y) {
        this.checkStartMove();
        const p = this.lastAnchor().point;
        return this.lineTo(p.x + x, p.y + y);
    }
    /**
     * Draw a cubic bezier curve to an absolute position
     */
    curveTo(x1, y1, x2, y2, x3, y3) {
        this.checkStartMove();
        const point = new Vector(x1, y1), handleOut = new Vector(x2, y2), handleIn = new Vector(x3, y3);
        console.log(point, handleOut, handleIn);
        this.lastAnchor().handleOut = handleOut;
        this.anchors.push(new Anchor(point, handleIn, null));
        this.update();
        return this;
    }
    /**
     * Return the first Anchor
     */
    firstAnchor() {
        return this.anchors[0];
    }
    /**
     * Return the current anchor
     */
    lastAnchor() {
        return this.anchors[this.anchors.length - 1];
    }
    /**
     * Returns the first curve of the path
     */
    firstCurve() {
        return this.curves[0];
    }
    /**
     * Returns the last curve of the path
     */
    lastCurve() {
        return this.curves[this.curves.length - 1];
    }
    /**
     * Check if path already has a move command otherwise create it
     */
    checkStartMove() {
        if (this.anchors.length === 0) {
            this.moveTo(0, 0);
        }
    }
    /**
     * Returns the length of the entire path
     */
    length() {
        return this.curves.map(c => c.length())
            .reduce((a, c) => a + c);
    }
    /**
     * Private helper method to get the curve location for a path location.
     *
     * @param {number} Location on the path between 0 (beginning) and 1 (end)
     */
    _locationAt(t) {
        let offset = this.length() * t, c = this.curves, l = 0;
        for (let i = 0; i < c.length; i++) {
            const start = l, curve = c[i], cl = curve.length();
            l += cl;
            if (l > offset) {
                return {
                    curve,
                    location: offset - start,
                    t: (offset - start) / cl,
                };
            }
        }
        return {
            curve: this.lastCurve(),
            location: this.lastCurve().length(),
            t: 1,
        };
    }
    /**
     * Returns the point on the path
     *
     * @param {number} Location on the path from 0 (beginning) to 1 (end)
     */
    getPointAt(t) {
        const cl = this._locationAt(t);
        return cl.curve.getPointAt(cl.t);
    }
    /**
     * Returns the tangent for a  point on the path
     *
     * @param {number} Location on the path from 0 (beginning) to 1 (end)
     */
    getTangentAt(t) {
        const cl = this._locationAt(t);
        return cl.curve.getTangentAt(cl.t);
    }
    /**
     * Returns the normal for a point on the path
     *
     * @param {number} Location on the path from 0 (beginning) to 1 (end)
     */
    getNormalAt(t) {
        const cl = this._locationAt(t);
        return cl.curve.getNormalAt(cl.t);
    }
    /**
     * Returns the curvature for a point on the path.
     *
     * @param {number} Location on the path from 0 (beginning) to 1 (end)
     */
    getCurvatureAt(t) {
        const cl = this._locationAt(t);
        return cl.curve.getCurvatureAt(cl.t);
    }
    /**
     * Returns the radius for a point on the path.
     *
     * @param {number} Location on the path from 0 (beginning) to 1 (end)
     */
    getRadiusAt(t) {
        const cl = this._locationAt(t);
        return cl.curve.getRadiusAt(cl.t);
    }
    /**
     * Reverses the path direction. Returns the path.
     */
    reverse() {
        this.anchors.reverse();
        for (let i = 0; i < this.anchors.length; i++) {
            const anchor = this.anchors[i], handleIn = anchor.handleIn;
            anchor.handleIn = anchor.handleOut;
            anchor.handleOut = handleIn;
        }
        this.update();
        return this;
    }
    /**
     * Applies the transformation matrix to the path.
     * Useful if you need to do calculations with the transformed path.
     *
     * Otherwise the renderer will handle the transformation for you.
     */
    applyTransform() {
        const m = this.transformation;
        for (let i = 0; i < this.anchors.length; i++) {
            const anchor = this.anchors[i];
            const point = m.applyToVector(anchor.point), handleIn = anchor.handleIn === null ? null : m.applyToVector(anchor.handleIn), handleOut = anchor.handleOut === null ? null : m.applyToVector(anchor.handleOut);
            this.anchors[i] = new Anchor(point, handleIn, handleOut);
        }
        this.update();
        this.transformation.reset();
        return this;
    }
    /**
     * Output the path as an SVG path command
     */
    toSVG() {
        const p = this.firstAnchor().point, s = ['M', p.x, p.y];
        for (let i = 0; i < this.curves.length; i++) {
            const c = this.curves[i];
            s.push(c.toSVG());
        }
        if (this.closed)
            s.push('Z');
        return s.join(' ');
    }

    /**
     * Returns an array of postscript like drawing instructions
     */
    toInstruction() {
        const s = [];
        const p = this.firstAnchor().point;
        s.push({
            command: Path.Commands.MOVE,
            points: [p.x, p.y],
        });
        for (let i = 0; i < this.curves.length; i++) {
            const c = this.curves[i];
            s.push(c.toInstruction());
        }
        if (this.closed) {
            s.push({
                command: Path.Commands.CLOSE,
                points: null,
            });
        }
        return s;
    }
    
    /**
     * Render Path
     */
    render(renderer) {
        return renderer.path(this);
    }
}
Path.Commands = {
    MOVE: 'moveTo',
    LINE: 'lineTo',
    CLOSE: 'close',
    CURVE: 'curveTo',
};
applyMixins(Path, [StylesMixin]);
export default Path;
