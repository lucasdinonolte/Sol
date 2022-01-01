import { SOL_NAME, SOL_VERSION } from '../constants.js'
import tokenizer from '../lang/tokenizer.js'
import parser from '../lang/parser.js'
import { Environment, evaluate } from '../lang/interpreter.js'

const rep = (code, env) => {
  return evaluate(parser(tokenizer(code)), env)
}

export default rep
