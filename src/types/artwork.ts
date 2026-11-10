export type PlacementZone = 
  | 'front-chest'
  | 'front-center'
  | 'front-pocket'
  | 'back-full'
  | 'back-neck'
  | 'sleeve-left'
  | 'sleeve-right'
  | 'hood-center'
  | 'pocket-left'
  | 'pocket-right'
  | 'inside-label'
  | 'pant-left-thigh'
  | 'pant-right-thigh';

export type PrintTechnique = 
  | 'screen-print' 
  | 'dtg' 
  | 'puff-print' 
  | 'embroidery' 
  | 'heat-transfer' 
  | 'rhinestones'
  | 'reflective';

export interface ArtworkLayer {
  id: string;
  name: string;
  type: 'image' | 'text';
  zone: PlacementZone;
  x: number; // offset mm from zone center
  y: number; // offset mm from zone center
  scale: number; // 0.1 to 5.0
  rotation: number; // degrees
  opacity: number; // 0 to 1
  technique: PrintTechnique;
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

