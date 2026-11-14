/**
 * GARMENT SPECIFICATION: 9. Baby Tee
 * ID: tshirt_baby_tee
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


const base = createTShirtTemplate('tshirt_baby_tee', '9. Baby Tee', 'slim' as any, '90s fitted Y2K silhouette with cap sleeves and compact proportions.', {
  chestWidth: 440,
  bodyLength: 520,
  shoulderWidth: 387,
  sleeveLength: 150,
  sleeveOpening: 154,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 440,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'tshirt_baby_tee',
  name: '9. Baby Tee',
  fit: 'slim',
  modelId: 'tee-t5',
  categoryPath: 't-shirts/baby-tee',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
