import readline from 'readline'

import express from 'express'
import chokidar from 'chokidar'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import rep from '../lang/rep.js'
import tokenizer from '../lang/tokenizer.js'
import parser from '../lang/parser.js'
import { Environment, evaluate } from '../lang/interpreter.js'

import { SOL_NAME, SOL_VERSION } from '../constants.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const start = (_file, port = 3000) => {
  const file = path.join(process.cwd(), _file)
  const app = express()
  const server = createServer(app)
  const io = new Server(server)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  
  let env = new Environment()
  let res
  let ast


  const sockets = {}

  const evaluateCode = (id) => {
    env = new Environment()
    env.onRender((tree) => render(tree))
    const content = fs.readFileSync(file, { encoding: "utf8" });
    ast = parser(tokenizer(content))
    evaluate(ast, env)
  }

  const render = (tree, id) => {
    const doEmit = (id, res) => {
      sockets[id].emit('render', res)
    }

    const emitError = (id, err) => {
      sockets[id].emit('error', err) 
    }

    if (id) {
      doEmit(id, tree)
    } else {
      Object.keys(sockets).forEach(id => doEmit(id, tree))
    }
  }

  chokidar.watch(file).on('change', () => {
    evaluateCode()
  })

  io.on("connection", socket => {
    const { id } = socket
    sockets[id] = socket

    evaluateCode()

    socket.on("disconnect", () => delete sockets[id])
  })
  
  app.use(express.static(path.join(__dirname, "../", "../", "public")))

  server.listen(port)
  evaluateCode()

  rl.on('line', (input) => {
    try {
      if (input) console.log(rep(input, env))
    } catch (e) {
      console.warn(`Error: ${e}`)
    }
    rl.prompt()
  })

  rep(`(println (str "${SOL_NAME} ${SOL_VERSION} running at http://127.0.0.1:${port}"))`, env)
  rl.prompt()
}

export default start
