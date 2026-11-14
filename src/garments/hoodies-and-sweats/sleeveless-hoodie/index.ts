/**
 * GARMENT SPECIFICATION: 41. Sleeveless Hoodie
 * ID: hoodie_sleeveless
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


const base = createHoodieTemplate('hoodie_sleeveless', '41. Sleeveless Hoodie', 'regular' as any, 'Armhole raw edge cut with roomy hood for training.');
base.modelId = 'hoodie';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'hoodie_sleeveless',
  name: '41. Sleeveless Hoodie',
  fit: 'regular',
  modelId: 'hoodie',
  categoryPath: 'hoodies-and-sweats/sleeveless-hoodie',
};

export const modelConfig = {
  modelId: 'hoodie',
  modelBinary: '/models/hoodie/model.bin',
  normalMap: '/models/hoodie/normal.jpg',
};

export default garment;
