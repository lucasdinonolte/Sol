import { SOL_VERSION } from '../constants.js'

const core = [
  // META
  ['VERSION', SOL_VERSION],
  
  // BASIC TYPES
  ['true', true],
  ['false', false],
  ['nil', null],

  // BASIC MATH
  ['+', (...a) => {
      return a.reduce((x, y) => {
        if (!!x.add) {
          return x.add(y)
        } else {
          return x + y 
        }
      })
    }
  ],
  ['-',
		(...xs) => {
			switch (xs.length) {
				case 0:
					return 0
				case 1:
          if (!!xs[0].invert) return xs[0].invert()
					return -xs[0]
				case 2:
          if (!!xs[0].sub) return xs[0].sub(xs[1])
					return xs[0] - xs[1]
				default:
					return xs.slice(1).reduce((a, b) => {
            if (!!xs[0].sub) return a.sub(b)
            return a - b
          }, xs[0])
			}
		},
  ],
  ['*', (...a) => a.reduce((x, y) => {
    if (!!x.multiply) return x.multiply(y)
    return x * y
  })],
  ['/',
		(...xs) => {
			switch (xs.length) {
				case 0:
					return 1
				case 1:
          if (!!xs[0].normalize) return xs[0].normalize()
					return 1 / xs[0]
				case 2:
          if (!!xs[0].divide) return xs[0].divide(xs[1])
					return xs[0] / xs[1]
				default:
					return xs.slice(1).reduce((a, b) => {
            if (!!a.divide) return a.divide(b)
            return a / b
          }, xs[0])
			}
		},
  ],
  ['%', (x, y) => ((x % y) + y) % y],
  ['<', (x, y) => x < y],
  ['>', (x, y) => x > y],
  ['<=', (x, y) => x <= y],
  ['>=', (x, y) => x >= y],
  ['odd?', (x) => x%2 === 1],
  ['even?', (x) => x%2 === 0],
  
  // LOGIC
  ['=', (x, y) => x === y],
  ['!=', (x, y) => x !== y],
  ['!', (x) => !x],
  ['true?', (x) => !!x === true],
	['false?', (x) => !!x === false],

  // STRING
  ['str', (...x) => x.join(" ")],

  // VECTOR
  ['dist', (v1, v2) => v1.distance(v2)],
  ['dist2', (v1, v2) => v1.distanceSquared(v2)],
  ['dot', (v1, v2) => v1.dot(v2)],
  ['invert', (v) => v.invert()],
  ['normalize', (v) => v.normalize()],
  ['length', (v) => v.length()],
  ['rotation', (v) => v.rotation()],
  ['vec/rotate', (v) => v.rotate()],
  ['vec/x', (v) => v.x],
  ['vec/y', (v) => v.y],

  // DRAWING
  // functions to build the render tree
  ['draw', (size, items) => ({
    w: size.x,
    h: size.y,
    commands: [items].flat()
  })],
  ['rect', (pos, size, styles) => ['rect', [pos.x, pos.y], [size.x, size.y], styles]],
  ['ellipse', (pos, size, styles) => ['ellipse', [pos.x, pos.y], [size.x, size.y], styles]],
  ['circle', (pos, radius, styles) => ['ellipse', [pos.x, pos.y], [radius, radius], styles]],

  // UTILS
  ['degrees', (x) => x * (180 / Math.PI)],
  ['radians', (x) => x * (Math.PI / 180)],
  ['random', (a, b = 0) => {
    if (b === 0) {
      b = a
      a = 0
    }
    return a + Math.random() * (b - a)
  }],

  // LIST
  /**
   * Dotimes and each are not very functional, as they do not return anything.
   * Remove them from the core, but keep them as reference.
   *
  [
    'dotimes',
    (n, fn) => {
      for (let i = 0; i < n; i++) {
        fn(i)
      }
    },
  ],
  [
    'each',
    (a, fn) => {
      for (let i = 0; i < a.length; i++) {
        fn(a[i], i)
      } 
    }
  ],
  */
  [
    'map',
    (a, fn) => {
      const b = []
      for (let i = 0; i < a.length; i++) {
        b.push(fn(a[i], i))
      }
      return b
    }
  ],
  [
    'filter',
    (a, fn) => {
      const b = []
      for (let i = 0; i < a.length; i++) {
        if (fn(a[i], i)) b.push(a[i])
      }
      return b
    }
  ],
  ['first', (a) => (a !== null && a.length > 0 ? a[0] : null)],
  ['rest', (a) => (a === null ? [] : a.slice(1))],
  [
    'last',
    (a) => (a !== null && a.length > 0 ? a[a.length - 1] : null),
  ],
  ['butlast', (a) => (a === null ? [] : a.slice(0, a.length - 1))],
  ['count', (a) => (a === null ? 0 : a.length)],
  ['nth', (a, n) => a[n]],
  ['join', (...args) => args.join(" ")],
  ['range', (n) => new Array(n)],

  // MAPS
  ['get', (m, k) => (m.hasOwnProperty(k) ? m[k] : null)],
  ['has?', (m, k) => m.hasOwnProperty(k)],
  ['assoc', (m, k, v) => {
    const newM = Object.assign({}, m)
    newM[k] = v
    return newM
  }],
  ['dissoc', (m, k) => {
    const newM = Object.assign({}, m)
    if (newM.hasOwnProperty(k)) delete newM[k]
    return newM
  }],
  ['keys', (m) => Object.keys(m)],
  ['vals', (m) => Object.values(m)],
  
  // DEBUGGERS
  ['println', (...args) => console.log(args.map(a => a !== null ? a.toString() : '').join())],
  ['json', (a) => JSON.stringify(a, null, 4)],
]

Object.getOwnPropertyNames(Math).filter(k => k !== 'random').forEach(k => {
  core.push([k, Math[k]])
})

export default core
