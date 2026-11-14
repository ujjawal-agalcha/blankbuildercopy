/**
 * GARMENT SPECIFICATION: 34. Denim Shirt
 * ID: shirt_denim
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


const base = createShirtTemplate('shirt_denim', '34. Denim Shirt', 'regular' as any, 'Western front yokes, snap closures, and durable denim weave.');
base.modelId = 'shirt-short-sleeve';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'shirt_denim',
  name: '34. Denim Shirt',
  fit: 'regular',
  modelId: 'shirt-short-sleeve',
  categoryPath: 'polos-and-shirts/denim-shirt',
};

export const modelConfig = {
  modelId: 'shirt-short-sleeve',
  modelBinary: '/models/shirt-short-sleeve/model.bin',
  normalMap: '/models/shirt-short-sleeve/normal.jpg',
};

export default garment;
