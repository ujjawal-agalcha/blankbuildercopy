export type SeamType = 'plain' | 'french' | 'flat-felled' | 'overlock' | 'serged' | 'topstitched';

export interface SewingRelationship {
  id: string;
  name: string;
  pieceAId: string;
  edgeAId: string;
  pieceBId: string;
  edgeBId: string;
  seamType: SeamType;
  flipped: boolean; // Reverse direction of seam alignment
  stitchingColor?: string;
  threadThickness?: number; // mm
  gatherRatio?: number; // 1.0 = 1:1, > 1.0 = gathered or eased
  enabled: boolean;
}

export interface SewingValidationResult {
  relationshipId: string;
  lengthA: number;
  lengthB: number;
  difference: number;
  differencePercentage: number;
  status: 'perfect' | 'acceptable' | 'warning' | 'mismatch';
  message: string;
}

