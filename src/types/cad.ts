export type Unit = 'mm' | 'cm' | 'in';

export interface Point2D {
  x: number;
  y: number;
}

export interface ControlPoint extends Point2D {
  id: string;
  type: 'corner' | 'smooth' | 'symmetric';
  handleIn?: Point2D;
  handleOut?: Point2D;
}

export type EdgeType = 'line' | 'cubic-bezier' | 'quad-bezier' | 'arc';

export interface Edge2D {
  id: string;
  fromPointId: string;
  toPointId: string;
  type: EdgeType;
  controlPoints?: Point2D[]; // For bezier curves
  seamAllowance?: number;    // In mm, override for this edge
  isFold?: boolean;          // Cut-on-fold indication
  name?: string;             // e.g. "Shoulder", "Armhole", "Side seam", "Hem"
}

export interface Notch {
  id: string;
  edgeId: string;
  distanceRatio: number; // 0 to 1 along the edge
  type: 'single' | 'double' | 'v-notch' | 't-notch';
  depth: number; // mm
}

export interface Dart {
  id: string;
  apex: Point2D;
  leg1: Point2D;
  leg2: Point2D;
  depth: number;
}

export interface Grainline {
  start: Point2D;
  end: Point2D;
  hasArrowBothEnds: boolean;
  angle: number; // degrees
}

export interface InternalLine {
  id: string;
  points: Point2D[];
  type: 'fold' | 'crease' | 'pocket-placement' | 'button-guide' | 'style' | 'box-pleat';
  name?: string;
}

export interface PatternPiece {
  id: string;
  name: string;
  category: 'body' | 'sleeve' | 'collar' | 'cuff' | 'pocket' | 'waistband' | 'hood' | 'lining' | 'trim';
  points: ControlPoint[];
  edges: Edge2D[];
  position: Point2D; // Placement on 2D cutting table canvas (mm)
  rotation: number;  // In degrees
  mirror: boolean;   // Cut 2 mirrored
  cutQuantity: number; // e.g. 1 on fold, 2 pairs
  fabricCode: string; // references material
  defaultSeamAllowance: number; // mm, default 10mm (1cm)
  seamAllowanceEnabled: boolean;
  notches: Notch[];
  darts: Dart[];
  grainline: Grainline;
  internalLines: InternalLine[];
  color: string;
  isLocked?: boolean;
  isVisible?: boolean;
}

export type CadTool = 
  | 'select'
  | 'move'
  | 'point'
  | 'line'
  | 'curve'
  | 'bezier'
  | 'rectangle'
  | 'notch'
  | 'dart'
  | 'grainline'
  | 'seam-allowance'
  | 'cut'
  | 'merge'
  | 'measure'
  | 'sew';

export interface ViewportTransform {
  x: number;
  y: number;
  zoom: number;
}

