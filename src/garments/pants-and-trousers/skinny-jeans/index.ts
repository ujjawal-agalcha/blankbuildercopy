/**
 * GARMENT SPECIFICATION: 81. Skinny Jeans
 * ID: pants_skinny_jeans
 * 3D Model: moto-pants
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


export const garment: GarmentTemplate = createJeansTemplate('pants_skinny_jeans', '81. Skinny Jeans', 'slim' as any, 'Close-fitting stretch denim through ankle.');


export const metadata = {
  id: 'pants_skinny_jeans',
  name: '81. Skinny Jeans',
  fit: 'slim',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/skinny-jeans',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
