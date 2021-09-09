'use strict';

{
  const canvas = document.getElementById('demo12');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 300;

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

  function getTangents(rayAnchor, circle) {
    const A = { x: rayAnchor.x - circle.x, y: rayAnchor.y - circle.y };
    const r = circle.radius;

    const result = [];

    if(A.x !== 0 && A.y !== 0) {
      const a = A.x ** 2 + A.y ** 2;
      const b = -2 * r ** 2 * A.y;
      const c = r ** 4 - r ** 2 * A.x ** 2;
      const discriminant = b ** 2 - 4 * a * c;

      if(discriminant === 0) {
        const y = -b / 2 * A;
        const x = (r ** 2 - y * A.y) / A.x;

        result.push({ x: x + circle.x, y: y + circle.y });
      } else if(discriminant > 0) {
        const discriminantSqrt = Math.sqrt(discriminant);
        const y1 = (-b + discriminantSqrt) / (2 * a);
        const y2 = (-b - discriminantSqrt) / (2 * a);
        const x1 = (r ** 2 - y1 * A.y) / A.x;
        const x2 = (r ** 2 - y2 * A.y) / A.x;

        result.push({ x: x1 + circle.x, y: y1 + circle.y });
        result.push({ x: x2 + circle.x, y: y2 + circle.y });
      }
    } else if(A.x === 0 && A.y !== 0) {
      const a = A.y ** 2;
      const b = 0;
      const c = r ** 4 - r ** 2 * A.y ** 2;
      const discriminant = b ** 2 - 4 * a * c;

      if(discriminant === 0) {
        const x = -b / 2 * A;
        const y = r ** 2 / A.y;

        result.push({ x: x + circle.x, y: y + circle.y });
      } else if(discriminant > 0) {
        const discriminantSqrt = Math.sqrt(discriminant);
        const x1 = (-b + discriminantSqrt) / (2 * a);
        const x2 = (-b - discriminantSqrt) / (2 * a);
        const y1 = r ** 2 / A.y;
        const y2 = r ** 2 / A.y;

        result.push({ x: x1 + circle.x, y: y1 + circle.y });
        result.push({ x: x2 + circle.x, y: y2 + circle.y });
      }
    } else if(A.x !== 0 && A.y === 0) {
      const a = A.x ** 2;
      const b = 0;
      const c = r ** 4 - r ** 2 * A.x ** 2;
      const discriminant = b ** 2 - 4 * a * c;

      if(discriminant === 0) {
        const y = -b / 2 * A;
        const x = r ** 2 / A.x;

        result.push({ x: x + circle.x, y: y + circle.y });
      } else if(discriminant > 0) {
        const discriminantSqrt = Math.sqrt(discriminant);
        const y1 = (-b + discriminantSqrt) / (2 * a);
        const y2 = (-b - discriminantSqrt) / (2 * a);
        const x1 = r ** 2 / A.x;
        const x2 = r ** 2 / A.x;

        result.push({ x: x1 + circle.x, y: y1 + circle.y });
        result.push({ x: x2 + circle.x, y: y2 + circle.y });
      }
    }

    return result;
  }

  function getAllTangents(rayAnchor, circles) {
    return circles.flatMap(circle => getTangents(rayAnchor, circle));
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

  function drawTangentsAndPoints(anchorPoint, circles) {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'blue';
    getAllTangents(anchorPoint, circles).forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(anchorPoint.x, anchorPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });
  }

  function draw(mousePos) {
    clearCanvas();
    drawCircles(circles);
    drawTangentsAndPoints(mousePos, circles);
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