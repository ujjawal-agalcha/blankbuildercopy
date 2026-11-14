/**
 * GARMENT SPECIFICATION: 32. Oxford Shirt
 * ID: shirt_oxford
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


const base = createShirtTemplate('shirt_oxford', '32. Oxford Shirt', 'regular' as any, 'Classic button-down collar Oxford cloth shirt.');
base.modelId = 'shirt-short-sleeve';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'shirt_oxford',
  name: '32. Oxford Shirt',
  fit: 'regular',
  modelId: 'shirt-short-sleeve',
  categoryPath: 'polos-and-shirts/oxford-shirt',
};

export const modelConfig = {
  modelId: 'shirt-short-sleeve',
  modelBinary: '/models/shirt-short-sleeve/model.bin',
  normalMap: '/models/shirt-short-sleeve/normal.jpg',
};

export default garment;
