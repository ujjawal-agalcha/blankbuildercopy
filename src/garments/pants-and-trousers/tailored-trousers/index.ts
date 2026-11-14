/**
 * GARMENT SPECIFICATION: 91. Tailored Trousers
 * ID: pants_tailored
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


export const garment: GarmentTemplate = createPantsTemplate('pants_tailored', '91. Tailored Trousers', 'slim' as any, 'Side waist adjusters with tapered cuffed hem.');


export const metadata = {
  id: 'pants_tailored',
  name: '91. Tailored Trousers',
  fit: 'slim',
  modelId: 'moto-pants',
  categoryPath: 'pants-and-trousers/tailored-trousers',
};

export const modelConfig = {
  modelId: 'moto-pants',
  modelBinary: '/models/moto-pants/model.bin',
  normalMap: '/models/moto-pants/normal.jpg',
};

export default garment;
