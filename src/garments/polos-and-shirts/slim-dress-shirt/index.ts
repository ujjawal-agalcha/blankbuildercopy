/**
 * GARMENT SPECIFICATION: 31. Slim Dress Shirt
 * ID: shirt_slim_dress
 * 3D Model: shirt-short-sleeve
 */

import { GarmentTemplate } from '../../../types/garment';
import {
  createTShirtTemplate,
  createTankTemplate,
  createLongSleeveTShirtTemplate,
  createPocketTShirtTemplate,
  createRingerTShirtTemplate,
} from '../../templates/tshirt';
import {
  createHoodieTemplate,
  createZipUpHoodieTemplate,
  createSweatshirtTemplate,
  createJacketTemplate,
} from '../../templates/hoodie';
import {
  createPantsTemplate,
  createJeansTemplate,
  createCargoPantsTemplate,
} from '../../templates/pants';
import { createPoloTemplate } from '../../templates/polo';
import { createShirtTemplate } from '../../templates/shirt';


const base = createShirtTemplate('shirt_slim_dress', '31. Slim Dress Shirt', 'slim' as any, 'Back waist darts, structured collar, and French cuffs.');
base.modelId = 'shirt-short-sleeve';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'shirt_slim_dress',
  name: '31. Slim Dress Shirt',
  fit: 'slim',
  modelId: 'shirt-short-sleeve',
  categoryPath: 'polos-and-shirts/slim-dress-shirt',
};

export const modelConfig = {
  modelId: 'shirt-short-sleeve',
  modelBinary: '/models/shirt-short-sleeve/model.bin',
  normalMap: '/models/shirt-short-sleeve/normal.jpg',
};

export default garment;
