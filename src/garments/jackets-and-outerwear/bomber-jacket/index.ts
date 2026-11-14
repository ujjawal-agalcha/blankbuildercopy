/**
 * GARMENT SPECIFICATION: 51. Bomber Jacket
 * ID: jacket_bomber
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_bomber', '51. Bomber Jacket', 'relaxed' as any, 'MA-1 flight jacket with ribbed collar, utility sleeve pocket, and zipper.');


export const metadata = {
  id: 'jacket_bomber',
  name: '51. Bomber Jacket',
  fit: 'relaxed',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/bomber-jacket',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
