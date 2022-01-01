class StylesMixin {
    setupState() {
        this.styles = {
            fill: false,
            stroke: false,
            strokeWidth: 1,
            opacity: 1,
            blur: 0,
        };
        this.data = {};
    }
    fill(color) {
        this.styles.fill = color;
        return this;
    }
    stroke(color) {
        this.styles.stroke = color;
        return this;
    }
    strokeWeight(weight) {
        this.styles.strokeWidth = weight;
        return this;
    }
    opacity(o) {
        let _o = o;
        if (o > 1)
            _o = 1;
        if (o < 0)
            _o = 0;
        this.styles.opacity = _o;
        return this;
    }
    blur(radius) {
        this.styles.blur = radius;
        return this;
    }

    applyStyles(styles = {}) {
      if (styles.fill) this.fill(styles.fill)
      if (styles.stroke) this.stroke(styles.stroke) 
      if (styles.strokeWeight) this.strokeWeight(styles.strokeWeight)
    }
}
export default StylesMixin;
