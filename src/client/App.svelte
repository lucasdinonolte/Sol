<script>
  let error
  let canvas

  const socket = io()

  const dpr = window.devicePixelRatio || 1

  socket.on('render', (res) => {
    error = undefined

    canvas.width = res.w * dpr
    canvas.height = res.h * dpr

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    res.commands.map((item) => {
      if (item.style.fill) ctx.fillStyle = item.style.fill
      if (item.style.stroke) ctx.strokeStyle = item.style.stroke

      ctx.beginPath()

      item.commands.map(cmd => {
        const command = cmd.command

        if (command === 'moveTo') ctx.moveTo(cmd.points[0], cmd.points[1])
        if (command === 'lineTo') ctx.lineTo(cmd.points[0], cmd.points[1])
        if (command === 'curveTo') ctx.bezierCurveTo(...cmd.points)
        if (command === 'close') ctx.closePath()
      })

      if (item.style.fill) ctx.fill()
      if (item.style.stroke) ctx.stroke()
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
  <div
    class="canvas"
  >
    <canvas
      bind:this={canvas}
      style={`transform: scale(${100 / dpr}%)`}
    />
  </div>
</main>

<style global>
  html, body {
    margin: 0;
    padding: 0;
  }

  main {
    position: relative;
    width: 100vw;
    height: 100vh;
  }

  .canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .error {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 50vw;
    transform: translate(-50%, -50%);
  }
</style>
