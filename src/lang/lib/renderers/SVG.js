import Util from '../Util.js';
const diff = require("virtual-dom/diff");
const patch = require("virtual-dom/patch");
const svg = require('virtual-dom/virtual-hyperscript/svg');
const createElement = require('virtual-dom/create-element');
class SVGRenderer {
    constructor(output = '') {
        this.tree = svg('svg', {});
        this.el = createElement(this.tree);
        this.outputFile = output;
    }
    attachToElement(el) {
        if (!Util.isBrowser()) {
            throw new Error('SVG Renderer can only attach to Element if run in browser');
        }
        el.appendChild(this.el);
    }
    render(doc) {
        const props = {
            attributes: {
                xmlns: 'http://www.w3.org/2000/svg',
                'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                width: doc.width,
                height: doc.height,
            },
        };
        const children = doc.stage.renderChildren(this);
        const newTree = svg('svg', props, children);
        const diffTree = diff(this.tree, newTree);
        this.el = patch(this.el, diffTree);
        this.tree = newTree;
    }
    getStyleAttributes(obj) {
        let attr = {};
        if (obj.styles.fill)
            attr.fill = obj.styles.fill;
        if (obj.styles.stroke)
            attr.stroke = obj.styles.stroke;
        if (obj.styles.strokeWidth)
            attr['stroke-width'] = obj.styles.strokeWidth;
        return attr;
    }
    group(group) {
        return svg('g', {}, group.renderChildren(this));
    }
    path(path) {
        const attr = Object.assign({ d: path.toSVG() }, this.getStyleAttributes(path));
        return svg('path', attr);
    }
    compoundPath(path) {
        const attr = Object.assign({ d: path.paths.map((p) => p.toSVG()).join(' ') }, this.getStyleAttributes(path));
        return svg('path', attr);
    }
}
export default SVGRenderer;
