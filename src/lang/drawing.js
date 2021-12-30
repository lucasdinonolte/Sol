import Folio from '@folio/core'

export default (doc) => [
  // Meta
  ['background', (c) => doc.background(c)],
  ['size', (w, h) => doc.setSize(w, h)],
  ['addItem', (item) => doc.add(item)],
  ['width', () => doc.width],
  ['height', () => doc.height],

  // Data Fetching
  ['loadJSON', async (url) => {
    await fetch(url).then(resp => resp.json())
  }],

  // Styles
  ['style', (...st) => st],
  ['render', (st, it) => {
    const style = [st].flat()
    const items = [it].flat()
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < style.length; j++) {
        style[j](items[i])
      }
      doc.add(items[i])
    }
  }],

  ['fill', (c) => (item) => (typeof item.fill === 'function') ? item.fill(c) : null],
  ['stroke', (c, w = 1) => (item) => (typeof item.stroke === 'function') ? item.stroke(c).strokeWeight(w) : null],
  ['opacity', (o = 1) => (item) => (typeof item.opacity === 'function') ? item.opacity(o) : null],
  ['blur', (r = 0) => (item) => (typeof item.blur === 'function') ? item.blur(r) : null],
  ['font', (f) => (item) => (typeof item.font === 'function') ? item.font(f) : null],
  ['fontSize', (f) => (item) => (typeof item.fontSize === 'function') ? item.fontSize(f) : null],

  ['transform', (t, i) => {
    const transforms = [t].flat()
    const items = [i].flat()

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < transforms.length; j++) {
        transforms[j](items[i])
      }
      if (typeof items[i].applyTransform === 'function') items[i].applyTransform()
    }

    return items.length === 1 ? items[0] : items
  }],
  ['translate', (v) => (item) => item.translate(v.x, v.y)],
  ['scale', (s) => (item) => item.scale(s)],
  ['rotate', (r) => (item) => item.rotate(r)],

  // Basic Types
  ['vector', (x, y) => new Folio.Vector(x, y)],
  ['anchor', (a, b = null, c = null) => new Folio.Anchor(a, b, c)],
  ['curve', (a, b) => new Folio.Curve(a, b)],
  
  // Basic Shapes
  [
    'rect',
    (p, s) => Folio.Path.Rectangle(p.x, p.y, s.x, s.y),
    {
      doc: 'Draws a rectangle',
      params: [
        { label: 'Position', type: 'Vector' },
        { label: 'Size', type: 'Vector' }
      ],
    },
  ],
  ['line', (from, to) => Folio.Path.Line(from.x, from.y, to.x, to.y)],
  ['circle', (center, radius) => Folio.Path.Circle(center.x, center.y, radius)],

  // Path
  // TODO: This is no immutable data yet!
  ['path', (anchors) => {
      const p = new Folio.Path()
      anchors.forEach(a => p.addAnchor(a))
      return p
    }
  ],
  ['moveTo', (p, v) => p.moveTo(v.x, v.y)],
  ['lineTo', (p, v) => p.lineTo(v.x, v.y)],
  ['close', (p) => p.close()],
  ['lineBy', (p, v) => p.lineBy(v.x, v.y)],
  ['curveTo', (p, v1, v2, v3) => p.curveTo(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y)], 
  ['pointAt', (p, t) => p.getPointAt(t)],
  ['tangent', (p, t) => p.getTangentAt(t)],
  ['normal', (p, t) => p.getNormalAt(t)],

  // Text
  ['text', (v, t) => new Folio.Text(v.x, v.y).text(t)],
  
  // Vectors
  ['vecX', (v) => v.x],
  ['vecY', (v) => v.y],
]
