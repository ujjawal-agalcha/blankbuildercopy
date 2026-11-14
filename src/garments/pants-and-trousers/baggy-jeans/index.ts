/**
 * GARMENT SPECIFICATION: 83. Baggy Jeans
 * ID: pants_baggy_jeans
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


export const garment: GarmentTemplate = createJeansTemplate('pants_baggy_jeans', '83. Baggy Jeans', 'baggy' as any, '90s wide skateboard silhouette with puddle hem.');


export const metadata = {
  id: 'pants_baggy_jeans',
  name: '83. Baggy Jeans',
  fit: 'baggy',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/baggy-jeans',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
