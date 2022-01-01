import Anchor from './Anchor.js';
import Box from './Box.js';
import CompoundPath from './CompoundPath.js';
import Curve from './Curve.js';
import EventEmitter from './EventEmitter.js';
import Font from './Font.js';
import Grid from './Grid.js';
import Group from './Group.js';
import Matrix from './Matrix.js';
import Path from './Path.js';
import TextBox from './Text.js';
import Util from './Util.js';
import Vector from './Vector.js';
import applyMixins from './util/ApplyMixin.js';
import CanvasRenderer from './renderers/Canvas.js';
import PostscriptRenderer from './renderers/Postscript.js';
import DummyRenderer from './renderers/Dummy.js';
class Folio {
    constructor(w = 1000, h = 1000, b = 0) {
        this.events = {};
        this.pauseNext = true;
        this.animated = false;
        this.frameRate = 60;
        this.frames = 600;
        this.frameCount = 0;
        this.width = w;
        this.height = h;
        this.bleed = b;
        this.stage = new Group();
        this._setCenter();
        this.emit('created');
    }
    /**
     * Creates a new static document.
     */
    static Document(_options, callback) {
        const options = Object.assign({
            width: 900,
            height: 900,
            bleed: 0,
        }, _options);
        const doc = new Folio(options.width, options.height, options.bleed);
        callback({ doc });
        return doc;
    }
    /**
     * Creates a new animation
     * @TODO
     */
    static Animation(_options, callback) {
        const options = Object.assign({
            width: 900,
            height: 900,
            frameRate: 60,
            frames: 600,
        }, _options);
        const doc = new Folio(options.width, options.height);
        doc.animated = true;
        doc.frameRate = options.frameRate;
        doc.frames = options.frames;
        doc.frameFunction = callback;
        return doc;
    }
    setSize(w, h) {
        this.width = w;
        this.height = h;
        this._setCenter();
    }
    _setCenter() {
        this.center = new Vector(this.width / 2, this.height / 2);
    }
    /**
     * Adds an element to the stage.
     *
     * @param {Item} The element to add.
     */
    add(el) {
        this.stage.add(el);
        this.emit('added', el);
    }
    /**
     * Removes an element from the stage.
     *
     * @param {Item} The element to remove
     */
    remove(el) {
        this.stage.remove(el);
        this.emit('removed', el);
    }
    /**
     * Removes all element from the stage group.
     */
    clear() {
        this.stage.clear();
        this.emit('cleared');
    }
    /**
     * Checks if stage group has children
     */
    isEmpty() {
        return this.stage.isEmpty();
    }
    /**
     * Set the renderer
     *
     * @TODO Might move this to the constructor, so you don't override renderers
     * @TODO Do we need the user to set the renderer or can this be handled
     * internally?
     */
    setRenderer(r) {
        this.renderer = r;
    }
    /**
     * Utility functions
     */
    background(color) {
        this.add(Path.Rectangle(0, 0, this.width, this.height).fill(color));
    }
    /**
     * Stub code to later implement multi frame documents (animation)
     */
    play() {
        if (this.frameCount <= this.frames) {
            this._play();
        }
        else {
            this.emit('done');
        }
    }
    _play() {
        const caller = typeof window !== 'undefined' ? requestAnimationFrame : setImmediate;
        this.clear();
        this.frameFunction({
            frame: this.frameCount,
            doc: this,
        });
        this.animationFrame = caller(() => {
            this.play();
        });
        this.render();
    }
    willRenderInNextCycle() {
        return this.stage.hasChangedChildren();
    }
    /**
     * Renders the current state of the stage using the specified renderer
     */
    render(...args) {
        this.frameCount++;
        if (this.willRenderInNextCycle()) {
            this.renderer.render(this, args);
            this.emit('rendered');
        }
    }
    /**
     * Convenience Functions to quickly add things.
     */
    rect(x, y, width, height) {
        const rect = Folio.Path.Rectangle(x, y, width, height);
        this.add(rect);
        return rect;
    }
}
// Make everything available through Folio namespace
Folio.Anchor = Anchor;
Folio.Box = Box;
Folio.CompoundPath = CompoundPath;
Folio.Curve = Curve;
Folio.Font = Font;
Folio.Grid = Grid;
Folio.Group = Group;
Folio.Matrix = Matrix;
Folio.Path = Path;
Folio.Text = TextBox;
Folio.Util = Util;
Folio.Vector = Vector;
Folio.CanvasRenderer = CanvasRenderer;
Folio.PostscriptRenderer = PostscriptRenderer;
Folio.DummyRenderer = DummyRenderer;
applyMixins(Folio, [EventEmitter]);
export default Folio;
