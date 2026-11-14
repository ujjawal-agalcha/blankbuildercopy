/**
 * GARMENT SPECIFICATION: 2. Oversized T-Shirt
 * ID: tshirt_oversized
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


const base = createTShirtTemplate('tshirt_oversized', '2. Oversized T-Shirt', 'oversized' as any, 'Modern streetwear oversized drape with wide chest, extended drop shoulders, and chunky 30mm rib collar.', {
  chestWidth: 630,
  bodyLength: 750,
  shoulderWidth: 554,
  sleeveLength: 250,
  sleeveOpening: 221,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 630,
  collarHeight: 25,
});
base.modelId = 'tee-oversize-1';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'tshirt_oversized',
  name: '2. Oversized T-Shirt',
  fit: 'oversized',
  modelId: 'tee-oversize-1',
  categoryPath: 't-shirts/oversized',
};

export const modelConfig = {
  modelId: 'tee-oversize-1',
  modelBinary: '/models/tee-oversize-1/model.bin',
  normalMap: '/models/tee-oversize-1/normal.jpg',
};

export default garment;
