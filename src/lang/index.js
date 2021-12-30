import Folio from '@folio/core'

import drawing from './drawing.js'
import tokenizer from './tokenizer.js'
import parser from './parser.js'
import { Environment, evaluate } from './interpreter.js'

const add = []

const parse = (source) => {
  return parser(tokenizer(source))
}

const doc = new Folio()

const evalCode = (ast) => {
  const globalEnv = new Environment()
  add.flat().forEach(item => {
    if (!globalEnv.has(item[0])) globalEnv.def(item[0], item[1])
  })

  globalEnv.def('eval', (source) => {
    const ast = parser(tokenizer(source))
    return evaluate(ast, globalEnv)
  })

  return evaluate(ast, globalEnv)
}

const addToGlobalEnv = (items) => {
  add.push(items) 
}

export default {
  parse,
  eval: evalCode,
  addToGlobalEnv,
  run: (source) => {
    doc.clear()
    addToGlobalEnv(drawing(doc))
    const ast = parse(source)

    return {
      ast,
      doc,
      result: evalCode(ast)
    }
  },
}
