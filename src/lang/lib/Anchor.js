class Anchor {
    constructor(a, b = null, c = null) {
        this.handleIn = null;
        this.handleOut = null;
        this.point = a;
        this.handleIn = b;
        this.handleOut = c;
    }
    hasHandles() {
        return this.handleIn !== null || this.handleOut !== null;
    }
    copy() {
        return new Anchor(this.point, this.handleIn, this.handleOut);
    }
    removeHandles() {
        this.handleIn = null;
        this.handleOut = null;
        return this;
    }
}
export default Anchor;
