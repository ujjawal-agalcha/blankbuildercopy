/**
 * GARMENT SPECIFICATION: 109. Yoga Pants
 * ID: clothing_yoga_pants
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


export const garment: GarmentTemplate = createPantsTemplate('clothing_yoga_pants', '109. Yoga Pants', 'relaxed' as any, 'Foldover waistband with flared bootcut hem.');


export const metadata = {
  id: 'clothing_yoga_pants',
  name: '109. Yoga Pants',
  fit: 'relaxed',
  modelId: 'moto-pants',
  categoryPath: 'dresses-skirts-and-other/yoga-pants',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
