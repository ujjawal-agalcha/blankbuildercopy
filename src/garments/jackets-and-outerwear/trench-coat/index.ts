/**
 * GARMENT SPECIFICATION: 62. Trench Coat
 * ID: jacket_trench_coat
 * 3D Model: hoodie-body
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_trench_coat', '62. Trench Coat', 'regular' as any, 'Double-breasted storm flap coat with waist buckle belt.');


export const metadata = {
  id: 'jacket_trench_coat',
  name: '62. Trench Coat',
  fit: 'regular',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/trench-coat',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
