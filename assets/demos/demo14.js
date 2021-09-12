'use strict';

// Important!
// We extend ray to be at least canvas.width * Math.sqrt(2) px long, it ensures that the ray goes across the whole canvas.
// Previously we were doing it only for graphical representation as it didn't matter for calculations, but now we need it for Bresenham's line algorithm.
// You might want to slightly modify the algorithm to omit this necessity.

{
  const canvas = document.getElementById('demo14');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 300;

  const rayAnchor = { x: 0, y: 0 };

  const cellSize = 30;

  function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
  }

  function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawCells() {
    ctx.strokeStyle = 'red';
    for(let col = 0; col < Math.ceil(canvas.width / cellSize); col++) {
      const cellX = col * cellSize;

      for(let row = 0; row < Math.ceil(canvas.height / cellSize); row++) {
        const cellY = row * cellSize;

        ctx.strokeRect(cellX, cellY, cellSize, cellSize);
      }
    }
  }

  function extendRay(ray) {
    const len = Math.sqrt((ray[0].x - ray[0].y) ** 2 + (ray[0].y - ray[1].y) ** 2);
    const x = ray[1].x + (ray[1].x - ray[0].x) / len * canvas.width * 1.42;
    const y = ray[1].y + (ray[1].y - ray[0].y) / len * canvas.width * 1.42;
    return { x, y };
  }

  function drawRay(ray) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(ray[0].x, ray[0].y);
    ctx.lineTo(ray[1].x, ray[1].y);
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  function visit(x, y) {
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.strokeRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
    ctx.lineWidth = 1;
  }

  // Shamelessly stolen from https://playtechs.blogspot.com/2007/03/raytracing-on-grid.html
  function bresenham(x0, y0, x1, y1) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let x = x0;
    let y = y0;
    let n = 1 + dx + dy;
    const x_inc = (x1 > x0) ? 1 : -1;
    const y_inc = (y1 > y0) ? 1 : -1;
    let error = dx - dy;
    dx *= 2;
    dy *= 2;

    for (; n > 0; --n) {
      visit(x, y);

      if (error > 0) {
        x += x_inc;
        error -= dy;
      } else {
        y += y_inc;
        error += dx;
      }
    }
  }
 
  function draw(mousePos) {
    clearCanvas();
    drawCells();
    const extendedRayEnd = extendRay([rayAnchor, mousePos]);
    bresenham(rayAnchor.x, rayAnchor.y, extendedRayEnd.x, extendedRayEnd.y);
    drawRay([rayAnchor, extendedRayEnd]);
  }

  window.addEventListener('mousemove', event => {
    const mousePos = getMousePosition(event);
    if(  
         mousePos.x < 0 || mousePos.x > canvas.width
      || mousePos.y < 0 || mousePos.y > canvas.height
    ) return;

    draw(mousePos);
  });

  draw({ x: 600, y: 300 });
}