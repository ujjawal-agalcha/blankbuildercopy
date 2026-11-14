/**
 * GARMENT SPECIFICATION: 119. Casual Dress
 * ID: clothing_dress_casual
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


const base = createTShirtTemplate('clothing_dress_casual', '119. Casual Dress', 'relaxed' as any, 'Everyday T-shirt dress with side seam pockets.', {
  chestWidth: 560,
  bodyLength: 950,
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
  id: 'clothing_dress_casual',
  name: '119. Casual Dress',
  fit: 'relaxed',
  modelId: 'tee-t5',
  categoryPath: 'dresses-skirts-and-other/casual-dress',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
