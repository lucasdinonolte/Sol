import applyMixins from './util/ApplyMixin.js';
import StylesMixin from './mixins/Styles.js';
import Item from './Item.js';
class CompoundPath extends Item {
    constructor() {
        super();
        this.paths = [];
        this.setupState();
    }
    update() {
        for (let i = 0; i < this.paths.length; i++) {
            this.paths[i].update();
        }
        this.changed();
    }
    /**
     * Adds a path to the compound path
     *
     * @param {Path} Path to add
     */
    addPath(p) {
        p.parentCompoundPath = this;
        this.paths.push(p);
        return this;
    }
    firstPath() {
        return this.paths[0];
    }
    lastPath() {
        return this.paths[this.paths.length - 1];
    }
    firstAnchor() {
        return this.firstPath().firstAnchor();
    }
    lastAnchor() {
        return this.lastPath().lastAnchor();
    }
    firstCurve() {
        return this.firstPath().firstCurve();
    }
    lastCurve() {
        return this.lastPath().lastCurve();
    }
    length() {
        return this.paths.map(p => p.length())
            .reduce((a, c) => a + c);
    }
    isClosed() {
        for (let i = 0; i < this.paths.length; i++) {
            if (!this.paths[i].closed)
                return false;
        }
        return true;
    }
    close() {
        for (let i = 0; i < this.paths.length; i++) {
            this.paths[i].close();
        }
        this.update();
        return this;
    }
    render(renderer) {
        return renderer.compoundPath(this);
    }
}
applyMixins(CompoundPath, [StylesMixin]);
export default CompoundPath;
