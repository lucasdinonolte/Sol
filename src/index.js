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

    globalEnv.def('add', function(a, b) {
      return a + b
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

    globalEnv.def('mod', function(a, b) {
      return a% b
    })

    globalEnv.def('pow', function(a, b) {
      return Math.pow(a, b)
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
