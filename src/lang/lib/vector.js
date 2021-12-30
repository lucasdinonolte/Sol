class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }
    sub(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y);
    }
    multiply(scalar = 1) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    divide(scalar = 1) {
        const vec = new Vector(0, 0);
        if (scalar) {
            vec.x = this.x / scalar;
            vec.y = this.y / scalar;
        }
        return vec;
    }
    distancedSquared(vec) {
        const dx = this.x - vec.x;
        const dy = this.y - vec.y;
        return dx * dx + dy * dy;
    }
    distance(vec) {
        return Math.sqrt(this.distancedSquared(vec));
    }
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    length() {
        return Math.sqrt(this.lengthSquared());
    }
    normalize() {
        return this.divide(this.length());
    }
    invert() {
        return new Vector(-this.x, -this.y);
    }
    /**
     * Gets the angle of the current vector in radians.
     */
    rotation() {
        return Math.atan2(this.y, this.x);
    }
    /**
     * Creates a new vector by rotation.
     *
     * @param {number} angle in radians to rotate by
     */
    rotate(angle) {
        const x = Math.cos(angle) * this.length();
        const y = Math.sin(angle) * this.length();
        return new Vector(x, y);
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    toString() {
        return `(x: ${this.x}, y: ${this.y})`;
    }
}
export default Vector;
