import { PatternPiece } from '../types/cad';
import { samplePieceOutline } from './measurements';
import { generateSeamAllowanceContour } from './offset';

/**
 * Generates an AutoCAD R12/2000 compatible ASCII DXF file for digital pattern cutting plotters (Gerber, Lectra, Optitex)
 */
export function exportPatternsToDxf(pieces: PatternPiece[], projectName: string): string {
  let dxf = `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n0\nENDSEC\n`;
  
  // TABLES SECTION
  dxf += `0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n4\n`;
  dxf += `0\nLAYER\n2\nCUT\n70\n0\n62\n7\n6\nCONTINUOUS\n0\n`;
  dxf += `0\nLAYER\n2\nSEW\n70\n0\n62\n3\n6\nDASHED\n0\n`;
  dxf += `0\nLAYER\n2\nGRAIN\n70\n0\n62\n4\n6\nCONTINUOUS\n0\n`;
  dxf += `0\nLAYER\n2\nTEXT\n70\n0\n62\n1\n6\nCONTINUOUS\n0\n`;
  dxf += `0\nENDTAB\n0\nENDSEC\n`;

  // ENTITIES SECTION
  dxf += `0\nSECTION\n2\nENTITIES\n`;

  pieces.forEach((piece) => {
    const ox = piece.position.x;
    const oy = -piece.position.y; // DXF Y axis is upwards, screen CAD is downwards

    // 1. Sew Contour (Inner sew line)
    const sewOutline = samplePieceOutline(piece, 24);
    if (sewOutline.length >= 3) {
      for (let i = 0; i < sewOutline.length; i++) {
        const p1 = sewOutline[i];
        const p2 = sewOutline[(i + 1) % sewOutline.length];
        dxf += `0\nLINE\n8\nSEW\n10\n${(ox + p1.x).toFixed(3)}\n20\n${(oy - p1.y).toFixed(3)}\n30\n0.0\n11\n${(ox + p2.x).toFixed(3)}\n21\n${(oy - p2.y).toFixed(3)}\n31\n0.0\n`;
      }
    }

    // 2. Cut Contour (Outer seam allowance line)
    if (piece.seamAllowanceEnabled) {
      const cutOutline = generateSeamAllowanceContour(piece);
      if (cutOutline.length >= 3) {
        for (let i = 0; i < cutOutline.length; i++) {
          const p1 = cutOutline[i];
          const p2 = cutOutline[(i + 1) % cutOutline.length];
          dxf += `0\nLINE\n8\nCUT\n10\n${(ox + p1.x).toFixed(3)}\n20\n${(oy - p1.y).toFixed(3)}\n30\n0.0\n11\n${(ox + p2.x).toFixed(3)}\n21\n${(oy - p2.y).toFixed(3)}\n31\n0.0\n`;
        }
      }
    }

    // 3. Grainline
    if (piece.grainline) {
      const g = piece.grainline;
      dxf += `0\nLINE\n8\nGRAIN\n10\n${(ox + g.start.x).toFixed(3)}\n20\n${(oy - g.start.y).toFixed(3)}\n30\n0.0\n11\n${(ox + g.end.x).toFixed(3)}\n21\n${(oy - g.end.y).toFixed(3)}\n31\n0.0\n`;
    }

    // 4. Piece Name
    dxf += `0\nTEXT\n8\nTEXT\n10\n${(ox + 50).toFixed(3)}\n20\n${(oy - 50).toFixed(3)}\n30\n0.0\n40\n15.0\n1\n${piece.name} (Cut ${piece.cutQuantity}x)\n`;
  });

  dxf += `0\nENDSEC\n0\nEOF\n`;
  return dxf;
}

