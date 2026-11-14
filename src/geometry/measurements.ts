import { Edge2D, PatternPiece, Point2D, ControlPoint } from '../types/cad';
import { distanceBetween, sampleCubicBezier, evalCubicBezier } from './bezier';

export function getEdgeEndpoints(edge: Edge2D, points: ControlPoint[]): { from: ControlPoint; to: ControlPoint } | null {
  const from = points.find((p) => p.id === edge.fromPointId);
  const to = points.find((p) => p.id === edge.toPointId);
  if (!from || !to) return null;
  return { from, to };
}

export function calculateEdgeLength(edge: Edge2D, points: ControlPoint[]): number {
  const endpoints = getEdgeEndpoints(edge, points);
  if (!endpoints) return 0;
  const { from, to } = endpoints;

  if (edge.type === 'line' || !edge.controlPoints || edge.controlPoints.length === 0) {
    return distanceBetween(from, to);
  }

  if (edge.type === 'cubic-bezier' && edge.controlPoints.length >= 2) {
    const p1 = edge.controlPoints[0];
    const p2 = edge.controlPoints[1];
    const sampled = sampleCubicBezier(from, p1, p2, to, 32);
    let len = 0;
    for (let i = 1; i < sampled.length; i++) {
      len += distanceBetween(sampled[i - 1], sampled[i]);
    }
    return len;
  }

  return distanceBetween(from, to);
}

export function sampleEdgePoints(edge: Edge2D, points: ControlPoint[], steps = 24): Point2D[] {
  const endpoints = getEdgeEndpoints(edge, points);
  if (!endpoints) return [];
  const { from, to } = endpoints;

  if (edge.type === 'cubic-bezier' && edge.controlPoints && edge.controlPoints.length >= 2) {
    return sampleCubicBezier(from, edge.controlPoints[0], edge.controlPoints[1], to, steps);
  }

  // Straight line
  return [from, to];
}

export function samplePieceOutline(piece: PatternPiece, stepsPerEdge = 16): Point2D[] {
  const sampledOutline: Point2D[] = [];
  piece.edges.forEach((edge) => {
    const pts = sampleEdgePoints(edge, piece.points, stepsPerEdge);
    // Exclude last point to avoid duplicates when chaining edges
    for (let i = 0; i < pts.length - 1; i++) {
      sampledOutline.push(pts[i]);
    }
  });
  return sampledOutline;
}

export function calculatePieceArea(piece: PatternPiece): number {
  // Shoelace formula in mm^2 -> return cm^2
  const pts = samplePieceOutline(piece, 20);
  if (pts.length < 3) return 0;

  let area = 0;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += pts[i].x * pts[j].y;
    area -= pts[j].x * pts[i].y;
  }
  const areaMm2 = Math.abs(area) / 2;
  return areaMm2 / 100; // cm²
}

export function calculatePiecePerimeter(piece: PatternPiece): number {
  return piece.edges.reduce((sum, edge) => sum + calculateEdgeLength(edge, piece.points), 0);
}

export function getPieceBoundingBox(piece: PatternPiece): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  piece.points.forEach((p) => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  });

  piece.edges.forEach((edge) => {
    if (edge.controlPoints) {
      edge.controlPoints.forEach((cp) => {
        minX = Math.min(minX, cp.x);
        minY = Math.min(minY, cp.y);
        maxX = Math.max(maxX, cp.x);
        maxY = Math.max(maxY, cp.y);
      });
    }
  });

  if (minX === Infinity) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Calculates the combined world bounding box of all pattern pieces,
 * taking into account each piece's (x, y) cutting table position and rotation.
 */
export function getAllPiecesWorldBoundingBox(pieces: PatternPiece[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (!pieces || pieces.length === 0) {
    return { minX: 0, minY: 0, maxX: 1000, maxY: 1000, width: 1000, height: 1000 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  pieces.forEach((piece) => {
    const rad = ((piece.rotation || 0) * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const transformPoint = (px: number, py: number) => {
      const rx = px * cos - py * sin;
      const ry = px * sin + py * cos;
      return {
        x: piece.position.x + rx,
        y: piece.position.y + ry,
      };
    };

    piece.points.forEach((p) => {
      const wp = transformPoint(p.x, p.y);
      minX = Math.min(minX, wp.x);
      minY = Math.min(minY, wp.y);
      maxX = Math.max(maxX, wp.x);
      maxY = Math.max(maxY, wp.y);
    });

    piece.edges.forEach((edge) => {
      if (edge.controlPoints) {
        edge.controlPoints.forEach((cp) => {
          const wcp = transformPoint(cp.x, cp.y);
          minX = Math.min(minX, wcp.x);
          minY = Math.min(minY, wcp.y);
          maxX = Math.max(maxX, wcp.x);
          maxY = Math.max(maxY, wcp.y);
        });
      }
    });
  });

  if (minX === Infinity) {
    return { minX: 0, minY: 0, maxX: 1000, maxY: 1000, width: 1000, height: 1000 };
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function getPointOnEdgeAtRatio(
  edge: Edge2D,
  points: ControlPoint[],
  ratio: number
): Point2D | null {
  const endpoints = getEdgeEndpoints(edge, points);
  if (!endpoints) return null;
  const { from, to } = endpoints;

  const t = Math.max(0, Math.min(1, ratio));

  if (edge.type === 'cubic-bezier' && edge.controlPoints && edge.controlPoints.length >= 2) {
    return evalCubicBezier(from, edge.controlPoints[0], edge.controlPoints[1], to, t);
  }

  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

