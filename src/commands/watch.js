import express from 'express'
import chokidar from 'chokidar'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import rep from '../lang/rep.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const start = (_file, port = 3000) => {
  const file = path.join(process.cwd(), _file)
  const app = express()
  const server = createServer(app)
  const io = new Server(server)

  const sockets = {}

  const evaluateCode = (id) => {
    const content = fs.readFileSync(file, { encoding: "utf8" });

    const doEmit = (id, res) => {
      sockets[id].emit('render', res)
    }

    const emitError = (id, err) => {
      sockets[id].emit('error', err) 
    }

    let res

    try {
      res = rep(content)
    } catch (e) {
      Object.keys(sockets).forEach(id => emitError(id, e.toString())) 
      return
    }

    if (id) {
      doEmit(id, res)
    } else {
      Object.keys(sockets).forEach(id => doEmit(id, res))
    }
  }

  chokidar.watch(file).on('change', () => {
    evaluateCode()
  })

  io.on("connection", socket => {
    const { id } = socket
    sockets[id] = socket

    evaluateCode(id)

    socket.on("disconnect", () => delete sockets[id])
  })
  
  app.use(express.static(path.join(__dirname, "../", "../", "public")))

  server.listen(port)
  console.log(`Sol running at http://127.0.0.1:${port}`)
}

export default start
