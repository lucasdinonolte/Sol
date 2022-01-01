import applyMixins from './util/ApplyMixin.js';
import StylesMixin from './mixins/Styles.js';
import Item from './Item.js';
class TextBox extends Item {
    constructor(x = 0, y = 0) {
        super();
        this.position.set(x, y);
        this.setupState();
        // Initial Data
        this.data = {
            text: '',
            font: 'Helvetica',
            fontSize: 50,
            textAlign: 'left',
            textBaseline: 'top',
        };
    }
    text(text) {
        this.data.text = text;
        return this;
    }
    font(font) {
        this.data.font = font;
        return this;
    }
    fontSize(size) {
        this.data.fontSize = size;
        return this;
    }
    update() {
        this.changed();
    }
    render(renderer) {
        return renderer.text(this);
    }
}
applyMixins(TextBox, [StylesMixin]);
export default TextBox;
