// Inspired by rune.js and paper.js
// which are based on bezier.js
import Path from './Path.js';
import Vector from './Vector.js';
import MathUtil from './util/MathUtil.js';
class Curve {
    constructor(anchor1, anchor2) {
        this.degree = 3;
        this.points = [
            anchor1.point,
            anchor1.handleOut || anchor1.point,
            anchor2.handleIn || anchor2.point,
            anchor2.point
        ];
        this.update();
    }
    static align(points, p1, p2) {
        const tx = p1.x, ty = p1.y, a = -Math.atan2(p2.y - ty, p2.x - tx), d = (v) => {
            const x = (v.x - tx) * Math.cos(a) - (v.y - ty) * Math.sin(a), y = (v.x - tx) * Math.sin(a) + (v.y - ty) * Math.cos(a);
            return new Vector(x, y);
        };
        return points.map(d);
    }
    arcfn(t) {
        const d = this.derivative(t);
        const l = d.x * d.x + d.y * d.y;
        return Math.sqrt(l);
    }
    /**
     * Recalculates Curve Look up Tables
     */
    update() {
        this.isLinear();
        this.derive();
    }
    /**
     * Check if curve is linear
     */
    isLinear() {
        const a = Curve.align(this.points, this.points[0], this.points[this.degree]);
        for (let i = 0; i < a.length; i++) {
            if (Math.abs(a[i].y) > 0.0001) {
                this.linear = false;
                return;
            }
        }
        this.linear = true;
    }
    /**
     * Creates Look Up Table for Derived function
     */
    derive() {
        this.dpoints = [];
        for (let p = this.points, d = p.length, c = d - 1; d > 1; d--, c--) {
            const list = [];
            for (let j = 0, dpt; j < c; j++) {
                dpt = {
                    x: c * (p[j + 1].x - p[j].x),
                    y: c * (p[j + 1].y - p[j].y),
                };
                list.push(new Vector(dpt.x, dpt.y));
            }
            this.dpoints.push(list);
            p = list;
        }
    }
    /**
     * Computes the point at Curve Location as Vector
     */
    compute(t) {
        // Shortcut for beginning and end of curve
        if (t === 0)
            return this.points[0];
        if (t === 1)
            return this.points[this.degree];
        // Bezier Computation
        const mt = 1 - t, mt2 = mt * mt, t2 = t * t, a = mt2 * mt, b = mt2 * t * 3, c = mt * t2 * 3, d = t * t2, x = a * this.points[0].x + b * this.points[1].x + c * this.points[2].x + d * this.points[this.degree].x, y = a * this.points[0].y + b * this.points[1].y + c * this.points[2].y + d * this.points[this.degree].y;
        return new Vector(x, y);
    }
    static compute(t, p) {
        if (t === 0)
            return p[0];
        const degree = p.length - 1;
        if (t === 1)
            return p[degree];
        if (degree === 0)
            return p[0];
        const mt = 1 - t;
        let x, y = 0;
        if (degree === 1) {
            x = mt * p[0].x + t * p[1].x,
                y = mt * p[0].y + t * p[1].y;
            return new Vector(x, y);
        }
        let mt2 = mt * mt, t2 = t * t, a, b, c, d = 0;
        if (degree === 2) {
            p = [p[0], p[1], p[2], new Vector(0, 0)];
            a = mt2;
            b = mt * t * 2;
            c = t2;
        }
        else if (degree === 3) {
            a = mt2 * mt;
            b = mt2 * t * 3;
            c = mt * t2 * 3;
            d = t * t2;
        }
        // @ts-expect-error 
        x = a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x,
            // @ts-expect-error
            y = a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y;
        return new Vector(x, y);
    }
    /**
     * Point at Curve Location as Vector
     */
    getPointAt(t) {
        return Curve.compute(t, this.points);
    }
    /**
     * Point at derived Curve Location as Vector
     */
    derivative(t) {
        const mt = 1 - t, a = mt * mt, b = mt * t * 2, c = t * t, p = this.dpoints[0], x = a * p[0].x + b * p[1].x + c * p[2].x, y = a * p[0].y + b * p[1].y + c * p[2].y;
        return new Vector(x, y);
    }
    /**
     * Tangent at Curve Location as normalized vector
     */
    getTangentAt(t) {
        return this.derivative(t).normalize();
    }
    /**
     * Normal at Curve Location as normalized vector
     */
    getNormalAt(t) {
        const d = this.getTangentAt(t), x = -d.y, y = d.x;
        return new Vector(x, y);
    }
    /**
     * Curvature and Radius at Curve Location
     */
    _curvature(t) {
        const d1 = this.dpoints[0], d2 = this.dpoints[1], d = Curve.compute(t, d1), dd = Curve.compute(t, d2), qdsum = d.x * d.x + d.y * d.y, num = d.x * dd.y - d.y * dd.x, dnm = Math.pow(qdsum, 3 / 2);
        if (num === 0 || dnm === 0)
            return { k: 0, r: 0 };
        return {
            k: num / dnm,
            r: dnm / num
        };
    }
    getCurvatureAt(t) {
        const kr = this._curvature(t);
        return kr.k;
    }
    getRadiusAt(t) {
        const kr = this._curvature(t);
        return kr.r;
    }
    /**
     * Clears the curve's handles, turning the curve into a straight line.
     */
    clearHandles() {
        this.points[1] = this.points[0].copy();
        this.points[2] = this.points[this.degree].copy();
        this.update();
    }
    /**
     * Calculates the length of the current curve
     */
    length() {
        let z = 0.5, sum = 0, t = 0;
        for (let i = 0; i < MathUtil.Tvalues.length; i++) {
            t = z * MathUtil.Tvalues[i] + z;
            sum += MathUtil.Cvalues[i] * this.arcfn(t);
        }
        return z * sum;
    }
    /**
     * Return SVG compatible representation of curve
     */
    toSVG() {
        const p = this.points, s = [];
        if (this.linear) {
            const p2 = p[this.degree];
            s.push('L');
            s.push(p2.x);
            s.push(p2.y);
        }
        else {
            s.push('C');
            for (let i = 1; i < p.length; i++) {
                s.push(p[i].x);
                s.push(p[i].y);
            }
        }
        return s.join(' ');
    }
    /**
     * Returns an array of postscript like drawing instructions
     */
    toInstruction() {
        const p = this.points;
        const points = [];
        let command = '';
        if (this.linear) {
            const p2 = p[this.degree];
            command = Path.Commands.LINE;
            points.push(p2.x, p2.y);
        }
        else {
            command = Path.Commands.CURVE;
            for (let i = 1; i < p.length; i++) {
                points.push(p[i].x);
                points.push(p[i].y);
            }
        }
        return {
            command,
            points,
        };
    }
}
export default Curve;
