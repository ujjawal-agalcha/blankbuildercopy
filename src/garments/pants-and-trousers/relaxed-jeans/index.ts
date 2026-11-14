/**
 * GARMENT SPECIFICATION: 82. Relaxed Jeans
 * ID: pants_relaxed_jeans
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


export const garment: GarmentTemplate = createJeansTemplate('pants_relaxed_jeans', '82. Relaxed Jeans', 'relaxed' as any, 'Roomy seat and thigh with straight leg fall.');


export const metadata = {
  id: 'pants_relaxed_jeans',
  name: '82. Relaxed Jeans',
  fit: 'relaxed',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/relaxed-jeans',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
