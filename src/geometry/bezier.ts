import { Point2D } from '../types/cad';

export function evalCubicBezier(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  t: number
): Point2D {
  const oneMinusT = 1 - t;
  const t2 = t * t;
  const t3 = t2 * t;
  const oneMinusT2 = oneMinusT * oneMinusT;
  const oneMinusT3 = oneMinusT2 * oneMinusT;

  return {
    x:
      oneMinusT3 * p0.x +
      3 * oneMinusT2 * t * p1.x +
      3 * oneMinusT * t2 * p2.x +
      t3 * p3.x,
    y:
      oneMinusT3 * p0.y +
      3 * oneMinusT2 * t * p1.y +
      3 * oneMinusT * t2 * p2.y +
      t3 * p3.y,
  };
}

export function evalCubicDerivative(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  t: number
): Point2D {
  const oneMinusT = 1 - t;
  return {
    x:
      3 * oneMinusT * oneMinusT * (p1.x - p0.x) +
      6 * oneMinusT * t * (p2.x - p1.x) +
      3 * t * t * (p3.x - p2.x),
    y:
      3 * oneMinusT * oneMinusT * (p1.y - p0.y) +
      6 * oneMinusT * t * (p2.y - p1.y) +
      3 * t * t * (p3.y - p2.y),
  };
}

export function sampleCubicBezier(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  steps = 24
): Point2D[] {
  const points: Point2D[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push(evalCubicBezier(p0, p1, p2, p3, t));
  }
  return points;
}

export function distanceBetween(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function cubicArcLength(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  steps = 32
): number {
  let length = 0;
  let prev = p0;
  for (let i = 1; i <= steps; i++) {
    const curr = evalCubicBezier(p0, p1, p2, p3, i / steps);
    length += distanceBetween(prev, curr);
    prev = curr;
  }
  return length;
}

export function getPointAndNormalAtT(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  t: number
): { point: Point2D; normal: Point2D; tangent: Point2D } {
  const point = evalCubicBezier(p0, p1, p2, p3, t);
  const deriv = evalCubicDerivative(p0, p1, p2, p3, t);
  const len = Math.sqrt(deriv.x * deriv.x + deriv.y * deriv.y) || 1;
  const tangent = { x: deriv.x / len, y: deriv.y / len };
  // Normal perpendicular (rotated 90 degrees CCW)
  const normal = { x: -tangent.y, y: tangent.x };
  return { point, normal, tangent };
}

