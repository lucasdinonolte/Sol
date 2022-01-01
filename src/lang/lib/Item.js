/**
 * Base class to handle common item behaviour
 */
import Box from './Box.js';
import Matrix from './Matrix.js';
import Vector from './Vector.js';
class Item {
    constructor() {
        this.parentNotified = false;
        this.bounds = new Box();
        this.position = new Vector();
        this.transformation = new Matrix();
        this.id = Item.getId();
    }
    static getId() {
        return Math.random().toString(36).substr(2, 9);
    }
    changed() {
        if (this.parent && !this.parentNotified) {
            this.parent.changedChildren.push(this.parentId);
            this.parentNotified = true;
            // Make sure to also let the parent notify it's parent
            this.parent.update();
        }
    }
    nextSibling() {
        if (!this.parent || !this.parentId)
            return false;
        return this.parent.children[this.parentId + 1] || false;
    }
    prevSibling() {
        if (!this.parent || !this.parentId)
            return false;
        return this.parent.children[this.parentId - 1] || false;
    }
    _updateExtrema(minX, minY, maxX, maxY) {
        this.bounds.setExtrema(minX, minY, maxX, maxY);
        this.position = this.bounds.center;
    }
    translate(x, y) {
        this.transformation.translate(x, y);
        return this;
    }
    scale(scalar, cx = this.bounds.center.x, cy = this.bounds.center.y) {
        this.transformation.scale(scalar, scalar, cx, cy);
        return this;
    }
    rotate(angle, cx = this.bounds.center.x, cy = this.bounds.center.y) {
        this.transformation.rotate(angle, cx, cy);
        return this;
    }
}
export default Item;
