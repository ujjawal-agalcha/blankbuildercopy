import { PatternPiece } from '../types/cad';
import { generateSeamAllowanceContour, contourToSvgPath } from './offset';
import { sampleEdgePoints, getPieceBoundingBox, getPointOnEdgeAtRatio, calculatePieceArea } from './measurements';

export function exportPatternsToSvg(pieces: PatternPiece[], projectName: string): string {
  // Compute overall bounds
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  pieces.forEach((piece) => {
    const bbox = getPieceBoundingBox(piece);
    minX = Math.min(minX, piece.position.x + bbox.minX - 50);
    minY = Math.min(minY, piece.position.y + bbox.minY - 50);
    maxX = Math.max(maxX, piece.position.x + bbox.maxX + 50);
    maxY = Math.max(maxY, piece.position.y + bbox.maxY + 50);
  });

  const width = Math.max(800, maxX - minX);
  const height = Math.max(600, maxY - minY);

  let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}mm" height="${height}mm">
  <defs>
    <style>
      .sew-line { fill: rgba(16, 185, 129, 0.05); stroke: #10b981; stroke-width: 1.5; stroke-dasharray: 4,4; }
      .cut-line { fill: none; stroke: #f1f5f9; stroke-width: 2; }
      .grainline { stroke: #38bdf8; stroke-width: 1.5; marker-end: url(#arrow); marker-start: url(#arrow); }
      .notch { stroke: #ef4444; stroke-width: 2; }
      .label-title { font-family: 'Helvetica', sans-serif; font-size: 16px; font-weight: bold; fill: #f1f5f9; }
      .label-sub { font-family: 'Helvetica', sans-serif; font-size: 11px; fill: #94a3b8; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/>
    </marker>
  </defs>
  <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="#0f1115" />
`;

  pieces.forEach((piece) => {
    const px = piece.position.x;
    const py = piece.position.y;
    const bbox = getPieceBoundingBox(piece);
    const area = calculatePieceArea(piece);

    svgContent += `  <g transform="translate(${px}, ${py})">\n`;

    // 1. Cut line (seam allowance)
    if (piece.seamAllowanceEnabled) {
      const offsetPts = generateSeamAllowanceContour(piece);
      if (offsetPts.length > 0) {
        svgContent += `    <path d="${contourToSvgPath(offsetPts)}" class="cut-line" />\n`;
      }
    }

    // 2. Sew line (actual pattern boundary)
    let sewPath = '';
    piece.edges.forEach((edge, idx) => {
      const pts = sampleEdgePoints(edge, piece.points, 24);
      if (idx === 0) {
        sewPath += `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
      }
      for (let i = 1; i < pts.length; i++) {
        sewPath += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
      }
    });
    sewPath += ' Z';
    svgContent += `    <path d="${sewPath}" class="sew-line" />\n`;

    // 3. Grainline
    if (piece.grainline) {
      const g = piece.grainline;
      svgContent += `    <line x1="${g.start.x}" y1="${g.start.y}" x2="${g.end.x}" y2="${g.end.y}" class="grainline" />\n`;
    }

    // 4. Notches
    piece.notches.forEach((notch) => {
      const edge = piece.edges.find((e) => e.id === notch.edgeId);
      if (edge) {
        const pt = getPointOnEdgeAtRatio(edge, piece.points, notch.distanceRatio);
        if (pt) {
          svgContent += `    <circle cx="${pt.x}" cy="${pt.y}" r="${notch.depth / 2}" class="notch" />\n`;
        }
      }
    });

    // 5. Piece Text Annotations
    const centerX = bbox.minX + bbox.width / 2;
    const centerY = bbox.minY + bbox.height / 2;
    svgContent += `    <text x="${centerX}" y="${centerY - 10}" text-anchor="middle" class="label-title">${piece.name}</text>\n`;
    svgContent += `    <text x="${centerX}" y="${centerY + 10}" text-anchor="middle" class="label-sub">Cut: ${piece.cutQuantity}x | Area: ${area.toFixed(0)} cm² | SA: ${piece.defaultSeamAllowance}mm</text>\n`;

    svgContent += `  </g>\n`;
  });

  svgContent += `</svg>`;
  return svgContent;
}

