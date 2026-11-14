/**
 * GARMENT SPECIFICATION: 48. Half-Zip Sweatshirt
 * ID: sweatshirt_half_zip
 * 3D Model: hoodie-flat
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


export const garment: GarmentTemplate = createSweatshirtTemplate('sweatshirt_half_zip', '48. Half-Zip Sweatshirt', 'relaxed' as any, 'Stand collar with silver half zip puller.');


export const metadata = {
  id: 'sweatshirt_half_zip',
  name: '48. Half-Zip Sweatshirt',
  fit: 'relaxed',
  modelId: 'hoodie-flat',
  categoryPath: 'hoodies-and-sweats/half-zip-sweatshirt',
};

export const modelConfig = {
  modelId: 'hoodie-flat',
  modelBinary: '/models/hoodie-flat/model.bin',
  normalMap: '/models/hoodie-flat/normal.jpg',
};

export default garment;
