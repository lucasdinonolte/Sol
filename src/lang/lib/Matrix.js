import Vector from './Vector.js';
// 3D Matrix with dummy Z coordinate used for 2D transformations
// You gotta love vector math
//
// http://www.it.hiof.no/~borres/j3d/math/twod/p-twod.html
class Matrix {
    constructor() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
    }
    reset() {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    }
    translate(x, y) {
        this.tx += x * this.a + y * this.c;
        this.ty += x * this.b + y * this.d;
        return this;
    }
    rotate(angle, cx, cy) {
        const cos = Math.cos(angle), sin = Math.sin(angle), tx = cx - cx * cos + cy * sin, ty = cy - cx * sin - cy * cos, a = this.a, b = this.b, c = this.c, d = this.d;
        this.a = cos * a + sin * c;
        this.b = cos * b + sin * d;
        this.c = -sin * a + cos * c;
        this.d = -sin * b + cos * d;
        this.tx += tx * a + ty * c;
        this.ty += tx * b + ty * d;
        return this;
    }
    scale(sx = 1, sy = 1, cx = 0, cy = 0) {
        const origin = new Vector(cx, cy);
        this.translate(origin.x, origin.y);
        this.a *= sx;
        this.b *= sx;
        this.c *= sy;
        this.d *= sy;
        const invertedOrigin = origin.invert();
        this.translate(invertedOrigin.x, invertedOrigin.y);
        return this;
    }
    applyToVector(v) {
        const x = this.a * v.x + this.c * v.y + this.tx;
        const y = this.b * v.x + this.d * v.y + this.ty;
        return new Vector(x, y);
    }
    /**
     * Multiplies a given matrix with this matrix and returns a new Matrix
     */
    prepend(m) {
        const _m = new Matrix(), a1 = this.a, b1 = this.b, c1 = this.c, d1 = this.d, tx1 = this.tx, ty1 = this.ty, a2 = m.a, b2 = m.c, c2 = m.b, d2 = m.d, tx2 = m.tx, ty2 = m.ty;
        _m.a = a2 * a1 + b2 * b1;
        _m.b = a2 * c1 + b2 * d1;
        _m.c = c2 * a1 + d2 * b1;
        _m.d = c2 * c1 + d2 * d1;
        _m.tx = a2 * tx1 + b2 * ty1 + tx2;
        _m.ty = c2 * tx1 + d2 * ty1 + ty2;
        return _m;
    }
}
export default Matrix;
