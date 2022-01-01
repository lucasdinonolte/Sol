import readline from 'readline'

import rep from '../lang/rep.js'
import { Environment } from '../lang/interpreter.js'
import { SOL_NAME, SOL_VERSION } from '../constants.js'

const repl = () => {
  const env = new Environment()

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rep(`(println (str "Welcome to ${SOL_NAME}" "${SOL_VERSION}"))`, env)

  rl.prompt()

  rl.on('line', (input) => {
    try {
      if (input) console.log(rep(input, env))
    } catch (e) {
      console.warn(`Error: ${e}`)
    }
    rl.prompt()
  })
}

export default repl
