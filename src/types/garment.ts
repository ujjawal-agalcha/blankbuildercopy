import { PatternPiece } from './cad';
import { SewingRelationship } from './sewing';

export type GarmentCategory = 'tops' | 'bottoms' | 'outerwear' | 'dresses' | 'activewear';

export type FitType = 
  | 'regular' 
  | 'oversized' 
  | 'boxy' 
  | 'drop-shoulder' 
  | 'cropped' 
  | 'slim' 
  | 'relaxed' 
  | 'baggy'
  | 'straight';

export type StandardSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface GarmentMeasurement {
  id: string;
  name: string;
  description: string;
  value: number; // in mm
  min: number;   // min allowed in mm
  max: number;   // max allowed in mm
  step: number;  // step in mm
  category: 'length' | 'width' | 'circumference' | 'sleeve' | 'neck' | 'rise' | 'leg';
}

export interface SizeGradingRule {
  size: StandardSize;
  measurementDeltas: Record<string, number>; // measurementId -> delta in mm from Base (M)
}

export interface GarmentTemplate {
  id: string;
  name: string;
  category: GarmentCategory;
  subcategory: string; // e.g. "T-Shirt", "Hoodie", "Sweatshirt", "Casual Shirt", "Cargo Pants", "Jeans"
  fit: FitType;
  description: string;
  thumbnail: string;
  baseSize: StandardSize;
  measurements: GarmentMeasurement[];
  gradingRules: SizeGradingRule[];
  defaultFabricCode: string;
  // Factory function to generate pattern pieces parametrically from measurements
  generatePatterns: (measurements: Record<string, number>) => PatternPiece[];
  // Initial sewing definitions
  defaultSewing: SewingRelationship[];
}
