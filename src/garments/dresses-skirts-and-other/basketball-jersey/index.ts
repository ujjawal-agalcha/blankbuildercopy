/**
 * GARMENT SPECIFICATION: 126. Basketball Jersey
 * ID: clothing_basketball_jersey
 * 3D Model: tee-t5
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


export const garment: GarmentTemplate = createTankTemplate('clothing_basketball_jersey', '126. Basketball Jersey', 'oversized' as any, 'Wide armhole sleeveless tank with ribbed trim.');


export const metadata = {
  id: 'clothing_basketball_jersey',
  name: '126. Basketball Jersey',
  fit: 'oversized',
  modelId: 'tee-t5',
  categoryPath: 'dresses-skirts-and-other/basketball-jersey',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
