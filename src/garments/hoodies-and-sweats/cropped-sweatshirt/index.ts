/**
 * GARMENT SPECIFICATION: 50. Cropped Sweatshirt
 * ID: sweatshirt_cropped
 * 3D Model: hoodie-flat
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


export const garment: GarmentTemplate = createSweatshirtTemplate('sweatshirt_cropped', '50. Cropped Sweatshirt', 'cropped' as any, 'Shortened body with wide ribbed waistband.');


export const metadata = {
  id: 'sweatshirt_cropped',
  name: '50. Cropped Sweatshirt',
  fit: 'cropped',
  modelId: 'hoodie-flat',
  categoryPath: 'hoodies-and-sweats/cropped-sweatshirt',
};

export const modelConfig = {
  modelId: 'hoodie-flat',
  modelBinary: '/models/hoodie-flat/model.bin',
  normalMap: '/models/hoodie-flat/normal.jpg',
};

export default garment;
