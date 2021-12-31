<script>
  let error
  let canvas

  const socket = io()

  socket.on('render', (res) => {
    error = undefined

    canvas.width = res.w
    canvas.height = res.h

    const ctx = canvas.getContext('2d')
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

  socket.on('error', (err) => {
    error = err
  })
</script>

<main>
  {#if !!error}
    <div class="error">
      {error}
    </div>
  {/if}
  <canvas bind:this={canvas} />
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    min-height: 100vh;
  }

  .error {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 50vw;
    transform: translate(-50%, -50%);
  }
</style>
