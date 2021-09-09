'use strict';

{
  const canvas = document.getElementById('demo8');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 300;

  const angleOffset = 0.00001;

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

  function getOffsettedRayPoint(ray, angle) {
    return {
      x: (ray[1].x - ray[0].x) * Math.cos(angle) - (ray[1].y - ray[0].y) * Math.sin(angle) + ray[0].x,
      y: (ray[1].y - ray[0].y) * Math.cos(angle) + (ray[1].x - ray[0].x) * Math.sin(angle) + ray[0].y,
    };
  }

  function clearCanvas() {
    ctx.fillStyle = 'lightgrey';
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

    ctx.moveTo(ray[0].x, ray[0].y);
    ctx.lineTo(ray[1].x, ray[1].y);
    ctx.stroke();
  }

  function drawExtraRay(ray) {
    ctx.strokeStyle = 'red';
    ctx.beginPath();

    ctx.moveTo(ray[0].x, ray[0].y);
    ctx.lineTo(ray[1].x, ray[1].y);
    ctx.stroke();
  }

  function drawClosestIntersectionPoint(closestPoint) {
    if(closestPoint !== null) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(closestPoint.x, closestPoint.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function drawVisibleArea(sortedIntersectionPoints) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(sortedIntersectionPoints[0].x, sortedIntersectionPoints[0].y);
    sortedIntersectionPoints.slice(1).forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(sortedIntersectionPoints[0].x, sortedIntersectionPoints[0].y);
    ctx.fill();
  }

  function draw(mousePos) {
    clearCanvas();

    const intersectionPoints = [];
    const extraIntersectionPoints = []; // Hold those points separately for better visualization
    vertices.forEach(vertex => {
      const extraOffsetPoint1 = getOffsettedRayPoint([mousePos, vertex], -angleOffset);
      const extraOffsetPoint2 = getOffsettedRayPoint([mousePos, vertex], angleOffset);
      const closestPoint = getClosestIntersectionPoint([mousePos, vertex], lineSegments);
      const extraClosestPoint1 = getClosestIntersectionPoint([mousePos, extraOffsetPoint1], lineSegments);
      const extraClosestPoint2 = getClosestIntersectionPoint([mousePos, extraOffsetPoint2], lineSegments);

      if(closestPoint !== null) intersectionPoints.push(closestPoint);
      if(extraClosestPoint1 !== null) extraIntersectionPoints.push(extraClosestPoint1);
      if(extraClosestPoint2 !== null) extraIntersectionPoints.push(extraClosestPoint2);
    });

    const sortedIntersectionPoints = sortIntersectionPointsByAngle(mousePos, [...intersectionPoints, ...extraIntersectionPoints]);

    drawVisibleArea(sortedIntersectionPoints);
    drawSegments(lineSegments);
    extraIntersectionPoints.forEach(intersectionPoint => {
      drawExtraRay([mousePos, intersectionPoint]);
      drawClosestIntersectionPoint(intersectionPoint);
    });
    intersectionPoints.forEach(intersectionPoint => {
      drawRay([mousePos, intersectionPoint]);
      drawClosestIntersectionPoint(intersectionPoint);
    });
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