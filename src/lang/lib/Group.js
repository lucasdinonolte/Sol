import * as _ from 'lodash';
import applyMixins from './util/ApplyMixin.js';
import StylesMixin from './mixins/Styles.js';
import Item from './Item.js';
class Group extends Item {
    constructor() {
        super();
        this.children = [];
        this.changedChildren = [];
        this.renderedChildren = [];
    }
    /**
     * Add Child to Group
     *
     * @param {Item} Element to add to group
     */
    add(child) {
        // Remove from other groups if any
        // Also prevents elements from being added to a group twice
        if (child.parent)
            child.parent.remove(child);
        this.children.push(child);
        child.parent = this;
        child.parentId = this.children.length - 1;
        child.update();
        this.update();
        return this;
    }
    /**
     * Removes an item from the group
     *
     * @param {Item} Element to remove
     */
    remove(child) {
        if (child.parent !== this)
            return this;
        this.renderedChildren.splice(child.parentId, 1);
        this.children.splice(child.parentId, 1);
        const cIndex = this.changedChildren.indexOf(child.parentId);
        if (cIndex !== -1)
            this.changedChildren.splice(cIndex, 1);
        for (let i = child.parentId; i < this.children.length; i++) {
            this.children[i].parentId--;
        }
        for (let i = 0; i < this.changedChildren.length; i++) {
            if (this.changedChildren[i] > child.parentId)
                this.changedChildren[i]--;
        }
        child.parentNotified = false;
        delete child.parent;
        delete child.parentId;
        this.update();
        return this;
    }
    update() {
        this._updateBoundingBox();
        this.changed();
    }
    _updateBoundingBox() {
        let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
        for (let i = 0; i < this.children.length; i++) {
            const b = this.children[i].bounds;
            minX = Math.min(minX, b.x);
            minY = Math.min(minY, b.y);
            maxX = Math.max(maxX, b.x + b.width);
            maxY = Math.max(maxY, b.y + b.height);
        }
        this._updateExtrema(minX, maxX, minY, maxY);
    }
    /**
     * Removes all children from group.
     */
    clear() {
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.remove(this.children[i]);
        }
    }
    /**
     * Checks if a group has childen
     *
     * @param {boolean} whether to check sub groups
     */
    isEmpty(recursively = false) {
        if (this.children.length === 0)
            return true;
        if (recursively) {
            let childrenEmpty = true;
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i] instanceof Group) {
                    if (!this.children[i].isEmpty(true))
                        childrenEmpty = false;
                }
            }
            return childrenEmpty;
        }
        return false;
    }
    /**
     * Returns the first child
     */
    firstChild() {
        return this.children[0];
    }
    /**
     * Returns the last child
     */
    lastChild() {
        return this.children[this.children.length - 1];
    }
    /**
     * Are there any changed children? (i.e.) does this need rendering?
     */
    hasChangedChildren() {
        return this.changedChildren.length > 0;
    }
    /**
     * Recursively renders a group by rendering all its children
     *
     * @param {Renderer} Renderer to render with
     */
    renderChildren(renderer) {
        while (this.changedChildren.length > 0) {
            const childId = this.changedChildren.shift();
            this.renderedChildren[childId] = this.children[childId].render(renderer);
            this.children[childId].parentNotified = false;
        }
        return _.flattenDeep(this.renderedChildren);
    }
    render(renderer) {
        return renderer.group(this);
    }
}
applyMixins(Group, [StylesMixin]);
export default Group;
