import readline from 'readline'

import rep from '../lang/rep.js'
import { SOL_NAME, SOL_VERSION } from '../constants.js'

const repl = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rep(`(println (str "Welcome to ${SOL_NAME}" "${SOL_VERSION}"))`)

  rl.prompt()

  rl.on('line', (input) => {
    try {
      if (input) console.log(rep(input))
    } catch (e) {
      console.warn(`Error: ${e}`)
    }
    rl.prompt()
  })
}

export default repl
