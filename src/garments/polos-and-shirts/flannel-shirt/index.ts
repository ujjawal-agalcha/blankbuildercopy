/**
 * GARMENT SPECIFICATION: 33. Flannel Shirt
 * ID: shirt_flannel
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


const base = createShirtTemplate('shirt_flannel', '33. Flannel Shirt', 'relaxed' as any, 'Heavy brushed cotton twin-pocket work shirt.');
base.modelId = 'shirt-short-sleeve';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'shirt_flannel',
  name: '33. Flannel Shirt',
  fit: 'relaxed',
  modelId: 'shirt-short-sleeve',
  categoryPath: 'polos-and-shirts/flannel-shirt',
};

export const modelConfig = {
  modelId: 'shirt-short-sleeve',
  modelBinary: '/models/shirt-short-sleeve/model.bin',
  normalMap: '/models/shirt-short-sleeve/normal.jpg',
};

export default garment;
