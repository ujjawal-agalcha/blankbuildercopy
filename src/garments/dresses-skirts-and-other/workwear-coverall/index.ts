/**
 * GARMENT SPECIFICATION: 132. Workwear Coverall
 * ID: clothing_coverall
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


export const garment: GarmentTemplate = createJacketTemplate('clothing_coverall', '132. Workwear Coverall', 'relaxed' as any, 'Heavy drill protective coverall with action back pleats.');


export const metadata = {
  id: 'clothing_coverall',
  name: '132. Workwear Coverall',
  fit: 'relaxed',
  modelId: 'hoodie-body',
  categoryPath: 'dresses-skirts-and-other/workwear-coverall',
};

export const modelConfig = {
  modelId: 'hoodie-body',
  modelBinary: '/models/hoodie-body/model.bin',
  normalMap: '/models/hoodie-body/normal.jpg',
};

export default garment;
