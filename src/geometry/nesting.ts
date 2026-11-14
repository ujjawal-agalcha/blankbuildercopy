import { PatternPiece, Point2D } from '../types/cad';
import { getPieceBoundingBox } from './measurements';

/**
 * Cleanly arranges pattern pieces on the CAD cutting table in logical tiers:
 * Tier 1: Main body panels (Front, Back)
 * Tier 2: Secondary major panels (Sleeves, Legs, Hoods)
 * Tier 3: Trims, Collars, Cuffs, Waistbands, Pockets, Bindings
 * 
 * Guarantees zero overlapping and generous spacing for easy CAD inspection and editing.
 */
export function autoArrangePatternPieces(
  pieces: PatternPiece[],
  horizontalSpacing = 40,
  verticalSpacing = 60,
  startX = 80,
  startY = 80
): PatternPiece[] {
  if (pieces.length === 0) return [];

  // Group pieces by logical category
  const bodyPieces: PatternPiece[] = [];
  const sleeveOrLegPieces: PatternPiece[] = [];
  const secondaryPieces: PatternPiece[] = [];

  for (const piece of pieces) {
    if (piece.category === 'body') {
      bodyPieces.push(piece);
    } else if (piece.category === 'sleeve' || piece.category === 'hood') {
      sleeveOrLegPieces.push(piece);
    } else {
      secondaryPieces.push(piece);
    }
  }

  // Helper to layout a single row of pieces
  let currentY = startY;
  const arrangedMap = new Map<string, Point2D>();

  const layoutTier = (tierPieces: PatternPiece[]) => {
    if (tierPieces.length === 0) return;

    let currentX = startX;
    let maxTierHeight = 0;

    for (const piece of tierPieces) {
      const bbox = getPieceBoundingBox(piece);
      // Align piece so its top-left world bounds sit at currentX, currentY
      const targetPosX = currentX - bbox.minX;
      const targetPosY = currentY - bbox.minY;

      arrangedMap.set(piece.id, {
        x: Math.round(targetPosX),
        y: Math.round(targetPosY),
      });

      currentX += bbox.width + horizontalSpacing;
      if (bbox.height > maxTierHeight) {
        maxTierHeight = bbox.height;
      }
    }

    currentY += maxTierHeight + verticalSpacing;
  };

  // Layout Tier 1 (Bodies)
  layoutTier(bodyPieces);
  // Layout Tier 2 (Sleeves / Hoods)
  layoutTier(sleeveOrLegPieces);
  // Layout Tier 3 (Collar, Cuffs, Pockets, Ribbing, Trims)
  layoutTier(secondaryPieces);

  // Return new pieces with updated coordinates
  return pieces.map((piece) => {
    const newPos = arrangedMap.get(piece.id);
    if (!newPos) return piece;
    return {
      ...piece,
      position: newPos,
    };
  });
}

/**
 * Fabric roll nesting algorithm (simulating commercial 150cm / 60-inch bolt fabric cutting).
 * Packs pieces onto a virtual fabric roll of width `fabricWidthMm`, packing left-to-right
 * and bottom-to-top while preserving grainlines.
 */
export function nestPiecesForCutting(
  pieces: PatternPiece[],
  fabricWidthMm = 1450, // standard 1500mm bolt with 25mm selvedge on each side
  marginMm = 20
): { pieces: PatternPiece[]; totalLengthMm: number; efficiency: number } {
  if (pieces.length === 0) {
    return { pieces: [], totalLengthMm: 0, efficiency: 0 };
  }

  // Sort pieces by height descending for optimal bin-packing
  const sorted = [...pieces].sort((a, b) => {
    const bA = getPieceBoundingBox(a);
    const bB = getPieceBoundingBox(b);
    return bB.height - bA.height;
  });

  let curX = marginMm;
  let curY = marginMm;
  let rowHeight = 0;
  let maxTotalY = 0;
  let totalPieceArea = 0;

  const nestedMap = new Map<string, Point2D>();

  for (const piece of sorted) {
    const bbox = getPieceBoundingBox(piece);
    totalPieceArea += bbox.width * bbox.height * 0.85; // approximate polygon fill

    // If piece overflows fabric roll width, start a new row
    if (curX + bbox.width + marginMm > fabricWidthMm && curX > marginMm) {
      curX = marginMm;
      curY += rowHeight + marginMm;
      rowHeight = 0;
    }

    const targetPosX = curX - bbox.minX;
    const targetPosY = curY - bbox.minY;

    nestedMap.set(piece.id, {
      x: Math.round(targetPosX),
      y: Math.round(targetPosY),
    });

    curX += bbox.width + marginMm;
    if (bbox.height > rowHeight) {
      rowHeight = bbox.height;
    }
    if (curY + bbox.height > maxTotalY) {
      maxTotalY = curY + bbox.height;
    }
  }

  const totalLengthMm = maxTotalY + marginMm;
  const totalFabricArea = fabricWidthMm * totalLengthMm;
  const efficiency = totalFabricArea > 0 ? Math.min(0.95, totalPieceArea / totalFabricArea) : 0;

  const resultPieces = pieces.map((piece) => {
    const pos = nestedMap.get(piece.id);
    if (!pos) return piece;
    return {
      ...piece,
      position: pos,
    };
  });

  return {
    pieces: resultPieces,
    totalLengthMm,
    efficiency: Math.round(efficiency * 100),
  };
}

