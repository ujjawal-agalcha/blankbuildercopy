/**
 * GARMENT SPECIFICATION: 26. Henley Shirt
 * ID: shirt_henley
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


const base = createTShirtTemplate('shirt_henley', '26. Henley Shirt', 'regular' as any, 'Collarless knit tee with 3-button front placket.', {
  chestWidth: 530,
  bodyLength: 730,
  shoulderWidth: 466,
  sleeveLength: 230,
  sleeveOpening: 186,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 530,
  collarHeight: 25,
});
base.modelId = 'tee-t5';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'shirt_henley',
  name: '26. Henley Shirt',
  fit: 'regular',
  modelId: 'tee-t5',
  categoryPath: 'polos-and-shirts/henley-shirt',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
