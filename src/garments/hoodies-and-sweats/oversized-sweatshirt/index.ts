/**
 * GARMENT SPECIFICATION: 46. Oversized Sweatshirt
 * ID: sweatshirt_oversized
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


export const garment: GarmentTemplate = createSweatshirtTemplate('sweatshirt_oversized', '46. Oversized Sweatshirt', 'oversized' as any, 'Heavy fleece crewneck with wide chest and drop shoulders.');


export const metadata = {
  id: 'sweatshirt_oversized',
  name: '46. Oversized Sweatshirt',
  fit: 'oversized',
  modelId: 'hoodie-flat',
  categoryPath: 'hoodies-and-sweats/oversized-sweatshirt',
};

export const modelConfig = {
  modelId: 'hoodie-flat',
  modelBinary: '/models/hoodie-flat/model.bin',
  normalMap: '/models/hoodie-flat/normal.jpg',
};

export default garment;
