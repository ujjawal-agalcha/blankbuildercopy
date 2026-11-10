export type PlacementZone = 
  | 'front-chest'
  | 'front-center'
  | 'front-pocket'
  | 'back-full'
  | 'back-neck'
  | 'sleeve-left'
  | 'sleeve-right'
  | 'hood-center'
  | 'hood-left'
  | 'hood-right'
  | 'pocket-center'
  | 'pocket-left'
  | 'pocket-right'
  | 'inside-label'
  | 'pant-left-thigh'
  | 'pant-right-thigh'
  | 'pant-left-shin'
  | 'pant-right-shin'
  | 'pant-back-seat'
  | 'custom';

export type PrintTechnique = 
  | 'screen-print' 
  | 'dtg' 
  | 'puff-print' 
  | 'embroidery' 
  | 'heat-transfer' 
  | 'rhinestones'
  | 'reflective'
  | 'sublimation';

export interface ArtworkLayer {
  id: string;
  name: string;
  type: 'image' | 'text';
  // Associated Pattern Piece ID (e.g. 'piece_front_body', 'piece_back_body', 'piece_sleeve_left', etc.)
  pieceId?: string;
  zone: PlacementZone;
  // Position in millimeters relative to the center of the associated pattern piece
  x: number;
  y: number;
  // Physical dimensions in millimeters
  width?: number;
  height?: number;
  scale: number; // 0.1 to 5.0
  rotation: number; // -180 to 180 degrees
  opacity: number; // 0.0 to 1.0
  technique: PrintTechnique;

  // Intentional flipping
  flipH?: boolean;
  flipV?: boolean;

  // Aspect ratio lock
  aspectRatio?: number;
  aspectRatioLocked?: boolean;

  // Alignment
  alignH?: 'left' | 'center' | 'right';
  alignV?: 'top' | 'center' | 'bottom';

  // Image properties
  imageUrl?: string;
  originalWidth?: number;
  originalHeight?: number;

  // Text properties
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  letterSpacing?: number;
  lineHeight?: number;

  // Embroidery properties
  threadColor?: string;
  stitchDensity?: number;
  stitchAngle?: number;

  // Puff print properties
  puffElevation?: number; // mm

  // Visibility & Lock
  visible: boolean;
  locked: boolean;
}

export interface UploadedAsset {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  fileType: string;
  fileSize: number;
  uploadedAt: number;
}
