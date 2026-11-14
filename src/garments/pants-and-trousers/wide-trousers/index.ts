/**
 * GARMENT SPECIFICATION: 96. Wide-Leg Trousers
 * ID: pants_wide_trousers
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


export const garment: GarmentTemplate = createPantsTemplate('pants_wide_trousers', '96. Wide-Leg Trousers', 'baggy' as any, 'High-waisted double pleated wide leg trousers.');


export const metadata = {
  id: 'pants_wide_trousers',
  name: '96. Wide-Leg Trousers',
  fit: 'baggy',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/wide-trousers',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
