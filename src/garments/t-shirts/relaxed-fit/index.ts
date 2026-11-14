/**
 * GARMENT SPECIFICATION: 6. Relaxed Fit T-Shirt
 * ID: tshirt_relaxed
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


const base = createTShirtTemplate('tshirt_relaxed', '6. Relaxed Fit T-Shirt', 'relaxed' as any, 'Easygoing everyday drape between regular and oversized fit.', {
  chestWidth: 560,
  bodyLength: 730,
  shoulderWidth: 493,
  sleeveLength: 230,
  sleeveOpening: 196,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 560,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'tshirt_relaxed',
  name: '6. Relaxed Fit T-Shirt',
  fit: 'relaxed',
  modelId: 'tee-t5',
  categoryPath: 't-shirts/relaxed-fit',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
