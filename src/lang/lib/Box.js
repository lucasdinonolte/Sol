// A bounding box
import Vector from './Vector.js';
class Box {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.topLeft = new Vector();
        this.topRight = new Vector();
        this.bottomLeft = new Vector();
        this.bottomRight = new Vector();
        this.center = new Vector();
        this.x = 0;
        this.y = 0;
        this.area = 0;
    }
    /**
     * Update the bounding box
     *
     * @param {number} min x coordinate of the bounding box
     * @param {number} max x coordinate of the bounding box
     * @param {number} min y coordinate of the bounding box
     * @param {number} max y coordinate of the bounding box
     */
    setExtrema(x0, x1, y0, y1) {
        this.width = x1 - x0;
        this.height = y1 - y0;
        this.topLeft.set(x0, y0);
        this.topRight.set(x1, y0);
        this.bottomLeft.set(x0, y1);
        this.bottomRight.set(x1, y1);
        this.center.set((x1 + x0) / 2, (y1 + y0) / 2);
        this.x = this.topLeft.x;
        this.y = this.topLeft.y;
        this.area = this.width * this.height;
    }
}
export default Box;
