/**
 * GARMENT SPECIFICATION: 14. Ringer T-Shirt
 * ID: tshirt_ringer
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


export const garment: GarmentTemplate = createRingerTShirtTemplate('tshirt_ringer', '14. Ringer T-Shirt', 'regular' as any, 'Vintage athletic tee with contrast ribbed collar and sleeve binding.');


export const metadata = {
  id: 'tshirt_ringer',
  name: '14. Ringer T-Shirt',
  fit: 'regular',
  modelId: 'tee-t5',
  categoryPath: 't-shirts/ringer',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
