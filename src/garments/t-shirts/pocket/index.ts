/**
 * GARMENT SPECIFICATION: 17. Pocket T-Shirt
 * ID: tshirt_pocket
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


export const garment: GarmentTemplate = createPocketTShirtTemplate('tshirt_pocket', '17. Pocket T-Shirt', 'regular' as any, 'Single patch pocket stitched on left chest.');


export const metadata = {
  id: 'tshirt_pocket',
  name: '17. Pocket T-Shirt',
  fit: 'regular',
  modelId: 'tee-t5',
  categoryPath: 't-shirts/pocket',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
