const socket = io()
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

socket.on('render', (res) => {
  canvas.width = res.w
  canvas.height = res.h
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  res.commands.flat().map((item) => {
    const cmd = item[0]
    const pos = item[1] || [0, 0]
    const size = item[2] || [0, 0]
    const style = item[3] || { fill: 'black' }

    if (style.stroke) ctx.strokeStyle = style.stroke
    if (style.fill) ctx.fillStyle = style.fill

    const [x, y] = pos
    const [w, h] = size

    ctx.beginPath()
    ctx[cmd](x, y, w, h)

    if (style.stroke) ctx.stroke()
    if (style.fill) ctx.fill()
  })
})

socket.on('error', (res) => {
  console.log(res)
})
