/**
 * GARMENT SPECIFICATION: 67. Workwear Jacket
 * ID: jacket_workwear
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_workwear', '67. Workwear Jacket', 'regular' as any, 'Heavy canvas chore coat with corduroy collar.');


export const metadata = {
  id: 'jacket_workwear',
  name: '67. Workwear Jacket',
  fit: 'regular',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/workwear-jacket',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
