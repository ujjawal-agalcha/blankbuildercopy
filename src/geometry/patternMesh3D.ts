/**
 * THREADCAD 3D — PATTERN-DRIVEN 3D GARMENT GEOMETRY ENGINE
 * Converts 2D pattern piece boundaries and sewing relationships into
 * an assembled, curved, and synchronized 3D garment.
 */

import * as THREE from 'three';
import { PatternPiece, Point2D, Edge2D, ControlPoint } from '../types/cad';
import { SewingRelationship, SewingValidationResult } from '../types/sewing';
import { sampleEdgePoints, calculateEdgeLength, getPieceBoundingBox } from './measurements';

export interface AssembledPanel3D {
  pieceId: string;
  name: string;
  category: string;
  geometry: THREE.BufferGeometry;
  worldPosition: [number, number, number];
  bounds3D: THREE.Box3;
  vertexCount: number;
  triangleCount: number;
}

export interface SeamLine3D {
  id: string;
  name: string;
  points: [number, number, number][];
  status: 'perfect' | 'ease' | 'mismatch';
}

export interface GarmentAssemblyResult {
  panels: AssembledPanel3D[];
  seamLines: SeamLine3D[];
  validations: SewingValidationResult[];
  totalVertices: number;
  totalTriangles: number;
  overallBounds: THREE.Box3;
}

/**
 * 3D World Scale: 1 mm in 2D pattern = 0.088 units in Three.js world space
 * This scales a typical 540mm chest width to ~47.5 units and 720mm length to ~63.3 units,
 * matching camera framing at [0, -5, 115].
 */
export const CAD_TO_3D_SCALE = 0.088;

/**
 * Samples a piece boundary into a sequence of points along its edges.
 */
function samplePieceEdgeBoundary(piece: PatternPiece, stepsPerEdge = 24): Point2D[] {
  const pts: Point2D[] = [];
  for (const edge of piece.edges) {
    const sampled = sampleEdgePoints(edge, piece.points, stepsPerEdge);
    for (let i = 0; i < sampled.length - 1; i++) {
      pts.push(sampled[i]);
    }
  }
  return pts;
}

/**
 * Finds horizontal boundary extents [xMin, xMax] of a piece at given vertical position y
 */
function findHorizontalExtentsAtY(boundaryPts: Point2D[], y: number): { xMin: number; xMax: number } {
  let minX = Infinity;
  let maxX = -Infinity;
  const n = boundaryPts.length;

  for (let i = 0; i < n; i++) {
    const p1 = boundaryPts[i];
    const p2 = boundaryPts[(i + 1) % n];

    // Check if segment [p1, p2] intersects horizontal line at y
    if ((p1.y <= y && p2.y >= y) || (p2.y <= y && p1.y >= y)) {
      const dy = p2.y - p1.y;
      if (Math.abs(dy) > 1e-4) {
        const t = (y - p1.y) / dy;
        const x = p1.x + t * (p2.x - p1.x);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      } else {
        minX = Math.min(minX, p1.x, p2.x);
        maxX = Math.max(maxX, p1.x, p2.x);
      }
    }
  }

  if (minX === Infinity || maxX === -Infinity) {
    return { xMin: -100, xMax: 100 };
  }
  return { xMin, xMax };
}

/**
 * Generates front body 3D panel geometry directly from 2D pattern piece
 */
export function generateFrontBodyPanel(
  piece: PatternPiece,
  scale = CAD_TO_3D_SCALE,
  cols = 32,
  rows = 38
): THREE.BufferGeometry {
  const bbox = getPieceBoundingBox(piece);
  const boundaryPts = samplePieceEdgeBoundary(piece, 24);

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const yMin = bbox.minY;
  const yMax = bbox.minY + bbox.height;
  const yCenter = (yMin + yMax) / 2;

  // Chest curvature parameters
  const chestHalfWidth3D = (bbox.width / 2) * scale;
  const torsoRadius = chestHalfWidth3D * 1.08;
  const depthZ = torsoRadius * 0.42;

  for (let r = 0; r <= rows; r++) {
    const vNorm = r / rows;
    const yMm = yMin + vNorm * (yMax - yMin);
    const { xMin, xMax } = findHorizontalExtentsAtY(boundaryPts, yMm);
    const rowWidth = Math.max(20, xMax - xMin);

    for (let c = 0; c <= cols; c++) {
      const uNorm = c / cols;
      const xMm = xMin + uNorm * (xMax - xMin);

      // Normalized horizontal coordinate from center [-1, 1]
      const xCenterOffset = xMm - (xMin + xMax) / 2;
      const xNorm = rowWidth > 0 ? (xCenterOffset / (rowWidth / 2)) : 0;
      const clampedXNorm = Math.max(-1, Math.min(1, xNorm));

      // 3D coordinates
      const x3D = xMm * scale;
      const y3D = -(yMm - yCenter) * scale;

      // Natural torso cylinder curvature: curves backward at side seams
      // Center chest is forward (Z > 0), sides curve back to meet side seams at Z ~ 0
      const curveFactor = Math.sqrt(Math.max(0.01, 1 - Math.pow(clampedXNorm * 0.94, 2)));
      let z3D = (curveFactor - 0.4) * depthZ;

      // Shoulder slope curve: at top 15% of garment, curve back to meet back shoulder seam
      if (vNorm < 0.18) {
        const shoulderBlend = 1 - (vNorm / 0.18);
        z3D -= shoulderBlend * depthZ * 0.55;
      }

      // Bottom hem drape
      if (vNorm > 0.88) {
        const hemBlend = (vNorm - 0.88) / 0.12;
        z3D += hemBlend * depthZ * 0.08;
      }

      positions.push(x3D, y3D, z3D);

      // Normalized UV coordinates mapped to front body texture area [0.06, 0.46] x [0.12, 0.62]
      const uTex = 0.06 + ((xMm - bbox.minX) / bbox.width) * 0.40;
      const vTex = 0.62 - ((yMm - bbox.minY) / bbox.height) * 0.50;
      uvs.push(uTex, vTex);
    }
  }

  // Construct indexed quad-strip triangles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p1 = r * (cols + 1) + c;
      const p2 = r * (cols + 1) + (c + 1);
      const p3 = (r + 1) * (cols + 1) + c;
      const p4 = (r + 1) * (cols + 1) + (c + 1);

      indices.push(p1, p3, p2);
      indices.push(p2, p3, p4);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  return geo;
}

/**
 * Generates back body 3D panel geometry directly from 2D pattern piece
 */
export function generateBackBodyPanel(
  piece: PatternPiece,
  scale = CAD_TO_3D_SCALE,
  cols = 32,
  rows = 38
): THREE.BufferGeometry {
  const bbox = getPieceBoundingBox(piece);
  const boundaryPts = samplePieceEdgeBoundary(piece, 24);

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const yMin = bbox.minY;
  const yMax = bbox.minY + bbox.height;
  const yCenter = (yMin + yMax) / 2;

  const chestHalfWidth3D = (bbox.width / 2) * scale;
  const torsoRadius = chestHalfWidth3D * 1.08;
  const depthZ = torsoRadius * 0.42;

  for (let r = 0; r <= rows; r++) {
    const vNorm = r / rows;
    const yMm = yMin + vNorm * (yMax - yMin);
    const { xMin, xMax } = findHorizontalExtentsAtY(boundaryPts, yMm);
    const rowWidth = Math.max(20, xMax - xMin);

    for (let c = 0; c <= cols; c++) {
      const uNorm = c / cols;
      const xMm = xMin + uNorm * (xMax - xMin);

      const xCenterOffset = xMm - (xMin + xMax) / 2;
      const xNorm = rowWidth > 0 ? (xCenterOffset / (rowWidth / 2)) : 0;
      const clampedXNorm = Math.max(-1, Math.min(1, xNorm));

      // In 3D back panel is mirrored on X and faces backward (Z < 0)
      const x3D = -xMm * scale;
      const y3D = -(yMm - yCenter) * scale;

      const curveFactor = Math.sqrt(Math.max(0.01, 1 - Math.pow(clampedXNorm * 0.94, 2)));
      let z3D = -((curveFactor - 0.4) * depthZ);

      // Shoulder slope curve forward towards shoulder line at Z ~ 0
      if (vNorm < 0.18) {
        const shoulderBlend = 1 - (vNorm / 0.18);
        z3D += shoulderBlend * depthZ * 0.55;
      }

      positions.push(x3D, y3D, z3D);

      // Normalized UV coordinates mapped to back body texture area [0.54, 0.94] x [0.12, 0.62]
      const uTex = 0.54 + ((xMm - bbox.minX) / bbox.width) * 0.40;
      const vTex = 0.62 - ((yMm - bbox.minY) / bbox.height) * 0.50;
      uvs.push(uTex, vTex);
    }
  }

  // Back panel winding order is reversed so outward normals point backward
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p1 = r * (cols + 1) + c;
      const p2 = r * (cols + 1) + (c + 1);
      const p3 = (r + 1) * (cols + 1) + c;
      const p4 = (r + 1) * (cols + 1) + (c + 1);

      indices.push(p1, p2, p3);
      indices.push(p2, p4, p3);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  return geo;
}

/**
 * Generates sleeve 3D panel geometry curved into a natural tubular drape along the arm
 */
export function generateSleevePanel(
  piece: PatternPiece,
  isLeft: boolean,
  shoulderPoint: { x: number; y: number; z: number },
  scale = CAD_TO_3D_SCALE,
  cols = 24,
  rows = 24
): THREE.BufferGeometry {
  const bbox = getPieceBoundingBox(piece);
  const boundaryPts = samplePieceEdgeBoundary(piece, 20);

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const yMin = bbox.minY;
  const yMax = bbox.minY + bbox.height;

  // Arm drape angle: natural relaxed A-pose hang (~35 degrees outward/downward)
  const armAngleRad = (isLeft ? -36 : 36) * (Math.PI / 180);
  const dirX = Math.sin(armAngleRad);
  const dirY = -Math.cos(armAngleRad);

  for (let r = 0; r <= rows; r++) {
    const vNorm = r / rows;
    const yMm = yMin + vNorm * (yMax - yMin);
    const { xMin, xMax } = findHorizontalExtentsAtY(boundaryPts, yMm);
    const widthMm = Math.max(30, xMax - xMin);

    // Tubular cylinder radius derived from actual 2D pattern sleeve width: Circumference = width
    const sleeveRadius3D = (widthMm / (2 * Math.PI)) * scale * 0.95;

    // Center position along the arm axis
    const distDownArm = (yMm - yMin) * scale;
    const centerArmX = shoulderPoint.x + distDownArm * dirX;
    const centerArmY = shoulderPoint.y + distDownArm * dirY;
    const centerArmZ = shoulderPoint.z;

    for (let c = 0; c <= cols; c++) {
      const uNorm = c / cols;
      const angle = (uNorm - 0.5) * 2 * Math.PI;

      // Radial cylinder offsets
      const radOffsetZ = Math.cos(angle) * sleeveRadius3D;
      const perpX = -dirY * Math.sin(angle) * sleeveRadius3D * 0.75;
      const perpY = dirX * Math.sin(angle) * sleeveRadius3D * 0.75;

      const x3D = centerArmX + perpX;
      const y3D = centerArmY + perpY;
      const z3D = centerArmZ + radOffsetZ;

      positions.push(x3D, y3D, z3D);

      // Texture UV assignment: left sleeve [0.54, 0.94] x [0.65, 0.95], right sleeve [0.06, 0.46] x [0.65, 0.95]
      const uBase = isLeft ? 0.54 : 0.06;
      const uTex = uBase + uNorm * 0.40;
      const vTex = 0.95 - vNorm * 0.30;
      uvs.push(uTex, vTex);
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p1 = r * (cols + 1) + c;
      const p2 = r * (cols + 1) + (c + 1);
      const p3 = (r + 1) * (cols + 1) + c;
      const p4 = (r + 1) * (cols + 1) + (c + 1);

      if (isLeft) {
        indices.push(p1, p3, p2);
        indices.push(p2, p3, p4);
      } else {
        indices.push(p1, p2, p3);
        indices.push(p2, p4, p3);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  return geo;
}

/**
 * Generates collar / ribband 3D ring sitting along the neck opening
 */
export function generateNeckbandPanel(
  piece: PatternPiece,
  neckCenter: { x: number; y: number; z: number },
  neckRadiusX: number,
  neckRadiusZ: number,
  scale = CAD_TO_3D_SCALE,
  radialSegs = 32
): THREE.BufferGeometry {
  const bbox = getPieceBoundingBox(piece);
  const collarHeight3D = Math.max(1.2, bbox.height * scale * 0.48);

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= radialSegs; i++) {
    const theta = (i / radialSegs) * 2 * Math.PI;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    // Neck opening elliptical curve
    const xBase = neckCenter.x + cosT * neckRadiusX;
    const zBase = neckCenter.z + sinT * neckRadiusZ;
    const yBase = neckCenter.y - Math.max(0, sinT) * 1.5; // Front neckline dips slightly

    // Bottom edge of collar (attaches to neck seam)
    positions.push(xBase, yBase, zBase);
    uvs.push(i / radialSegs, 0);

    // Top edge of collar (standing up)
    const inwardTilt = 0.88;
    const xTop = neckCenter.x + cosT * neckRadiusX * inwardTilt;
    const zTop = neckCenter.z + sinT * neckRadiusZ * inwardTilt;
    const yTop = yBase + collarHeight3D;

    positions.push(xTop, yTop, zTop);
    uvs.push(i / radialSegs, 1);
  }

  for (let i = 0; i < radialSegs; i++) {
    const p1 = i * 2;
    const p2 = i * 2 + 1;
    const p3 = (i + 1) * 2;
    const p4 = (i + 1) * 2 + 1;

    indices.push(p1, p3, p2);
    indices.push(p2, p3, p4);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  return geo;
}

/**
 * Generates patch pocket 3D panel placed on front body surface
 */
export function generatePatchPocketPanel(
  piece: PatternPiece,
  frontBbox: { width: number; height: number },
  scale = CAD_TO_3D_SCALE
): THREE.BufferGeometry {
  const pBbox = getPieceBoundingBox(piece);
  const w3D = pBbox.width * scale;
  const h3D = pBbox.height * scale;

  const geo = new THREE.PlaneGeometry(w3D, h3D, 8, 8);
  const pos = geo.attributes.position;

  // Slight outward curvature and forward offset (+Z)
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const normX = x / (w3D / 2);
    const z = (1 - normX * normX) * 0.35 + 0.3;
    pos.setZ(i, z);
  }

  geo.computeVertexNormals();
  geo.computeBoundingBox();
  return geo;
}

/**
 * Main Master Assembly Engine:
 * Converts all 2D pattern pieces of a garment and their sewing relationships into
 * an assembled 3D garment.
 */
export function assemblePatternDrivenGarment(
  pieces: PatternPiece[],
  relationships: SewingRelationship[],
  measurements: Record<string, number> = {}
): GarmentAssemblyResult {
  const panels: AssembledPanel3D[] = [];
  const seamLines: SeamLine3D[] = [];
  const overallBounds = new THREE.Box3();

  // 1. Identify primary pieces
  const frontPiece = pieces.find(
    (p) => p.id === 'piece_front_body' || p.id.includes('front') || p.category === 'body'
  );
  const backPiece = pieces.find(
    (p) => p.id === 'piece_back_body' || p.id.includes('back')
  );
  const sleeveLeft = pieces.find(
    (p) => p.id === 'piece_sleeve_left' || p.id.includes('sleeve_left') || p.id.includes('sleevel')
  );
  const sleeveRight = pieces.find(
    (p) => p.id === 'piece_sleeve_right' || p.id.includes('sleeve_right') || p.id.includes('sleever')
  );
  const neckPiece = pieces.find(
    (p) => p.id === 'piece_neck_rib' || p.id.includes('collar') || p.id.includes('neck') || p.category === 'collar'
  );
  const pocketPiece = pieces.find(
    (p) => p.id.includes('pocket') || p.category === 'pocket'
  );

  const frontBbox = frontPiece ? getPieceBoundingBox(frontPiece) : { width: 540, height: 720, minX: 0, minY: 0 };

  // Calculate shoulder points in 3D for sleeve attachments
  const shoulderWidth3D = ((measurements.shoulderWidth || frontBbox.width * 0.88) / 2) * CAD_TO_3D_SCALE;
  const bodyHeight3D = frontBbox.height * CAD_TO_3D_SCALE;
  const shoulderY = (bodyHeight3D / 2) * 0.88;

  const leftShoulderPoint = { x: -shoulderWidth3D * 1.05, y: shoulderY, z: 0 };
  const rightShoulderPoint = { x: shoulderWidth3D * 1.05, y: shoulderY, z: 0 };

  // 2. Generate Front Body Panel
  if (frontPiece) {
    const frontGeo = generateFrontBodyPanel(frontPiece, CAD_TO_3D_SCALE);
    panels.push({
      pieceId: frontPiece.id,
      name: frontPiece.name || 'Front Body',
      category: 'body',
      geometry: frontGeo,
      worldPosition: [0, 0, 0],
      bounds3D: frontGeo.boundingBox!,
      vertexCount: frontGeo.attributes.position.count,
      triangleCount: frontGeo.index ? frontGeo.index.count / 3 : 0,
    });
    overallBounds.union(frontGeo.boundingBox!);
  }

  // 3. Generate Back Body Panel
  if (backPiece) {
    const backGeo = generateBackBodyPanel(backPiece, CAD_TO_3D_SCALE);
    panels.push({
      pieceId: backPiece.id,
      name: backPiece.name || 'Back Body',
      category: 'body',
      geometry: backGeo,
      worldPosition: [0, 0, 0],
      bounds3D: backGeo.boundingBox!,
      vertexCount: backGeo.attributes.position.count,
      triangleCount: backGeo.index ? backGeo.index.count / 3 : 0,
    });
    overallBounds.union(backGeo.boundingBox!);
  }

  // 4. Generate Left Sleeve Panel
  if (sleeveLeft) {
    const sLeftGeo = generateSleevePanel(sleeveLeft, true, leftShoulderPoint, CAD_TO_3D_SCALE);
    panels.push({
      pieceId: sleeveLeft.id,
      name: sleeveLeft.name || 'Left Sleeve',
      category: 'sleeve',
      geometry: sLeftGeo,
      worldPosition: [0, 0, 0],
      bounds3D: sLeftGeo.boundingBox!,
      vertexCount: sLeftGeo.attributes.position.count,
      triangleCount: sLeftGeo.index ? sLeftGeo.index.count / 3 : 0,
    });
    overallBounds.union(sLeftGeo.boundingBox!);
  }

  // 5. Generate Right Sleeve Panel
  if (sleeveRight) {
    const sRightGeo = generateSleevePanel(sleeveRight, false, rightShoulderPoint, CAD_TO_3D_SCALE);
    panels.push({
      pieceId: sleeveRight.id,
      name: sleeveRight.name || 'Right Sleeve',
      category: 'sleeve',
      geometry: sRightGeo,
      worldPosition: [0, 0, 0],
      bounds3D: sRightGeo.boundingBox!,
      vertexCount: sRightGeo.attributes.position.count,
      triangleCount: sRightGeo.index ? sRightGeo.index.count / 3 : 0,
    });
    overallBounds.union(sRightGeo.boundingBox!);
  }

  // 6. Generate Neckband Collar Panel
  if (neckPiece) {
    const neckRadiusX = ((measurements.neckWidth || 190) / 2) * CAD_TO_3D_SCALE * 0.9;
    const neckRadiusZ = neckRadiusX * 0.75;
    const neckCenter = { x: 0, y: shoulderY + 1.2, z: 0 };

    const collarGeo = generateNeckbandPanel(neckPiece, neckCenter, neckRadiusX, neckRadiusZ, CAD_TO_3D_SCALE);
    panels.push({
      pieceId: neckPiece.id,
      name: neckPiece.name || 'Neckband Rib',
      category: 'collar',
      geometry: collarGeo,
      worldPosition: [0, 0, 0],
      bounds3D: collarGeo.boundingBox!,
      vertexCount: collarGeo.attributes.position.count,
      triangleCount: collarGeo.index ? collarGeo.index.count / 3 : 0,
    });
    overallBounds.union(collarGeo.boundingBox!);
  }

  // 7. Generate Patch Pocket (if present)
  if (pocketPiece && frontPiece) {
    const pocketGeo = generatePatchPocketPanel(pocketPiece, frontBbox, CAD_TO_3D_SCALE);
    // Position on left chest in 3D
    const chestX = -shoulderWidth3D * 0.45;
    const chestY = shoulderY * 0.35;
    const chestZ = 6.8;

    panels.push({
      pieceId: pocketPiece.id,
      name: pocketPiece.name || 'Chest Pocket',
      category: 'pocket',
      geometry: pocketGeo,
      worldPosition: [chestX, chestY, chestZ],
      bounds3D: pocketGeo.boundingBox!,
      vertexCount: pocketGeo.attributes.position.count,
      triangleCount: pocketGeo.index ? pocketGeo.index.count / 3 : 0,
    });
  }

  // 8. Validate Sewing Seam Relationships
  const validations: SewingValidationResult[] = [];
  relationships.forEach((rel) => {
    const pA = pieces.find((p) => p.id === rel.pieceAId);
    const pB = pieces.find((p) => p.id === rel.pieceBId);
    if (!pA || !pB) return;

    const eA = pA.edges.find((e) => e.id === rel.edgeAId);
    const eB = pB.edges.find((e) => e.id === rel.edgeBId);
    if (!eA || !eB) return;

    const lenA = calculateEdgeLength(eA, pA.points);
    const lenB = calculateEdgeLength(eB, pB.points);
    const diff = Math.abs(lenA - lenB);
    const diffPct = (diff / Math.max(lenA, lenB, 1)) * 100;

    let status: SewingValidationResult['status'] = 'perfect';
    let message = 'Edges match accurately.';
    if (diffPct > 15) {
      status = 'mismatch';
      message = `Edge length discrepancy: ${lenA.toFixed(0)}mm vs ${lenB.toFixed(0)}mm (${diffPct.toFixed(1)}%).`;
    } else if (diffPct > 5) {
      status = 'ease';
      message = `Minor ease: ${diffPct.toFixed(1)}% difference accommodated with easing.`;
    }

    validations.push({
      relationshipId: rel.id,
      status,
      edgeALength: lenA,
      edgeBLength: lenB,
      difference: diff,
      message,
    });

    // 3D Seam Line Curve
    if (rel.id.includes('shoulder')) {
      const isL = rel.id.includes('l');
      const sX = isL ? -shoulderWidth3D : shoulderWidth3D;
      seamLines.push({
        id: rel.id,
        name: rel.name,
        status,
        points: [
          [sX * 0.35, shoulderY + 1.5, 0],
          [sX, shoulderY, 0],
        ],
      });
    } else if (rel.id.includes('side')) {
      const isL = rel.id.includes('l');
      const sX = isL ? -shoulderWidth3D * 1.15 : shoulderWidth3D * 1.15;
      seamLines.push({
        id: rel.id,
        name: rel.name,
        status,
        points: [
          [sX, shoulderY * 0.3, 0],
          [sX * 1.05, -bodyHeight3D / 2, 0],
        ],
      });
    }
  });

  const totalVertices = panels.reduce((sum, p) => sum + p.vertexCount, 0);
  const totalTriangles = panels.reduce((sum, p) => sum + p.triangleCount, 0);

  return {
    panels,
    seamLines,
    validations,
    totalVertices,
    totalTriangles,
    overallBounds,
  };
}

