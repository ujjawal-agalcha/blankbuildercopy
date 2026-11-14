/**
 * GARMENT SPECIFICATION: 60. Puffer Jacket
 * ID: jacket_puffer
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_puffer', '60. Puffer Jacket', 'oversized' as any, 'Down quilted baffle chambers with funnel neck collar.');


export const metadata = {
  id: 'jacket_puffer',
  name: '60. Puffer Jacket',
  fit: 'oversized',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/puffer-jacket',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
