/**
 * GARMENT SPECIFICATION: 95. Straight Fit Trousers
 * ID: pants_straight_trousers
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


export const garment: GarmentTemplate = createPantsTemplate('pants_straight_trousers', '95. Straight Fit Trousers', 'straight' as any, 'Clean minimal trousers in wool blend fabric.');


export const metadata = {
  id: 'pants_straight_trousers',
  name: '95. Straight Fit Trousers',
  fit: 'straight',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/straight-trousers',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
