/**
 * GARMENT SPECIFICATION: 84. Wide-Leg Jeans
 * ID: pants_wide_leg_jeans
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


export const garment: GarmentTemplate = createJeansTemplate('pants_wide_leg_jeans', '84. Wide-Leg Jeans', 'baggy' as any, 'Clean architectural wide leg from hip to sweep.');


export const metadata = {
  id: 'pants_wide_leg_jeans',
  name: '84. Wide-Leg Jeans',
  fit: 'baggy',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/wide-leg-jeans',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
