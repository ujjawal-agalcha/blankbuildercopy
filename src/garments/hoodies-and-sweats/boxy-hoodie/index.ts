/**
 * GARMENT SPECIFICATION: 43. Boxy Hoodie
 * ID: hoodie_boxy
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


const base = createHoodieTemplate('hoodie_boxy', '43. Boxy Hoodie', 'boxy' as any, 'Square torso proportions with relaxed wide sleeve circumference.');
base.modelId = 'hoodie';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'hoodie_boxy',
  name: '43. Boxy Hoodie',
  fit: 'boxy',
  modelId: 'hoodie',
  categoryPath: 'hoodies-and-sweats/boxy-hoodie',
};

export const modelConfig = {
  modelId: 'hoodie',
  modelBinary: '/models/hoodie/model.bin',
  normalMap: '/models/hoodie/normal.jpg',
};

export default garment;
