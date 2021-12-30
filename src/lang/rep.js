import { SOL_NAME, SOL_VERSION } from '../constants.js'
import tokenizer from '../lang/tokenizer.js'
import parser from '../lang/parser.js'
import { Environment, evaluate } from '../lang/interpreter.js'


const rep = (code) => {
  const repl_env = new Environment() 
  return evaluate(parser(tokenizer(code)), repl_env)
}

export default rep
