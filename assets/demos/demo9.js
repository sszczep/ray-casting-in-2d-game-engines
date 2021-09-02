'use strict';

{
  const canvas = document.getElementById('demo9');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 300;

  const angleOffset = 0.00001;
  const angleOffsetSin = Math.sin(angleOffset);
  const angleOffsetCos = Math.cos(angleOffset);

  const visibilityRadius = 100;

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

  // In production code, you might want to filter only unique vertices
  const vertices = lineSegments.reduce((vertices, segment) => {
    return [...vertices, ...segment];
  }, []);

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

  function sortIntersectionPointsByAngle(anchor, points) {
    return points.sort((P1, P2) => Math.atan2(P1.y - anchor.y, P1.x - anchor.x) - Math.atan2(P2.y - anchor.y, P2.x - anchor.x));
  }

  function draw(mousePos) {
    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    lineSegments.forEach(segment => {
      ctx.beginPath();
      ctx.moveTo(segment[0].x, segment[0].y);
      ctx.lineTo(segment[1].x, segment[1].y);
      ctx.stroke();
    });

    const intersectionPoints = [];
    vertices.forEach(vertex => {
      [
        {
          x: (vertex.x - mousePos.x) * angleOffsetCos + (vertex.y - mousePos.y) * angleOffsetSin + mousePos.x,
          y: (vertex.y - mousePos.y) * angleOffsetCos - (vertex.x - mousePos.x) * angleOffsetSin + mousePos.y,
        },
        vertex,
        {
          x: (vertex.x - mousePos.x) * angleOffsetCos - (vertex.y - mousePos.y) * angleOffsetSin + mousePos.x,
          y: (vertex.y - mousePos.y) * angleOffsetCos + (vertex.x - mousePos.x) * angleOffsetSin + mousePos.y,
        },
      ].forEach(vertex => {
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        ctx.lineTo(vertex.x, vertex.y);
        ctx.stroke();

        const closestPoint = getClosestIntersectionPoint([mousePos, vertex], lineSegments);
        if(closestPoint !== null) {
          intersectionPoints.push(closestPoint);

          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(closestPoint.x, closestPoint.y, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    });

    ctx.save();
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, visibilityRadius, 0, 2 * Math.PI);
    ctx.clip();

    const sortedIntersectionPoints = sortIntersectionPointsByAngle(mousePos, intersectionPoints);
    ctx.fillStyle = 'lightgrey';
    ctx.beginPath();
    ctx.moveTo(sortedIntersectionPoints[0].x, sortedIntersectionPoints[0].y);
    sortedIntersectionPoints.slice(1).forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(sortedIntersectionPoints[0].x, sortedIntersectionPoints[0].y);
    ctx.fill();

    ctx.restore();
  }

  window.addEventListener('mousemove', event => {
    const mousePos = getMousePosition(event);
    if(  
         mousePos.x < 0 || mousePos.x > canvas.width
      || mousePos.y < 0 || mousePos.y > canvas.height
    ) return;

    draw(mousePos);
  });

  draw({ x: canvas.width / 2, y: canvas.height / 2 });
}