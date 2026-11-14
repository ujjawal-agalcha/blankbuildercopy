/**
 * GARMENT SPECIFICATION: 90. Dress Trousers
 * ID: pants_dress_trousers
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


export const garment: GarmentTemplate = createPantsTemplate('pants_dress_trousers', '90. Dress Trousers', 'straight' as any, 'Pressed center leg crease with hook-and-bar closure.');


export const metadata = {
  id: 'pants_dress_trousers',
  name: '90. Dress Trousers',
  fit: 'straight',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/dress-trousers',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
