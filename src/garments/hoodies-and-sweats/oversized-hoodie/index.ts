/**
 * GARMENT SPECIFICATION: 37. Oversized Hoodie
 * ID: hoodie_oversized
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


const base = createHoodieTemplate('hoodie_oversized', '37. Oversized Hoodie', 'oversized' as any, 'Slouchy drop shoulders and roomy double-layer fleece hood.');
base.modelId = 'hoodie-body';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'hoodie_oversized',
  name: '37. Oversized Hoodie',
  fit: 'oversized',
  modelId: 'hoodie-body',
  categoryPath: 'hoodies-and-sweats/oversized-hoodie',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
