/**
 * GARMENT SPECIFICATION: 36. Classic Hoodie
 * ID: hoodie_classic
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


const base = createHoodieTemplate('hoodie_classic', '36. Classic Hoodie', 'regular' as any, 'Front kangaroo pocket, drawstring hood, ribbed hem and cuffs.');
base.modelId = 'hoodie';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'hoodie_classic',
  name: '36. Classic Hoodie',
  fit: 'regular',
  modelId: 'hoodie',
  categoryPath: 'hoodies-and-sweats/classic-hoodie',
};

export const modelConfig = {
  modelId: 'hoodie',
  modelBinary: '/models/hoodie/model.bin',
  normalMap: '/models/hoodie/normal.jpg',
};

export default garment;
