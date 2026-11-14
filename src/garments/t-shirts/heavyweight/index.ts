/**
 * GARMENT SPECIFICATION: 19. Heavyweight T-Shirt
 * ID: tshirt_heavyweight
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


const base = createTShirtTemplate('tshirt_heavyweight', '19. Heavyweight T-Shirt', 'oversized' as any, 'Sturdy 280 GSM dry-hand combed cotton with structural boxy shape.', {
  chestWidth: 640,
  bodyLength: 750,
  shoulderWidth: 563,
  sleeveLength: 260,
  sleeveOpening: 224,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 640,
  collarHeight: 25,
});
base.modelId = 'tee-oversize-1';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'tshirt_heavyweight',
  name: '19. Heavyweight T-Shirt',
  fit: 'oversized',
  modelId: 'tee-oversize-1',
  categoryPath: 't-shirts/heavyweight',
};

export const modelConfig = {
  modelId: 'tee-oversize-1',
  modelBinary: '/models/tee-oversize-1/model.bin',
  normalMap: '/models/tee-oversize-1/normal.jpg',
};

export default garment;
