/**
 * GARMENT SPECIFICATION: 4. Drop Shoulder T-Shirt
 * ID: tshirt_drop_shoulder
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


const base = createTShirtTemplate('tshirt_drop_shoulder', '4. Drop Shoulder T-Shirt', 'drop-shoulder' as any, 'Elongated shoulder line creating a relaxed casual sleeve drape.', {
  chestWidth: 610,
  bodyLength: 740,
  shoulderWidth: 537,
  sleeveLength: 240,
  sleeveOpening: 214,
  neckWidth: 185,
  neckDepthFront: 88,
  neckDepthBack: 22,
  hemWidth: 610,
  collarHeight: 25,
});
base.modelId = 'tee-oversize-1';
export const garment: GarmentTemplate = base;


export const metadata = {
  id: 'tshirt_drop_shoulder',
  name: '4. Drop Shoulder T-Shirt',
  fit: 'drop-shoulder',
  modelId: 'tee-oversize-1',
  categoryPath: 't-shirts/drop-shoulder',
};

export const modelConfig = {
  modelId: 'tee-oversize-1',
  modelBinary: '/models/tee-oversize-1/model.bin',
  normalMap: '/models/tee-oversize-1/normal.jpg',
};

export default garment;
