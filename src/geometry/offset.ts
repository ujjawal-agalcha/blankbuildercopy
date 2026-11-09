import { PatternPiece, Point2D } from '../types/cad';
import { samplePieceOutline } from './measurements';

export function computePieceWinding(points: Point2D[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length];
    sum += (next.x - points[i].x) * (next.y + points[i].y);
  }
  return sum; // > 0 is clockwise in screen coordinates (Y down)
}

/**
 * Computes parallel offset polygon representing the outer cut line with seam allowance.
 */
export function generateSeamAllowanceContour(piece: PatternPiece): Point2D[] {
  if (!piece.seamAllowanceEnabled || piece.defaultSeamAllowance <= 0) {
    return [];
  }

  const offsetDist = piece.defaultSeamAllowance;
  const outline = samplePieceOutline(piece, 16);
  if (outline.length < 3) return [];

  const isClockwise = computePieceWinding(outline) > 0;
  // If clockwise with Y-down, normal pointing outward to the right of vector (P[i] -> P[i+1])
  const outwardSign = isClockwise ? 1 : -1;

  const offsetPoints: Point2D[] = [];
  const n = outline.length;

  for (let i = 0; i < n; i++) {
    const prev = outline[(i - 1 + n) % n];
    const curr = outline[i];
    const next = outline[(i + 1) % n];

    // Vector 1: prev -> curr
    const v1x = curr.x - prev.x;
    const v1y = curr.y - prev.y;
    const l1 = Math.sqrt(v1x * v1x + v1y * v1y) || 1;
    // Normal 1 (rotated 90 deg)
    const n1x = -v1y / l1 * outwardSign;
    const n1y = v1x / l1 * outwardSign;

    // Vector 2: curr -> next
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;
    const l2 = Math.sqrt(v2x * v2x + v2y * v2y) || 1;
    // Normal 2
    const n2x = -v2y / l2 * outwardSign;
    const n2y = v2x / l2 * outwardSign;

    // Average normal at vertex (miter)
    let avgNx = (n1x + n2x) / 2;
    let avgNy = (n1y + n2y) / 2;
    const avgLen = Math.sqrt(avgNx * avgNx + avgNy * avgNy) || 1;
    avgNx /= avgLen;
    avgNy /= avgLen;

    // Cosine of half-angle to limit excessive miter spikes
    const dot = n1x * avgNx + n1y * avgNy;
    const miterLimit = Math.max(0.5, Math.min(2.0, 1 / (dot || 1)));

    offsetPoints.push({
      x: curr.x + avgNx * offsetDist * miterLimit,
      y: curr.y + avgNy * offsetDist * miterLimit,
    });
  }

  return offsetPoints;
}

export function contourToSvgPath(points: Point2D[], close = true): string {
  if (points.length === 0) return '';
  const first = points[0];
  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)}`;
  }
  if (close) d += ' Z';
  return d;
}

