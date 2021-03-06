'use strict';

{
  const canvas = document.getElementById('demo1');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 300;

  const rayAnchor = { x: 0, y: 150 };

  const lineSegments = [
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

  function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
  }

  function getIntersectionPoint(ray, segment) {
    const [A, B] = segment;
    const [C, D] = ray;

    const denominator = (D.x - C.x) * (B.y - A.y) - (B.x - A.x) * (D.y - C.y);

    const s = ((A.x - C.x) * (D.y - C.y) - (D.x - C.x) * (A.y - C.y)) / denominator;
    if(s < 0 || s > 1) return null;

    const r = ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) / denominator;
    if(r < 0) return null;

    return { x: s * (B.x - A.x) + A.x, y: s * (B.y - A.y) + A.y };
  }

  function getIntersectionPoints(ray, segments) {
    return segments.map(segment => getIntersectionPoint(ray, segment)).filter(point => point !== null);
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

  function drawRay(ray) {
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    
    // Extending line segment for better ray visualization
    // Can be omitted in production code
    const x = ray[1].x + (ray[1].x - ray[0].x) * 1000;
    const y = ray[1].y + (ray[1].y - ray[0].y) * 1000;

    ctx.moveTo(ray[0].x, ray[0].y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function drawIntersectionPoints(ray) {
    ctx.fillStyle = 'red';
    getIntersectionPoints(ray, lineSegments).forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
 
  function draw(mousePos) {
    clearCanvas();
    drawSegments(lineSegments);
    drawRay([rayAnchor, mousePos]);
    drawIntersectionPoints([rayAnchor, mousePos]);
  }

  window.addEventListener('mousemove', event => {
    const mousePos = getMousePosition(event);
    if(  
         mousePos.x < 0 || mousePos.x > canvas.width
      || mousePos.y < 0 || mousePos.y > canvas.height
    ) return;

    draw(mousePos);
  });

  draw({ x: canvas.width, y: canvas.height / 2 });
}