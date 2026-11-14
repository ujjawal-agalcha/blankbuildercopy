/**
 * GARMENT SPECIFICATION: 75. Cropped Tank
 * ID: tank_cropped
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


export const garment: GarmentTemplate = createTankTemplate('tank_cropped', '75. Cropped Tank', 'cropped' as any, 'Ribbed cropped sleeveless top hitting above midriff.');


export const metadata = {
  id: 'tank_cropped',
  name: '75. Cropped Tank',
  fit: 'cropped',
  modelId: 'tee-t5',
  categoryPath: 'tank-tops/cropped-tank',
};

export const modelConfig = {
  modelId: 'tee-t5',
  modelBinary: '/models/tee-t5/model.bin',
  normalMap: '/models/tee-t5/normal.jpg',
};

export default garment;
