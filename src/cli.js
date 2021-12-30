#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import repl from './commands/repl.js'
import watch from './commands/watch.js'

yargs(hideBin(process.argv))
  .scriptName('sol')
  .command('$0 [file]', 'Sol Repl', () => {}, (argv) => {
    if (!!argv.file) {
      watch(argv.file)
    } else {
      repl() 
    }
  })
  .demandCommand(1)
  .parse()
