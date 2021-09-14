const fs = require('fs')
const tokenizer = require('./tokenizer')
const parser = require('./parser')
const { Environment, evaluate } = require('./interpreter')

module.exports = () => {
  const args = process.argv.slice(2)

  const run = (source) => {
    const ast = parser(tokenizer(source))
    const globalEnv = new Environment() 
    
    globalEnv.def('println', function(val) {
      console.log(val)
    })

    globalEnv.def('true', true)
    globalEnv.def('false', false)
   
    globalEnv.def('rect', function(x, y, w, h) {
      console.log(`Drawing a rect a ${x}, ${y} with size ${w}*${h}`)
      return {x, y, w, h}
    })

    globalEnv.def('style', function(style, ...items) {
      console.log(style)
      console.log(`Applying ${style} to ${items}`)
    })

    globalEnv.def('fill', function(color) {
      console.log(color)
      return color
    })

    globalEnv.def('gt', function(a, b) {
      return a > b
    })

    globalEnv.def('lt', function(a, b) {
      return a < b
    })

    globalEnv.def('sub', function(a, b) {
      return a - b
    })

    globalEnv.def('mul', function(a, b) {
      return a * b
    })

    globalEnv.def('div', function(a, b) {
      return a / b
    })

    const core = [
      ['add', (...a) => a.reduce((x, y) => x + y, 0)],
      [
        'dotimes',
        (n, fn) => {
          for (let i = 0; i < n; i++) {
            fn(i)
          }
        },
      ],
      ['mod', (x, y) => ((x % y) + y) % y],
      ['first', (a) => (a !== null && a.length > 0 ? a[0] : null)],
      ['rest', (a) => (a === null ? [] : a.slice(1))],
      [
        'last',
        (a) => (a !== null && a.length > 0 ? a[a.length - 1] : null),
      ],
      ['butlast', (a) => (a === null ? [] : a.slice(0, a.length - 1))],
      ['count', (a) => (a === null ? 0 : a.length)],
      ['join', (...args) => args.join(" ")],
    ]

    Object.getOwnPropertyNames(Math).forEach(k =>
      core.push([k, Math[k]])
    )

    core.forEach(item => {
      globalEnv.def(item[0], item[1])
    })

    return evaluate(ast, globalEnv)
  }

  const runFile = (path) => {
    const code = fs.readFileSync(path, 'utf-8')
    run(code)
  }

  if (args.length !== 1) {
    console.log('Usage: name [script]')
    process.exit(1)
  } else {
    runFile(args[0])
  }
}
