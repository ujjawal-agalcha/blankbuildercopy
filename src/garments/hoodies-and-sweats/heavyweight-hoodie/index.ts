/**
 * GARMENT SPECIFICATION: 42. Heavyweight Hoodie
 * ID: hoodie_heavyweight
 * 3D Model: hoodie
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


const base = createHoodieTemplate('hoodie_heavyweight', '42. Heavyweight Hoodie', 'oversized' as any, '500 GSM ultra-dense brushed fleece with structured hood.');
base.modelId = 'hoodie';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'hoodie_heavyweight',
  name: '42. Heavyweight Hoodie',
  fit: 'oversized',
  modelId: 'hoodie',
  categoryPath: 'hoodies-and-sweats/heavyweight-hoodie',
};

export const modelConfig = {
  modelId: 'hoodie',
  modelBinary: '/models/hoodie/model.bin',
  normalMap: '/models/hoodie/normal.jpg',
};

export default garment;
