/**
 * GARMENT SPECIFICATION: 80. Slim Fit Jeans
 * ID: pants_slim_jeans
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


export const garment: GarmentTemplate = createJeansTemplate('pants_slim_jeans', '80. Slim Fit Jeans', 'slim' as any, 'Tapered leg profile fitted through hip and thigh.');


export const metadata = {
  id: 'pants_slim_jeans',
  name: '80. Slim Fit Jeans',
  fit: 'slim',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/slim-jeans',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
