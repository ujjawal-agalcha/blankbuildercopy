/**
 * GARMENT SPECIFICATION: 68. Fleece Jacket
 * ID: jacket_fleece
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


export const garment: GarmentTemplate = createJacketTemplate('jacket_fleece', '68. Fleece Jacket', 'relaxed' as any, 'High-pile Sherpa fleece with nylon chest zip pocket.');


export const metadata = {
  id: 'jacket_fleece',
  name: '68. Fleece Jacket',
  fit: 'relaxed',
  modelId: 'hoodie-body',
  categoryPath: 'jackets-and-outerwear/fleece-jacket',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
