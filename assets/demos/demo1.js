{
  const canvas = document.getElementById('demo1');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 300;

  const rayAnchor = { x: 0, y: 150 };

  const lineSegments = [
    [{ x: 100, y: 50 }, { x: 100, y: 250 }],
    [{ x: 200, y: 50 }, { x: 200, y: 250 }],
    [{ x: 300, y: 50 }, { x: 300, y: 250 }],
    [{ x: 400, y: 50 }, { x: 400, y: 250 }],
    [{ x: 500, y: 50 }, { x: 500, y: 250 }],
  ];

  function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
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

  function draw(event) {
    const mousePos = getMousePosition(event);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    lineSegments.forEach(segment => {
      ctx.beginPath();
      ctx.moveTo(segment[0].x, segment[0].y);
      ctx.lineTo(segment[1].x, segment[1].y);
      ctx.stroke();
    });

    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(rayAnchor.x, rayAnchor.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();

    ctx.fillStyle = 'red';
    getIntersectionPoints([rayAnchor, mousePos], lineSegments).forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  window.addEventListener('mousemove', draw);
}