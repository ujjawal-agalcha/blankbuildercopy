/**
 * GARMENT SPECIFICATION: 94. Sweatpants
 * ID: pants_sweatpants
 * 3D Model: moto-pants
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


export const garment: GarmentTemplate = createPantsTemplate('pants_sweatpants', '94. Sweatpants', 'relaxed' as any, 'Relaxed heavyweight sweatpants with elasticated cuffs.');


export const metadata = {
  id: 'pants_sweatpants',
  name: '94. Sweatpants',
  fit: 'relaxed',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/sweatpants',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
