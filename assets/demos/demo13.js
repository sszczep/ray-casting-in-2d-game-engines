'use strict';

{
  const canvas = document.getElementById('demo13');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 300;

  const lineSegments = [
    [{ x: 0, y: 0 }, { x: 600, y: 0 }],
    [{ x: 600, y: 0 }, { x: 600, y: 300 }],
    [{ x: 600, y: 300 }, { x: 0, y: 300 }],
    [{ x: 0, y: 300 }, { x: 0, y: 0 }],
    [{ x: 200, y: 50 }, { x: 250, y: 50 }],
    [{ x: 200, y: 50 }, { x: 200, y: 100 }],
    [{ x: 400, y: 50 }, { x: 350, y: 50 }],
    [{ x: 400, y: 50 }, { x: 400, y: 100 }],
    [{ x: 200, y: 250 }, { x: 250, y: 250 }],
    [{ x: 200, y: 250 }, { x: 200, y: 200 }],
    [{ x: 400, y: 250 }, { x: 350, y: 250 }],
    [{ x: 400, y: 250 }, { x: 400, y: 200 }],
    [{ x: 100, y: 50 }, { x: 100, y: 250 }],
    [{ x: 500, y: 50 }, { x: 500, y: 250 }],
  ];

  const cellSize = 150;
  const cells = [];

  // We need to check if a line segment intersects with the cell.
  // For simplicity, I decided to use bounding boxes. 
  // It might not be the most accurate solution but it gets the job done.
  // You might want to check for line-segment - cell intersection instead.
  for(let col = 0; col < Math.ceil(canvas.width / cellSize); col++) {
    cells.push([]);

    for(let row = 0; row < Math.ceil(canvas.height / cellSize); row++) {
      const cell = lineSegments.filter(segment => {
        const cellX = col * cellSize;
        const cellY = row * cellSize;

        const [A, B] = segment;
        const width = Math.abs(A.x - B.x);
        const height = Math.abs(A.y - B.y);
        const x = Math.min(A.x, B.x);
        const y = Math.min(A.y, B.y);

        return (
          // If line-segment inside a cell
          (
            x >= cellX && x + width <= cellX + cellSize
            && y >= cellY && y + height <= cellY + cellSize 
          )
          // If bounding boxes intersect
          || (
            cellX < x + width
            && cellX + cellSize > x
            && cellY < y + height
            && cellY + height > y
          )
        );
      });

      cells[col].push(cell);
    }
  }

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

  function drawSegments(segments) {
    ctx.strokeStyle = 'black';
    segments.forEach(segment => {
      ctx.beginPath();
      ctx.moveTo(segment[0].x, segment[0].y);
      ctx.lineTo(segment[1].x, segment[1].y);
      ctx.stroke();
    });
  }

  function drawCells() {
    ctx.strokeStyle = 'red';
    for(let col = 0; col < Math.ceil(canvas.width / cellSize); col++) {
      const cellX = col * cellSize;

      for(let row = 0; row < Math.ceil(canvas.height / cellSize); row++) {
        const cellY = row * cellSize;

        ctx.strokeRect(cellX, cellY, cellSize, cellSize);

        ctx.fillStyle = 'black';
        ctx.font = '16px serif';
        ctx.fillText(`(${cellX},${cellY})`, cellX + 5, cellY + 21);
      }
    }
  }

  function drawActiveCell(mousePos) {
    const x = Math.floor(mousePos.x / cellSize);
    const y = Math.floor(mousePos.y / cellSize);

    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;

    ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

    ctx.beginPath();
    cells[x][y].forEach(segment => {
      const [A, B] = segment;
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
    });
    ctx.stroke();

    ctx.lineWidth = 1;
  }
 
  function draw(mousePos) {
    clearCanvas();
    drawSegments(lineSegments);
    drawCells();
    drawActiveCell(mousePos);
  }

  window.addEventListener('mousemove', event => {
    const mousePos = getMousePosition(event);
    if(  
         mousePos.x < 0 || mousePos.x > canvas.width
      || mousePos.y < 0 || mousePos.y > canvas.height
    ) return;

    draw(mousePos);
  });

  draw({ x: 0, y: 0 });
}