'use strict';

{
  const canvas = document.getElementById('demo11');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 300;

  const rayAnchor = { x: 0, y: 150 };

  const circles = [
    { x: 100, y: 50, radius: 30 },
    { x: 300, y: 150, radius: 50 },
    { x: 400, y: 200, radius: 30 },
  ];

  function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
  }

  function getIntersectionPoint(ray, circle) {
    const [A, B] = ray;
    const C = { x: circle.x, y: circle.y };
    const r = circle.radius;

    const a = (B.x - A.x) ** 2 + (B.y - A.y) ** 2;
    const b = 2 * ((B.x - A.x) * (A.x - C.x) + (B.y - A.y) * (A.y - C.y));
    const c = (A.x - C.x) ** 2 + (A.y - C.y) ** 2 - r ** 2;
    const discriminant = b ** 2 - 4 * a * c;

    const result = [];
    
    if(discriminant === 0) {
      const t = -b / (2 * a);

      if(t >= 0) {
        const x = t * (B.x - A.x) + A.x;
        const y = t * (B.y - A.y) + A.y;

        result.push({ x, y });
      }
    } else if(discriminant > 0) {
      const discriminantSqrt = Math.sqrt(discriminant);
      const t1 = (-b + discriminantSqrt) / (2 * a);
      const t2 = (-b - discriminantSqrt) / (2 * a);

      if(t1 >= 0) {
        const x = t1 * (B.x - A.x) + A.x;
        const y = t1 * (B.y - A.y) + A.y;

        result.push({ x, y })
      }

      if(t2 >= 0) {
        const x = t2 * (B.x - A.x) + A.x;
        const y = t2 * (B.y - A.y) + A.y;

        result.push({ x, y });
      }
    }

    return result;
  }

  function getIntersectionPoints(ray, circles) {
    return circles.flatMap(circle => getIntersectionPoint(ray, circle));
  }

  function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawCircles(circles) {
    ctx.strokeStyle = 'black';
    circles.forEach(circle => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
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

  function drawIntersectionPoints(ray, circles) {
    ctx.fillStyle = 'red';
    getIntersectionPoints(ray, circles).forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  function draw(mousePos) {
    clearCanvas();
    drawCircles(circles);
    drawRay([rayAnchor, mousePos]);
    drawIntersectionPoints([rayAnchor, mousePos], circles);
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