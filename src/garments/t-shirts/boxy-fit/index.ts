/**
 * GARMENT SPECIFICATION: 3. Boxy Fit T-Shirt
 * ID: tshirt_boxy
 * 3D Model: tee-oversize-1
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


const base = createTShirtTemplate('tshirt_boxy', '3. Boxy Fit T-Shirt', 'boxy' as any, 'Square torso proportions with widened chest and flat straight hem.', {
  chestWidth: 620,
  bodyLength: 700,
  shoulderWidth: 546,
  sleeveLength: 230,
  sleeveOpening: 217,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 620,
  collarHeight: 25,
});
base.modelId = 'tee-oversize-1';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'tshirt_boxy',
  name: '3. Boxy Fit T-Shirt',
  fit: 'boxy',
  modelId: 'tee-oversize-1',
  categoryPath: 't-shirts/boxy-fit',
};

export const modelConfig = {
  modelId: 'tee-oversize-1',
  modelBinary: '/models/tee-oversize-1/model.bin',
  normalMap: '/models/tee-oversize-1/normal.jpg',
};

export default garment;
