/**
 * GARMENT SPECIFICATION: 39. Pullover Hoodie
 * ID: hoodie_pullover
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


const base = createHoodieTemplate('hoodie_pullover', '39. Pullover Hoodie', 'oversized' as any, 'Heavyweight 450 GSM French terry hoodie with clean pouch.');
base.modelId = 'hoodie';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'hoodie_pullover',
  name: '39. Pullover Hoodie',
  fit: 'oversized',
  modelId: 'hoodie',
  categoryPath: 'hoodies-and-sweats/pullover-hoodie',
};

export const modelConfig = {
  modelId: 'hoodie',
  modelBinary: '/models/hoodie/model.bin',
  normalMap: '/models/hoodie/normal.jpg',
};

export default garment;
