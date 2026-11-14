/**
 * THREADCAD GARMENT CATALOG
 * Exports all 132 garments sourced directly from their individual directory definitions.
 */

import { GarmentTemplate } from '../types/garment';
import { ALL_GARMENTS } from './registry';

export const GARMENT_TEMPLATES: GarmentTemplate[] = ALL_GARMENTS;

export function getTemplateById(id: string): GarmentTemplate {
  return GARMENT_TEMPLATES.find((t) => t.id === id) || GARMENT_TEMPLATES[0];
}

export { ALL_GARMENTS };
