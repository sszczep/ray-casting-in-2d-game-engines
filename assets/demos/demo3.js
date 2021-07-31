'use strict';

{
  const canvas = document.getElementById('demo3');
  const ctx = canvas.getContext('2d');

  const angleOffset = 12;

  canvas.width = 600;
  canvas.height = 300;

  const lineSegments = [
    [{ x: 0, y: 0 }, { x: 600, y: 0 }],
    [{ x: 600, y: 0 }, { x: 600, y: 300 }],
    [{ x: 600, y: 300 }, { x: 0, y: 300 }],
    [{ x: 0, y: 300 }, { x: 0, y: 0 }],
    [{ x: 100, y: 50 }, { x: 100, y: 250 }],
    [{ x: 200, y: 50 }, { x: 200, y: 250 }],
    [{ x: 300, y: 50 }, { x: 300, y: 250 }],
    [{ x: 400, y: 50 }, { x: 400, y: 250 }],
    [{ x: 500, y: 50 }, { x: 500, y: 250 }],
  ];

  function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
  }

  function getIntersectionPoint(ray, segment, smallestR) {
    const [A, B] = segment;
    const [C, D] = ray;

    const denominator = (D.x - C.x) * (B.y - A.y) - (B.x - A.x) * (D.y - C.y);

    const r = ((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) / denominator;
    if(r < 0) return null;
    if(smallestR !== null && smallestR < r) return null;

    const s = ((A.x - C.x) * (D.y - C.y) - (D.x - C.x) * (A.y - C.y)) / denominator;
    if(s < 0 || s > 1) return null;

    return { x: s * (B.x - A.x) + A.x, y: s * (B.y - A.y) + A.y, r };
  }

  function getClosestIntersectionPoint(ray, segments) {
    return segments.reduce((closest, segment) => {
      return getIntersectionPoint(ray, segment, closest ? closest.r : null) || closest;
    }, null);
  }

  const dist = 1000;
  function getAngleOffsetPoint(point, angle) {
    return {
      x: point.x + dist * Math.sin(Math.PI / 180 * angle),
      y: point.y - dist * Math.cos(Math.PI / 180 * angle),
    };
  }

  function draw(mousePos) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    lineSegments.forEach(segment => {
      ctx.beginPath();
      ctx.moveTo(segment[0].x, segment[0].y);
      ctx.lineTo(segment[1].x, segment[1].y);
      ctx.stroke();
    });

    for(let angle = 0; angle < 360; angle += angleOffset) {
      const offsetPoint = getAngleOffsetPoint(mousePos, angle);

      ctx.strokeStyle = 'blue';
      ctx.beginPath();
      ctx.moveTo(mousePos.x, mousePos.y);
      ctx.lineTo(offsetPoint.x, offsetPoint.y);
      ctx.stroke();

      const closestPoint = getClosestIntersectionPoint([mousePos, offsetPoint], lineSegments);
      if(closestPoint !== null) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(closestPoint.x, closestPoint.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  window.addEventListener('mousemove', event => {
    const mousePos = getMousePosition(event);
    if(  
         mousePos.x < 0 || mousePos.x > canvas.width
      || mousePos.y < 0 || mousePos.y > canvas.height
    ) return;

    draw(mousePos);
  });

  draw({ x: canvas.width, y: canvas.height  / 2 });
}