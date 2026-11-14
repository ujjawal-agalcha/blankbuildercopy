/**
 * GARMENT SPECIFICATION: 8. Cropped T-Shirt
 * ID: tshirt_cropped
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


const base = createTShirtTemplate('tshirt_cropped', '8. Cropped T-Shirt', 'cropped' as any, 'Shortened body length hitting right above waistband line.', {
  chestWidth: 580,
  bodyLength: 560,
  shoulderWidth: 510,
  sleeveLength: 200,
  sleeveOpening: 203,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 580,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'tshirt_cropped',
  name: '8. Cropped T-Shirt',
  fit: 'cropped',
  modelId: 'tee-t5',
  categoryPath: 't-shirts/cropped',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
