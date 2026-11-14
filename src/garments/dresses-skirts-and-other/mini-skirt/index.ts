/**
 * GARMENT SPECIFICATION: 114. Mini Skirt
 * ID: clothing_skirt_mini
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


export const garment: GarmentTemplate = createPantsTemplate('clothing_skirt_mini', '114. Mini Skirt', 'slim' as any, 'High-rise structured mini skirt with front slit.');


export const metadata = {
  id: 'clothing_skirt_mini',
  name: '114. Mini Skirt',
  fit: 'slim',
  modelId: 'moto-pants',
  categoryPath: 'dresses-skirts-and-other/mini-skirt',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
